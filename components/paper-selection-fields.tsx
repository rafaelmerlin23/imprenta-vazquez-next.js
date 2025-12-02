import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const paperSizes = {
  1: "1/8 de carta",
  2: "1/6 de carta",
  3: "1/4 de carta",
  4: "1/4 de oficio",
  5: "1/2 de carta",
  6: "1/2 de oficio",
  7: "Tamaño carta",
  8: "Tamaño oficio",
  9: "Tamaño especial",
};

const paperTypes = {
  1: "Papel bond",
  2: "Papel autocopiante",
  3: "Cartulina",
};

interface PaperSelectionFieldsProps {
  formData: any;
  isEditable: boolean;
  onChange: (field: string, value: any) => void;
}

export function PaperSelectionFields({ formData, isEditable, onChange }: PaperSelectionFieldsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="paper_size">
          Tamaño de papel {isEditable && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={formData.paper_size}
          onValueChange={(value) => onChange('paper_size', value)}
          disabled={!isEditable}
        >
          <SelectTrigger className="w-full" id="paper_size">
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(paperSizes).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paper_type">
          Tipo de papel {isEditable && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={formData.paper_type}
          onValueChange={(value) => onChange('paper_type', value)}
          disabled={!isEditable}
        >
          <SelectTrigger className="w-full" id="paper_type">
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(paperTypes).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}