export const API_BASE = import.meta.env.VITE_API_URL as string;

export async function handleResponse(res: Response) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data.message || `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return res.json();
}
