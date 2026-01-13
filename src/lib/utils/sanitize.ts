import DOMPurify from "isomorphic-dompurify";

export function sanitizeString(input: string): string {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
}

export function sanitizeEmail(email: string): string {
    return sanitizeString(email.toLowerCase());
}

export function sanitizeObject<T extends Record<string, any>>(
    obj: T,
    fieldsToSanitize: (keyof T)[]
): T {
    const sanitized = { ...obj };

    for (const field of fieldsToSanitize) {
        if (typeof sanitized[field] === "string") {
            sanitized[field] = sanitizeString(sanitized[field] as string) as T[keyof T];
        }
    }

    return sanitized;
}
