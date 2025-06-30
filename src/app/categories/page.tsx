"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Category = {
  id: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
};

export default function CategoriesViewer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .limit(100);

      if (error) {
        console.error("❌ Error fetching categories:", error);
      } else {
        console.log("✅ Categories fetched:", data);
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Categories (First 100)</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Label</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Color</th>
            <th className="border px-2 py-1">Icon</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="border px-2 py-1">{cat.id}</td>
              <td className="border px-2 py-1">{cat.label}</td>
              <td className="border px-2 py-1">{cat.description || "-"}</td>
              <td className="border px-2 py-1">
                <span
                  className="inline-block w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: cat.color || "#00ff00" }}
                ></span>
                {cat.color}
              </td>
              <td className="border px-2 py-1">{cat.icon || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
