import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const ITEMS_FILE = path.join(DATA_DIR, 'items.json');
const INITIAL_ITEMS_FILE = path.join(DATA_DIR, 'initialItems.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read helper
function readJSON(file, fallback = []) {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
  }
  return fallback;
}

// Write helper
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

// Initialize items.json if not present
if (!fs.existsSync(ITEMS_FILE)) {
  const initial = readJSON(INITIAL_ITEMS_FILE, []);
  writeJSON(ITEMS_FILE, initial);
}

export const db = {
  // Items Operations
  getAllItems() {
    return readJSON(ITEMS_FILE, []);
  },

  getItemById(id) {
    const items = this.getAllItems();
    return items.find((i) => String(i.id) === String(id)) || null;
  },

  getItems({ status, type, category, search, posted_by } = {}) {
    let items = this.getAllItems();

    if (status && status !== 'all') {
      items = items.filter((i) => i.status === status);
    }

    if (type && type !== 'all') {
      items = items.filter((i) => i.item_type === type);
    }

    if (category && category !== 'all') {
      items = items.filter((i) => String(i.category_id) === String(category));
    }

    if (posted_by) {
      items = items.filter((i) => i.posted_by.toLowerCase() === posted_by.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      items = items.filter((i) => {
        const matchTitle = (i.title || '').toLowerCase().includes(q);
        const matchDesc = (i.description || '').toLowerCase().includes(q);
        const matchLoc = (i.location || '').toLowerCase().includes(q);
        const matchPoster = (i.posted_by || '').toLowerCase().includes(q);
        return matchTitle || matchDesc || matchLoc || matchPoster;
      });
    }

    return items;
  },

  addItem(itemData) {
    const items = this.getAllItems();
    const maxId = items.reduce((max, i) => (Number(i.id) > max ? Number(i.id) : max), 0);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newItem = {
      id: maxId + 1,
      item_type: itemData.item_type || 'lost',
      category_id: Number(itemData.category_id) || 1,
      title: itemData.title ? itemData.title.trim() : 'Untitled',
      description: itemData.description ? itemData.description.trim() : '',
      location: itemData.location ? itemData.location.trim() : 'Campus',
      date_lost_found: itemData.date_lost_found || now.split(' ')[0],
      image: itemData.image || '',
      status: itemData.status || 'pending',
      posted_by: itemData.posted_by || 'Student',
      contact: itemData.contact || 'campus@student.edu',
      created_at: now
    };

    items.unshift(newItem);
    writeJSON(ITEMS_FILE, items);
    return newItem;
  },

  updateItem(id, updates) {
    const items = this.getAllItems();
    const index = items.findIndex((i) => String(i.id) === String(id));
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates
    };

    writeJSON(ITEMS_FILE, items);
    return items[index];
  },

  deleteItem(id) {
    const items = this.getAllItems();
    const filtered = items.filter((i) => String(i.id) !== String(id));
    if (filtered.length === items.length) return false;

    writeJSON(ITEMS_FILE, filtered);
    return true;
  },

  // Categories Operations
  getCategories() {
    return readJSON(CATEGORIES_FILE, []);
  },

  getCategoryById(id) {
    const categories = this.getCategories();
    return categories.find((c) => String(c.id) === String(id)) || null;
  },

  // Aggregated Statistics
  getStatistics() {
    const items = this.getAllItems();
    return {
      total: items.length,
      pending: items.filter((i) => i.status === 'pending').length,
      open: items.filter((i) => i.status === 'open').length,
      returned: items.filter((i) => i.status === 'returned').length,
      lost: items.filter((i) => i.item_type === 'lost' && i.status === 'open').length,
      found: items.filter((i) => i.item_type === 'found' && i.status === 'open').length
    };
  },

  // Reset to demo dataset
  reset() {
    const initial = readJSON(INITIAL_ITEMS_FILE, []);
    writeJSON(ITEMS_FILE, initial);
    return initial;
  }
};

export default db;
