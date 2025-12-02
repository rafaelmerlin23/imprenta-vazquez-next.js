import { FileText } from "lucide-react";

interface UserInfoProps {
  userName?: string;
}

export function UserInfo({ userName = "Juan Pérez" }: UserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-primary p-2">
        <FileText className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-bold">Solicitud</h1>
        <p className="text-sm text-muted-foreground">{userName}</p>
      </div>
    </div>
  );
}