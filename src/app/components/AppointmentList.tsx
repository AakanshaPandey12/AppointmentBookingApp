"use client";
import { Appointment } from "../types";
//import { categories } from "../data /categories";
//import { patients } from "../data /patients";
import { format, isSameDay, compareAsc } from "date-fns";
import { Calendar, MapPin, User2, Info } from "lucide-react"; // Icon imports

type AppointmentListProps = {
  appointments: Appointment[];
  patients: { id: string; firstname: string; lastname: string }[];
  categories: { id: string; color: string }[];
  onEdit?: (appointment: Appointment) => void;
};
function groupByDay(appts: Appointment[]) {
  const grouped: { [day: string]: Appointment[] } = {};
  appts.forEach(appt => {
    const key = format(new Date(appt.start), "yyyy-MM-dd");
    grouped[key] = grouped[key] || [];
    grouped[key].push(appt);
  });
  return grouped;
}

function formatDateHeading(dateStr: string) {
  const date = new Date(dateStr);
  const days = [
    "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
  ];
  return `${days[date.getDay()]}, ${format(date, "dd. MMMM")}`;
}

export function AppointmentList({ appointments, onEdit, categories, patients }: AppointmentListProps) {
  if (!appointments.length) {
    return (
      <div className="w-full flex justify-center items-center text-gray-400 py-16">
        Keine weiteren Termine gefunden
      </div>
    );
  }

  // Group appointments by day
  const grouped = groupByDay(appointments.sort((a, b) =>
    compareAsc(new Date(a.start), new Date(b.start))
  ));

  return (
    <div className="w-full max-w-4xl mx-auto px-2 py-6 bg-gray-100 rounded-lg">
      {Object.entries(grouped).map(([dateStr, dayAppts]) => (
        <div key={dateStr} className="mb-10">
          <h3 className="text-xl font-bold mb-4 mt-6">
            {formatDateHeading(dateStr)}
          </h3>
          <div className="flex flex-col gap-6">
            {dayAppts.map(appt => {
              const category = categories.find(c => c.id === appt.category);
              const patient = patients.find(p => p.id === appt.patient);

              return (
                  <div
                   key={appt.id}
                  className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2 border-l-8 cursor-pointer hover:bg-gray-50"
                  style={{ borderColor: category?.color || "red" }}
                  onClick={() => onEdit?.(appt)} // 👈 Click anywhere triggers edit
                  >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category?.color || "yellow" }}
                    />
                    <div className="font-semibold text-base">{appt.title}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-5 text-gray-600 text-sm mt-1 mb-0">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} className="text-gray-400" />
                      {format(new Date(appt.start), "HH:mm")} bis {format(new Date(appt.end), "HH:mm")} Uhr
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-gray-400" />
                      {appt.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <User2 size={16} className="text-gray-400" />
                      {patient?.firstname} {patient?.lastname}
                    </div>
                  </div>
                  {appt.notes && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Info size={15} className="text-gray-400" />
                      <span>{appt.notes}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 hidden">
                    <span>{appt.id} </span>
                  </div>  
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
