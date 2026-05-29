/**
 * @fileoverview Ink component for rendering captured CLI output with semantic domain and level-based
 * color mapping, plus utility functions for color determination and line truncation.
 *
 * This file owns the captured-output renderer used by terminal apps to display
 * domain-colored and level-priority output blocks.
 * Color priority: ERROR/FATAL > WARN > DEBUG/TRACE > PERF > domain > source.
 *
 * @testing CLI manual: npm run terminal-ui-kit:type-check
 * @see packages/terminal-ui-kit/src/ink/bridge-task.ts - Task bridge that streams lines consumed by this renderer.
 * @see packages/terminal-ui-kit/src/ink/status.tsx - Tone semantics used as fallback when domain/level are unset.
 * @documentation reviewed=2026-04-11 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
import React from "react";
/**
 * Supported log levels for color mapping
 */
export type InkLogLevel = "INFO" | "DEBUG" | "WARN" | "ERROR" | "TRACE" | "FATAL" | "PERF" | "HTTP";
/**
 * Supported operational domains for semantic coloring
 */
export type InkDomain = "PIPELINE" | "LLM" | "EXTERNAL" | "DB" | "HTTP" | "PERF" | "SYSTEM" | undefined;
/**
 * Extended line interface with semantic metadata for enhanced coloring
 */
export interface InkCapturedOutputLine {
    source: string;
    text: string;
    /** Operational domain for semantic coloring */
    domain?: InkDomain;
    /** Log level for priority-based coloring */
    level?: InkLogLevel;
}
/**
 * Determines the appropriate color for a log line based on source, domain, and level.
 * Implements semantic hierarchy: level takes priority, then domain, then source.
 */
export declare function inkCliDefaultLineColor(source: string, domain?: InkDomain, level?: InkLogLevel): "gray" | "red" | "white" | "cyan" | "green" | "yellow" | "blue" | "magenta";
/**
 * Returns the last `count` items from `lines`, or all items if `lines.length <= count`.
 * @param lines - The source array to slice.
 * @param count - Maximum number of trailing items to return.
 */
export declare function sliceRecentLines<T>(lines: readonly T[], count: number): T[];
/**
 * Renders a log line with semantic coloring based on domain and level.
 * Level indicators take priority, followed by domain context.
 */
export declare function InkCapturedOutputBlock({ title, lines, maxLines, lineColor, bracketSource, showDomain, }: {
    title: string;
    lines: readonly InkCapturedOutputLine[];
    maxLines: number;
    lineColor?: (source: string, domain?: InkDomain, level?: InkLogLevel) => "gray" | "red" | "white" | "cyan" | "green" | "yellow" | "blue" | "magenta";
    bracketSource?: boolean;
    /** Show domain prefix for additional context */
    showDomain?: boolean;
}): React.ReactNode;
//# sourceMappingURL=captured-output.d.ts.map