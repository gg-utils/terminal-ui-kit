/**
 * @fileoverview Ink components for rendering command preview blocks and formatting command lines
 * for display in terminal UIs.
 *
 * This file owns the command preview renderer used by terminal CLI apps.
 *
 * @testing CLI manual: npm run terminal-ui-kit:type-check
 * @see packages/terminal-ui-kit/src/cli-interactive/framework.ts - Command preview builders (`buildCommandPreview`, `buildNpmRunPreview`) consumed by this component.
 * @documentation reviewed=2026-04-11 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
import React from "react";
/** Joins a command name and args array into a single space-separated command line string. */
export declare function formatInkCliCommandLine(command: string, args: readonly string[]): string;
/** Renders a titled command line block using Ink `Box` and `Text` with word-wrap support. */
export declare function InkCommandPreview({ title, commandLine, }: {
    title?: string;
    commandLine: string;
}): React.ReactNode;
//# sourceMappingURL=command-preview.d.ts.map