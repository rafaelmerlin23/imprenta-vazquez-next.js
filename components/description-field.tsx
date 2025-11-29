import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  value: string;
  isEditable: boolean;
  onChange: (value: string) => void;
}

export function DescriptionField({ value, isEditable, onChange }: DescriptionFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">
        Descripción {isEditable && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id="description"
        placeholder="Descripción específica del pedido"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditable}
      />
    </div>
  );
}