import { API_BASE, handleResponse } from './api';

export async function fetchMaterialsByVideo(token: string, videoId: number): Promise<Material[]> {
  const res = await fetch(`${API_BASE}/materials/video/${videoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}

export async function saveMaterialDetails(
  token: string,
  data: { videoId: number; name: string; url: string; publicId: string }
): Promise<Material> {
  const res = await fetch(`${API_BASE}/materials`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateMaterial(
  token: string,
  materialId: number,
  data: { name?: string; url?: string; publicId?: string }
): Promise<Material> {
  const res = await fetch(`${API_BASE}/materials/${materialId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteMaterial(token: string, materialId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/materials/${materialId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(res);
}
