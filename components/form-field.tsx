import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  input: ReactNode;
}

export function FormField({ label, required = false, input }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {input}
    </div>
  );
}