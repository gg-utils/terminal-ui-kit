import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from "ink";
/** Joins a command name and args array into a single space-separated command line string. */
export function formatInkCliCommandLine(command, args) {
    return [command, ...args].join(" ");
}
/** Renders a titled command line block using Ink `Box` and `Text` with word-wrap support. */
export function InkCommandPreview({ title = "Command", commandLine, }) {
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { bold: true, children: title }), _jsx(Text, { wrap: "wrap", children: commandLine })] }));
}
//# sourceMappingURL=command-preview.js.map