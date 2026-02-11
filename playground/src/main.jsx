import React from "react";
import { createRoot } from "react-dom/client";
import { Lock } from "lucide-react";

import { TeaLeaf, useTeaLeaf } from "./tealeaf/react/index.js";
import { Checkbox } from "./components/ui/checkbox";
import { ColorCombobox } from "./components/ui/color-combobox";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import "./styles.css";

function getSeedFromLocation() {
  const raw = window.location.search || "";
  if (raw && raw !== "?") {
    return `tealeaf::${raw}`;
  }
  return "tealeaf::?playground";
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value).replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function TeaLeafControlsBar() {
  const { state, setFormat, setColor, setBackground, setSize } = useTeaLeaf();

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex min-w-[140px] flex-col gap-2">
        <Label htmlFor="format">Format</Label>
        <Select value={state.format} onValueChange={setFormat}>
          <SelectTrigger id="format" className="w-[140px]">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="svg">SVG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-[200px] flex-col gap-2">
        <Label>Foreground</Label>
        <ColorCombobox value={state.color} onChange={setColor} />
      </div>

      <div className="flex min-w-[200px] flex-col gap-2">
        <Label>Background</Label>
        <ColorCombobox
          value={state.bg || "#ffffff"}
          onChange={(next) => {
            if (state.bg == null) {
              setBackground("#ffffff");
            }
            setBackground(next);
          }}
        />
      </div>

      <div className="flex min-w-[170px] flex-col gap-2">
        <Label htmlFor="transparent-bg">Transparent</Label>
        <div className="flex h-10 items-center gap-2 rounded-md border border-zinc-300 px-3">
          <Checkbox
            id="transparent-bg"
            checked={state.bg == null}
            onCheckedChange={(checked) => {
              if (checked) {
                setBackground(null);
              } else {
                setBackground("#ffffff");
              }
            }}
          />
          <Label htmlFor="transparent-bg" className="text-sm text-zinc-600">
            Enable
          </Label>
        </div>
      </div>

      <div className="flex min-w-[330px] flex-col gap-2">
        <Label>Size (Locked Square)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={String(state.width)}
            onChange={(event) => {
              const next = toPositiveInt(event.target.value, state.width);
              setSize(next, next);
            }}
            className="h-10 w-[140px]"
            aria-label="Width"
          />
          <div
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 bg-zinc-50"
            aria-label="Width and height locked"
            title="Width and height locked"
          >
            <Lock className="h-4 w-4 text-zinc-600" />
          </div>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={String(state.height)}
            onChange={(event) => {
              const next = toPositiveInt(event.target.value, state.height);
              setSize(next, next);
            }}
            className="h-10 w-[140px]"
            aria-label="Height"
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const seedText = getSeedFromLocation();

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-6">
        <TeaLeaf.Root
          seedText={seedText}
          querySearch={window.location.search}
          options={{ width: 480, height: 480 }}
        >
          <div className="space-y-4 overflow-auto">
            <header className="space-y-2">
              <h1 className="text-4xl tracking-tight">teaLeaf playground</h1>
              <p className="text-base text-zinc-600">
                Configure output format, colors, and locked square size. Preview
                updates live.
              </p>
            </header>
            <TeaLeafControlsBar />
            <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-6">
              <TeaLeaf.Output className="max-h-[70vh] max-w-full [&_img]:h-auto [&_img]:max-w-full [&_img]:image-render-pixel [&_svg]:h-auto [&_svg]:max-w-full" />
            </div>
          </div>
        </TeaLeaf.Root>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
