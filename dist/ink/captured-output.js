import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
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
import { Box, Text } from "ink";
/**
 * Determines the appropriate color for a log line based on source, domain, and level.
 * Implements semantic hierarchy: level takes priority, then domain, then source.
 */
export function inkCliDefaultLineColor(source, domain, level) {
    // Level-based coloring (highest priority)
    if (level === "ERROR" || level === "FATAL") {
        return "red";
    }
    if (level === "WARN") {
        return "yellow";
    }
    if (level === "DEBUG" || level === "TRACE") {
        return "gray";
    }
    if (level === "PERF") {
        return "cyan";
    }
    // Domain-based coloring (secondary priority)
    if (domain === "LLM") {
        return "green";
    }
    if (domain === "PIPELINE") {
        return "cyan";
    }
    if (domain === "EXTERNAL") {
        return "yellow";
    }
    if (domain === "DB") {
        return "magenta";
    }
    if (domain === "HTTP") {
        return "gray";
    }
    if (domain === "PERF") {
        return "cyan";
    }
    // Source-based fallback
    if (source === "stderr") {
        return "red";
    }
    if (source === "bridge") {
        return "gray";
    }
    return "white";
}
/**
 * Returns the last `count` items from `lines`, or all items if `lines.length <= count`.
 * @param lines - The source array to slice.
 * @param count - Maximum number of trailing items to return.
 */
export function sliceRecentLines(lines, count) {
    if (lines.length <= count) {
        return [...lines];
    }
    return lines.slice(lines.length - count);
}
/**
 * Renders domain as a subtle colored prefix
 */
function renderDomainPrefix(domain) {
    if (!domain)
        return null;
    const domainColorMap = {
        PIPELINE: "cyan",
        LLM: "green",
        EXTERNAL: "yellow",
        DB: "magenta",
        HTTP: "gray",
        PERF: "cyan",
        SYSTEM: "gray",
    };
    const color = domainColorMap[domain] ?? "gray";
    return (_jsxs(Text, { color: color, dimColor: true, children: ["[", domain, "]", " "] }));
}
/**
 * Renders a log line with semantic coloring based on domain and level.
 * Level indicators take priority, followed by domain context.
 */
export function InkCapturedOutputBlock({ title, lines, maxLines, lineColor = inkCliDefaultLineColor, bracketSource = false, showDomain = false, }) {
    const recent = sliceRecentLines(lines, maxLines);
    return (_jsxs(Box, { flexDirection: "column", marginTop: title ? 1 : 0, children: [title ? _jsx(Text, { bold: true, children: title }) : null, recent.map((line, index) => (_jsxs(Text, { color: lineColor(line.source, line.domain, line.level), children: [showDomain && renderDomainPrefix(line.domain), bracketSource ? `[${line.source}] ${line.text}` : line.text] }, `${line.source}:${index}`)))] }));
}
