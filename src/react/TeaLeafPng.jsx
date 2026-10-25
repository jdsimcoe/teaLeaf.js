import { useMemo } from "react";
import { createTeaLeafPngDataUrl } from "../tealeaf-core.js";
import { useTeaLeaf } from "./TeaLeafContext.jsx";

export function TeaLeafPng(props) {
  const { state, field } = useTeaLeaf();

  const src = useMemo(
    () =>
      createTeaLeafPngDataUrl({
        field,
        color: state.color,
        bg: state.bg,
        width: state.width,
        height: state.height,
        variant: state.variant,
        triangleCount: state.triangleCount,
        seam: state.seam ?? undefined,
        offOpacity: state.offOpacity ?? undefined,
      }),
    [
      field,
      state.color,
      state.bg,
      state.width,
      state.height,
      state.variant,
      state.triangleCount,
      state.seam,
      state.offOpacity,
    ]
  );

  return (
    <img
      {...props}
      src={src}
      width={state.width}
      height={state.height}
      alt={props.alt || "TeaLeaf PNG"}
      style={{
        imageRendering: state.variant === "pixel" ? "pixelated" : "auto",
        ...(props.style || {}),
      }}
    />
  );
}
