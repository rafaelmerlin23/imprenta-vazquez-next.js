import { Label } from "@/components/ui/label";
import { ColorCheckbox } from "./color-checkbox";
import { copiesColors, tintColors } from "@/lib/colors";
import { PrintRequest } from "@/lib/mock-data";

interface ColorSelectionSectionProps {
  formData: any;
  isEditable: boolean;
  onCheckboxChange: (field: keyof PrintRequest, value: number) => void;
  type: "tint" | "copies";
}

export function ColorSelectionSection({ 
  formData, 
  isEditable, 
  onCheckboxChange,
  type = "tint" 
}: ColorSelectionSectionProps) {
  const colors = type === "tint" ? tintColors : copiesColors;
  const field = type === "tint" ? "tint_colors" : "copies_colors";
  
  if (type === "copies" && formData.category_id !== "1") return null;

  return (
    <div className="space-y-2">
      <Label>
        Color de {type === "tint" ? "tintas" : "papel por copia"}{" "}
        {isEditable && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(colors).map(([key, value]) => (
          <ColorCheckbox
            key={key}
            id={`${type}-color-${key}`}
            label={value}
            checked={formData[field]?.includes(parseInt(key))}
            onCheckedChange={() => onCheckboxChange(field, parseInt(key))}
            disabled={!isEditable}
          />
        ))}
      </div>
    </div>
  );
}