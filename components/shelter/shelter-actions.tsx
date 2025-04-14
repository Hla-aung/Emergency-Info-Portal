"use client";

import { Shelter } from "@prisma/client";
import ShelterEditDialog from "./shelter-edit-dialog";
import ShelterDeleteDialog from "./shelter-delete-dialog";

interface ShelterActionsProps {
  shelter: Shelter;
}

export default function ShelterActions({ shelter }: ShelterActionsProps) {
  return (
    <div className="flex gap-2 mt-3">
      <ShelterEditDialog shelter={shelter} />
      <ShelterDeleteDialog shelter={shelter} />
    </div>
  );
}
