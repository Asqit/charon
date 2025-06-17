import { z } from "zod";

export const dataFormValidation = z.object({
  exportPath: z.string().refine(
    (path) => {
      return path.startsWith("/") || /^[a-zA-Z]:\\/.test(path);
    },
    {
      message: "Invalid folder path. Please provide a valid OS folder path.",
    }
  ),
});

export type DataFormValidator = z.infer<typeof dataFormValidation>;

export const defaultValues: DataFormValidator = {
  exportPath: "$HOME/Downloads",
};
