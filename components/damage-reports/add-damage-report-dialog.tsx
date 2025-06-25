"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateDamageReport } from "@/lib/query/use-damage-reports";
import {
  damageReportFormSchema,
  DamageReportFormData,
} from "@/lib/schemas/damage-report";
import { useReverseGeocoding } from "@/lib/query/use-nominatim";
import React, { useEffect } from "react";
import {
  Loader2,
  MapPin,
  AlertTriangle,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DamageType, DamageSeverity } from "@prisma/client";

type FormValues = z.infer<typeof damageReportFormSchema>;

interface AddDamageReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position?: L.LatLngTuple;
}

export default function AddDamageReportDialog({
  open,
  onOpenChange,
  position,
}: AddDamageReportDialogProps) {
  const t = useTranslations();
  const createDamageReport = useCreateDamageReport();

  const form = useForm<FormValues>({
    resolver: zodResolver(damageReportFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      latitude: position?.[0],
      longitude: position?.[1],
      damageType: undefined,
      severity: undefined,
      estimatedCost: undefined,
      affectedArea: "",
      priority: 1,
      isPeopleDamaged: false,
      numberOfPeopleDamaged: undefined,
      isUrgent: false,
      photos: [],
      notes: "",
      reporterName: "",
      reporterEmail: "",
      reporterPhone: "",
    },
  });

  // Get location name from coordinates
  const { data: locationData, isLoading: isLoadingLocation } =
    useReverseGeocoding(position?.[0], position?.[1]);

  // Update location when coordinates change
  useEffect(() => {
    if (position?.[0] && position?.[1]) {
      form.setValue("latitude", position[0]);
      form.setValue("longitude", position[1]);
    }
  }, [position, form]);

  // Update location field when reverse geocoding data is available
  useEffect(() => {
    if (locationData?.display_name) {
      form.setValue("location", locationData.display_name);
    }
  }, [locationData, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Ensure required fields are present
      const submitData = {
        title: data.title,
        description: data.description,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        damageType: data.damageType!,
        severity: data.severity!,
        estimatedCost: data.estimatedCost,
        affectedArea: data.affectedArea,
        priority: data.priority,
        isPeopleDamaged: data.isPeopleDamaged,
        numberOfPeopleDamaged: data.numberOfPeopleDamaged,
        isUrgent: data.isUrgent,
        photos: data.photos,
        notes: data.notes,
        reporterName: data.reporterName,
        reporterEmail: data.reporterEmail,
        reporterPhone: data.reporterPhone,
      };

      await createDamageReport.mutateAsync(submitData);
      toast.success("Damage report created successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create damage report");
      console.error("Error creating damage report:", error);
    }
  };

  const isPeopleDamaged = form.watch("isPeopleDamaged");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden z-[500]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report Damage
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-1"
            >
              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Location Information
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter location or address"
                            {...field}
                            className="pr-8"
                          />
                          {isLoadingLocation && (
                            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Damage Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Damage Details
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief description of the damage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the damage..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="damageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Damage Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select damage type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[600]">
                            {(
                              [
                                "STRUCTURAL",
                                "INFRASTRUCTURE",
                                "UTILITIES",
                                "ROADS",
                                "BRIDGES",
                                "BUILDINGS",
                                "OTHER",
                                "PERSON",
                              ] as DamageType[]
                            ).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[600]">
                            {(
                              [
                                "MINOR",
                                "MODERATE",
                                "SEVERE",
                                "CRITICAL",
                              ] as DamageSeverity[]
                            ).map((severity) => (
                              <SelectItem key={severity} value={severity}>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      severity === "CRITICAL"
                                        ? "destructive"
                                        : severity === "SEVERE"
                                        ? "default"
                                        : severity === "MODERATE"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {severity}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="affectedArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affected Area</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Downtown, Residential District"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="estimatedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Cost</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority (1-10)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            placeholder="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* People Impact Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  People Impact
                </div>

                <FormField
                  control={form.control}
                  name="isPeopleDamaged"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between ">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          People Affected
                        </FormLabel>
                        <FormDescription>
                          Are there people injured or affected by this damage?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {isPeopleDamaged && (
                  <FormField
                    control={form.control}
                    name="numberOfPeopleDamaged"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of People Affected</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Enter number of people"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Urgency Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isUrgent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between ">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Urgent Response Required
                        </FormLabel>
                        <FormDescription>
                          Mark as urgent if immediate attention is needed
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Reporter Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Reporter Information (Optional)
                </div>

                <FormField
                  control={form.control}
                  name="reporterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reporterEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reporterPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information or context..."
                        className="min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={createDamageReport.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createDamageReport.isPending}
                  className="min-w-[120px]"
                >
                  {createDamageReport.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
