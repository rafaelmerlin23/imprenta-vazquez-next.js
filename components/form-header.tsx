import { UserInfo } from "./user-info";
import { ActionButtons } from "./action-buttons";

interface FormHeaderProps {
  mode: string;
  onModeToggle: () => void;
  onDelete: () => void;
  userName?: string;
}

export function FormHeader({ 
  mode, 
  onModeToggle, 
  onDelete,
  userName = "Juan Péreeeeeez" 
}: FormHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <UserInfo userName={userName} />
        <ActionButtons 
          mode={mode}
          onModeToggle={onModeToggle}
          onDelete={onDelete}
        />
      </div>
    </header>
  );
}