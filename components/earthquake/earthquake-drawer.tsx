import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { format } from "date-fns";
import { useGetEarthquakes } from "@/lib/query/use-earthquake";
import { ScrollArea } from "../ui/scroll-area";
import EarthquakeDetails from "./earthquake-details";

const EarthquakeDrawer = () => {
  const { data } = useGetEarthquakes();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="absolute bottom-20 right-5 z-[500] rounded-full"
          variant="destructive"
        >
          <Activity className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="z-[500]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{data?.metadata?.title}</DrawerTitle>
          <DrawerDescription>
            {format(data?.metadata?.generated, "PPpp")}
          </DrawerDescription>
          <DrawerDescription>
            {data?.metadata?.count} earthquakes
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[50vh] pt-0 p-5">
          <EarthquakeDetails data={data} />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default EarthquakeDrawer;
