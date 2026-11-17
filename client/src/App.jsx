import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import ToastAlert from './components/common/ToastAlert';
import ExploreView from './components/views/ExploreView';
import BrowseView from './components/views/BrowseView';
import PostItemView from './components/views/PostItemView';
import MyPostsView from './components/views/MyPostsView';
import AdminDashboardView from './components/views/AdminDashboardView';
import ItemDetailModal from './components/items/ItemDetailModal';
import ClaimModal from './components/items/ClaimModal';
import FilterSheet from './components/items/FilterSheet';
import AuthModal from './components/common/AuthModal';

const AppContent = () => {
  const { currentTab } = useApp();

  return (
    <div className="web-app-container">
      {/* Toast notifications */}
      <ToastAlert />

      {/* Responsive Top Navigation Header */}
      <Navbar />

      {/* Main View Area */}
      <main className="main-content-area" id="main-content">
        <div className="content-container">
          {currentTab === 'explore' && <ExploreView />}
          {currentTab === 'browse' && <BrowseView />}
          {currentTab === 'post' && <PostItemView />}
          {currentTab === 'my-posts' && <MyPostsView />}
          {currentTab === 'admin' && <AdminDashboardView />}
        </div>
      </main>

      {/* Modal Sheets & Dialogs */}
      <ItemDetailModal />
      <ClaimModal />
      <FilterSheet />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
