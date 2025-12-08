import { AlertCircle, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RejectionAlertProps {
  requestId: string;
  reasonRejection?: string;
}

const RejectionAlert = ({ requestId, reasonRejection }: RejectionAlertProps) => {
  const router = useRouter();

  return (
    <Card className="shadow-md border-2 border-red-300 bg-linear-to-br from-red-50 to-rose-50">
      <CardHeader className="-mb-6">
        <CardTitle className="text-lg flex items-center gap-2 text-red-900">
          <AlertCircle className="h-5 w-5 text-red-600" />
          Solicitud Denegada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <p className="text-sm text-red-800 font-medium">
          Esta solicitud ha sido denegada y necesita ser editada antes de poder procesarse.
        </p>
        
        {reasonRejection && (
          <div className="p-4 bg-white rounded-lg border border-red-200">
            <p className="text-xs text-red-600 font-semibold mb-2 uppercase tracking-wide">
              Motivo del rechazo:
            </p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {reasonRejection}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RejectionAlert;