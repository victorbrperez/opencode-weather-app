export function ask(message: string): string {
  return (prompt(message) ?? "").trim();
}

export function pause(): void {
  prompt("\nPresiona Enter para continuar...");
}
