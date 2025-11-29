export function RequiredFieldsNotice() {
  return (
    <div className="mb-6 rounded-lg bg-blue-50 p-4">
      <p className="text-sm">
        <span className="font-semibold">Campos requeridos</span>{" "}
        <span className="text-red-500">*</span>
      </p>
      <p className="text-sm text-muted-foreground">
        Los campos con el asterisco en rojo son obligatorios, así que
        deberá de proporcionarlos para que el formulario se envíe
        correctamente.
      </p>
    </div>
  );
}