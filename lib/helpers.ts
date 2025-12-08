import { TypeReceipt } from "@/lib/types";
export const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const getFileName = (filepath: string | File | null) => {
    if (typeof filepath === "string") {
        return filepath.split("/").pop() || "archivo";
    }
    if (filepath instanceof File) {
        return filepath.name || "archivo";
    }
    return "archivo";
};

export const isPrintingType = (typeReceipt: string, typeReceipts: TypeReceipt[]): boolean => {
    if (!typeReceipt) return false;
    const selectedType = typeReceipts.find((tr) => tr.id === typeReceipt);
    return selectedType?.receipt_category === "Impresión";
};