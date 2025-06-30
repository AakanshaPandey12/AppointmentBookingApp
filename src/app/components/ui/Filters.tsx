"use client";
import { useState } from "react";
import { Category, Patient } from "../../types";
import {Button} from  "@/app/components/ui/button";

type FiltersType = {
  category?: string;
  patient?: string;
  from?: string;
  to?: string;
};

type FiltersProps = {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  categories: { id: string; label: string }[];

};
 
export function Filters({ filters, setFilters, categories }: FiltersProps) {
  //const [categories, setCategories] = useState<Category[]>([]);
  return (
    <div className="flex flex-wrap gap-3 mb-4 items-end">
      <div>
        <label className="block text-xs font-medium mb-1">Category</label>
        <select
          value={filters.category || ""}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>
  
      <div>
        <label className="block text-xs font-medium mb-1">From</label>
        <input
          type="date"
          value={filters.from || ""}
          onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
          className="border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">To</label>
        <input
          type="date"
          value={filters.to || ""}
          onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
          className="border rounded px-2 py-1"
        />
      </div>
      <Button variant="outline" onClick={() => setFilters({})}>Clear</Button>
    </div>
  );
}
