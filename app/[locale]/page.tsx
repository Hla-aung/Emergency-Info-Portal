"use client";

import React from "react";
import { useTranslations } from "next-intl";

import dynamic from "next/dynamic";
import { HomeIcon, Settings } from "lucide-react";
import Link from "next/link";

const MainMap = dynamic(() => import("@/components/MainMap"), {
  ssr: false,
});

export default function Home() {
  return <MainMap />;
}
