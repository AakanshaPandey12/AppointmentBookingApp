"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { createClient } from '@supabase/supabase-js';

type Appointment = {
  id: string;
  title: string;
  start: string;
  end: string;
  patient?: string;
  category?: string;
  location?: string;
  notes?: string;
};

export default function AppointmentsViewer() {

    
  const [appointments, setAppointments] = useState<Appointment[]>([]);

useEffect(() => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments") // ✅ Use correct table name here
      .select("*")
      .limit(100);

    if (error) {
      console.error("❌ Error fetching appointments:", error);
    } else {
      console.log("✅ Appointments fetched:", data);
      setAppointments(data);
    }
  };

  fetchAppointments();
}, []);
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Appointments (First 100)</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Start</th>
            <th className="border px-2 py-1">End</th>
            <th className="border px-2 py-1">Patient</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td className="border px-2 py-1">{appt.id}</td>
              <td className="border px-2 py-1">{appt.title}</td>
              <td className="border px-2 py-1">{new Date(appt.start).toLocaleString()}</td>
              <td className="border px-2 py-1">{new Date(appt.end).toLocaleString()}</td>
              <td className="border px-2 py-1">{appt.patient || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
