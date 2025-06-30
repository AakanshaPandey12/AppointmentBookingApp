"use client";
import React from "react";
import { addDays, startOfWeek, isSameDay, format, getHours, getMinutes, differenceInMinutes } from "date-fns";
import { Appointment, Patient, Category } from "../types";
import { AppointmentHoverCard } from "./AppointmentHoverCard";

type CalendarTimeGridWeekProps = {
  referenceDate: Date;
  appointments: Appointment[];
   patients: Patient[];
  categories: Category[];
};
const WEEKDAYS_DE = [
  "Montag",     // 0 = Monday for weekStartsOn: 1
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];




const START_HOUR = 8;
const END_HOUR = 18; // 8am to 5pm
const SLOT_MINUTES = 60; // use 60 for hourly slots, 30 for half-hour slots

// Generate all time slots in a day (e.g. 8:00, 8:30, ... 17:30)
function getTimeSlots() {
  const slots = [];
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    for (let min = 0; min < 60; min += SLOT_MINUTES) {
      slots.push({ hour, min });
    }
  }
  return slots;
}
const SLOTS = getTimeSlots();

export function CalendarTimeGridWeek({ referenceDate, appointments, patients, categories }: CalendarTimeGridWeekProps) {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
     const today = new Date();
     
const todayIdx = days.findIndex(day =>
  day.getDate() === today.getDate() &&
  day.getMonth() === today.getMonth() &&
  day.getFullYear() === today.getFullYear()
);
  const renderedAppointments: { [key: string]: boolean } = {};

  // Helper: Find appointment starting at this slot
  function getAppointmentStartingAt(day: Date, hour: number, min: number) {
    return appointments.find(appt => {
      const start = new Date(appt.start);
      return (
        isSameDay(day, start) &&
        getHours(start) === hour &&
        getMinutes(start) === min
      );
    });


  }

  // Calculate how many slots this appointment spans
  function calcRowSpan(appt: Appointment) {
    const start = new Date(appt.start);
    const end = new Date(appt.end);
    const mins = Math.max(differenceInMinutes(end, start), SLOT_MINUTES);
    return Math.ceil(mins / SLOT_MINUTES);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">
        Week Grid View ({format(weekStart, "dd.MM")} - {format(addDays(weekStart, 6), "dd.MM.yyyy")})
      </h2>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="bg-white py-1 text-center font-medium text-xs"></div>
          {days.map((day, idx) => ( 
          <div
            key={day.toISOString()}
              className={`py-1 text-center font-medium text-xs ${
             idx === todayIdx ? "bg-green-100 text-green-900" : "bg-gray-100"
             }`}>
            
           {WEEKDAYS_DE[idx]}, {format(day, "dd.MM")}
           </div>
          ))}
          {/* Time grid */}
          {SLOTS.map(({ hour, min }) => (
            <React.Fragment key={hour + ":" + min}>
              {/* Time Y-axis label */}
              <div className="min-h-[50px] bg-white py-3 text-center text-xs font-bold whitespace-nowrap">
                {hour.toString().padStart(2, "0")}:{min.toString().padStart(2, "0")}
              </div>
              {days.map((day, idx) => {
              //  const isToday = idx === todayIdx;
                const appt = getAppointmentStartingAt(day, hour, min);

                if (appt && typeof appt.id === "string" && appt.id !== "" && !renderedAppointments[appt.id]) {
                  renderedAppointments[appt.id] = true;
                  const rowSpan = calcRowSpan(appt);

                  return (
                <div
                      key={day.toISOString() + hour + ":" + min}
                      className="bg-gray-50 border border-gray-1 px-1 relative"
                      style={{ gridRow: `span ${rowSpan}` }}
                    >
                   <div
  key={day.toISOString() + hour + ":" + min}
  className="relative px-1 py-0 h-full"
  style={{
    gridRow: `span ${rowSpan}`,
    minHeight: `${rowSpan * 55}px`, // or whatever you want for vertical size
    display: "flex",
    alignItems: "stretch",
  }}
>
  <AppointmentHoverCard
    appointment={appt}
      patients={patients}
  categories={categories}
    className="w-full h-full bg-purple-200 border-l-4 border-purple-500 rounded-lg shadow-sm p-2 flex flex-col justify-center"
  />
</div>
               </div>

                  );
                }
                // If an appointment was rendered spanning this row, leave empty
                if (
                  appointments.some(appt => {
                    if (      appt &&
      typeof appt.id === "string" &&
      appt.id !== "" && renderedAppointments[appt.id]) {
                      const start = new Date(appt.start);
                      const rowSpan = calcRowSpan(appt);
                      const slotStart =
                        (getHours(start) - START_HOUR) * (60 / SLOT_MINUTES) +
                        getMinutes(start) / SLOT_MINUTES;
                      const currentSlot =
                        (hour - START_HOUR) * (60 / SLOT_MINUTES) +
                        min / SLOT_MINUTES;
                      return (
                        isSameDay(day, start) &&
                        currentSlot > slotStart &&
                        currentSlot < slotStart + rowSpan
                      );
                    }
                    return false;
                  })
                ) {
                  return null; // Do not render anything for spanned rows
                }
                // Otherwise, render empty cell
                return (
                  <div
                    key={day.toISOString() + hour + ":" + min}
                  className={`min-h-[50px] px-1 ${
             idx === todayIdx ? "bg-green-100  " : "bg-gray-50"
             }`}>
                </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
