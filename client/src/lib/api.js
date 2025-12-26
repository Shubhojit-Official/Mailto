const API_BASE = "http://localhost:3000/api/v1";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { token }),
      ...options.headers,
    },
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    throw error;
  }

  return data;
}
