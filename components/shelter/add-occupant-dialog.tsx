"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { occupantSchema, type OccupantFormData } from "@/lib/schemas/occupant";
import { useCreateOccupant } from "@/lib/query/use-occupant";

interface AddOccupantDialogProps {
  organizationId: string;
  shelterId: string;
  onOccupantAdded: () => void;
  shelterCapacity: number;
  currentOccupancy: number;
}

export function AddOccupantDialog({
  organizationId,
  shelterId,
  onOccupantAdded,
  shelterCapacity,
  currentOccupancy,
}: AddOccupantDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Shelter");
  const { mutate: createOccupant, isPending } = useCreateOccupant();

  const form = useForm<OccupantFormData>({
    resolver: zodResolver(occupantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: undefined,
      gender: undefined,
      phone: "",
      emergencyContact: "",
      emergencyContactPhone: "",
      medicalConditions: "",
      specialNeeds: "",
    },
  });

  const handleSubmit = (data: OccupantFormData) => {
    createOccupant(
      {
        organizationId,
        shelterId,
        data,
      },
      {
        onSuccess: () => {
          toast.success(t("occupantAddedSuccess"));
          setOpen(false);
          form.reset();
          onOccupantAdded();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : t("failedToAddOccupant")
          );
        },
      }
    );
  };

  const isAtCapacity = currentOccupancy >= shelterCapacity;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isAtCapacity} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addOccupant")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("addNewOccupant")}</DialogTitle>
          <DialogDescription>
            {t("addOccupantDescription")}
            {isAtCapacity && (
              <span className="block text-red-600 font-medium mt-2">
                {t("shelterAtCapacity", {
                  current: currentOccupancy,
                  capacity: shelterCapacity,
                })}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("firstName")} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterFirstName")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("lastName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterLastName")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("age")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="120"
                        placeholder={t("enterAge")}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("gender")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectGender")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">{t("male")}</SelectItem>
                        <SelectItem value="female">{t("female")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          {t("preferNotToSay")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={t("enterPhoneNumber")}
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
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emergencyContact")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("emergencyContactName")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emergencyContactPhone")}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder={t("emergencyContactPhoneNumber")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="medicalConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("medicalConditions")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("medicalConditionsPlaceholder")}
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialNeeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("specialNeeds")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("specialNeedsPlaceholder")}
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("adding")}
                  </>
                ) : (
                  t("addOccupant")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
