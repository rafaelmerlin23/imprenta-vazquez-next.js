"use client";
import { PrintRequest } from "@/lib/mock-data";
import { useState, useCallback } from "react";

export function usePrintRequestForm(initialData: PrintRequest, initialMode = "show") {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState<PrintRequest>({
      id: initialData.id ?? "",
      customer_id: initialData.customer_id ?? "",
      name: initialData.name ?? "",
      type_receipt_id: initialData.type_receipt_id ?? "",
      paper_size: initialData.paper_size ?? "",
      paper_type: initialData.paper_type ?? "",
      quantity: initialData.quantity ?? 0,
      copies_number: initialData.copies_number ?? "",
      folio: initialData.folio ?? "",
      copies_colors: initialData.copies_colors ?? [],
      tint_colors: initialData.tint_colors ?? [],
      file_path: initialData.file_path ?? "",
      description: initialData.description ?? "",
      status: initialData.status ?? "",
      estimated_time: initialData.estimated_time ?? "",
      quotation: initialData.quotation ?? undefined,
      payment_method: initialData.payment_method ?? undefined,
      is_paid_in_full: initialData.is_paid_in_full ?? false,
      advance: initialData.advance ?? 0,
      payment_proof: initialData.payment_proof ?? "",
      created_at: initialData.created_at ?? "",
      updated_at: initialData.updated_at ?? "",
      customer: initialData.customer ?? undefined,
  });

  const isEditable = mode === "edit";

  const handleCheckboxChange = useCallback((field: keyof PrintRequest, value: number) => {
    if (!isEditable) return;

    setFormData(prev => {
      const currentValues = prev[field] as unknown as number[] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: number) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  }, [isEditable]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return;
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file_path: file }));
    }
  }, [isEditable]);

  return {
    mode,
    setMode,
    formData,
    setFormData,
    isEditable,
    handleCheckboxChange,
    handleFileChange
  };
}