import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone is required"),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  type: z.enum(["TEMPORARY", "PERMANENT", "MEDICAL", "EVACUATION"] as const, {
    required_error: "Shelter type is required",
  }),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  isAvailable: z.boolean().default(true),
  isAccessible: z.boolean().optional(),
  notes: z.string().optional(),
  organizationId: z.string().min(1, "Organization ID is required"),
  resourcesAvailable: z
    .array(
      z.enum([
        "FOOD",
        "WATER",
        "MEDICAL",
        "BLANKETS",
        "TOILETS",
        "INTERNET",
        "ELECTRICITY",
      ] as const)
    )
    .optional(),
});
