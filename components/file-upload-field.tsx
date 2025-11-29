import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload } from "lucide-react";

interface FileUploadFieldProps {
  file: any;
  isEditable: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadField({ file, isEditable, onChange }: FileUploadFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="file_path">
        Documento de impresión {isEditable && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex items-center gap-4">
        {isEditable ? (
          <>
            <Input
              id="file_path"
              type="file"
              onChange={onChange}
              className="hidden"
            />
            <Label
              htmlFor="file_path"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
            >
              <Upload className="h-4 w-4" />
              Selecciona un archivo
            </Label>
          </>
        ) : (
          <div className="flex items-center gap-2 rounded-md border border-input bg-muted px-4 py-2 text-sm">
            <FileText className="h-4 w-4" />
            Archivo cargado
          </div>
        )}
        {file && (
          <span className="text-sm text-muted-foreground">
            {file.name}
          </span>
        )}
      </div>
    </div>
  );
}