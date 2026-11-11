/**
 * @fileoverview Ink chrome primitives: screen headers with app branding, panels with optional badges,
 * panel sections, and column dividers for composing rich terminal UIs.
 *
 * This file owns the structural Ink components used to scaffold terminal CLI apps.
 *
 * @testing CLI manual: npm run terminal-ui-kit:type-check
 * @see packages/terminal-ui-kit/src/ink/status.tsx - Status badge and tone semantics used by chrome components.
 * @see packages/terminal-ui-kit/src/ink/command-preview.tsx - Command preview component rendered inside chrome panels.
 * @documentation reviewed=2026-04-11 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
import React from "react";
import { type InkStatusTone } from "./status.js";
/** Top-of-screen header with app name, optional title + badge, description, summary, and notice lines. */
export declare function InkScreenHeader({ appName, title, description, summary, notice, badgeLabel, badgeTone, }: {
    appName: string;
    title?: string;
    description?: string;
    summary?: React.ReactNode;
    notice?: string | null;
    badgeLabel?: string | null;
    badgeTone?: InkStatusTone;
}): React.ReactNode;
/** Named panel with optional subtitle, badge, footer hint, and arbitrary children. */
export declare function InkPanel({ title, subtitle, badgeLabel, badgeTone, footerHint, children, }: {
    title: string;
    subtitle?: string;
    badgeLabel?: string | null;
    badgeTone?: InkStatusTone;
    footerHint?: string;
    children: React.ReactNode;
}): React.ReactNode;
/** A titled section inside a panel with a bold title and indented children. */
export declare function InkPanelSection({ title, children, }: {
    title: string;
    children: React.ReactNode;
}): React.ReactNode;
/** A 1-column vertical divider with gray pipe character, used to separate layout columns. */
export declare function InkColumnDivider(): React.ReactNode;
declare const inkChrome: {
    InkScreenHeader: typeof InkScreenHeader;
    InkPanel: typeof InkPanel;
    InkPanelSection: typeof InkPanelSection;
    InkColumnDivider: typeof InkColumnDivider;
};
export default inkChrome;
