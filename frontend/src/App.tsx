import { useState } from "react";
import { DropZone, ToConvert } from "./components/share/drop-zone";
import { Header } from "./components/share/header";
import { Loader } from "lucide-react";
import { AskForSaveLocation, ConvertFiles } from "../wailsjs/go/main/App";
import { Button } from "./components/ui/button";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (data: ToConvert[]) => {
    setIsLoading(true);
    try {
      const destination = await AskForSaveLocation();
      const isSuccess = await ConvertFiles(
        destination,
        data.map((i) => ({ path: i.path, format: i.format ?? "" })),
      );

      if (!isSuccess) {
        return new Error("Failed to convert images");
      }
    } catch (error) {
      setError(
        (error as unknown as any)?.message ?? "Failed to convert images",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const render = () => {
    switch (true) {
      default:
        return <DropZone handleSubmit={handleSubmit} />;
      case isLoading:
        return <Loader className="animate-spin" />;
      case Boolean(error.trim()):
        return (
          <div className="border rounded-md p-8 w-[500px] space-y-4">
            <h2 className="text-2xl">Yikes, try again? </h2>
            <p className="text-red-700 text-sm font-mono">{error}</p>
            <Button variant={"secondary"} onClick={() => setError("")}>
              New Conversion
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="h-screen overflow-scroll bg-transparent">
      <div className="container max-w-7xl mx-auto p-4">
        <Header />
        <main className="flex items-center justify-center">{render()}</main>
      </div>
    </div>
  );
}
