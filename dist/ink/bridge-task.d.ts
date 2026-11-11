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
import { type ChildProcessByStdio } from "node:child_process";
import type { Readable } from "node:stream";
/** Source stream for a captured output line. */
export type InkCliSessionLineSource = "stdout" | "stderr";
/** A single captured output line with its source stream. */
export interface InkCliSessionLine {
    source: InkCliSessionLineSource;
    text: string;
}
/** The final outcome of a spawned task, including exit metadata and all captured lines. */
export interface InkCliTaskExecutionResult {
    status: "succeeded" | "failed" | "cancelled";
    exitCode: number | null;
    signal: string | null;
    lines: InkCliSessionLine[];
    startedAt: string;
    endedAt: string;
}
/**
 * Injectable spawn surface matching Node `child_process` streaming stdio for tests and stubs.
 *
 * @remarks
 * Callers attach pipe readers to stdout/stderr exactly like the real `spawn` return value.
 */
interface SpawnProcess {
    (command: string, args: string[], options: {
        cwd: string;
        env: NodeJS.ProcessEnv;
        detached: boolean;
        stdio: ["ignore", "pipe", "pipe"];
    }): ChildProcessByStdio<null, Readable, Readable>;
}
/**
 * Side-channel hooks invoked as the bridged subprocess starts and emits output lines.
 *
 * @remarks
 * `onLine` preserves stream identity (`stdout` vs `stderr`) for downstream tone semantics.
 */
interface InkCliTaskCallbacks {
    onStarted: (startedAt: string) => void;
    onLine: (line: InkCliSessionLine) => void;
}
/**
 * Spawns a child process and returns a cancelable handle that streams lines via callbacks.
 * The `callbacks.onStarted` is invoked with an ISO timestamp when the process begins.
 * On cancellation, sends SIGTERM then SIGKILL after 2 s. The resolved result reflects the
 * final exit state: `"succeeded"` (exit 0), `"failed"` (non-zero), or `"cancelled"` (SIGTERM/KILL).
 */
export declare function startInkCliTaskProcess(options: {
    projectRoot: string;
    command: string;
    args: string[];
    /** When set, used as the full process environment for the child (caller should merge `process.env` when needed). */
    env?: NodeJS.ProcessEnv;
    callbacks: InkCliTaskCallbacks;
    dependencies?: {
        spawnProcess?: SpawnProcess;
    };
}): {
    promise: Promise<InkCliTaskExecutionResult>;
    cancel: () => void;
    lines: InkCliSessionLine[];
    startedAt: string;
};
export {};
