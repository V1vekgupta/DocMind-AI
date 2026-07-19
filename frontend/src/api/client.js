const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const TOKEN_KEY = "docmind_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, isMultipart = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let payload = body;
  if (body && !isMultipart) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: payload,
  });

  if (response.status === 204) {
    return null;
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && data.message) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data;
}

export const api = {
  // -- Auth ---------------------------------------------------------------
  register: (fullName, email, password) =>
    request("/api/auth/register", { method: "POST", body: { fullName, email, password } }),
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/api/auth/me"),

  // -- PDFs -----------------------------------------------------------------
  listPdfs: () => request("/api/pdfs"),
  getPdf: (pdfId) => request(`/api/pdfs/${pdfId}`),
  uploadPdf: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/api/pdfs/upload", { method: "POST", body: formData, isMultipart: true });
  },
  deletePdf: (pdfId) => request(`/api/pdfs/${pdfId}`, { method: "DELETE" }),

  // -- Conversations / chat --------------------------------------------------
  listConversations: () => request("/api/conversations"),
  getConversation: (conversationId) => request(`/api/conversations/${conversationId}`),
  deleteConversation: (conversationId) =>
    request(`/api/conversations/${conversationId}`, { method: "DELETE" }),
  createConversation: (pdfId, title) =>
    request(`/api/pdfs/${pdfId}/conversations`, { method: "POST", body: { title } }),
  askQuestion: (pdfId, { question, conversationId, responseStyle, webSearch }) =>
    request(`/api/pdfs/${pdfId}/chat`, {
      method: "POST",
      body: { question, conversationId, responseStyle, webSearch },
    }),
};

export { ApiError };
