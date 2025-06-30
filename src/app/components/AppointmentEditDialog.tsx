// components/AppointmentEditDialog.tsx
"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Appointment } from "../types";
import { Category } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (updated: Appointment) => void;
  initial: Appointment | null;
  categories: Category[];
};

export function AppointmentEditDialog({ open, onClose, onSave, initial, categories }: Props) {
  const [form, setForm] = useState<Appointment | null>(null);

  useEffect(() => {
    if (open && initial) {
      setForm(initial);
    }
  }, [open, initial]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => prev ? { ...prev, [name]: value } : null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form) {
      onSave(form);
    }
    onClose();
  }

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>Termin bearbeiten</DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="title" value={form.title} onChange={handleChange} className="input" />
          <input name="location" value={form.location} onChange={handleChange} className="input" />
          <textarea name="notes" value={form.notes} onChange={handleChange} className="input" />

          <input type="datetime-local" name="start" value={form.start.slice(0,16)} onChange={handleChange} />
          <input type="datetime-local" name="end" value={form.end.slice(0,16)} onChange={handleChange} />

          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>

          <Button type="submit">Speichern</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
