/**
 * Returns `[columns, rows]` for the active Ink stdout handle, updating on `resize` events.
 *
 * @remarks
 * Subscribes to `stdout` resize events from Ink's `useStdout` hook; defaults to 80x24 when dimensions are unavailable.
 */
export declare function useStdoutDimensions(): [number, number];
//# sourceMappingURL=use-stdout-dimensions.d.ts.map