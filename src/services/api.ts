import { Course, PromptPack, DownloadAsset, UserProfile, QRISPaymentTransaction, ExternalTool, BlogArticle } from '../types';

const API_BASE = '/api';

export interface PromptQueryOptions {
  category?: string;
  aiModel?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PromptResponse {
  data: PromptPack[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const api = {
  // PROMPTS
  async getPrompts(options: PromptQueryOptions = {}): Promise<PromptResponse | null> {
    try {
      const params = new URLSearchParams();
      if (options.category) params.append('category', options.category);
      if (options.aiModel) params.append('aiModel', options.aiModel);
      if (options.search) params.append('search', options.search);
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());

      const res = await fetch(`${API_BASE}/prompts?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API Prompts fetch failed (using local cache/mock):', e);
      return null;
    }
  },

  async createPrompt(prompt: Omit<PromptPack, 'id'>): Promise<PromptPack | null> {
    try {
      const res = await fetch(`${API_BASE}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      });
      if (!res.ok) throw new Error('Failed to create prompt');
      return await res.json();
    } catch (e) {
      console.warn('API Create prompt failed:', e);
      return null;
    }
  },

  async updatePrompt(id: string, prompt: Partial<PromptPack>): Promise<PromptPack | null> {
    try {
      const res = await fetch(`${API_BASE}/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      });
      if (!res.ok) throw new Error('Failed to update prompt');
      return await res.json();
    } catch (e) {
      console.warn('API Update prompt failed:', e);
      return null;
    }
  },

  async deletePrompt(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/prompts/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('API Delete prompt failed:', e);
      return false;
    }
  },

  // COURSES
  async getCourses(): Promise<Course[] | null> {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API Courses fetch failed (using local cache/mock):', e);
      return null;
    }
  },

  async createCourse(course: Omit<Course, 'id'>): Promise<Course | null> {
    try {
      const res = await fetch(`${API_BASE}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
      if (!res.ok) throw new Error('Failed to create course');
      return await res.json();
    } catch (e) {
      console.warn('API Create course failed:', e);
      return null;
    }
  },

  async updateCourse(id: string, course: Partial<Course>): Promise<Course | null> {
    try {
      const res = await fetch(`${API_BASE}/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
      if (!res.ok) throw new Error('Failed to update course');
      return await res.json();
    } catch (e) {
      console.warn('API Update course failed:', e);
      return null;
    }
  },

  async deleteCourse(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('API Delete course failed:', e);
      return false;
    }
  },

  // ASSETS
  async getAssets(): Promise<DownloadAsset[] | null> {
    try {
      const res = await fetch(`${API_BASE}/assets`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API Assets fetch failed:', e);
      return null;
    }
  },

  // TOOLS
  async getTools(): Promise<ExternalTool[] | null> {
    try {
      const res = await fetch(`${API_BASE}/tools`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API Tools fetch failed:', e);
      return null;
    }
  },

  // USERS
  async getUsers(): Promise<UserProfile[] | null> {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API Users fetch failed:', e);
      return null;
    }
  },

  async syncUser(user: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!res.ok) throw new Error('Failed to sync user');
      return await res.json();
    } catch (e) {
      console.warn('API Sync user failed:', e);
      return null;
    }
  },

  async updateUser(id: string, user: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!res.ok) throw new Error('Failed to update user');
      return await res.json();
    } catch (e) {
      console.warn('API Update user failed:', e);
      return null;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('API Delete user failed:', e);
      return false;
    }
  },

  // TRANSACTIONS
  async getTransactions(): Promise<QRISPaymentTransaction[] | null> {
    try {
      const res = await fetch(`${API_BASE}/transactions`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API Transactions fetch failed:', e);
      return null;
    }
  },

  async createTransaction(trx: Omit<QRISPaymentTransaction, 'id'>): Promise<QRISPaymentTransaction | null> {
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trx)
      });
      if (!res.ok) throw new Error('Failed to create transaction');
      return await res.json();
    } catch (e) {
      console.warn('API Create transaction failed:', e);
      return null;
    }
  },

  // BLOGS
  async getBlogs(): Promise<BlogArticle[] | null> {
    try {
      const res = await fetch(`${API_BASE}/blogs`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API Blogs fetch failed:', e);
      return null;
    }
  }
};
