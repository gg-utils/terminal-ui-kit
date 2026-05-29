/**
 * @fileoverview Spawns a child process as an Ink CLI task, streaming stdout/stderr lines through
 * callbacks and resolving a structured execution result on completion or cancellation.
 *
 * This file owns the low-level process-bridge used by all terminal Ink apps to run
 * background tasks and report their output.
 * Flow: spawn -> stream lines -> collect result -> resolve promise.
 *
 * @testing CLI manual: npm run terminal-ui-kit:type-check
 * @see packages/terminal-ui-kit/src/cli-interactive/framework.ts - Interactive session wrapper that uses this bridge for command execution.
 * @see packages/terminal-ui-kit/src/ink/status.tsx - Status tone semantics consumed by renderers of task output.
 * @documentation reviewed=2026-04-11 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
import { spawn } from "node:child_process";
/**
 * Wraps emitted text with its originating stream channel for aggregated task logs.
 */
function createLine(source, text) {
    return { source, text };
}
/**
 * Consumes a byte chunk, emits complete newline-terminated lines, and retains a trailing partial fragment.
 *
 * @remarks
 * CRLF endings strip `\r` from emitted lines while keeping buffering stable across fragmented writes.
 */
function appendChunkLines(source, chunk, lines, emitLine, existingBuffer) {
    let buffer = existingBuffer + chunk;
    while (true) {
        const newlineIndex = buffer.indexOf("\n");
        if (newlineIndex === -1) {
            break;
        }
        const rawLine = buffer.slice(0, newlineIndex).replace(/\r$/, "");
        buffer = buffer.slice(newlineIndex + 1);
        const line = createLine(source, rawLine);
        lines.push(line);
        emitLine(line);
    }
    return buffer;
}
/**
 * Emits one final line after stream close when the buffer still holds text without a closing newline.
 */
function flushBufferedLine(source, buffer, lines, emitLine) {
    const trimmed = buffer.replace(/\r$/, "");
    if (trimmed.length === 0) {
        return;
    }
    const line = createLine(source, trimmed);
    lines.push(line);
    emitLine(line);
}
/**
 * Sends `signal` to the child, using process-group kill when the bridge spawned detached on Unix.
 *
 * @remarks
 * Treats `ESRCH` as a benign no-op after exit; propagates unexpected kill failures to the caller.
 */
function stopChildProcess(options) {
    const { child, useProcessGroup, signal } = options;
    try {
        if (useProcessGroup && typeof child.pid === "number") {
            process.kill(-child.pid, signal);
            return;
        }
        child.kill(signal);
    }
    catch (error) {
        const code = error instanceof Error && "code" in error ? String(error.code) : null;
        if (code === "ESRCH") {
            return;
        }
        throw error;
    }
}
/**
 * Spawns a child process and returns a cancelable handle that streams lines via callbacks.
 * The `callbacks.onStarted` is invoked with an ISO timestamp when the process begins.
 * On cancellation, sends SIGTERM then SIGKILL after 2 s. The resolved result reflects the
 * final exit state: `"succeeded"` (exit 0), `"failed"` (non-zero), or `"cancelled"` (SIGTERM/KILL).
 */
export function startInkCliTaskProcess(options) {
    const { projectRoot, command, args, env, callbacks, dependencies } = options;
    const spawnProcess = dependencies?.spawnProcess ?? spawn;
    const useProcessGroup = process.platform !== "win32";
    const child = spawnProcess(command, args, {
        cwd: projectRoot,
        env: env ?? process.env,
        detached: useProcessGroup,
        stdio: ["ignore", "pipe", "pipe"],
    });
    const lines = [];
    const startedAt = new Date().toISOString();
    let stdoutBuffer = "";
    let stderrBuffer = "";
    let cancelled = false;
    let closed = false;
    let forceKillTimer = null;
    callbacks.onStarted(startedAt);
    const promise = new Promise((resolve, reject) => {
        child.stdout.on("data", (chunk) => {
            stdoutBuffer = appendChunkLines("stdout", chunk.toString(), lines, callbacks.onLine, stdoutBuffer);
        });
        child.stderr.on("data", (chunk) => {
            stderrBuffer = appendChunkLines("stderr", chunk.toString(), lines, callbacks.onLine, stderrBuffer);
        });
        child.once("error", (error) => {
            reject(error);
        });
        child.once("close", (exitCode, signal) => {
            closed = true;
            if (forceKillTimer) {
                clearTimeout(forceKillTimer);
                forceKillTimer = null;
            }
            flushBufferedLine("stdout", stdoutBuffer, lines, callbacks.onLine);
            flushBufferedLine("stderr", stderrBuffer, lines, callbacks.onLine);
            resolve({
                status: cancelled ? "cancelled" : exitCode === 0 ? "succeeded" : "failed",
                exitCode,
                signal,
                lines,
                startedAt,
                endedAt: new Date().toISOString(),
            });
        });
    });
    return {
        promise,
        lines,
        startedAt,
        /**
         * Requests cooperative shutdown with `SIGTERM`, escalating to `SIGKILL` after a short grace window.
         *
         * @remarks
         * Idempotent after `close`; schedules a timer and calls `.unref?.()` so idle processes can exit.
         */
        cancel() {
            cancelled = true;
            if (closed) {
                return;
            }
            stopChildProcess({
                child,
                useProcessGroup,
                signal: "SIGTERM",
            });
            forceKillTimer = setTimeout(() => {
                if (closed) {
                    return;
                }
                stopChildProcess({
                    child,
                    useProcessGroup,
                    signal: "SIGKILL",
                });
            }, 2000);
            forceKillTimer.unref?.();
        },
    };
}
//# sourceMappingURL=bridge-task.js.map