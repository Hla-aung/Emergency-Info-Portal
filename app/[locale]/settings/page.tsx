import dynamic from "next/dynamic";

const Settings = dynamic(() => import("@/components/Settings"), {
  ssr: true,
});

export default function Page() {
  return <Settings />;
}
