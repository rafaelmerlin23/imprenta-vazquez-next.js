import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

export type LoadingSpinnerProps = {
  /** "inline" shows a compact spinner that fits inside layout. "overlay" shows a full-screen centered overlay. */
  variant?: "inline" | "overlay";
  /** Optional helper text shown next to / below the spinner */
  text?: string;
  /** size multiplier (px). Default 28 */
  size?: number;
  /** show / hide the component */
  visible?: boolean;
};

/**
 * LoadingSpinner
 *
 * Un componente de carga ligero y accesible que sigue el estilo del proyecto
 * - Tailwind + rounded corners
 * - Sombras suaves y spacing consistente
 * - Usa lucide-react para el icono y framer-motion para una entrada suave
 *
 * Props:
 *  - variant: "inline" | "overlay" (default: inline)
 *  - text: texto opcional
 *  - size: tamaño del icono en px (default 28)
 *  - visible: mostrar/ocultar (default true)
 *
 * Uso:
 *  import LoadingSpinner from "./LoadingSpinner";
 *  <LoadingSpinner variant="overlay" text="Procesando..." />
 */
export default function LoadingSpinner({
  variant = "overlay",
  text,
  size = 28,
  visible = true,
}: LoadingSpinnerProps) {
  if (!visible) return null;

  if (variant === "overlay") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        aria-hidden={false}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          role="status"
          aria-live="polite"
          className="relative z-10 flex w-[min(90%,520px)] max-w-xl flex-col items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4">
              <Loader2 
                className="animate-spin text-blue-600 dark:text-blue-400" 
                style={{ width: size, height: size }} 
              />
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              {text || "Cargando..."}
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
            Por favor espera mientras procesamos tu solicitud.
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // inline variant - ahora centrado con mejor presentación
  return (
    <div className="flex items-center justify-center w-full min-h-[200px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-3"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl"></div>
          <div className="relative flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 p-4 shadow-lg">
            <Loader2 
              className="animate-spin text-white" 
              style={{ width: size, height: size }} 
            />
          </div>
        </div>
        {text && (
          <span className="text-base font-medium text-gray-700 dark:text-gray-300">
            {text}
          </span>
        )}
      </motion.div>
    </div>
  );
}