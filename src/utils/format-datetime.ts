export function formatDate(dateInput: string | Date | number): string {
  if (!dateInput) return 'N/A';

  return new Date(dateInput).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}