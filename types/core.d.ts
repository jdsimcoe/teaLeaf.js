export type TeaLeafFormat = "png" | "svg";
export type TeaLeafVariant = "pixel" | "triangle" | "triangle-panels";

/** Triangle vertices as [x0, y0, x1, y1, x2, y2] in grid units (y down). */
export type TeaLeafTriangle = [number, number, number, number, number, number];

export interface TeaLeafField {
  outRe: Float64Array;
  threshold: number;
  gridSize: number;
  seed: number;
  seedText: string;
}

export interface TeaLeafRun {
  x: number;
  y: number;
  width: number;
}

export interface ParseTeaLeafDefaults {
  color?: string;
  bg?: string | null;
  format?: TeaLeafFormat;
  variant?: TeaLeafVariant;
  /** Triangles across the canvas (triangle variants only). Defaults to 6. */
  triangleCount?: number | null;
  width?: number;
  height?: number;
  gridSize?: number;
  frequencyCutoff?: number;
}

export interface TeaLeafOptions extends ParseTeaLeafDefaults {
  seedText?: string;
}

export interface GenerateTeaLeafFieldInput {
  seedText: string;
  gridSize?: number;
  frequencyCutoff?: number;
}

export interface CreateTeaLeafSvgInput {
  field: TeaLeafField;
  color?: string;
  bg?: string | null;
  width?: number;
  height?: number;
  variant?: TeaLeafVariant;
  triangleCount?: number | null;
  /** Seam between panels as a fraction of the triangle side ("triangle-panels" only). Defaults to 0.06. */
  seam?: number;
  /** Opacity of the foreground color on "off" panels ("triangle-panels" only). Defaults to 0.14. */
  offOpacity?: number;
}

export interface TeaLeafTrianglePanel {
  points: TeaLeafTriangle;
  on: boolean;
}

export interface DrawTeaLeafToCanvasInput extends CreateTeaLeafSvgInput {
  targetCanvas?: HTMLCanvasElement;
}

export declare const DEFAULT_BG: null;
export declare const DEFAULT_COLOR: "#000000";
export declare const DEFAULT_FORMAT: "png";
export declare const DEFAULT_FREQUENCY_CUTOFF: 5;
export declare const DEFAULT_GRID_SIZE: 420;
export declare const DEFAULT_VARIANT: "pixel";
export declare const VARIANTS: readonly TeaLeafVariant[];
export declare const DEFAULT_TRIANGLE_COUNT: 6;
export declare const DEFAULT_PANEL_SEAM: 0.06;
export declare const DEFAULT_PANEL_OFF_OPACITY: 0.14;

export declare function seedFromString(text: string): number;

export declare function getSeedTextFromLocation(locationLike?: {
  search?: string;
  pathname?: string;
}): string;

export declare function parseTeaLeafOptionsFromSearch(
  search?: string,
  defaults?: ParseTeaLeafDefaults
): Required<Pick<TeaLeafOptions, "color" | "bg" | "format" | "variant" | "width" | "height" | "gridSize" | "frequencyCutoff">> & {
  triangleCount: number | null;
};

export declare function generateTeaLeafField(input: GenerateTeaLeafFieldInput): TeaLeafField;

export declare function buildTeaLeafRuns(field: TeaLeafField): TeaLeafRun[];

export declare function buildTeaLeafTrianglePanels(
  field: TeaLeafField,
  options?: { triangleCount?: number | null }
): TeaLeafTrianglePanel[];

export declare function buildTeaLeafTriangles(
  field: TeaLeafField,
  options?: { triangleCount?: number | null }
): TeaLeafTriangle[];

export declare function createTeaLeafSvg(input: CreateTeaLeafSvgInput): string;

export declare function drawTeaLeafToCanvas(input: DrawTeaLeafToCanvasInput): HTMLCanvasElement;

export declare function createTeaLeafPngDataUrl(input: DrawTeaLeafToCanvasInput): string;
