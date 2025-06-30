"use client";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from "@/app/components/ui/hover-card";
import { Appointment } from "../types";
import { format } from "date-fns";
import { Patient, Category } from "../types"; // Assuming you've added types
type AppointmentHoverCardProps = {
  appointment: Appointment;
  patients: Patient[];
  categories: Category[];
  className?: string;
   children?: React.ReactNode;
};

export function AppointmentHoverCard({
  appointment,
  patients,
  categories,
  className,
   children,
}: AppointmentHoverCardProps) {
  const category = categories?.find(cat => cat.id === appointment?.category);
  const patient = patients?.find(p => p.id === appointment?.patient);

  return (
 <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={`cursor-pointer inline-block px-2 py-1 rounded bg-purple-100 hover:bg-gray-200 border-l-4 ${className}`}
          style={{ borderColor: category?.color || "#888" }}
        >
          {children || appointment.title}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-[800px]">
        <div className="font-bold mb-1">{appointment.title}</div>
        <div className="text-xs mb-2">
          {category?.label} – {patient?.firstname} {patient?.lastname}
        </div>
        <div className="text-xs mb-2">
          <strong>Start:</strong> {format(new Date(appointment.start), "dd.MM.yyyy HH:mm")}
          <br />
          <strong>End:</strong> {format(new Date(appointment.end), "dd.MM.yyyy HH:mm")}
        </div>
        <div className="text-xs">
          <strong>Location:</strong> {appointment.location}
        </div>
        <div className="text-xs">
          <strong>Notes:</strong> {appointment.notes}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
