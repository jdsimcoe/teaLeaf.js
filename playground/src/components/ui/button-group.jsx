import { cn } from "../../lib/utils";

function ButtonGroup({ className, ...props }) {
  return (
    <div
      role="group"
      data-slot="button-group"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    />
  );
}

export { ButtonGroup };
