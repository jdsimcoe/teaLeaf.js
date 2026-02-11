import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "../../lib/utils";

function ToggleGroup({ className, ...props }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("inline-flex items-center rounded-md border border-zinc-300 p-1", className)}
      {...props}
    />
  );
}

function ToggleGroupItem({ className, ...props }) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex h-8 items-center justify-center rounded px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 data-[state=on]:bg-black data-[state=on]:text-white",
        className
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
