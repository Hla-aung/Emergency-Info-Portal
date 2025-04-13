import React from "react";

function OfflineLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-full min-h-svh">{children}</div>;
}

export default OfflineLayout;
