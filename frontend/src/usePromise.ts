import { useEffect, useState } from "react";

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

type Status = "idle" | "loading" | "success" | "error";

export function usePromise<Output, TError = unknown>(
  prom: AsyncFunction<Output>,
  ...args: Parameters<AsyncFunction<Output>>
): [Output | undefined, TError | undefined, boolean, Status] {
  const [result, setResult] = useState<Output>();
  const [error, setError] = useState<TError>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      setStatus("loading");
      setError(undefined);
      setResult(undefined);

      try {
        const res = await prom(...args);
        if (!cancelled) {
          setResult(res);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as TError);
          setStatus("error");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [prom, ...args]);

  return [result, error, isLoading, status];
}
