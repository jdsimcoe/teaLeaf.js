import { useMemo } from "react";
import { createTeaLeafSvg } from "../tealeaf-core.js";
import { useTeaLeaf } from "./TeaLeafContext.jsx";

export function TeaLeafSvg({ className, style, title = "TeaLeaf SVG" }) {
  const { state, field } = useTeaLeaf();

  const markup = useMemo(
    () =>
      createTeaLeafSvg({
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
    <div
      className={className}
      style={style}
      role="img"
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
