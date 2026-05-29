import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from "ink";
/**
 * Renders a legend block with an optional title and a list of lines.
 * Lines containing ` | ` are split into key-badge + description pairs; other lines are rendered gray.
 */
export function InkLegend({ lines, title = "Keys", }) {
    return (_jsxs(Box, { marginTop: 1, flexDirection: "column", gap: 0, children: [title ? (_jsx(Box, { marginBottom: 1, children: _jsx(Text, { bold: true, children: title }) })) : null, lines.map((line, lineIndex) => {
                const hasPrefix = line.startsWith("Keys: ");
                const cleanLine = hasPrefix ? line.slice(6).trim() : line.trim();
                if (!cleanLine.includes(" | ") && !hasPrefix) {
                    return (_jsx(Text, { color: "gray", children: line }, lineIndex));
                }
                const segments = cleanLine.split(" | ");
                return (_jsx(Box, { flexDirection: "row", flexWrap: "wrap", children: segments.map((segment, segIndex) => {
                        const trimmed = segment.trim();
                        if (!trimmed)
                            return null;
                        const firstSpace = trimmed.indexOf(" ");
                        const keyCombo = firstSpace > -1 ? trimmed.slice(0, firstSpace) : trimmed;
                        const desc = firstSpace > -1 ? trimmed.slice(firstSpace + 1) : "";
                        return (_jsxs(Box, { marginRight: 3, marginBottom: 1, children: [_jsx(Text, { color: "black", backgroundColor: "white", bold: true, children: ` ${keyCombo} ` }), desc ? _jsxs(Text, { color: "gray", children: [" ", desc] }) : null] }, segIndex));
                    }) }, lineIndex));
            })] }));
}
const inkLegend = {
    InkLegend,
};
export default inkLegend;
//# sourceMappingURL=legend.js.map