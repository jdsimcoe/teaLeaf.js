const DEFAULT_GRID_SIZE = 420;
const DEFAULT_FREQUENCY_CUTOFF = 5;
const DEFAULT_COLOR = "#000000";
const DEFAULT_BG = null;
const DEFAULT_FORMAT = "png";
const DEFAULT_VARIANT = "pixel";
const VARIANTS = ["pixel", "triangle", "triangle-panels"];
const DEFAULT_TRIANGLE_COUNT = 6;
const DEFAULT_PANEL_SEAM = 0.06;
const DEFAULT_PANEL_OFF_OPACITY = 0.14;

function nextPow2(n) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function fftRadix2(re, im, inverse, normalize) {
  const n = re.length;

  for (let i = 1, j = 0; i < n; i += 1) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let tmp = re[i];
      re[i] = re[j];
      re[j] = tmp;
      tmp = im[i];
      im[i] = im[j];
      im[j] = tmp;
    }
  }

  const sign = inverse ? 1 : -1;
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (2 * Math.PI / len) * sign;
    const wlenRe = Math.cos(ang);
    const wlenIm = Math.sin(ang);

    for (let i = 0; i < n; i += len) {
      let wRe = 1.0;
      let wIm = 0.0;
      const half = len >> 1;

      for (let j = 0; j < half; j += 1) {
        const uRe = re[i + j];
        const uIm = im[i + j];
        const vRe = re[i + j + half] * wRe - im[i + j + half] * wIm;
        const vIm = re[i + j + half] * wIm + im[i + j + half] * wRe;

        re[i + j] = uRe + vRe;
        im[i + j] = uIm + vIm;
        re[i + j + half] = uRe - vRe;
        im[i + j + half] = uIm - vIm;

        const nextWRe = wRe * wlenRe - wIm * wlenIm;
        const nextWIm = wRe * wlenIm + wIm * wlenRe;
        wRe = nextWRe;
        wIm = nextWIm;
      }
    }
  }

  if (normalize) {
    for (let i = 0; i < n; i += 1) {
      re[i] /= n;
      im[i] /= n;
    }
  }
}

function bluestein(re, im, inverse) {
  const n = re.length;
  const m = nextPow2(2 * n - 1);

  const aRe = new Float64Array(m);
  const aIm = new Float64Array(m);
  const bRe = new Float64Array(m);
  const bIm = new Float64Array(m);

  const sign = inverse ? 1 : -1;
  const angBase = Math.PI / n;

  for (let k = 0; k < n; k += 1) {
    const ang = sign * angBase * k * k;
    const cosv = Math.cos(ang);
    const sinv = Math.sin(ang);

    aRe[k] = re[k] * cosv + im[k] * sinv;
    aIm[k] = im[k] * cosv - re[k] * sinv;

    bRe[k] = cosv;
    bIm[k] = sinv;
    if (k !== 0) {
      bRe[m - k] = cosv;
      bIm[m - k] = sinv;
    }
  }

  fftRadix2(aRe, aIm, false, false);
  fftRadix2(bRe, bIm, false, false);

  for (let i = 0; i < m; i += 1) {
    const r = aRe[i] * bRe[i] - aIm[i] * bIm[i];
    const imv = aRe[i] * bIm[i] + aIm[i] * bRe[i];
    aRe[i] = r;
    aIm[i] = imv;
  }

  fftRadix2(aRe, aIm, true, true);

  const outRe = new Float64Array(n);
  const outIm = new Float64Array(n);
  for (let k = 0; k < n; k += 1) {
    const ang = sign * angBase * k * k;
    const cosv = Math.cos(ang);
    const sinv = Math.sin(ang);
    const cRe = aRe[k];
    const cIm = aIm[k];
    outRe[k] = cRe * cosv + cIm * sinv;
    outIm[k] = cIm * cosv - cRe * sinv;
  }

  return { re: outRe, im: outIm };
}

function fft1d(inRe, inIm, inverse) {
  return bluestein(inRe, inIm, inverse);
}

function fft2d(inRe, inIm, outRe, outIm, inverse) {
  const n = Math.sqrt(inRe.length);
  const total = n * n;
  const tempRe = new Float64Array(total);
  const tempIm = new Float64Array(total);

  for (let row = 0; row < n; row += 1) {
    const rowRe = new Float64Array(n);
    const rowIm = new Float64Array(n);
    for (let t = 0; t < n; t += 1) {
      const idx = row * n + t;
      rowRe[t] = inRe[idx];
      rowIm[t] = inIm[idx];
    }
    const rowOut = fft1d(rowRe, rowIm, inverse);
    for (let k = 0; k < n; k += 1) {
      const outIdx = row * n + k;
      tempRe[outIdx] = rowOut.re[k];
      tempIm[outIdx] = rowOut.im[k];
    }
  }

  for (let col = 0; col < n; col += 1) {
    const colRe = new Float64Array(n);
    const colIm = new Float64Array(n);
    for (let t = 0; t < n; t += 1) {
      const idx = t * n + col;
      colRe[t] = tempRe[idx];
      colIm[t] = tempIm[idx];
    }
    const colOut = fft1d(colRe, colIm, inverse);
    for (let k = 0; k < n; k += 1) {
      const outIdx = k * n + col;
      outRe[outIdx] = colOut.re[k];
      outIm[outIdx] = colOut.im[k];
    }
  }
}

function seedFromString(text) {
  let seed = 0;
  for (let i = 0; i < text.length; i += 1) {
    seed = (seed + text.charCodeAt(i)) >>> 0;
  }
  return seed >>> 0;
}

function makeRng(seed) {
  let state = (seed >>> 0) % 2147483647;
  if (state === 0) state = 1;

  return function nextRand() {
    const hi = Math.floor(state / 127773);
    const lo = state - hi * 127773;
    let test = 16807 * lo - 2836 * hi;
    if (test <= 0) test += 2147483647;
    state = test;
    return state;
  };
}

function fillRandomBinary(re, im, seed) {
  const rand = makeRng(seed);
  for (let i = 0; i < re.length; i += 1) {
    re[i] = rand() & 1;
    im[i] = 0;
  }
}

function masked(row, col, size, cutoff) {
  return (
    (cutoff <= row && row <= size - cutoff) ||
    (cutoff <= col && col <= size - cutoff)
  );
}

function applyFrequencyMask(re, im, size, cutoff) {
  for (let i = 0; i < re.length; i += 1) {
    const row = Math.floor(i / size);
    const col = i % size;
    if (masked(row, col, size, cutoff)) {
      re[i] = 0;
      im[i] = 0;
    }
  }
}

function stripSeedParams(raw) {
  if (!raw || raw === "?") return raw;
  const trimmed = raw.startsWith("?") ? raw.slice(1) : raw;
  const parts = trimmed.split("&").filter((part) => part.length > 0);
  const filtered = parts.filter(
    (part) =>
      !part.startsWith("color=") &&
      !part.startsWith("bg=") &&
      !part.startsWith("format=") &&
      !part.startsWith("width=") &&
      !part.startsWith("height=") &&
      !part.startsWith("scale=") &&
      !part.startsWith("variant=") &&
      !part.startsWith("triangles=")
  );
  if (filtered.length === 0) return "?";
  return `?${filtered.join("&")}`;
}

function getSeedTextFromLocation({ search = "", pathname = "" } = {}) {
  const seedRaw = stripSeedParams(search || "");
  if (seedRaw && seedRaw !== "?") {
    return `tealeaf::${seedRaw}`;
  }

  const trimmedPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  if (trimmedPath) {
    return `tealeaf::?${trimmedPath}`;
  }

  return "tealeaf::";
}

function normalizeHex(value) {
  if (!value) return null;
  const cleaned = String(value).replace(/^#/, "").trim();
  if (/^[0-9a-fA-F]{6}$/.test(cleaned) || /^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return `#${cleaned.toLowerCase()}`;
  }
  return null;
}

function parsePositiveInt(raw, fallback) {
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return value;
}

function parseFormat(raw) {
  const lowered = String(raw || "").toLowerCase();
  return lowered === "svg" ? "svg" : "png";
}

function parseVariant(raw) {
  const lowered = String(raw || "").toLowerCase();
  return VARIANTS.includes(lowered) ? lowered : DEFAULT_VARIANT;
}

function parsePositiveNumber(raw) {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function parseTeaLeafOptionsFromSearch(search, defaults = {}) {
  const params = new URLSearchParams(search || "");

  const color =
    normalizeHex(params.get("color")) ?? defaults.color ?? DEFAULT_COLOR;

  const bgRaw = params.get("bg");
  const bgCandidate = normalizeHex(bgRaw);
  const bg =
    bgRaw === "transparent"
      ? null
      : bgCandidate ??
        (Object.prototype.hasOwnProperty.call(defaults, "bg")
          ? defaults.bg
          : DEFAULT_BG);

  const format = parseFormat(params.get("format") || defaults.format || DEFAULT_FORMAT);

  const variant = parseVariant(params.get("variant") || defaults.variant);
  const triangleCount =
    parsePositiveNumber(params.get("triangles")) ?? defaults.triangleCount ?? null;

  const scale = Number.parseFloat(params.get("scale") || "");
  const parsedScale = Number.isFinite(scale) && scale > 0 ? scale : null;

  const defaultWidth = defaults.width ?? DEFAULT_GRID_SIZE;
  const defaultHeight = defaults.height ?? DEFAULT_GRID_SIZE;

  const width = parsePositiveInt(
    params.get("width"),
    parsedScale ? Math.round(DEFAULT_GRID_SIZE * parsedScale) : defaultWidth
  );
  const height = parsePositiveInt(
    params.get("height"),
    parsedScale ? Math.round(DEFAULT_GRID_SIZE * parsedScale) : defaultHeight
  );

  return {
    color,
    bg,
    format,
    variant,
    triangleCount,
    width,
    height,
    gridSize: defaults.gridSize ?? DEFAULT_GRID_SIZE,
    frequencyCutoff: defaults.frequencyCutoff ?? DEFAULT_FREQUENCY_CUTOFF,
  };
}

function hexToRgb(hex) {
  const cleaned = hex.replace(/^#/, "");
  if (cleaned.length === 3) {
    const r = Number.parseInt(cleaned[0] + cleaned[0], 16);
    const g = Number.parseInt(cleaned[1] + cleaned[1], 16);
    const b = Number.parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }

  const r = Number.parseInt(cleaned.slice(0, 2), 16);
  const g = Number.parseInt(cleaned.slice(2, 4), 16);
  const b = Number.parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
}

export function generateTeaLeafField({
  seedText,
  gridSize = DEFAULT_GRID_SIZE,
  frequencyCutoff = DEFAULT_FREQUENCY_CUTOFF,
}) {
  const seed = seedFromString(seedText || "tealeaf::");
  const total = gridSize * gridSize;

  const inRe = new Float64Array(total);
  const inIm = new Float64Array(total);
  const midRe = new Float64Array(total);
  const midIm = new Float64Array(total);
  const outRe = new Float64Array(total);
  const outIm = new Float64Array(total);

  fillRandomBinary(inRe, inIm, seed);
  fft2d(inRe, inIm, midRe, midIm, false);
  applyFrequencyMask(midRe, midIm, gridSize, frequencyCutoff);
  fft2d(midRe, midIm, outRe, outIm, true);

  const threshold = (gridSize * gridSize) / 2;
  return { outRe, threshold, gridSize, seed, seedText };
}

export function buildTeaLeafRuns(field) {
  const { outRe, threshold, gridSize } = field;
  const runs = [];

  for (let y = 0; y < gridSize; y += 1) {
    let x = 0;
    while (x < gridSize) {
      const idx = y * gridSize + x;
      if (outRe[idx] > threshold) {
        let width = 1;
        while (
          x + width < gridSize &&
          outRe[y * gridSize + x + width] > threshold
        ) {
          width += 1;
        }
        runs.push({ x, y: gridSize - 1 - y, width });
        x += width;
      } else {
        x += 1;
      }
    }
  }

  return runs;
}

function sampleField(field, x, y) {
  const { outRe, gridSize: n } = field;
  // (x, y) are output coordinates (y down); the field is stored bottom-up and tiles seamlessly.
  const fx = x - 0.5;
  const fy = n - 0.5 - y;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = fx - x0;
  const ty = fy - y0;
  const wrap = (v) => ((v % n) + n) % n;
  const c0 = wrap(x0);
  const c1 = wrap(x0 + 1);
  const r0 = wrap(y0) * n;
  const r1 = wrap(y0 + 1) * n;
  const top = outRe[r0 + c0] * (1 - tx) + outRe[r0 + c1] * tx;
  const bottom = outRe[r1 + c0] * (1 - tx) + outRe[r1 + c1] * tx;
  return top * (1 - ty) + bottom * ty;
}

function resolveTriangleCount(triangleCount) {
  return triangleCount > 0 ? triangleCount : DEFAULT_TRIANGLE_COUNT;
}

export function buildTeaLeafTrianglePanels(field, { triangleCount } = {}) {
  const n = field.gridSize;
  const side = n / resolveTriangleCount(triangleCount);
  const rowHeight = (side * Math.sqrt(3)) / 2;
  const center = n / 2;
  const rowsPerHalf = Math.ceil(center / rowHeight) + 1;
  const colsPerHalf = Math.ceil(center / side) + 1;
  const panels = [];

  // Centered lattice: a shared vertex sits at the middle of the canvas.
  for (let row = -rowsPerHalf; row < rowsPerHalf; row += 1) {
    const top = center + row * rowHeight;
    const bottom = top + rowHeight;
    if (bottom <= 0 || top >= n) continue;
    const offset = (((row % 2) + 2) % 2) * (side / 2);

    for (let col = -colsPerHalf - 1; col <= colsPerHalf; col += 1) {
      const left = center + offset + col * side - side / 2;
      const candidates = [
        [left, bottom, left + side / 2, top, left + side, bottom],
        [left + side / 2, top, left + (side * 3) / 2, top, left + side, bottom],
      ];

      for (const points of candidates) {
        const minX = Math.min(points[0], points[2], points[4]);
        const maxX = Math.max(points[0], points[2], points[4]);
        if (maxX <= 0 || minX >= n) continue;
        const cx = (points[0] + points[2] + points[4]) / 3;
        const cy = (points[1] + points[3] + points[5]) / 3;
        panels.push({ points, on: sampleField(field, cx, cy) > field.threshold });
      }
    }
  }

  return panels;
}

export function buildTeaLeafTriangles(field, options = {}) {
  return buildTeaLeafTrianglePanels(field, options)
    .filter((panel) => panel.on)
    .map((panel) => panel.points);
}

function insetTriangle(points, gap) {
  if (!(gap > 0)) return points;
  const cx = (points[0] + points[2] + points[4]) / 3;
  const cy = (points[1] + points[3] + points[5]) / 3;
  const inradius = Math.hypot(points[2] - points[0], points[3] - points[1]) / (2 * Math.sqrt(3));
  const k = Math.max(0, (inradius - gap / 2) / inradius);
  return points.map((v, i) => (i % 2 === 0 ? cx + (v - cx) * k : cy + (v - cy) * k));
}

function resolveTriangleLayers(field, { variant, triangleCount, seam, offOpacity }) {
  const panels = buildTeaLeafTrianglePanels(field, { triangleCount });
  if (variant !== "triangle-panels") {
    return { on: panels.filter((p) => p.on).map((p) => p.points), off: [], offOpacity: 0 };
  }
  const side = field.gridSize / resolveTriangleCount(triangleCount);
  const gap = side * (seam ?? DEFAULT_PANEL_SEAM);
  return {
    on: panels.filter((p) => p.on).map((p) => insetTriangle(p.points, gap)),
    off: panels.filter((p) => !p.on).map((p) => insetTriangle(p.points, gap)),
    offOpacity: offOpacity ?? DEFAULT_PANEL_OFF_OPACITY,
  };
}

function isTriangleVariant(variant) {
  return variant === "triangle" || variant === "triangle-panels";
}

function formatCoord(value) {
  return String(Math.round(value * 1000) / 1000);
}

function trianglesToSvgPath(triangles) {
  let path = "";
  for (const t of triangles) {
    path += `M ${formatCoord(t[0])} ${formatCoord(t[1])} L ${formatCoord(t[2])} ${formatCoord(t[3])} L ${formatCoord(t[4])} ${formatCoord(t[5])} Z `;
  }
  return path.trim();
}

function traceTriangles(ctx, triangles) {
  ctx.beginPath();
  for (const t of triangles) {
    ctx.moveTo(t[0], t[1]);
    ctx.lineTo(t[2], t[3]);
    ctx.lineTo(t[4], t[5]);
    ctx.closePath();
  }
}

export function createTeaLeafSvg({
  field,
  color = DEFAULT_COLOR,
  bg = DEFAULT_BG,
  width,
  height,
  variant = DEFAULT_VARIANT,
  triangleCount,
  seam,
  offOpacity,
}) {
  if (isTriangleVariant(variant)) {
    const n = field.gridSize;
    const layers = resolveTriangleLayers(field, { variant, triangleCount, seam, offOpacity });
    return [
      `<svg width="${width ?? n}" height="${height ?? n}" viewBox="0 0 ${n} ${n}" xmlns="http://www.w3.org/2000/svg">`,
      `<rect width="${n}" height="${n}" fill="${bg || "transparent"}"/>`,
      layers.off.length && layers.offOpacity > 0
        ? `<path d="${trianglesToSvgPath(layers.off)}" fill="${color}" fill-opacity="${layers.offOpacity}"/>`
        : "",
      `<path d="${trianglesToSvgPath(layers.on)}" fill="${color}"/>`,
      "</svg>",
    ].join("");
  }

  const runs = buildTeaLeafRuns(field);
  const n = field.gridSize;
  const outWidth = width ?? n;
  const outHeight = height ?? n;

  let path = "";
  for (const run of runs) {
    path += `M ${run.x} ${run.y} h ${run.width} v 1 h ${-run.width} Z `;
  }

  return [
    `<svg width="${outWidth}" height="${outHeight}" viewBox="0 0 ${n} ${n}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">`,
    `<rect width="${n}" height="${n}" fill="${bg || "transparent"}"/>`,
    `<path d="${path.trim()}" fill="${color}"/>`,
    "</svg>",
  ].join("");
}

export function drawTeaLeafToCanvas({
  field,
  color = DEFAULT_COLOR,
  bg = DEFAULT_BG,
  width,
  height,
  targetCanvas,
  variant = DEFAULT_VARIANT,
  triangleCount,
  seam,
  offOpacity,
}) {
  const n = field.gridSize;
  const outWidth = width ?? n;
  const outHeight = height ?? n;

  if (isTriangleVariant(variant)) {
    const layers = resolveTriangleLayers(field, { variant, triangleCount, seam, offOpacity });
    const canvas = targetCanvas || document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, outWidth, outHeight);
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, outWidth, outHeight);
    }
    ctx.scale(outWidth / n, outHeight / n);
    ctx.fillStyle = color;
    if (layers.off.length && layers.offOpacity > 0) {
      ctx.globalAlpha = layers.offOpacity;
      traceTriangles(ctx, layers.off);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    traceTriangles(ctx, layers.on);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return canvas;
  }

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = n;
  srcCanvas.height = n;
  const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: false });
  const imageData = srcCtx.createImageData(n, n);

  const fg = hexToRgb(color);
  const hasBg = Boolean(bg);
  const bgRgb = hasBg ? hexToRgb(bg) : null;

  for (let i = 0; i < field.outRe.length; i += 1) {
    const row = Math.floor(i / n);
    const col = i % n;
    const flippedRow = n - 1 - row;
    const idx = (flippedRow * n + col) * 4;

    if (field.outRe[i] > field.threshold) {
      imageData.data[idx + 0] = fg.r;
      imageData.data[idx + 1] = fg.g;
      imageData.data[idx + 2] = fg.b;
      imageData.data[idx + 3] = 255;
    } else if (hasBg) {
      imageData.data[idx + 0] = bgRgb.r;
      imageData.data[idx + 1] = bgRgb.g;
      imageData.data[idx + 2] = bgRgb.b;
      imageData.data[idx + 3] = 255;
    } else {
      imageData.data[idx + 0] = 255;
      imageData.data[idx + 1] = 255;
      imageData.data[idx + 2] = 255;
      imageData.data[idx + 3] = 0;
    }
  }

  srcCtx.putImageData(imageData, 0, 0);

  const canvas = targetCanvas || document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, outWidth, outHeight);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(srcCanvas, 0, 0, n, n, 0, 0, outWidth, outHeight);

  return canvas;
}

export function createTeaLeafPngDataUrl(options) {
  const canvas = drawTeaLeafToCanvas(options);
  return canvas.toDataURL("image/png");
}

export {
  DEFAULT_BG,
  DEFAULT_COLOR,
  DEFAULT_FORMAT,
  DEFAULT_FREQUENCY_CUTOFF,
  DEFAULT_GRID_SIZE,
  DEFAULT_PANEL_OFF_OPACITY,
  DEFAULT_PANEL_SEAM,
  DEFAULT_TRIANGLE_COUNT,
  DEFAULT_VARIANT,
  VARIANTS,
  getSeedTextFromLocation,
  parseTeaLeafOptionsFromSearch,
  seedFromString,
};
