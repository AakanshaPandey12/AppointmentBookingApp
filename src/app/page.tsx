"use client";

import { useEffect, useState } from "react";
import { Filters } from "./components/ui/Filters";
import { CalendarMonth } from "./components/CalenderMonth";
import { AppointmentList } from "./components/AppointmentList";
import { AppointmentDialog } from "./components/AppointmentDialog";
import { Appointment } from "./types";
import { Patient } from "./types";
import { Category } from "./types";
import { addDays, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addWeeks, isBefore, isSameWeek  } from "date-fns";
import { CalendarTimeGridWeek } from "./components/CalendarTimeGridWeek";
import { FullAppointmentData } from "./types";
import { AppointmentEditDialog } from "@/app/components/AppointmentEditDialog";

export type FiltersType = {
  category?: string;
  patient?: string;
  from?: string;
  to?: string;
};


export default function HomePage() {
  const [filters, setFilters] = useState<FiltersType>({});
  const [referenceDate, setReferenceDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"month" | "week" | "weekgrid" | "list">("month");
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); 
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth()); // 0 = January



  useEffect(() => {
  const fetchAllData = async () => {
    try {
      // Fetch all in parallel from your API routes
      const [aRes, pRes, cRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/patients"),
        fetch("/api/categories"),
      ]);

      // Parse the JSON responses
      const [appointmentsData, patientsData, categoriesData] = await Promise.all([
        aRes.json(),
        pRes.json(),
        cRes.json(),
      ]);

      // Set the states
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("❌ Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, []);


function handleEdit(appointment: Appointment) {
  setEditingAppt(appointment);
  setEditDialogOpen(true);
}

async function handleUpdateAppointment(appt: Appointment) {
  const res = await fetch("/api/appointments", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appointment: appt }),
  });

  const result = await res.json();

  if (!res.ok) {
    console.error("Failed to update:", result.error);
    return;
  }

  // Update local state
  setAppointments((prev) =>
    prev.map(a => a.id === appt.id ? result.appointment : a)
  );
}

async function handleSaveAppointment(flatData: {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  pronoun: string;
  category?: string;
  title?: string;
  start?: string;
  end?: string;
  location?: string;
  notes?: string;
}) {
  try {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flatData),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("❌ Failed to save appointment:", result.error);
      return;
    }

    // You can optionally re-fetch appointments instead of inserting manually
    
    alert("✅ Appointment saved successfully!"
    );
    setDialogOpen(false);
    setEditing(null);
  } catch (err) {
    console.error("❌ Network error while saving:", err);
  }
}

  function filterAppointmentsForDate(date: Date) {
    return appointments.filter(appt => {
      const apptDate = new Date(appt.start);
      let pass = true;
      if (filters.category && appt.category !== filters.category) pass = false;
      if (filters.patient && appt.patient !== filters.patient) pass = false;
      if (filters.from && apptDate < new Date(filters.from)) pass = false;
      if (filters.to && apptDate > new Date(filters.to)) pass = false;
      return pass && isSameDay(apptDate, date);
    });
  }

  function getFilteredAppointments() {
    return appointments.filter(appt => {
      const apptDate = new Date(appt.start);
      let pass = true;
      if (filters.category && appt.category !== filters.category) pass = false;
      if (filters.patient && appt.patient !== filters.patient) pass = false;
      if (filters.from && apptDate < new Date(filters.from)) pass = false;
      if (filters.to && apptDate > new Date(filters.to)) pass = false;
      return pass;
    });
  }

  // Utility to get all week starts for a month
function getAllWeekStartsInMonth(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = endOfMonth(firstOfMonth);
  const weekStarts: Date[] = [];
  let current = startOfWeek(firstOfMonth, { weekStartsOn: 1 });
  while (isBefore(current, lastOfMonth) || current.getTime() === lastOfMonth.getTime()) {
    weekStarts.push(current);
    current = addWeeks(current, 1);
  }
  return weekStarts;
}

  function filterAppointmentsForWeek(appointments: Appointment[], referenceDate: Date): Appointment[] {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });     // Sunday

  return appointments.filter(appt => {
    const apptDate = new Date(appt.start);
    return apptDate >= weekStart && apptDate <= weekEnd;
  });
}


  return (
    <main className="max-w-4xl mx-auto max-h-screen bg-white py-10 ">
      <h1 className="text-2xl font-bold mb-6">Vocare Demo Appointment App</h1>
      <div className="flex gap-2 mb-4">
  <select
    value={calendarMonth}
    onChange={e => setCalendarMonth(Number(e.target.value))}
    className="border rounded px-2 py-1"
  >
    {[
      "Januar", "Februar", "März", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Dezember"
    ].map((name, idx) => (
      <option key={idx} value={idx}>{name}</option>
    ))}
  </select>
  <select
    value={calendarYear}
    onChange={e => setCalendarYear(Number(e.target.value))}
    className="border rounded px-2 py-1"
  >
    {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i).map(yr => (
      <option key={yr} value={yr}>{yr}</option>
    ))}
  </select>
</div>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-3 py-1 rounded ${view === "month" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => setView("month")}
        >
          Monatlich
        </button>
        <button
          className={`px-3 py-1 rounded ${view === "weekgrid" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => setView("weekgrid")}
        >
          Woche
        </button>
        <button
          className={`px-3 py-1 rounded ${view === "list" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => setView("list")}
        >
          Liste
        </button>
        <div className="flex gap-4 ml-auto">
          <button
            className="px-3 py-1 rounded bg-black text-white"
            onClick={() => setShowFilters(v => !v)}
          >
            {showFilters ? "schließen filtern" : "Termin filtern"}
          </button>
          <button
            className="ml-auto px-3 py-1 rounded bg-green-500 text-white"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            + Neuer Termin
          </button>
        </div>
      </div>

      {showFilters && <Filters filters={filters} setFilters={setFilters} categories={categories || []} />}

      <div className="mb-8">
        {loading ? (
          <p>Loading appointments...</p>
        ) : view === "month" ? (
          <CalendarMonth filterAppointments={filterAppointmentsForDate}
                   patients={patients}           // ✅ add this
         categories={categories} 
           month={calendarMonth}
           year={calendarYear} />
        ) : view === "weekgrid" ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setReferenceDate(d => addDays(d, -7))} className="px-2">⬅️</button>
              <span className="font-medium">Week of {referenceDate.toLocaleDateString()}</span>
              <button onClick={() => setReferenceDate(d => addDays(d, 7))} className="px-2">➡️</button>
            </div>
            <CalendarTimeGridWeek 
            referenceDate={referenceDate} 
            appointments={filterAppointmentsForWeek(appointments, referenceDate)}
            patients={patients}           // ✅ add this
            categories={categories} />
          </>
        ) : (
        <AppointmentList
         appointments={getFilteredAppointments()}
         patients={patients}           // ✅ add this
         categories={categories}       // ✅ add this
         onEdit={(appt) => {
            setEditing(appt);        // ✅ Store selected appointment
            setDialogOpen(true);  
         }}
        />
        )}
      </div>
      <AppointmentEditDialog
      open={editDialogOpen}
      initial={editingAppt}
      onClose={() => {
      setEditDialogOpen(false);
      setEditingAppt(null);
      }}
     onSave={handleUpdateAppointment}
     categories={categories}  // ✅ Pass categories here
      />
      <AppointmentDialog
        open={dialogOpen}
        initial = {editing}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSave={handleSaveAppointment}
     />



    </main>
  );
}
