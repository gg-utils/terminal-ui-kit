/**
 * @fileoverview Shared Ink hook for observing stdout dimensions in CLI layouts.
 *
 * Flow: terminal resize signals -> measured stdout dimensions -> responsive Ink layout state.
 *
 * @testing Manual import verification: npx tsx -e "await import('./packages/terminal-ui-kit/src/ink/use-stdout-dimensions.ts');"
 * @see packages/terminal-ui-kit/src/ink/use-stdout-dimensions.ts - Import this hook leaf module directly from CLI-Ink consumers.
 * @documentation reviewed=2026-04-11 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
import { useEffect, useState } from "react";
import { useStdout } from "ink";

/**
 * Returns `[columns, rows]` for the active Ink stdout handle, updating on `resize` events.
 *
 * @remarks
 * Subscribes to `stdout` resize events from Ink's `useStdout` hook; defaults to 80x24 when dimensions are unavailable.
 */
export function useStdoutDimensions(): [number, number] {
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState<[number, number]>([
    stdout.columns ?? 80,
    stdout.rows ?? 24,
  ]);

  useEffect(() => {
    /**
     * Refreshes stored stdout dimensions after the terminal fires a `resize` event.
     *
     * @remarks
     * Reads `stdout.columns` and `stdout.rows` at event time, applying the same 80×24 fallbacks as initial state.
     */
    const onResize = () => {
      setDimensions([stdout.columns ?? 80, stdout.rows ?? 24]);
    };
    stdout.on("resize", onResize);
    return () => {
      stdout.off("resize", onResize);
    };
  }, [stdout]);

  return dimensions;
}
