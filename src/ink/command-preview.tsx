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
import { Box, Text } from "ink";

/** Joins a command name and args array into a single space-separated command line string. */
export function formatInkCliCommandLine(
  command: string,
  args: readonly string[],
): string {
  return [command, ...args].join(" ");
}

/** Renders a titled command line block using Ink `Box` and `Text` with word-wrap support. */
export function InkCommandPreview({
  title = "Command",
  commandLine,
}: {
  title?: string;
  commandLine: string;
}): React.ReactNode {
  return (
    <Box flexDirection="column">
      <Text bold>{title}</Text>
      <Text wrap="wrap">{commandLine}</Text>
    </Box>
  );
}
