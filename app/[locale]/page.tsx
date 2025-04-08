"use client";

import React from "react";
import { useTranslations } from "next-intl";

import dynamic from "next/dynamic";

const EarthquakeMap = dynamic(() => import("../../components/EarthquakeMap"), {
  ssr: false,
});

export default function Home() {
  const t = useTranslations("HomePage");

  return <EarthquakeMap />;
}
