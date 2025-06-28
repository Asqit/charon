import { TableItem } from "./table-item";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { filesContext } from "../context/files-context";
import { ClickToSelectFiles } from "wailsjs/go/main/App";

interface Props {
  submitCallback(): void;
}

export function FileTable({ submitCallback }: Props) {
  const { files, setFiles } = useContext(filesContext);

  const handleClickSelect = async () => {
    const newFiles = await ClickToSelectFiles();

    setFiles((prev) =>
      [...new Set([...newFiles, ...prev.map((p) => p.path)])].map((item) => {
        const exists = prev.find((v) => v.path === item);
        if (exists) {
          return exists;
        }

        return { path: item };
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full drop-zone">
      <table className="bg-background border border-muted animate-fadeIn">
        <thead>
          <tr className="bg-muted text-left">
            <th className="px-4 py-2 border-b border-muted">File</th>
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
              setOutputFormat={(format) =>
                setFiles((p) =>
                  [...p].map((file) => {
                    if (file.path === path) {
                      return { ...file, format };
                    }
                    return file;
                  })
                )
              }
              deleteSelf={() =>
                setFiles((prev) => [...prev].filter((f) => f.path !== path))
              }
            />
          ))}
        </tbody>
      </table>
      {files.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          <Button variant={"destructive"} onClick={() => setFiles([])}>
            Remove All
          </Button>

          <div className="space-x-2">
            <Button variant={"outline"} onClick={handleClickSelect}>
              Add File(s)
            </Button>
            <Button onClick={submitCallback} disabled={files.length === 0}>
              {files.length > 1
                ? `Convert (${files.length}) files`
                : "Convert file"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
