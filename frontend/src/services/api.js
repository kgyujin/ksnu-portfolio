const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ksnu-portfolio-production.up.railway.app';

export const commentAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/comments`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
  },

  async create(commentData) {
    const response = await fetch(`${API_BASE_URL}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  },

  async update(id, commentData) {
    const response = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
  },

  async delete(id, password) {
    const response = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `${response.status}: Failed to delete comment`);
    }
    return response.json();
  }
};

export const statsAPI = {
  async recordVisit() {
    try {
      await fetch(`${API_BASE_URL}/api/stats/visit`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to record visit:', error);
    }
  }
};
