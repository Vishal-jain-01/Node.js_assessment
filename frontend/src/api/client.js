const API_BASE = import.meta.env.VITE_API_BASE || '';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const fetchCrmDashboard = () => request('/api/crm/dashboard');
export const fetchCrmLeads = () => request('/api/crm/leads');
export const fetchCrmDeals = () => request('/api/crm/deals');
export const fetchCrmPipeline = () => request('/api/crm/pipeline');
export const fetchAttendance = () => request('/api/attendance');
export const sendWhatsAppMessage = (payload) =>
  request('/api/whatsapp', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
