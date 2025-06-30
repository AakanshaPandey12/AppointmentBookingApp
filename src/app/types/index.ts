// /types/index.ts
export type UUID = string;
export type Appointment = {
  id?: UUID;
  title: string;
  start: string;
  end: string;
  category?: UUID;
  patient?: UUID;
  location?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Category = {
  id: UUID;
  label: string;
  description?: string;
  color: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
};

export type Patient = {
  id: UUID;
  firstname: string;
  lastname: string;
  birth_date?: string;
  care_level?: number;
  pronoun?: string;
  email?: string;
  active?: boolean;
  active_since?: string;
  created_at?: string;
};


export type FullAppointmentData = {
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
};