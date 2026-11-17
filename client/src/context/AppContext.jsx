import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [items, setItems] = useState(() => storageService.getItems());
  const [user, setUser] = useState(() => storageService.getUser());
  const [theme, setTheme] = useState(() => storageService.getTheme());
  
  // Navigation & UI States
  const [currentTab, setCurrentTab] = useState('explore'); // 'explore' | 'browse' | 'post' | 'my-posts' | 'admin'
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimItemTarget, setClaimItemTarget] = useState(null);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'lost' | 'found'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | category_id
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'open' | 'claimed' | 'returned' | 'pending'
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Dynamic Alert state
  const [islandAlert, setIslandAlert] = useState(null);

  // Initial load from backend API
  useEffect(() => {
    let isMounted = true;
    api.getItems()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to local cache
  useEffect(() => {
    storageService.saveItems(items);
  }, [items]);

  useEffect(() => {
    storageService.saveUser(user);
  }, [user]);

  useEffect(() => {
    storageService.saveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Flash alert notification
  const triggerIslandAlert = (alert) => {
    setIslandAlert(alert);
    const duration = alert.duration || 4500;
    setTimeout(() => {
      setIslandAlert((current) => (current === alert ? null : current));
    }, duration);
  };

  // Item Actions
  const addItem = async (itemData, imageFile = null) => {
    const payload = {
      status: user.role === 'admin' ? 'open' : 'pending',
      posted_by: user.name,
      contact: user.email,
      ...itemData
    };

    try {
      const created = await api.addItem(payload, imageFile);
      if (created) {
        setItems((prev) => [created, ...prev.filter((i) => String(i.id) !== String(created.id))]);
        triggerIslandAlert({
          title: created.status === 'open' ? 'Item Published' : 'Item Submitted',
          subtitle: created.status === 'open' ? 'Live on campus feed' : 'Queued for admin review',
          icon: 'fa-solid fa-paper-plane',
          type: 'success'
        });
        return created;
      }
    } catch {
      // API failed or offline - fall back to local
    }

    const newItem = {
      id: Date.now(),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...payload
    };

    setItems((prev) => [newItem, ...prev]);

    triggerIslandAlert({
      title: newItem.status === 'open' ? 'Item Published' : 'Item Submitted',
      subtitle: newItem.status === 'open' ? 'Live on campus feed' : 'Queued for admin review',
      icon: 'fa-solid fa-paper-plane',
      type: 'success'
    });

    return newItem;
  };

  const updateItem = (id, fields) => {
    setItems((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, ...fields } : item))
    );
    if (selectedItem && String(selectedItem.id) === String(id)) {
      setSelectedItem((prev) => ({ ...prev, ...fields }));
    }
  };

  const deleteItem = async (id) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
    if (selectedItem && String(selectedItem.id) === String(id)) {
      setSelectedItem(null);
    }
    triggerIslandAlert({
      title: 'Item Removed',
      subtitle: 'Post deleted from network',
      icon: 'fa-solid fa-trash-can',
      type: 'neutral'
    });
    try {
      await api.deleteItem(id);
    } catch {
      // offline fallback handled
    }
  };

  const verifyItem = async (id, approve = true) => {
    if (approve) {
      updateItem(id, { status: 'open' });
      triggerIslandAlert({
        title: 'Post Approved',
        subtitle: 'Item is now publicly visible',
        icon: 'fa-solid fa-circle-check',
        type: 'success'
      });
    } else {
      deleteItem(id);
      triggerIslandAlert({
        title: 'Post Rejected',
        subtitle: 'Item removed by moderator',
        icon: 'fa-solid fa-ban',
        type: 'error'
      });
    }
    try {
      await api.verifyItem(id, approve);
    } catch {
      // offline fallback handled
    }
  };

  const claimItem = async (id, claimData) => {
    const claimPayload = {
      claimed_by: user.name,
      claimed_contact: claimData.contact || user.email,
      claim_note: claimData.note,
      claimed_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    updateItem(id, {
      status: 'claimed',
      ...claimPayload
    });

    triggerIslandAlert({
      title: 'Claim Submitted',
      subtitle: 'Owner notified to coordinate handover',
      icon: 'fa-solid fa-handshake',
      type: 'success'
    });

    try {
      await api.claimItem(id, claimPayload);
    } catch {
      // offline fallback handled
    }
  };

  const markAsReturned = async (id) => {
    updateItem(id, {
      status: 'returned',
      resolved_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    triggerIslandAlert({
      title: 'Status: Returned',
      subtitle: 'Item reunited with owner!',
      icon: 'fa-solid fa-circle-check',
      type: 'success'
    });

    try {
      await api.updateStatus(id, 'returned');
    } catch {
      // offline fallback handled
    }
  };

  const toggleUserRole = () => {
    const nextRole = user.role === 'admin' ? 'student' : 'admin';
    const updated = {
      ...user,
      role: nextRole,
      name: nextRole === 'admin' ? 'Campus Admin (Proctor)' : 'Bilal Ahmed'
    };
    setUser(updated);
    triggerIslandAlert({
      title: `Switched to ${nextRole === 'admin' ? 'Admin Mode' : 'Student Mode'}`,
      subtitle: nextRole === 'admin' ? 'Moderation privileges enabled' : 'Student access active',
      icon: nextRole === 'admin' ? 'fa-solid fa-shield-halved' : 'fa-solid fa-user-graduate',
      type: 'info'
    });
  };

  const loginStudent = async (name) => {
    if (!name || !name.trim()) return false;
    const cleanName = name.trim();
    try {
      const studentUser = await api.loginStudent(cleanName);
      if (studentUser) {
        setUser(studentUser);
        triggerIslandAlert({
          title: `Welcome, ${studentUser.name}!`,
          subtitle: 'Student session active',
          icon: 'fa-solid fa-user-graduate',
          type: 'success'
        });
        return true;
      }
    } catch {
      // fallback
    }

    const studentUser = {
      id: Date.now(),
      name: cleanName,
      email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@campus.edu`,
      studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'student',
      avatar: cleanName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    };
    setUser(studentUser);
    triggerIslandAlert({
      title: `Welcome, ${cleanName}!`,
      subtitle: 'Student session active',
      icon: 'fa-solid fa-user-graduate',
      type: 'success'
    });
    return true;
  };

  const loginAdmin = async (username, password) => {
    try {
      const result = await api.loginAdmin(username, password);
      if (result && result.success) {
        setUser(result.user);
        triggerIslandAlert({
          title: 'Admin Access Granted',
          subtitle: 'Moderator permissions unlocked',
          icon: 'fa-solid fa-shield-halved',
          type: 'success'
        });
        return { success: true };
      } else if (result && result.error) {
        return { success: false, error: result.error };
      }
    } catch {
      // fallback
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
      setUser(adminUser);
      triggerIslandAlert({
        title: 'Admin Access Granted',
        subtitle: 'Moderator permissions unlocked',
        icon: 'fa-solid fa-shield-halved',
        type: 'success'
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password!' };
  };

  const logout = () => {
    const guestUser = {
      id: 0,
      name: 'Guest Student',
      email: 'guest@campus.edu',
      studentId: 'GUEST',
      role: 'student',
      avatar: 'GS'
    };
    setUser(guestUser);
    triggerIslandAlert({
      title: 'Signed Out',
      subtitle: 'Session ended successfully',
      icon: 'fa-solid fa-arrow-right-from-bracket',
      type: 'neutral'
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const resetData = async () => {
    try {
      const fresh = await api.resetData();
      if (fresh) {
        setItems(fresh);
      } else {
        const localFresh = storageService.resetDemoData();
        setItems(localFresh);
      }
    } catch {
      const localFresh = storageService.resetDemoData();
      setItems(localFresh);
    }

    triggerIslandAlert({
      title: 'Data Reset',
      subtitle: 'Restored original campus entries',
      icon: 'fa-solid fa-rotate-right',
      type: 'neutral'
    });
  };

  // Filtered Items computation
  const filteredItems = items.filter((item) => {
    // Hide pending items from general students browsing unless it's their own or user is admin
    if (item.status === 'pending') {
      const isMyPost = item.posted_by === user.name;
      const isAdmin = user.role === 'admin';
      if (!isMyPost && !isAdmin && currentTab !== 'admin') {
        return false;
      }
    }

    // Type filter
    if (filterType !== 'all' && item.item_type !== filterType) {
      return false;
    }

    // Category filter
    if (filterCategory !== 'all' && String(item.category_id) !== String(filterCategory)) {
      return false;
    }

    // Status filter
    if (filterStatus !== 'all' && item.status !== filterStatus) {
      return false;
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(query);
      const matchDesc = (item.description || '').toLowerCase().includes(query);
      const matchLoc = (item.location || '').toLowerCase().includes(query);
      const matchPoster = (item.posted_by || '').toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchLoc && !matchPoster) {
        return false;
      }
    }

    return true;
  });

  // Aggregated Stats
  const stats = {
    total: items.length,
    lost: items.filter((i) => i.item_type === 'lost' && i.status === 'open').length,
    found: items.filter((i) => i.item_type === 'found' && i.status === 'open').length,
    pending: items.filter((i) => i.status === 'pending').length,
    returned: items.filter((i) => i.status === 'returned').length,
    open: items.filter((i) => i.status === 'open').length
  };

  return (
    <AppContext.Provider
      value={{
        items,
        filteredItems,
        stats,
        user,
        theme,
        currentTab,
        selectedItem,
        claimItemTarget,
        searchQuery,
        filterType,
        filterCategory,
        filterStatus,
        isFilterSheetOpen,
        isAuthModalOpen,
        islandAlert,
        setCurrentTab,
        setSelectedItem,
        setClaimItemTarget,
        setSearchQuery,
        setFilterType,
        setFilterCategory,
        setFilterStatus,
        setIsFilterSheetOpen,
        setIsAuthModalOpen,
        addItem,
        updateItem,
        deleteItem,
        verifyItem,
        claimItem,
        markAsReturned,
        toggleUserRole,
        loginStudent,
        loginAdmin,
        logout,
        toggleTheme,
        resetData,
        triggerIslandAlert
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
