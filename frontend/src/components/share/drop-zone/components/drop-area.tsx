import { Upload } from "lucide-react";
import { useContext } from "react";
import { ClickToSelectFiles } from "wailsjs/go/main/App";
import { filesContext } from "../context/files-context";

export function DropArea() {
  const { files, setFiles } = useContext(filesContext);
  const handleClickSelect = async () => {
    const newFiles = await ClickToSelectFiles();
    setFiles([...new Set([...files, ...newFiles.map((p) => ({ path: p }))])]);
  };

  return (
    <div
      onClick={handleClickSelect}
      className="drop-zone flex flex-col items-center justify-center border-4 border-dashed p-8 cursor-pointer w-full h-full"
    >
      <div className="p-3 bg-primary/10 rounded-full mb-4">
        <Upload className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Drag & Drop files here</h1>
      <p className="text-muted-foreground text-sm">or click to select files</p>
    </div>
  );
}
