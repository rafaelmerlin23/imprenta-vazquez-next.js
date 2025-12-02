import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = {
  1: "Impresión",
  2: "Varios",
};

interface BasicInfoFieldsProps {
  formData: any;
  isEditable: boolean;
  onChange: (field: string, value: any) => void;
}

export function BasicInfoFields({ formData, isEditable, onChange }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">
          Nombre de la solicitud {isEditable && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="name"
          placeholder="Solicitud de impresión para Juan Pérez"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          disabled={!isEditable}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">
            Tipo {isEditable && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => onChange('category_id', value)}
            disabled={!isEditable}
          >
            <SelectTrigger className="w-full" id="category">
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categories).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">
            Cantidad {isEditable && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="quantity"
            type="number"
            placeholder="Ingrese la cantidad"
            value={formData.quantity}
            onChange={(e) => onChange('quantity', parseInt(e.target.value))}
            disabled={!isEditable}
          />
        </div>
      </div>
    </>
  );
}