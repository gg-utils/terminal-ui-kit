import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text } from "ink";
import { InkStatusBadge } from "./status.js";
/** Top-of-screen header with app name, optional title + badge, description, summary, and notice lines. */
export function InkScreenHeader({ appName, title, description, summary, notice, badgeLabel, badgeTone, }) {
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { bold: true, color: "green", children: appName }), title || badgeLabel ? (_jsxs(Box, { children: [title ? _jsx(Text, { bold: true, children: title }) : null, title && badgeLabel ? _jsx(Text, { children: " " }) : null, badgeLabel && badgeTone ? (_jsx(InkStatusBadge, { label: badgeLabel, tone: badgeTone })) : null] })) : null, description ? _jsx(Text, { color: "gray", children: description }) : null, summary ? _jsx(Box, { children: summary }) : null, notice ? _jsx(Text, { color: "yellow", children: notice }) : null] }));
}
/** Named panel with optional subtitle, badge, footer hint, and arbitrary children. */
export function InkPanel({ title, subtitle, badgeLabel, badgeTone, footerHint, children, }) {
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Text, { bold: true, children: title }), badgeLabel && badgeTone ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: " " }), _jsx(InkStatusBadge, { label: badgeLabel, tone: badgeTone })] })) : null] }), subtitle ? _jsx(Text, { color: "gray", children: subtitle }) : null, children, footerHint ? _jsx(Text, { color: "gray", children: footerHint }) : null] }));
}
/** A titled section inside a panel with a bold title and indented children. */
export function InkPanelSection({ title, children, }) {
    return (_jsxs(Box, { marginTop: 1, flexDirection: "column", children: [_jsx(Text, { bold: true, children: title }), children] }));
}
/** A 1-column vertical divider with gray pipe character, used to separate layout columns. */
export function InkColumnDivider() {
    return (_jsx(Box, { width: 1, children: _jsx(Text, { color: "gray", children: "|" }) }));
}
const inkChrome = {
    InkScreenHeader,
    InkPanel,
    InkPanelSection,
    InkColumnDivider,
};
export default inkChrome;
//# sourceMappingURL=chrome.js.map