import { Appointment } from "../types";
import { categories } from "../data /categories";
import { patients } from "../data /patients";
import { format } from "date-fns";

type EventCardProps = {
  appointment: Appointment;
};

export function EventCard({ appointment }: EventCardProps) {
  const category = categories.find((cat) => cat.id === appointment.category);
  const patient = patients.find((p) => p.id === appointment.patient);

  return (
    <div
      className={`rounded-xl shadow-sm px-3 py-2 text-sm cursor-pointer transition hover:brightness-95`}
      style={{
        background: category?.color || "#e9d5ff", // default to a soft purple
        color: "#333",
        borderLeft: `6px solid ${category?.color || "#c4b5fd"}`,
      }}
    >
      <div className="font-semibold mb-1">{appointment.title}</div>
      <div className="flex flex-col gap-0.5 text-xs">
        <span>
          {format(new Date(appointment.start), "HH:mm")}–{format(new Date(appointment.end), "HH:mm")}
        </span>
        <span>{appointment.location}</span>
        <span className="text-gray-700">
          {patient?.firstname} {patient?.lastname}
        </span>
      </div>
    </div>
  );
}
