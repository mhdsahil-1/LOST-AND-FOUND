import { storageService } from './storageService';

const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Fetch items with optional filters
  async getItems(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.posted_by) params.append('posted_by', filters.posted_by);

      const url = `${API_BASE}/items${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const items = await res.json();
        // Sync to local cache
        storageService.saveItems(items);
        return items;
      }
    } catch {
      // Fallback to local storage if server not running
    }
    return storageService.getItems();
  },

  // Fetch single item
  async getItemById(id) {
    try {
      const res = await fetch(`${API_BASE}/items/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const items = storageService.getItems();
    return items.find((i) => String(i.id) === String(id)) || null;
  },

  // Create new item (supports multipart form for photo uploads or json)
  async addItem(itemData, imageFile = null) {
    try {
      let res;
      if (imageFile) {
        const formData = new FormData();
        Object.keys(itemData).forEach((key) => {
          if (itemData[key] !== undefined && itemData[key] !== null) {
            formData.append(key, itemData[key]);
          }
        });
        formData.append('image', imageFile);

        res = await fetch(`${API_BASE}/items`, {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch(`${API_BASE}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData)
        });
      }

      if (res.ok) {
        const data = await res.json();
        return data.item;
      }
    } catch {
      // Fallback
    }

    // Local fallback
    const items = storageService.getItems();
    const newItem = {
      id: Date.now(),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...itemData
    };
    storageService.saveItems([newItem, ...items]);
    return newItem;
  },

  // Update item status
  async updateStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/items/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        return data.item;
      }
    } catch {
      // Fallback
    }

    const items = storageService.getItems();
    const updated = items.map((i) => (String(i.id) === String(id) ? { ...i, status } : i));
    storageService.saveItems(updated);
    return updated.find((i) => String(i.id) === String(id));
  },

  // Submit claim
  async claimItem(id, claimPayload) {
    try {
      const res = await fetch(`${API_BASE}/items/${id}/claim`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimPayload)
      });
      if (res.ok) {
        const data = await res.json();
        return data.item;
      }
    } catch {
      // Fallback
    }

    const items = storageService.getItems();
    const updated = items.map((i) =>
      String(i.id) === String(id)
        ? {
            ...i,
            status: 'claimed',
            claimed_by: claimPayload.claimed_by,
            claimed_contact: claimPayload.claimed_contact,
            claim_note: claimPayload.claim_note,
            claimed_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        : i
    );
    storageService.saveItems(updated);
    return updated.find((i) => String(i.id) === String(id));
  },

  // Delete item
  async deleteItem(id) {
    try {
      const res = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    const items = storageService.getItems();
    const filtered = items.filter((i) => String(i.id) !== String(id));
    storageService.saveItems(filtered);
    return true;
  },

  // Admin: verify post (approve or reject)
  async verifyItem(id, approve = true) {
    try {
      const res = await fetch(`${API_BASE}/admin/verify/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: approve ? 'approve' : 'reject' })
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    if (approve) {
      await this.updateStatus(id, 'open');
    } else {
      await this.deleteItem(id);
    }
    return true;
  },

  // Student auth
  async loginStudent(name) {
    try {
      const res = await fetch(`${API_BASE}/auth/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const data = await res.json();
        storageService.saveUser(data.user);
        return data.user;
      }
    } catch {
      // Fallback
    }

    const cleanName = name.trim();
    const studentUser = {
      id: Date.now(),
      name: cleanName,
      email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@campus.edu`,
      studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'student',
      avatar: cleanName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    };
    storageService.saveUser(studentUser);
    return studentUser;
  },

  // Admin auth
  async loginAdmin(username, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        storageService.saveUser(data.user);
        return { success: true, user: data.user };
      }
      const errData = await res.json();
      return { success: false, error: errData.error || 'Authentication failed' };
    } catch {
      // Fallback
    }

    if (username.trim() === 'admin' && password.trim() === 'admin123') {
      const adminUser = {
        id: 1,
        name: 'Campus Admin (Proctor)',
        email: 'admin@campus.edu',
        studentId: 'ADM-001',
        role: 'admin',
        avatar: 'AD'
      };
      storageService.saveUser(adminUser);
      return { success: true, user: adminUser };
    }
    return { success: false, error: 'Invalid username or password!' };
  },

  // Reset data
  async resetData() {
    try {
      const res = await fetch(`${API_BASE}/admin/reset`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        storageService.saveItems(data.items);
        return data.items;
      }
    } catch {
      // Fallback
    }
    return storageService.resetDemoData();
  }
};

export default api;
