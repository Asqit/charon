import { File } from "lucide-react";

export function Loading() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <File className=" animate-portalUp -rotate-12" size={32} />
        <File
          size={16}
          className="animate-portalUp rotate-6"
          style={{ animationDelay: "1200ms" }}
        />
        <File
          className="animate-portalUp -rotate-6"
          style={{ animationDelay: "1000ms" }}
        />
        <File
          size={48}
          className="animate-portalUp rotate-12 "
          style={{ animationDelay: "500ms" }}
        />
      </div>
      <h2 className="font-black animate-pulse">Files Area Being Processed</h2>
    </div>
  );
}
