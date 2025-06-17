import { Eraser, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { OnFileDrop } from "wailsjs/runtime";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import { ClickToSelectFiles, GetFileType } from "wailsjs/go/main/App";
import { usePromise } from "@/usePromise";
import { Loader } from "lucide-react";

export interface ToConvert {
  path: string;
  format?: string;
}

interface Props {
  handleSubmit(data: ToConvert[]): void;
}

export function DropZone({ handleSubmit }: Props) {
  const [files, setFiles] = useState<ToConvert[]>([]);
  const [error, setError] = useState<string>("");

  const handleSubmission = () => {
    if (files.length === 0) {
      setError("Please drop your files first!");
      return;
    }

    files.forEach((file) => {
      if (!file.format) {
        setError("All files must have a final format");
        return;
      }
    });

    handleSubmit(files);
  };

  const handleClickSelect = async () => {
    const files = await ClickToSelectFiles();
    setFiles((p) => [...new Set([...p, ...files.map((p) => ({ path: p }))])]);
  };

  useEffect(() => {
    OnFileDrop((_x, _y, paths) => {
      setFiles((p) => [...new Set([...p, ...paths.map((p) => ({ path: p }))])]);
    }, true);
  }, []);

  return (
    <div className="w-full">
      {error.length > 0 && (
        <h2 className="font-semibold text-red-600 text-center mb-4">{error}</h2>
      )}
      <div
        className={clsx(
          "drop-zone rounded-lg flex items-center justify-center mb-4",
          files.length > 0 ? "border" : "border-4 border-dashed",
        )}
      >
        {files.length > 0 ? (
          <table className="min-w-full bg-background border border-muted">
            <thead>
              <tr className="bg-muted text-left">
                <th className="px-4 py-2 border-b border-muted">File Path</th>
                <th className="px-4 py-2 border-b border-muted">
                  Current File Format
                </th>
                <th className="px-4 py-2 border-b border-muted">
                  Desired File Format
                </th>
                <th className="px-4 py-2 border-b border-muted">Delete</th>
              </tr>
            </thead>
            <tbody>
              {files.map(({ path }) => (
                <TableItem
                  key={path}
                  path={path}
                  setOutputFormat={(format) => {
                    if (error) {
                      setError("");
                    }

                    setFiles((p) => [
                      ...p.map((i) => {
                        if (i.path === path) {
                          i.format = format;
                        }
                        return i;
                      }),
                    ]);
                  }}
                  deleteSelf={() =>
                    setFiles((p) => p.filter((i) => i.path !== path))
                  }
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div
            onClick={handleClickSelect}
            className="flex items-center justify-center w-full h-full p-8 flex-col select-none cursor-pointer"
          >
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Drag & drop files here</h1>
            <p className="text-muted-foreground text-sm">
              or click to select files
            </p>
          </div>
        )}
      </div>
      <Button onClick={handleSubmission} className="w-full">
        Continue
      </Button>
    </div>
  );
}

interface TableItemProps {
  path: string;
  deleteSelf(): void;
  setOutputFormat(format: string): void;
}

function TableItem({ path, deleteSelf, setOutputFormat }: TableItemProps) {
  const metadata = path.split("/");
  const memoizedPromise = useCallback(() => GetFileType(path), [path]);
  const [result, _error, isLoading, status] = usePromise(memoizedPromise);

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
              return (
                <Select onValueChange={(value) => setOutputFormat(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent>
                    {result &&
                    Array.isArray(result?.outputFormats) &&
                    result?.outputFormats?.length > 0 ? (
                      result?.outputFormats.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="png">
                          PNG (.png) – bezztrátový
                        </SelectItem>
                        <SelectItem value="jpeg">
                          JPEG (.jpg) – ztrátový, vhodný pro fotky
                        </SelectItem>
                        <SelectItem value="webp">
                          WebP (.webp) – moderní, malý, podporuje průhlednost
                        </SelectItem>
                        <SelectItem value="bmp">
                          BMP (.bmp) – nekomprimovaný, starší formát
                        </SelectItem>
                        <SelectItem value="gif">
                          GIF (.gif) – omezená paleta, animace
                        </SelectItem>
                        <SelectItem value="tiff">
                          TIFF (.tiff) – bezztrátový, často ve tisku
                        </SelectItem>
                        <SelectItem value="pgm">
                          PGM (.pgm) – grayscale (šedá škála)
                        </SelectItem>
                        <SelectItem value="ppm">
                          PPM (.ppm) – čistá RGB bitmapa
                        </SelectItem>
                        <SelectItem value="pam">
                          PAM (.pam) – rozšířený Netpbm formát
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
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
