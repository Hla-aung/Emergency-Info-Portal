"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface AddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setAddShelter: (open: boolean) => void;
  setAddDamageReport: (open: boolean) => void;
}

const AddDialog = ({
  open,
  onOpenChange,
  setAddShelter,
  setAddDamageReport,
}: AddDialogProps) => {
  const t = useTranslations("HomePage");
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="z-[500]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Button onClick={() => setAddShelter(true)}>
            <Plus />
            {t("add_shelter")}
          </Button>
          <Button onClick={() => setAddDamageReport(true)}>
            <Plus />
            {t("add_damage_report")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDialog;
