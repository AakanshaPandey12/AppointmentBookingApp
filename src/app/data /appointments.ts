import { addDays, setHours, setMinutes } from "date-fns";
import { Appointment } from "../types";

export const appointments: Appointment[] = [
  {
    id: "1",
    title: "Initial Consultation",
    start: setHours(setMinutes(new Date(), 0), 10).toISOString(),
    end: setHours(setMinutes(new Date(), 0), 11).toISOString(),
    category: "health",
    patient: "1",
    location: "Room 101",
    notes: "Discuss health plan",
  },
  {
    id: "2",
    title: "Medication Delivery",
    start: setHours(setMinutes(addDays(new Date(), 1), 0), 9).toISOString(),
    end: setHours(setMinutes(addDays(new Date(), 1), 0), 9).toISOString(),
    category: "delivery",
    patient: "2",
    location: "Main Entrance",
    notes: "Bring new prescription",
  },
  {
    id: "3",
    title: "Family Meeting",
    start: setHours(setMinutes(addDays(new Date(), 2), 0), 12).toISOString(),
    end: setHours(setMinutes(addDays(new Date(), 2), 0), 17).toISOString(),
    category: "family",
    patient: "3",
    location: "Conference Room",
    notes: "Monthly update with relatives",
  },
];
