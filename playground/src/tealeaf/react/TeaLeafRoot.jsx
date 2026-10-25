import { useMemo, useState } from "react";
import {
  DEFAULT_BG,
  DEFAULT_COLOR,
  DEFAULT_FORMAT,
  DEFAULT_FREQUENCY_CUTOFF,
  DEFAULT_GRID_SIZE,
  DEFAULT_VARIANT,
  VARIANTS,
  generateTeaLeafField,
  parseTeaLeafOptionsFromSearch,
} from "../tealeaf-core.js";
import { TeaLeafContext } from "./TeaLeafContext.jsx";

function sanitizeFormat(value) {
  return value === "svg" ? "svg" : "png";
}

function sanitizeVariant(value) {
  return VARIANTS.includes(value) ? value : DEFAULT_VARIANT;
}

function toPositiveNumber(value, fallback) {
  if (value == null || value === "") return null;
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeHex(value, fallback) {
  if (value == null || value === "") return fallback;
  const cleaned = String(value).replace(/^#/, "").trim();
  if (/^[0-9a-fA-F]{6}$/.test(cleaned) || /^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return `#${cleaned.toLowerCase()}`;
  }
  return fallback;
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function TeaLeafRoot({
  children,
  seedText = "tealeaf::",
  options,
  querySearch,
  gridSize = DEFAULT_GRID_SIZE,
  frequencyCutoff = DEFAULT_FREQUENCY_CUTOFF,
  variant,
  triangleCount,
  seam,
  offOpacity,
}) {
  const queryOptions =
    typeof querySearch === "string"
      ? parseTeaLeafOptionsFromSearch(querySearch, {
          gridSize,
          frequencyCutoff,
          variant,
          triangleCount,
        })
      : null;

  const initial = {
    color: DEFAULT_COLOR,
    bg: DEFAULT_BG,
    format: DEFAULT_FORMAT,
    variant: variant ?? DEFAULT_VARIANT,
    triangleCount: triangleCount ?? null,
    seam: seam ?? null,
    offOpacity: offOpacity ?? null,
    width: gridSize,
    height: gridSize,
    ...(queryOptions || {}),
    ...(options || {}),
  };

  const [state, setState] = useState(() => ({
    seedText,
    color: normalizeHex(initial.color, DEFAULT_COLOR),
    bg: initial.bg === null ? null : normalizeHex(initial.bg, DEFAULT_BG),
    format: sanitizeFormat(initial.format),
    variant: sanitizeVariant(initial.variant),
    triangleCount: toPositiveNumber(initial.triangleCount, null),
    seam: typeof initial.seam === "number" && initial.seam >= 0 ? initial.seam : null,
    offOpacity:
      typeof initial.offOpacity === "number" && initial.offOpacity >= 0
        ? Math.min(1, initial.offOpacity)
        : null,
    width: toPositiveInt(initial.width, gridSize),
    height: toPositiveInt(initial.height, gridSize),
    gridSize,
    frequencyCutoff,
  }));

  const field = useMemo(
    () =>
      generateTeaLeafField({
        seedText: state.seedText,
        gridSize: state.gridSize,
        frequencyCutoff: state.frequencyCutoff,
      }),
    [state.seedText, state.gridSize, state.frequencyCutoff]
  );

  const api = useMemo(
    () => ({
      state,
      field,
      setSeedText(seed) {
        setState((current) => ({ ...current, seedText: String(seed || "") }));
      },
      setFormat(format) {
        setState((current) => ({ ...current, format: sanitizeFormat(format) }));
      },
      setVariant(nextVariant) {
        setState((current) => ({ ...current, variant: sanitizeVariant(nextVariant) }));
      },
      setTriangleCount(count) {
        setState((current) => ({
          ...current,
          triangleCount: toPositiveNumber(count, current.triangleCount),
        }));
      },
      setColor(color) {
        setState((current) => ({
          ...current,
          color: normalizeHex(color, current.color),
        }));
      },
      setBackground(bg) {
        setState((current) => ({
          ...current,
          bg:
            bg == null || bg === "" || bg === "transparent"
              ? null
              : normalizeHex(bg, current.bg),
        }));
      },
      setSize(width, height = width) {
        setState((current) => ({
          ...current,
          width: toPositiveInt(width, current.width),
          height: toPositiveInt(height, current.height),
        }));
      },
      setWidth(width) {
        setState((current) => ({
          ...current,
          width: toPositiveInt(width, current.width),
        }));
      },
      setHeight(height) {
        setState((current) => ({
          ...current,
          height: toPositiveInt(height, current.height),
        }));
      },
      setOptions(nextOptions) {
        setState((current) => ({
          ...current,
          ...(nextOptions.seedText == null
            ? null
            : { seedText: String(nextOptions.seedText) }),
          ...(nextOptions.format == null
            ? null
            : { format: sanitizeFormat(nextOptions.format) }),
          ...(nextOptions.variant == null
            ? null
            : { variant: sanitizeVariant(nextOptions.variant) }),
          ...(nextOptions.triangleCount === undefined
            ? null
            : {
                triangleCount: toPositiveNumber(
                  nextOptions.triangleCount,
                  current.triangleCount
                ),
              }),
          ...(nextOptions.color == null
            ? null
            : { color: normalizeHex(nextOptions.color, current.color) }),
          ...(nextOptions.bg === undefined
            ? null
            : {
                bg:
                  nextOptions.bg == null || nextOptions.bg === "transparent"
                    ? null
                    : normalizeHex(nextOptions.bg, current.bg),
              }),
          ...(nextOptions.width == null
            ? null
            : { width: toPositiveInt(nextOptions.width, current.width) }),
          ...(nextOptions.height == null
            ? null
            : { height: toPositiveInt(nextOptions.height, current.height) }),
        }));
      },
    }),
    [state, field]
  );

  return <TeaLeafContext.Provider value={api}>{children}</TeaLeafContext.Provider>;
}
