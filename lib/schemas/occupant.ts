import * as z from "zod";

export const occupantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  age: z.coerce.number().min(0).max(120).optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  medicalConditions: z.string().optional(),
  specialNeeds: z.string().optional(),
});

export type OccupantFormData = z.infer<typeof occupantSchema>;
