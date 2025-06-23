import type { ToConvert } from "@/utils/types";
import { useState, type ReactNode } from "react";
import { filesContext } from "./files-context";

interface Props {
  children: Readonly<ReactNode>;
}

export function FilesProvider({ children }: Props) {
  const [files, setFiles] = useState<ToConvert[]>([]);
  return (
    <filesContext.Provider value={{ files, setFiles }}>
      {children}
    </filesContext.Provider>
  );
}
