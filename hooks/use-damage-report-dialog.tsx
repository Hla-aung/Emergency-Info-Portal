"use client";

import { useState } from "react";

interface MapPosition {
  lat: number;
  lng: number;
}

export function useDamageReportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MapPosition | undefined>();

  const openDialog = (pos: MapPosition) => {
    setPosition(pos);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setPosition(undefined);
  };

  const handleMapClick = (event: any) => {
    const { lat, lng } = event.latlng;
    openDialog({ lat, lng });
  };

  return {
    isOpen,
    position,
    openDialog,
    closeDialog,
    handleMapClick,
  };
}
