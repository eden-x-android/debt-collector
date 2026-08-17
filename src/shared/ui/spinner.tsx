import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<typeof Loader2>) {
  return (
    <Loader2
      data-slot="spinner"
      className={cn("size-4 animate-spin", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Spinner };
