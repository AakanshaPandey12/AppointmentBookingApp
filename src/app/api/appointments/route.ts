import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs
import { NextRequest } from 'next/server';

// Create Supabase server client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ GET appointments
export async function GET() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .limit(100);

  if (error) {
    console.error("Error fetching appointments:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}

// ✅ POST: create patient and appointment
export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    firstname,
    lastname,
    pronoun,
    email,
    category,
    title,
    start,
    end,
    location,
    notes
  } = body;

  // 1. Insert Patient
  const patientId = uuidv4();

  const { error: patientError } = await supabase
    .from('patients')
    .insert([{
      id: patientId,
      firstname,
      lastname,
      pronoun,
      email,
      active: true,
      active_since: new Date().toISOString(),
    }]);

  if (patientError) {
    console.error("Error inserting patient:", patientError);
    return new Response(JSON.stringify({ error: patientError.message }), { status: 500 });
  }

  // 2. Insert Appointment
  const appointmentId = uuidv4();

  const { error: apptError } = await supabase
    .from('appointments')
    .insert([{
      id: appointmentId,
      title,
      start,
      end,
      category,
      patient: patientId,
      location,
      notes,
      created_at: new Date().toISOString(),
    }]);

  if (apptError) {
    console.error("Error inserting appointment:", apptError);
    return new Response(JSON.stringify({ error: apptError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Appointment and patient created successfully.' }), {
    headers: { "Content-Type": "application/json" },
    status: 201
  });
}
export async function PUT(req: Request) {
  const { appointment, patient } = await req.json();

  if (!appointment.id || !appointment.patient) {
    return new Response(JSON.stringify({ error: "Missing IDs for update" }), { status: 400 });
  }

  // 1. Update patient
  const { error: patientError } = await supabase
    .from("patients")
    .update({
      firstname: patient.firstname,
      lastname: patient.lastname,
      email: patient.email,
      pronoun: patient.pronoun,
    })
    .eq("id", appointment.patient);

  if (patientError) {
    console.error("Failed to update patient", patientError);
    return new Response(JSON.stringify({ error: patientError.message }), { status: 500 });
  }

  // 2. Update appointment
  const { data: apptData, error: apptError } = await supabase
    .from("appointments")
    .update({
      title: appointment.title,
      start: appointment.start,
      end: appointment.end,
      category: appointment.category,
      location: appointment.location,
      notes: appointment.notes,
    })
    .eq("id", appointment.id)
    .select()
    .single();

  if (apptError) {
    console.error("Failed to update appointment", apptError);
    return new Response(JSON.stringify({ error: apptError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ appointment: apptData }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
