const API_BASE = "http://localhost:5000/api"; // change when deploying

export const testAPI = async () => {
  const res = await fetch(`${API_BASE}/test`);
  const data = await res.json();
  return data;
};
