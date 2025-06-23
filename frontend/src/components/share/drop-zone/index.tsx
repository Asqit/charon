import { useCallback, useEffect, useState, useContext } from "react";
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
  const [error, setError] = useState<string>("internal server error");
  const [state, setState] = useState<State>("idle");
  const [time, setTime] = useState<number>(-1);

  const handleSubmit = useCallback(async () => {
    const start = performance.now();
    try {
      setState("loading");
      const destination = await AskForSaveLocation();
      const isSuccess = await ConvertFiles(
        destination,
        files.map((i) => ({ path: i.path, format: i.format ?? "" })),
      );
      if (!isSuccess) {
        setState("error");
        setError((error as unknown as any)?.message);
        return;
      }
      setState("success");
    } catch (error) {
      setState("error");
      setError((error as unknown as any)?.message);
    } finally {
      setTime(performance.now() - start);
    }
  }, [files]);

  const handleReset = () => {
    setState("idle");
    setFiles([]);
  };

  useEffect(() => {
    OnFileDrop((_x, _y, paths) => {
      setFiles([...new Set([...files, ...paths.map((p) => ({ path: p }))])]);
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
