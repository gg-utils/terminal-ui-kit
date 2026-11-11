import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * @fileoverview Ink terminal UI primitives for status rendering: badge colors, boolean chips,
 * option toggles, and choice selectors with tone-driven color semantics.
 *
 * This file owns all shared Ink status components used by terminal CLI apps.
 * Tone matrix:
 * - ready / staged / editing / info → cyan (positive flow)
 * - blocked / warning → yellow (caution)
 * - destructive → red (danger)
 * - muted → gray (inactive)
 *
 * @testing CLI manual: npm run terminal-ui-kit:type-check
 * @testing CLI manual: npm run terminal-ui-kit:type-check
 * @see packages/terminal-ui-kit/src/cli-interactive/framework.ts - Interactive session that uses these components for command orchestration.
 * @see packages/terminal-ui-kit/src/ink/bridge-task.ts - Task execution renderer that streams output with status tone.
 * @documentation reviewed=2026-04-13 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
import React from "react";
import { Box, Text } from "ink";
/**
 * Resolves a status tone to an Ink `Text` color token for badge rendering.
 *
 * @remarks
 * Implements the same tone-to-color matrix described in this file's overview (e.g. blocked and
 * warning share yellow; staged, editing, and info share cyan).
 */
function getInkStatusColor(tone) {
    switch (tone) {
        case "ready":
            return "green";
        case "blocked":
        case "warning":
            return "yellow";
        case "staged":
        case "editing":
        case "info":
            return "cyan";
        case "destructive":
            return "red";
        case "muted":
            return "gray";
    }
}
/** Renders a single bracketed status badge in the tone color. */
export function InkStatusBadge({ label, tone, }) {
    return _jsxs(Text, { color: getInkStatusColor(tone), children: ["[", label, "]"] });
}
/** Renders yes/no chips showing which of the two states is active for a boolean value. */
export function InkBooleanChips({ value, }) {
    return (_jsxs(Box, { children: [_jsx(InkStatusBadge, { label: "yes", tone: value ? "ready" : "muted" }), _jsx(Text, { color: "gray", children: " " }), _jsx(InkStatusBadge, { label: "no", tone: value ? "muted" : "warning" })] }));
}
/**
 * Renders a labeled boolean option with active/inactive tone-driven chips and an optional shortcut hint.
 * The "yes" chip takes `activeTone` when `value` is true and `inactiveTone` when false.
 * The "no" chip takes `inactiveTone` when `value` is true and `"warning"` when false.
 */
export function InkOptionToggle({ label, shortcut, value, activeTone = "ready", inactiveTone = "muted", }) {
    return (_jsxs(Box, { children: [_jsxs(Text, { children: [label, " ", shortcut ? `[${shortcut}]` : "", ":", " "] }), _jsx(InkStatusBadge, { label: "yes", tone: value ? activeTone : inactiveTone }), _jsx(Text, { color: "gray", children: " " }), _jsx(InkStatusBadge, { label: "no", tone: value ? inactiveTone : "warning" })] }));
}
/**
 * Renders a labeled choice among mutually exclusive options, highlighting the active choice with
 * `activeTone` and all others with `inactiveTone`.
 */
export function InkOptionSelector({ label, shortcut, value, choices, activeTone = "ready", inactiveTone = "muted", }) {
    return (_jsxs(Box, { children: [_jsxs(Text, { children: [label, " ", shortcut ? `[${shortcut}]` : "", ":", " "] }), choices.map((choice, index) => (_jsxs(React.Fragment, { children: [_jsx(InkStatusBadge, { label: choice.label, tone: value === choice.value ? activeTone : inactiveTone }), index < choices.length - 1 ? _jsx(Text, { color: "gray", children: " " }) : null] }, choice.value)))] }));
}
const inkStatus = {
    InkStatusBadge,
    InkBooleanChips,
    InkOptionToggle,
    InkOptionSelector,
};
export default inkStatus;
