"use client";

import React from "react";
import { useTranslations } from "next-intl";

import dynamic from "next/dynamic";
import { Providers } from "../providers";

const EarthquakeMap = dynamic(() => import("../../components/EarthquakeMap"), {
  ssr: false,
});

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <main className="min-h-screen">
      <EarthquakeMap />
    </main>
  );
}
