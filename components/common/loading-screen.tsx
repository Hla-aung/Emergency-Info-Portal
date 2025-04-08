import React from "react";
import { Loader2 } from "lucide-react";
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full text-primary">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
};

export default LoadingScreen;
