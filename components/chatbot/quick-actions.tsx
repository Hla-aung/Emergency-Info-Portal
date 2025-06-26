"use client";

import { Button } from "@/components/ui/button";
import {
  Home,
  Phone,
  Shield,
  Heart,
  MapPin,
  AlertTriangle,
  Info,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  query: string;
  color: "default" | "secondary" | "destructive" | "outline";
}

interface QuickActionsProps {
  onActionClick: (query: string) => void;
  disabled?: boolean;
}

const QuickActions = ({
  onActionClick,
  disabled = false,
}: QuickActionsProps) => {
  const [currentLocation, setCurrentLocation] =
    useState<GeolocationPosition | null>(null);

  const quickActions: QuickAction[] = [
    // {
    //   id: "shelters",
    //   label: "Find Shelters",
    //   icon: <Home className="h-4 w-4" />,
    //   query: "Where are the nearest emergency shelters?",
    //   color: "default",
    // },
    {
      id: "emergency",
      label: "Emergency Contact",
      icon: <Phone className="h-4 w-4" />,
      query: "What emergency numbers should I call?",
      color: "destructive",
    },
    {
      id: "safety",
      label: "Safety Tips",
      icon: <Shield className="h-4 w-4" />,
      query: "What safety tips should I follow during an emergency?",
      color: "secondary",
    },
    {
      id: "first-aid",
      label: "First Aid",
      icon: <Heart className="h-4 w-4" />,
      query: "What basic first aid should I know?",
      color: "outline",
    },
    {
      id: "evacuation",
      label: "Evacuation",
      icon: <MapPin className="h-4 w-4" />,
      query: "What should I do during evacuation?",
      color: "secondary",
    },
    {
      id: "alerts",
      label: "Emergency Alerts",
      icon: <AlertTriangle className="h-4 w-4" />,
      query: "How do I understand emergency alerts?",
      color: "outline",
    },
    {
      id: "preparedness",
      label: "Preparedness",
      icon: <Info className="h-4 w-4" />,
      query: "How can I prepare for emergencies?",
      color: "default",
    },
    {
      id: "family",
      label: "Family Plan",
      icon: <Users className="h-4 w-4" />,
      query: "How do I create a family emergency plan?",
      color: "secondary",
    },
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {quickActions.map((action) => (
        <Button
          key={action.id}
          variant={action.color}
          size="sm"
          onClick={() => {
            if (action.id === "emergency") {
              const emergencyQuery = `
                I am currently at ${currentLocation?.coords.latitude}, ${currentLocation?.coords.longitude}. What are the nearest emergency numbers?
              `;
              onActionClick(emergencyQuery);
            } else {
              onActionClick(action.query);
            }
          }}
          disabled={disabled}
          className="h-auto py-2 px-3 text-xs flex flex-col items-center gap-1"
        >
          {action.icon}
          <span>{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
