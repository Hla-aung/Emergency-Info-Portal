"use client";

import React from "react";

import dynamic from "next/dynamic";
import { useCheckPushSubscription } from "@/hooks/use-push-subscription";

const MainMap = dynamic(() => import("@/components/MainMap"), {
  ssr: false,
});

export default function Home() {
  useCheckPushSubscription();

  return <MainMap />;
}
