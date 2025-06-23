import type { ToConvert } from "@/utils/types";
import { createContext } from "react";

interface FilesContext {
  setFiles(payload: ToConvert[]): void;
  files: ToConvert[];
}

export const filesContext = createContext<FilesContext>({
  files: [],
  setFiles: () => {},
});
