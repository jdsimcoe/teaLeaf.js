import {
  createTeaLeafPngDataUrl,
  createTeaLeafSvg,
  drawTeaLeafToCanvas,
  generateTeaLeafField,
  getSeedTextFromLocation,
  parseTeaLeafOptionsFromSearch,
} from "./tealeaf-core.js";

export function resolveTeaLeafOptionsFromLocation(locationLike = window.location) {
  const seedText = getSeedTextFromLocation({
    search: locationLike.search || "",
    pathname: locationLike.pathname || "",
  });
  const parsed = parseTeaLeafOptionsFromSearch(locationLike.search || "");
  return {
    ...parsed,
    seedText,
  };
}

export function renderTeaLeaf(target, options) {
  const field = generateTeaLeafField({
    seedText: options.seedText,
    gridSize: options.gridSize,
    frequencyCutoff: options.frequencyCutoff,
  });

  if (options.format === "svg") {
    const svg = createTeaLeafSvg({
      field,
      color: options.color,
      bg: options.bg,
      width: options.width,
      height: options.height,
      variant: options.variant,
      triangleSize: options.triangleSize,
    });
    target.innerHTML = svg;
    return { field, format: "svg", svg };
  }

  const canvas = drawTeaLeafToCanvas({
    field,
    color: options.color,
    bg: options.bg,
    width: options.width,
    height: options.height,
  });

  canvas.style.imageRendering = options.variant === "triangle" ? "auto" : "pixelated";
  canvas.style.borderRadius = "12px";
  canvas.style.background = "transparent";
  target.innerHTML = "";
  target.appendChild(canvas);

  return {
    field,
    format: "png",
    pngDataUrl: createTeaLeafPngDataUrl({
      field,
      color: options.color,
      bg: options.bg,
      width: options.width,
      height: options.height,
      variant: options.variant,
      triangleSize: options.triangleSize,
    }),
  };
}

export function renderTeaLeafFromLocation(target, locationLike = window.location) {
  const options = resolveTeaLeafOptionsFromLocation(locationLike);
  return renderTeaLeaf(target, options);
}
