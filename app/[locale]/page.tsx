"use client";

import React from "react";
import { useTranslations } from "next-intl";

import dynamic from "next/dynamic";

const MainMap = dynamic(() => import("@/components/MainMap"), {
  ssr: false,
});

export default function Home() {
  const t = useTranslations("HomePage");

  return <MainMap />;
}
