/**
 * @fileoverview Interactive TTY framework for guided CLI workflows: colorized terminal output,
 * structured prompts, list selection, command execution, and npm script orchestration.
 *
 * This file owns the `CliInteractiveSession` and all companion helpers used by terminal
 * UI entrypoints that need structured user interaction in a terminal.
 * Flow: prompt -> session state -> user choice -> command execution -> result display.
 *
 * @testing CLI: npm run terminal-ui-kit:type-check
 * @testing CLI: npm run terminal-ui-kit:type-check
 * @see packages/terminal-ui-kit/src/ink/bridge-task.ts - Child-process bridge that runs the spawned command under an Ink session.
 * @see packages/terminal-ui-kit/src/ink/status.tsx - Ink status primitives (badge, toggle, chips) used by interactive sessions.
 * @documentation reviewed=2026-04-11 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
/** Sentinel for yes/no prompts when Enter accepts the hinted default (`y/N` vs `Y/n`). */
type CliInteractive_DefaultPrompt = "n" | "y";
/** Options for the shared interactive terminal session. */
export type CliInteractiveSessionOptions = {
    brandLabel?: string;
};
/** Option descriptor for list-based interactive selection. */
export type CliInteractiveListOption<TValue extends string> = {
    description?: string;
    label?: string;
    value: TValue;
};
/** Thrown when the user cancels an interactive flow via SIGINT. */
export declare class CliInteractiveCancelledError extends Error {
    /** Creates an error signalling cooperative cancellation during readline prompting. */
    constructor();
}
/** Thrown when a spawned command exits with a non-zero code. */
export declare class CliInteractiveCommandFailedError extends Error {
    readonly exitCode: number;
    /** Creates an error carrying the failed command preview and its non-zero exit code. */
    constructor(options: {
        command: string;
        exitCode: number;
    });
}
/** Stateful interactive TTY session: output styling, structured prompts, and command orchestration. */
export declare class CliInteractiveSession {
    private readonly brandLabel;
    private cancelled;
    private readonly interface;
    private readonly styleEnabled;
    /**
     * Wires stdin/stderr readline I/O on a TTY and marks the session cancelled on SIGINT.
     *
     * @remarks
     * Closing the interface cooperates with outstanding `question()` calls.
     */
    constructor(options?: CliInteractiveSessionOptions);
    /** Releases the underlying readline interface; safe to call more than once. */
    close(): void;
    /** Clears the controlling terminal viewport when stderr is attached to a TTY. */
    clearScreen(): void;
    /** Writes one line (empty by default) to stderr with a trailing newline. */
    writeLine(text?: string): void;
    /** Renders a full-width magenta banner framing the family and focus labels. */
    printHeader(family: string, focus: string): void;
    /** Renders a cyan ASCII panel title with optional blue subtitle line. */
    printPanelTitle(title: string, subtitle?: string): void;
    /** Prints a numbered menu row with balanced label and description columns. */
    printMenuItem(number: string | number, label: string, description: string): void;
    /** Prints a short magenta accent line to separate visual sections. */
    printKicker(text: string): void;
    /** Prints auxiliary blue guidance text without badge prefixes. */
    printMicrocopy(text: string): void;
    /** Prints a subtle cyan dotted rule between major blocks. */
    printSectionBreak(): void;
    /** Prints an informational note tagged `[note]` in blue. */
    printNote(text: string): void;
    /** Prints a success line tagged `[ok]` in green (bold when styling is on). */
    printSuccess(text: string): void;
    /** Prints a warning line tagged `[warn]` in yellow (bold when styling is on). */
    printWarning(text: string): void;
    /** Prints an error line tagged `[error]` in red (bold when styling is on). */
    printError(text: string): void;
    /** Prints a magenta `[run]` line showing the command about to execute. */
    printCommand(text: string): void;
    /** Prints a full-width magenta equals rule across the current frame width. */
    printDivider(): void;
    /**
     * Prompts once on stderr via readline, trimming leading and trailing whitespace.
     *
     * @remarks
     * Cooperative cancellation translates into `CliInteractiveCancelledError`; other errors propagate.
     *
     * @throws {CliInteractiveCancelledError} When SIGINT interrupted the interactive flow.
     */
    promptReadLine(promptText: string): Promise<string>;
    /** Prompts once; blank answers fall back to the provided default verbatim. */
    promptWithDefault(promptText: string, defaultValue: string): Promise<string>;
    /**
     * Loops until the user submits a non-empty trimmed answer.
     *
     * @remarks
     * Prints `printError` feedback on each invalid attempt without throwing.
     */
    promptRequired(promptText: string): Promise<string>;
    /**
     * Parses a strictly positive decimal integer answer, honoring the default string when blank.
     *
     * @remarks
     * Re-prompts on invalid input rather than throwing.
     */
    promptPositiveIntegerWithDefault(promptText: string, defaultValue: number): Promise<number>;
    /**
     * Collects yes/no terminal; blank Enter accepts the `defaultValue` polarity hint.
     *
     * @remarks
     * Accepts common synonyms (`yes`/`no`); rejects other answers with guided error text.
     */
    promptYesNo(promptText: string, defaultValue: CliInteractive_DefaultPrompt): Promise<boolean>;
    /**
     * Parses an inclusive 1-based menu index capped by `max`, looping on invalid parses.
     *
     * @remarks
     * Emits customizable `errorText` or a stock validation message via `printError`.
     */
    promptMenuSelection(options: {
        errorText?: string;
        max: number;
        prompt: string;
    }): Promise<number>;
    /**
     * Renders list options inside a cyan panel then blocks until the user selects a valid index.
     *
     * @throws {Error} When the backing array does not align with the chosen numeric index (defensive guard).
     */
    chooseFromList<TValue extends string>(options: {
        items: ReadonlyArray<CliInteractiveListOption<TValue>>;
        promptText?: string;
        promptTitle: string;
        promptSubtitle: string;
    }): Promise<TValue>;
    /**
     * Pauses readline input while spawned children inherit stdout/stderr.
     *
     * @remarks
     * Pair with `resumeAfterCommand` in `finally` blocks to avoid stalled prompts.
     */
    pauseForCommand(): void;
    /** Resumes readline prompting after pausing around child-process execution. */
    resumeAfterCommand(): void;
    /** Chooses responsive layout width from `stdout.columns` with sane clamps. */
    private frameWidth;
    /** Truncates with an ellipsis suffix when overflowing the column budget (non-negative widths). */
    private truncate;
    /** Pads ASCII spaces on the right to align fixed-width stderr columns. */
    private padRight;
    /** Wraps text with ANSI color (and optional bold) when styling is enabled. */
    private decorate;
}
/** Enforces that the current process has a TTY on both stdin and stderr; throws otherwise. */
export declare function assertCliInteractiveTty(commandName: string): void;
/**
 * Runs an interactive CLI workflow inside a `CliInteractiveSession`, catching cancellation and
 * command-failure errors and mapping them to process exit codes.
 * @param run - The interactive workflow to execute; receives the session as its only argument.
 */
export declare function runCliInteractiveMain(run: (session: CliInteractiveSession) => Promise<void>): Promise<void>;
/** Quotes a string for safe use inside a single-quoted POSIX shell token. */
export declare function cliInteractiveShellQuote(value: string): string;
/**
 * Formats a token for safe shell embedding: passes-through safe tokens and shell-quotes unsafe ones.
 * @param token - The raw token string to format.
 */
export declare function formatCliInteractiveShellToken(token: string): string;
/**
 * Builds a human-readable command preview string from a binary and optional args array.
 * Unsafe tokens are shell-quoted; the first token is passed through unquoted.
 */
export declare function buildCommandPreview(options: {
    args?: ReadonlyArray<string>;
    binary: string;
}): string;
/**
 * Builds a human-readable `npm run <script>` command preview string with optional forwarded args.
 * Wraps `buildCommandPreview` with the `npm run <script> [-- <args>]` pattern.
 */
export declare function buildNpmRunPreview(options: {
    args?: ReadonlyArray<string>;
    scriptName: string;
}): string;
/**
 * Spawns a binary as a child process with inherited stdio, pausing the readline session during execution.
 * Throws `CliInteractiveCommandFailedError` on non-zero exit unless `allowNonZeroExit` is set.
 */
export declare function runCommand(options: {
    allowNonZeroExit?: boolean;
    args?: ReadonlyArray<string>;
    binary: string;
    commandText?: string;
    cwd: string;
    previewBinary?: string;
    session: CliInteractiveSession;
}): Promise<void>;
/**
 * Runs an npm script (`npm run <script>`) inside the session's cwd, pausing the readline interface
 * during execution. Forwards all args after `--` to the script.
 */
export declare function runNpmScript(options: {
    args?: ReadonlyArray<string>;
    commandText?: string;
    cwd: string;
    scriptName: string;
    session: CliInteractiveSession;
}): Promise<void>;
/**
 * Prints the command preview via `session.printCommand` then runs it via `runCommand`.
 * Pauses the readline interface during execution.
 */
export declare function printAndRunCommand(options: {
    allowNonZeroExit?: boolean;
    args?: ReadonlyArray<string>;
    binary: string;
    commandText?: string;
    cwd: string;
    previewBinary?: string;
    session: CliInteractiveSession;
}): Promise<void>;
/**
 * Prints the `npm run <script>` preview via `session.printCommand` then runs it via `runNpmScript`.
 * Pauses the readline interface during execution.
 */
export declare function printAndRunNpmScript(options: {
    args?: ReadonlyArray<string>;
    commandText?: string;
    cwd: string;
    scriptName: string;
    session: CliInteractiveSession;
}): Promise<void>;
/**
 * Shows a panel with the command preview, waits for yes/no confirmation, then runs the npm script.
 * Optionally displays a warning before the confirmation prompt.
 */
export declare function previewAndRunNpmScript(options: {
    args?: ReadonlyArray<string>;
    confirmPrompt?: string;
    cwd: string;
    defaultConfirm?: "n" | "y";
    description: string;
    panelSubtitle?: string;
    panelTitle?: string;
    scriptName: string;
    session: CliInteractiveSession;
    skipMessage?: string;
    warningText?: string;
}): Promise<void>;
export {};
//# sourceMappingURL=framework.d.ts.map