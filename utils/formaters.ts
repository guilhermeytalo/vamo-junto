export function toUpper(input: string): string {
    return input.toUpperCase();
}

// format to uppercase only the first letter
export function toUpperFirst(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}
