"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
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
import { ScrollArea } from "../ui/scroll-area";
import { useCreateShelter } from "@/lib/hooks/use-shelter";
import { CreateShelterDto } from "@/lib/api/shelter";
import { ShelterResource, ShelterType } from "@prisma/client";
import { formSchema } from "@/lib/schemas/shelter";

type FormValues = z.infer<typeof formSchema>;

interface ShelterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: L.LatLngTuple;
}

export default function ShelterDialog({
  open,
  onOpenChange,
  position,
}: ShelterDialogProps) {
  const t = useTranslations("Shelter");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      phone: "",
      capacity: 0,
      type: "TEMPORARY",
      isAvailable: true,
    },
  });

  const { mutate: createShelter } = useCreateShelter();

  const handleSubmit = (data: FormValues) => {
    createShelter(
      {
        ...data,
        latitude: position[0],
        longitude: position[1],
      } as CreateShelterDto,
      {
        onSuccess: (res) => {
          alert(res);
        },
        onError: (error) => {
          alert(error);
        },
      }
    );
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[500]">
        <DialogHeader>
          <DialogTitle>{t("add_shelter")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("name")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("location")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("location")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("phone")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("capacity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("capacity")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact_name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("contact_name")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact_phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("contact_phone")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("shelter_type")}</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("select_type")} />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="z-[600]">
                        {(
                          [
                            "TEMPORARY",
                            "PERMANENT",
                            "MEDICAL",
                            "EVACUATION",
                          ] as ShelterType[]
                        ).map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(type)}
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
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("is_available")}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAccessible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("is_accessible")}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("notes")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("notes")}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resourcesAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("resources")}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-4">
                        {(
                          [
                            "FOOD",
                            "WATER",
                            "MEDICAL",
                            "BLANKETS",
                            "TOILETS",
                            "INTERNET",
                            "ELECTRICITY",
                          ] as ShelterResource[]
                        ).map((resource) => (
                          <FormItem
                            key={resource}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(resource)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, resource]);
                                  } else {
                                    field.onChange(
                                      current.filter((r) => r !== resource)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t(resource)}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t("add_shelter")}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
