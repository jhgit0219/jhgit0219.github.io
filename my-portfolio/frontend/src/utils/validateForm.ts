// utils/validateForm.ts
export interface FormData {
  name: string;
  email: string;
  message: string;
}

export function isEmptyForm(
  fields: Record<string, string> | string[]
): boolean {
  if (Array.isArray(fields)) {
    return fields.some((val) => val.trim().length === 0);
  }

  return Object.values(fields).some((val) => val.trim().length === 0);
}
