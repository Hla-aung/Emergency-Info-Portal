import * as z from "zod";
import { DamageType, DamageSeverity } from "@prisma/client";

export const damageReportFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  damageType: z.enum(
    [
      "STRUCTURAL",
      "INFRASTRUCTURE",
      "UTILITIES",
      "ROADS",
      "BRIDGES",
      "BUILDINGS",
      "OTHER",
      "PERSON",
    ],
    {
      required_error: "Please select a damage type",
    }
  ),
  severity: z.enum(["MINOR", "MODERATE", "SEVERE", "CRITICAL"], {
    required_error: "Please select a severity level",
  }),
  estimatedCost: z.number().min(0, "Cost must be positive").optional(),
  affectedArea: z
    .string()
    .max(200, "Affected area must be less than 200 characters")
    .optional(),
  priority: z
    .number()
    .min(1, "Priority must be at least 1")
    .max(10, "Priority must be at most 10")
    .default(1),
  isPeopleDamaged: z.boolean().default(false),
  numberOfPeopleDamaged: z
    .number()
    .min(1, "Number of people must be at least 1")
    .optional(),
  isUrgent: z.boolean().default(false),
  photos: z.array(z.string().url("Invalid photo URL")).default([]),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
  reporterName: z
    .string()
    .max(100, "Name must be less than 100 characters")
    .optional(),
  reporterEmail: z.string().optional(),
  reporterPhone: z
    .string()
    .max(20, "Phone must be less than 20 characters")
    .optional(),
});

export type DamageReportFormData = z.infer<typeof damageReportFormSchema>;
