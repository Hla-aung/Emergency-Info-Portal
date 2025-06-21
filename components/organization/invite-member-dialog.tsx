"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Share2, Check, Building2, Users, Link } from "lucide-react";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  organizationName?: string;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  organizationId,
  organizationName,
}: InviteMemberDialogProps) {
  const t = useTranslations("Dashboard");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(organizationId);
      setCopied(true);
      toast.success(t("copiedToClipboard"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t("copyFailed"));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my organization",
          text: `Join my organization "${organizationName}" using this ID: ${organizationId}`,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error(t("shareFailed"));
        }
      }
    } else {
      // Fallback to copy if sharing is not supported
      handleCopy();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("inviteMemberTitle")}
          </DialogTitle>
          <DialogDescription>{t("inviteMemberDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Organization Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">
                    {organizationName || "Organization"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("organizationId")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization ID Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("organizationId")}</label>
            <div className="flex gap-2">
              <Input
                value={organizationId}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t("howToInvite")}</p>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>{t("inviteStep1")}</li>
                    <li>{t("inviteStep2")}</li>
                    <li>{t("inviteStep3")}</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleShare} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              {t("share")}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
