import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CircleX, ChevronsUpDown } from "lucide-react";

interface Props {
  error: string;
  reset(): void;
}

export function Error({ error, reset }: Props) {
  return (
    <div className="text-center">
      <figure className="block text-primary-foreground bg-red-500 p-8 rounded-full outline-8 outline-red-200 w-fit mx-auto mb-16">
        <CircleX size={64} />
      </figure>
      <h2 className="text-3xl font-medium">Yikess! Error happened</h2>
      <p className="my-3">
        During the conversion an unexpected error occurred.
      </p>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant={"ghost"} className="w-full mb-6">
            Geek Info <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="font-mono bg-muted rounded-md p-2 text-left">{error}</p>
        </CollapsibleContent>
      </Collapsible>
      <Button className="w-full mt-6" onClick={reset}>
        New Conversion
      </Button>
    </div>
  );
}
