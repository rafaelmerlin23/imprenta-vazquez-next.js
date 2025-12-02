import { Input } from "@/components/ui/input";
import { FormField } from "./form-field";

interface PrintingFieldsProps {
  formData: any;
  isEditable: boolean;
  onChange: (field: string, value: any) => void;
}

export function PrintingFields({ formData, isEditable, onChange }: PrintingFieldsProps) {
  if (formData.category_id !== "1") return null;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          label="Número de copias"
          required={isEditable}
          input={
            <Input
              type="number"
              min="1"
              value={formData.copies_number}
              onChange={(e) => onChange('copies_number', e.target.value)}
              disabled={!isEditable}
            />
          }
        />
        <FormField
          label="Folio"
          required={isEditable}
          input={
            <Input
              value={formData.folio}
              onChange={(e) => onChange('folio', e.target.value)}
              disabled={!isEditable}
            />
          }
        />
      </div>
    </>
  );
}