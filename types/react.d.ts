import type * as React from "react";
import type { TeaLeafField, TeaLeafFormat, TeaLeafVariant } from "./core";

export interface TeaLeafState {
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

export interface TeaLeafSetOptionsInput {
  seedText?: string;
  color?: string;
  bg?: string | null;
  format?: TeaLeafFormat;
  variant?: TeaLeafVariant;
  triangleSize?: number | null;
  width?: number;
  height?: number;
}

export interface TeaLeafContextValue {
  state: TeaLeafState;
  field: TeaLeafField;
  setSeedText(seed: string): void;
  setFormat(format: TeaLeafFormat): void;
  setVariant(variant: TeaLeafVariant): void;
  setTriangleSize(size: number | null): void;
  setColor(color: string): void;
  setBackground(bg: string | null): void;
  setSize(width: number, height?: number): void;
  setWidth(width: number): void;
  setHeight(height: number): void;
  setOptions(nextOptions: TeaLeafSetOptionsInput): void;
}

export interface TeaLeafRootProps {
  children: React.ReactNode;
  seedText?: string;
  querySearch?: string;
  gridSize?: number;
  frequencyCutoff?: number;
  variant?: TeaLeafVariant;
  triangleSize?: number | null;
  options?: TeaLeafSetOptionsInput;
}

export type TeaLeafOutputProps = React.ComponentPropsWithoutRef<"div">;
export type TeaLeafPngProps = React.ComponentPropsWithoutRef<"img">;
export interface TeaLeafSvgProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export interface TeaLeafControlsProps {
  className?: string;
  style?: React.CSSProperties;
}

export declare const TeaLeafRoot: React.ComponentType<TeaLeafRootProps>;
export declare const TeaLeafOutput: React.ComponentType<TeaLeafOutputProps>;
export declare const TeaLeafPng: React.ComponentType<TeaLeafPngProps>;
export declare const TeaLeafSvg: React.ComponentType<TeaLeafSvgProps>;
export declare const TeaLeafControls: React.ComponentType<TeaLeafControlsProps>;

export interface TeaLeafCompound {
  Root: typeof TeaLeafRoot;
  Output: typeof TeaLeafOutput;
  Png: typeof TeaLeafPng;
  Svg: typeof TeaLeafSvg;
  Controls: typeof TeaLeafControls;
}

export declare const TeaLeaf: TeaLeafCompound;

export declare function useTeaLeaf(): TeaLeafContextValue;
