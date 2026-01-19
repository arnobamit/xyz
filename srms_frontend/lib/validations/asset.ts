import { z } from "zod";

export const assetSchema = z.object({
  as_type: z.string().min(1, "Type is required"),
  as_name: z.string().min(1, "Name is required"),
  as_status: z.string().min(1, "Status is required"),
});

export type AssetInput = z.infer<typeof assetSchema>;
