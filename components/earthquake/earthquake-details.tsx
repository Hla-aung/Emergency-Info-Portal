"use client";

import { format } from "date-fns";
import { AlertTriangle, Calendar, MapPin, Ruler } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Helper function to determine magnitude color
function getMagnitudeColor(magnitude: number): string {
  if (magnitude < 2) return "bg-green-500";
  if (magnitude < 4) return "bg-yellow-500";
  if (magnitude < 6) return "bg-orange-500";
  return "bg-red-500";
}

// Helper function to get alert level badge
function getAlertBadge(alert: string | null | undefined) {
  if (!alert) return null;

  const alertColors: Record<string, string> = {
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    red: "bg-red-500 hover:bg-red-600",
  };

  return (
    <Badge className={alertColors[alert] || "bg-gray-500"}>
      Alert: {alert.toUpperCase()}
    </Badge>
  );
}

export default function EarthquakeDetails({
  data,
}: {
  data?: { features: Earthquake[] };
}) {
  if (!data?.features || data.features.length === 0) {
    return (
      <div className="text-center py-10">No earthquake data available</div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.features.map((earthquake) => (
        <Card key={earthquake.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-4 h-4 rounded-full ${getMagnitudeColor(
                        earthquake.properties.mag
                      )}`}
                      title={`Magnitude ${earthquake.properties.mag}`}
                    />
                    Magnitude {earthquake.properties.mag.toFixed(1)}
                  </div>
                </CardTitle>
                <CardDescription className="mt-1 line-clamp-2">
                  {earthquake.properties.place || "Unknown location"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {earthquake.properties.tsunami === 1 && (
                  <Badge variant="destructive">Tsunami</Badge>
                )}
                {getAlertBadge(earthquake.properties.alert)}
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Time</h3>
                  <p className="text-sm">
                    {format(earthquake.properties.time, "PPpp")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Location</h3>
                  <p className="text-sm">
                    Latitude: {earthquake.geometry.coordinates[1].toFixed(4)}°
                    <br />
                    Longitude: {earthquake.geometry.coordinates[0].toFixed(4)}°
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ruler className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Depth</h3>
                  <p className="text-sm">
                    {earthquake.geometry.coordinates[2].toFixed(2)} km
                  </p>
                </div>
              </div>

              {earthquake.properties.felt && (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Impact</h3>
                    <p className="text-sm">
                      Felt by approximately {earthquake.properties.felt} people
                      <br />
                      Significance: {earthquake.properties.sig} (Range: 0 -
                      1000)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
