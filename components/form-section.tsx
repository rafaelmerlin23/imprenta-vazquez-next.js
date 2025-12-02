import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface FormSectionProps {
  children: ReactNode;
  title: string;
  description: string;
  actionButtons?: ReactNode;
}

export function FormSection({ children, title, description, actionButtons }: FormSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="mt-2">{description}</CardDescription>
        </div>
        {actionButtons && (
          <div className="flex gap-2">{actionButtons}</div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}