"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Appointment } from "../types";
import { Category } from "../types";
import { FullAppointmentData } from "../types";

const PRONOUNS = ["Er", "Sie", "They/Them", "Andere"];



type AppointmentDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: FullAppointmentData) => void; // will pass merged patient + appointment
  initial?: Appointment | null;
};

export function AppointmentDialog({ open, onClose, onSave, initial }: AppointmentDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Appointment | null>(null);
  const [patientInfo, setPatientInfo] = useState({
    firstname: "",
    lastname: "",
    pronoun: "",
    email: "",
  });

  // Fetch categories from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }

    fetchCategories();
  }, []);

  // Initialize form after categories loaded or on dialog open
  useEffect(() => {
    if (!open) return;

    if (initial) {
      setForm(initial);
      
    } else if (categories.length > 0) {
      setForm({
        id: Math.random().toString(36).substring(2),
        title: "",
        start: new Date().toISOString(),
        end: new Date().toISOString(),
        category: categories[0].id,
        location: "",
        notes: "",
      });
    }
  }, [initial, categories, open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;

    if (["firstname", "lastname", "email", "pronoun"].includes(name)) {
      setPatientInfo(prev => ({ ...prev, [name]: value }));
    } else {
      setForm(f => f ? { ...f, [name]: value } : f);
    }
  }



/*function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!form) return;

  const fullData: FullAppointmentData = {
    appointment: form,
    patient: patientInfo,
  };

  onSave(fullData); // ✅ send to parent
  onClose();
}*/


 function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!form) {
    console.error("🚨 Cannot submit: form is null");
    return;
  }
  const payload = {
    // Patient details
    firstname: patientInfo.firstname,
    lastname: patientInfo.lastname,
    pronoun: patientInfo.pronoun,
    email: patientInfo.email,
    category: form.category, // 🟢 Must be a UUID string (from category dropdown)

   // Appointment details
    title: form.title,
    start: form.start,
    end: form.end,

    location: form.location,
    notes: form.notes,
  };
    // Optionally reset the form or refresh data
    onSave(payload);
    onClose();
    
  
} 


  // While form is null (categories not yet fetched), skip render
  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogTitle>{initial ? "Edit Appointment" : "Book Appointment"}</DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Treatment Title"
            required
            className="border rounded px-2 py-1 w-full"
          />

          <select
            name="pronoun"
            value={patientInfo.pronoun}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Select Pronoun</option>
            {PRONOUNS.map(pr => (
              <option key={pr} value={pr}>{pr}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              name="firstname"
              value={patientInfo.firstname}
              onChange={handleChange}
              placeholder="First Name"
              className="border rounded px-2 py-1 w-full"
            />
            <input
              name="lastname"
              value={patientInfo.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <input
            name="email"
            value={patientInfo.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded px-2 py-1 w-full"
          />

          <div className="flex gap-2">
            <input
              type="datetime-local"
              name="start"
              value={form.start.slice(0, 16)}
              onChange={handleChange}
              required
              className="border rounded px-2 py-1 w-full"
            />
            <input
              type="datetime-local"
              name="end"
              value={form.end.slice(0, 16)}
              onChange={handleChange}
              required
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="border rounded px-2 py-1 w-full"
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Treatment Description"
            className="border rounded px-2 py-1 w-full"
          />

          <div className="flex gap-2 mt-2">
            <Button type="submit">{initial ? "Save" : "Create"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
