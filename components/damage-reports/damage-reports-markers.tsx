"use client";

import { useDamageReports } from "@/lib/query/use-damage-reports";
import { generateMarkerIcon } from "@/components/MainMap";
import { useTranslations } from "next-intl";
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { AlertTriangle, Clock, DollarSign, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DamageType, DamageSeverity, ReportStatus } from "@prisma/client";

const DamageReportsMarkers = () => {
  const t = useTranslations();

  const { data: damageReportsData } = useDamageReports();
  const damageReports = damageReportsData?.damageReports || [];

  // Function to get marker color based on severity
  const getMarkerColor = (severity: DamageSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return "#dc2626"; // red
      case "SEVERE":
        return "#ea580c"; // orange
      case "MODERATE":
        return "#ca8a04"; // yellow
      case "MINOR":
        return "#16a34a"; // green
      default:
        return "#6b7280"; // gray
    }
  };

  // Function to get severity label
  const getSeverityLabel = (severity: DamageSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return "Critical";
      case "SEVERE":
        return "Severe";
      case "MODERATE":
        return "Moderate";
      case "MINOR":
        return "Minor";
      default:
        return severity;
    }
  };

  // Function to get damage type label
  const getDamageTypeLabel = (damageType: DamageType) => {
    switch (damageType) {
      case "STRUCTURAL":
        return "Structural";
      case "INFRASTRUCTURE":
        return "Infrastructure";
      case "UTILITIES":
        return "Utilities";
      case "ROADS":
        return "Roads";
      case "BRIDGES":
        return "Bridges";
      case "BUILDINGS":
        return "Buildings";
      case "OTHER":
        return "Other";
      case "PERSON":
        return "Person";
      default:
        return damageType;
    }
  };

  // Function to get status label
  const getStatusLabel = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <>
      {damageReports?.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude || 0, report.longitude || 0]}
          icon={generateMarkerIcon({ color: getMarkerColor(report.severity) })}
        >
          <Popup>
            <div className="flex flex-col min-w-[300px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <AlertTriangle className="text-destructive size-5" />
                  {report.title}
                </h3>
              </div>

              {/* Severity and Status Badges */}
              <div className="flex gap-2 mb-2">
                <Badge
                  variant={
                    report.severity === "CRITICAL" ||
                    report.severity === "SEVERE"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {getSeverityLabel(report.severity)}
                </Badge>
                <Badge variant="outline">{getStatusLabel(report.status)}</Badge>
                {report.isUrgent && <Badge variant="destructive">Urgent</Badge>}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-2">
                {report.description}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="size-4 text-muted-foreground" />
                <span className="text-sm">{report.location}</span>
              </div>

              {/* Damage Type */}
              <p className="text-sm mb-2">
                <span className="font-medium">Type:</span>{" "}
                {getDamageTypeLabel(report.damageType)}
              </p>

              {/* Priority */}
              <p className="text-sm mb-2">
                <span className="font-medium">Priority:</span> {report.priority}
                /10
              </p>

              {/* Estimated Cost */}
              {report.estimatedCost && (
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Estimated Cost:</span> $
                    {report.estimatedCost.toLocaleString()}
                  </span>
                </div>
              )}

              {/* People Affected */}
              {report.isPeopleDamaged && (
                <div className="flex items-center gap-2 mb-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">People Affected:</span>{" "}
                    {report.numberOfPeopleDamaged || "Unknown"}
                  </span>
                </div>
              )}

              {/* Affected Area */}
              {report.affectedArea && (
                <p className="text-sm mb-2">
                  <span className="font-medium">Affected Area:</span>{" "}
                  {report.affectedArea}
                </p>
              )}

              {/* Reporter Information */}
              {report.reporterName && (
                <div className="border-t pt-2 mt-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Reported by:</span>{" "}
                    {report.reporterName}
                  </p>
                  {report.reporterPhone && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Phone:</span>{" "}
                      {report.reporterPhone}
                    </p>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(report.createdAt).toLocaleDateString()} at{" "}
                  {new Date(report.createdAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Notes */}
              {report.notes && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm">
                    <span className="font-medium">Notes:</span> {report.notes}
                  </p>
                </div>
              )}

              {/* <div className="mt-2 pt-2 border-t">
                {report.comments.map((comment) => (
                  <div key={comment.id}>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                ))}
              </div> */}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default DamageReportsMarkers;
