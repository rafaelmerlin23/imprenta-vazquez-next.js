import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ColorCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
  disabled?: boolean;
}

export function ColorCheckbox({ 
  id, 
  label, 
  checked, 
  onCheckedChange, 
  disabled = false 
}: ColorCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      <Label
        htmlFor={id}
        className={`font-normal ${disabled ? "cursor-default" : "cursor-pointer"}`}
      >
        {label}
      </Label>
    </div>
  );
}