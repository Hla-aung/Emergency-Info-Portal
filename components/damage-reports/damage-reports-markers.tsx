"use client";

import {
  useAddDamageReportComment,
  useDamageReports,
} from "@/lib/query/use-damage-reports";
import { generateMarkerIcon } from "@/components/MainMap";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  User,
  MapPin,
  Send,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DamageType, DamageSeverity, ReportStatus } from "@prisma/client";
import { DamageReport } from "@/lib/api/damage-reports";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { toast } from "sonner";

const DamageReportsMarkers = () => {
  const t = useTranslations();

  const { data: damageReportsData } = useDamageReports();
  const damageReports = damageReportsData?.damageReports || [];
  const [isOpenComments, setIsOpenComments] = useState(false);
  const [comment, setComment] = useState("");

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

  const { mutate: addComment } = useAddDamageReportComment();

  const handleAddComment = (reportId: string, comment: string) => {
    addComment({ damageReportId: reportId, comment });
  };

  const handleShare = async (report: DamageReport) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Help! I have been damaged`,
          text: `I'm in ${report.location} and I'm in need of help.`,
          url: `https://www.google.com/maps?q=${report?.latitude},${report?.longitude}`,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error(t("shareFailed"));
        }
      }
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare(report)}
                >
                  <Share2 />
                </Button>
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
                {/* <Badge variant="outline">{getStatusLabel(report.status)}</Badge> */}
                {report.isUrgent && <Badge variant="destructive">Urgent</Badge>}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground !m-0 !my-0.5">
                {report.description}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 !m-0 !my-0.5">
                <MapPin className="size-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{report.location}</span>
              </div>

              {/* Damage Type */}
              <p className="text-sm !m-0 !my-0.5">
                <span className="font-medium">Type:</span>{" "}
                {getDamageTypeLabel(report.damageType)}
              </p>

              {/* Priority */}
              <p className="text-sm !m-0 !my-0.5">
                <span className="font-medium">Priority:</span> {report.priority}
                /10
              </p>

              {/* People Affected */}
              {report.isPeopleDamaged && (
                <div className="flex items-center gap-2 !m-0 !my-0.5">
                  <User className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">People Affected:</span>{" "}
                    {report.numberOfPeopleDamaged || "Unknown"}
                  </span>
                </div>
              )}

              {/* Affected Area */}
              {report.affectedArea && (
                <p className="text-sm !m-0 !my-0.5">
                  <span className="font-medium">Affected Area:</span>{" "}
                  {report.affectedArea}
                </p>
              )}

              {/* Reporter Information */}
              {report.reporterName && (
                <div className="border-t pt-2 !m-0 !my-0.5">
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
              <div className="flex items-center gap-2 !m-0 !my-0.5">
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

              {/* Comments */}
              <div className="mt-2 pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsOpenComments(!isOpenComments)}
                >
                  {isOpenComments ? "Hide Comments" : "Show Comments"}
                </Button>
              </div>

              {isOpenComments && (
                <ScrollArea className="mt-2 pt-2 border-t h-[150px]">
                  {report.comments && report.comments.length > 0 ? (
                    report.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-md bg-muted mb-1 p-1 pt-0"
                      >
                        <p className="text-sm !m-0 !my-0.5">
                          {comment.comment}
                        </p>
                        <span className="text-xs text-muted-foreground !m-0 !my-0.5">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No comments yet
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="text"
                      placeholder="Add a comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (comment) {
                            handleAddComment(report.id, comment);
                          }
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (comment) {
                          handleAddComment(report.id, comment);
                        }
                        setComment("");
                      }}
                      disabled={!comment}
                    >
                      <Send />
                    </Button>
                  </div>
                </ScrollArea>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default DamageReportsMarkers;
