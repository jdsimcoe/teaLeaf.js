import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { cn } from "../../lib/utils";

const PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

function cleanHex(value, fallback) {
  const cleaned = String(value || "").replace(/^#/, "").trim();
  if (/^[0-9a-fA-F]{6}$/.test(cleaned) || /^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return `#${cleaned.toLowerCase()}`;
  }
  return fallback;
}

function ColorCombobox({ value, onChange, placeholder = "Pick color" }) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value || "#000000");

  React.useEffect(() => {
    setDraft(value || "#000000");
  }, [value]);

  return (
    <div className="relative">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 w-[180px] justify-between"
          >
            <span className="inline-flex items-center gap-2 truncate">
              <span
                className="h-4 w-4 rounded border border-zinc-300"
                style={{ backgroundColor: value || "transparent" }}
                aria-hidden="true"
              />
              <span className="truncate">{value || placeholder}</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </Popover.Trigger>

        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[100] w-[220px] rounded-md border border-zinc-200 bg-white p-3 shadow-md outline-none"
        >
          <div className="space-y-3">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={() => onChange(cleanHex(draft, value || "#000000"))}
              placeholder="#000000"
              className="h-9"
            />

            <Input
              type="color"
              value={value || "#000000"}
              onChange={(event) => onChange(event.target.value)}
              className="h-10 w-full cursor-pointer"
              aria-label="Pick color"
            />

            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => {
                const selected = value === color;
                return (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded border border-zinc-300",
                      selected && "ring-2 ring-zinc-400"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setOpen(false);
                    }}
                    aria-label={`Set color ${color}`}
                  >
                    {selected ? <Check className="h-3.5 w-3.5 text-white drop-shadow" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}

export { ColorCombobox };
