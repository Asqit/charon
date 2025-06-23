import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

interface Props {
  reset(): void;
  time?: number;
}

export function Success({ reset, time }: Props) {
  return (
    <div>
      <figure className="block text-primary-foreground bg-primary p-8 rounded-full outline-8 w-fit mx-auto mb-16">
        <CheckCheck size={64} />
      </figure>

      <h2 className="text-3xl font-medium">All files have been converted</h2>
      {time && (
        <h3 className="font-bold mb-6">
          Took:{" "}
          <span className="text-primary font-bold">
            {(time / 1000).toFixed(2)}s
          </span>
        </h3>
      )}
      <Button className="w-full" onClick={reset}>
        New Conversion
      </Button>
    </div>
  );
}
