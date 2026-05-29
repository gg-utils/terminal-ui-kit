/**
 * Factory for the shared OpenTUI CLI renderer used by maintainer and orchestration entrypoints.
 *
 * @remarks
 * I/O: Initializes alternate-screen TTY renderer. USAGE: Call once per process before `createRoot`.
 */
export declare function openTuiCreateScriptRenderer(): Promise<import("@opentui/core").CliRenderer>;
//# sourceMappingURL=create-renderer.d.ts.map