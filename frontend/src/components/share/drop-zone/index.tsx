import { useCallback, useEffect, useState } from "react";
import { OnFileDrop } from "wailsjs/runtime/runtime";
import { DropArea } from "./components/drop-area";
import { Loading } from "./components/loading";
import { FileTable } from "./components/file-table";
import { AskForSaveLocation, ConvertFiles } from "wailsjs/go/main/App";
import { filesContext } from "./context/files-context";
import { ToConvert } from "@/utils/types";
import { Success } from "./components/success";
import { Error } from "./components/error";

type State = "idle" | "loading" | "error" | "success";

export function DropZone() {
  const [files, setFiles] = useState<ToConvert[]>([]);
  const [error, setError] = useState<string>("");
  const [state, setState] = useState<State>("idle");
  const [time, setTime] = useState<number>(-1);

  const handleSubmit = useCallback(async () => {
    setState("loading");
    const destination = await AskForSaveLocation();
    const startTime = performance.now();
    const isSuccess = await ConvertFiles(
      destination,
      files.map((i) => ({ path: i.path, format: i.format ?? "" }))
    );
    if (!isSuccess) {
      setState("error");
      setError("An error occurred while converting the files.");
      return;
    }

    setState("success");
    setTime(performance.now() - startTime);
  }, [files]);

  const handleReset = () => {
    setState("idle");
    setFiles([]);
  };

  useEffect(() => {
    OnFileDrop((_x, _y, paths) => {
      setFiles((prev) =>
        [...new Set([...paths, ...prev.map((p) => p.path)])].map((item) => {
          const exists = prev.find((v) => v.path === item);
          if (exists) {
            return exists;
          }

          return { path: item };
        })
      );
    }, true);
  }, []);

  const render = () => {
    switch (state) {
      case "error":
        return <Error error={error} reset={handleReset} />;
      case "loading":
        return <Loading />;
      case "success":
        return <Success time={time} reset={handleReset} />;
      case "idle":
        if (files.length > 0) {
          return <FileTable submitCallback={handleSubmit} />;
        }

        return <DropArea />;
    }
  };

  return (
    <filesContext.Provider value={{ files, setFiles }}>
      {render()}
    </filesContext.Provider>
  );
}
