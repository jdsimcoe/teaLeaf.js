export type TeaLeafFormat = "png" | "svg";

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
}

export interface DrawTeaLeafToCanvasInput extends CreateTeaLeafSvgInput {
  targetCanvas?: HTMLCanvasElement;
}

export declare const DEFAULT_BG: null;
export declare const DEFAULT_COLOR: "#000000";
export declare const DEFAULT_FORMAT: "png";
export declare const DEFAULT_FREQUENCY_CUTOFF: 5;
export declare const DEFAULT_GRID_SIZE: 420;

export declare function seedFromString(text: string): number;

export declare function getSeedTextFromLocation(locationLike?: {
  search?: string;
  pathname?: string;
}): string;

export declare function parseTeaLeafOptionsFromSearch(
  search?: string,
  defaults?: ParseTeaLeafDefaults
): Required<Pick<TeaLeafOptions, "color" | "bg" | "format" | "width" | "height" | "gridSize" | "frequencyCutoff">>;

export declare function generateTeaLeafField(input: GenerateTeaLeafFieldInput): TeaLeafField;

export declare function buildTeaLeafRuns(field: TeaLeafField): TeaLeafRun[];

export declare function createTeaLeafSvg(input: CreateTeaLeafSvgInput): string;

export declare function drawTeaLeafToCanvas(input: DrawTeaLeafToCanvasInput): HTMLCanvasElement;

export declare function createTeaLeafPngDataUrl(input: DrawTeaLeafToCanvasInput): string;
