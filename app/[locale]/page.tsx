"use client";

import React from "react";

import dynamic from "next/dynamic";

const MainMap = dynamic(() => import("@/components/MainMap"), {
  ssr: false,
});

export default function Home() {
  return <MainMap />;
}
