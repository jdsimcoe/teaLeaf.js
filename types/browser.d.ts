import type { TeaLeafField, TeaLeafFormat, TeaLeafOptions, TeaLeafVariant } from "./core";

export interface LocationLike {
  search?: string;
  pathname?: string;
}

export interface ResolvedTeaLeafOptions extends TeaLeafOptions {
  seedText: string;
  color: string;
  bg: string | null;
  format: TeaLeafFormat;
  variant: TeaLeafVariant;
  triangleSize: number | null;
  width: number;
  height: number;
  gridSize: number;
  frequencyCutoff: number;
}

export interface SvgRenderResult {
  field: TeaLeafField;
  format: "svg";
  svg: string;
}

export interface PngRenderResult {
  field: TeaLeafField;
  format: "png";
  pngDataUrl: string;
}

export type RenderResult = SvgRenderResult | PngRenderResult;

export declare function resolveTeaLeafOptionsFromLocation(locationLike?: LocationLike): ResolvedTeaLeafOptions;

export declare function renderTeaLeaf(
  target: HTMLElement,
  options: ResolvedTeaLeafOptions
): RenderResult;

export declare function renderTeaLeafFromLocation(
  target: HTMLElement,
  locationLike?: LocationLike
): RenderResult;
