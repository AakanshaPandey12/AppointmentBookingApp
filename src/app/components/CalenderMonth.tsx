"use client";
import { useMemo } from "react";
import {
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  format,
} from "date-fns";
import { Appointment } from "../types";
import { Patient } from "../types";
import { Category } from "../types";
import { UUID } from "../types";
import { AppointmentHoverCard }  from "./AppointmentHoverCard";


type CalendarMonthProps = {
  filterAppointments: (date: Date) => Appointment[];
  patients: Patient[];
  categories: Category[];
  month: number; // 0-11
  year: number;
};
export function CalendarMonth({ filterAppointments , patients, categories, month, year}: CalendarMonthProps) {
  //const today = new Date();
   const referenceDate = new Date(year, month, 1);

  // Compute all dates to display (covers entire weeks)
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dates = useMemo(() => {
    let days: Date[] = [];
    let d = calendarStart;
    while (d <= calendarEnd) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  }, [calendarStart, calendarEnd]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Month View</h2>
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].map(day => (
          <div key={day} className="bg-gray-100 py-1 text-center font-medium text-xs">
            {day}
          </div>
        ))}
        {dates.map((date, i) => {
          const appts = filterAppointments(date);
          return (
            <div
              key={i}
              className={`min-h-[100px] p-1 border border-gray-200 bg-white relative ${
                isSameMonth(date, referenceDate) ? "" : "bg-gray-50 text-gray-400"
              }`}
            >
              <div className="text-xs absolute right-2 top-1">{format(date, "d")}</div>
              <div className="flex flex-col gap-1 mt-5">
               {appts.map(appt => (
                <div key={appt.id}>
                <div className="font-semibold text-xs">{appt.title}</div>
                <div className="text-[10px] text-gray-500">
                 {format(new Date(appt.start), "HH:mm")} - {format(new Date(appt.end), "HH:mm")}
                </div>
             <AppointmentHoverCard
               appointment={appt}
              patients={patients}
               categories={categories}
             />
             </div>
              ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}