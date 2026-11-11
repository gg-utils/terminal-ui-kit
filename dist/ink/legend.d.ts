/**
 * @fileoverview Ink legend component for rendering keyboard shortcut hints with styled key badges
 * and descriptions inside terminal UIs.
 *
 * This file owns the legend renderer used by terminal CLI apps to show keyboard bindings.
 *
 * @testing CLI manual: npm run terminal-ui-kit:type-check
 * @see packages/terminal-ui-kit/src/ink/chrome.tsx - Chrome components (panels, headers) that may contain a legend.
 * @documentation reviewed=2026-04-11 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
import React from "react";
/**
 * Renders a legend block with an optional title and a list of lines.
 * Lines containing ` | ` are split into key-badge + description pairs; other lines are rendered gray.
 */
export declare function InkLegend({ lines, title, }: {
    lines: readonly string[];
    title?: string | null;
}): React.ReactNode;
declare const inkLegend: {
    InkLegend: typeof InkLegend;
};
export default inkLegend;
