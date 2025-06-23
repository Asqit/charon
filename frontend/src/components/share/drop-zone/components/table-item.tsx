import { usePromise } from "@/usePromise";
import { Loader, Eraser } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { GetFileType } from "wailsjs/go/main/App";
import { Button } from "@/components/ui/button";
import { typeLookup } from "@/utils/type-lookup";
import { TagCombo } from "@/components/ui/tag-combo";

interface Props {
  path: string;
  deleteSelf(): void;
  setOutputFormat(format: string): void;
}

export function TableItem({ path, deleteSelf, setOutputFormat }: Props) {
  const metadata = path.split("/");
  const memoizedPromise = useCallback(() => GetFileType(path), [path]);
  const [result, _error, isLoading, status] = usePromise(memoizedPromise);
  const templates = useMemo(() => {
    if (!result) {
      return [];
    }

    return typeLookup[result.mimeType.split("/")[0]];
  }, [result]);

  return (
    <tr className="hover:bg-muted rounded-lg">
      <td className="px-4 py-2 border-b border-muted">
        {metadata[metadata.length - 1].trim()}
      </td>
      <td className="px-4 py-2 border-b border-muted">
        {isLoading ? "..." : result?.mimeType}
      </td>
      <td className="px-4 py-2 border-b border-muted">
        {(() => {
          switch (status) {
            case "loading":
              return <Loader className="animate-spin" />;
            case "error":
              return <span className="text-red-600">Error Occurred</span>;
            case "success":
              return result && result?.outputFormats?.length > 0 ? (
                <TagCombo
                  onChange={(value) => setOutputFormat(value)}
                  data={result.outputFormats.map((f) => ({
                    label: f,
                    value: f.split(" ")[0],
                  }))}
                />
              ) : (
                <TagCombo
                  onChange={(value) => setOutputFormat(value)}
                  data={templates.map((t) => ({
                    label: `${t.value} - ${t.description}`,
                    value: t.value,
                  }))}
                />
              );
            default:
              return null;
          }
        })()}
      </td>

      <td className="px-4 py-2 border-b border-muted">
        <Button
          variant={"ghost"}
          size={"icon"}
          aria-label={`Delete file at ${path}`}
          onClick={deleteSelf}
          className="hover:text-red-600 cursor-pointer"
        >
          <Eraser />
        </Button>
      </td>
    </tr>
  );
}
