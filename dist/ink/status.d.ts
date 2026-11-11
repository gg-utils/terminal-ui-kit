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
/** Color tone semantics for status badges: maps terminal to terminal color. */
export type InkStatusTone = "ready" | "blocked" | "staged" | "editing" | "warning" | "destructive" | "info" | "muted";
/** Renders a single bracketed status badge in the tone color. */
export declare function InkStatusBadge({ label, tone, }: {
    label: string;
    tone: InkStatusTone;
}): React.ReactNode;
/** Renders yes/no chips showing which of the two states is active for a boolean value. */
export declare function InkBooleanChips({ value, }: {
    value: boolean;
}): React.ReactNode;
/**
 * Renders a labeled boolean option with active/inactive tone-driven chips and an optional shortcut hint.
 * The "yes" chip takes `activeTone` when `value` is true and `inactiveTone` when false.
 * The "no" chip takes `inactiveTone` when `value` is true and `"warning"` when false.
 */
export declare function InkOptionToggle({ label, shortcut, value, activeTone, inactiveTone, }: {
    label: string;
    shortcut?: string;
    value: boolean;
    activeTone?: InkStatusTone;
    inactiveTone?: InkStatusTone;
}): React.ReactNode;
/**
 * Renders a labeled choice among mutually exclusive options, highlighting the active choice with
 * `activeTone` and all others with `inactiveTone`.
 */
export declare function InkOptionSelector({ label, shortcut, value, choices, activeTone, inactiveTone, }: {
    label: string;
    shortcut?: string;
    value: string;
    choices: {
        value: string;
        label: string;
    }[];
    activeTone?: InkStatusTone;
    inactiveTone?: InkStatusTone;
}): React.ReactNode;
declare const inkStatus: {
    InkStatusBadge: typeof InkStatusBadge;
    InkBooleanChips: typeof InkBooleanChips;
    InkOptionToggle: typeof InkOptionToggle;
    InkOptionSelector: typeof InkOptionSelector;
};
export default inkStatus;
