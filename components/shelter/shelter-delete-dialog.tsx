"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Shelter } from "@prisma/client";
import { useDeleteShelter } from "@/lib/query/use-shelter";

interface ShelterDeleteDialogProps {
  shelter: Shelter;
}

export default function ShelterDeleteDialog({
  shelter,
}: ShelterDeleteDialogProps) {
  const t = useTranslations("Shelter");
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: deleteShelter, isPending } = useDeleteShelter();

  const handleDelete = () => {
    deleteShelter(shelter.id, {
      onSuccess: () => {
        setIsOpen(false);
      },
      onError: (error) => {
        alert(error);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="w-7 h-7">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[500]">
        <DialogHeader>
          <DialogTitle>{t("delete_shelter")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{t("delete_shelter_confirmation")}</p>
          <div className="flex justify-end gap-2">
            <Button variant="destructive" onClick={handleDelete}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("delete")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
