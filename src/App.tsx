import React from 'react';
import { useApp } from './context/AppContext';
import { OfficialGovHeader } from './components/layout/OfficialGovHeader';
import { OfficialGovFooter } from './components/layout/OfficialGovFooter';

// Pages
import { SignInPage } from './pages/SignInPage';
import { UploadDocumentView } from './pages/UploadDocumentView';
import { OfficialDashboardView } from './pages/OfficialDashboardView';
import { UserDashboardView } from './pages/UserDashboardView';
import { CheckDocumentView } from './pages/CheckDocumentView';
import { TrackProgressView } from './pages/TrackProgressView';
import { LocationSelectionView } from './pages/LocationSelectionView';

export const App: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated } = useApp();

  // Publicly accessible pages without authentication
  const publicTabs = ['signin', 'login', 'auth'];
  const isPublic = publicTabs.includes(activeTab);

  // Synchronize browser history and guard against browser Back/Forward navigation after logout
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (!isAuthenticated) {
        setActiveTab('signin');
        window.history.replaceState({ tab: 'signin' }, '', window.location.pathname);
      } else if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, setActiveTab]);

  // Route protection guard: Automatically redirect to /sign-in if an unauthenticated user attempts to view a protected page
  React.useEffect(() => {
    if (!isAuthenticated && !isPublic) {
      setActiveTab('signin');
      window.history.replaceState({ tab: 'signin' }, '', window.location.pathname);
    }
  }, [activeTab, isAuthenticated, isPublic, setActiveTab]);

  const renderActivePage = () => {
    // Strict Guard: If unauthenticated and on a protected page, render SignInPage immediately
    if (!isAuthenticated && !isPublic) {
      return <SignInPage />;
    }

    switch (activeTab) {
      case 'signin':
      case 'login':
      case 'auth':
        return <SignInPage />;
      case 'location-select':
      case 'location':
      case 'map-selection':
        return <LocationSelectionView />;
      case 'upload-document':
      case 'upload':
        return <UploadDocumentView />;
      case 'official-dashboard':
        return <OfficialDashboardView />;
      case 'user-dashboard':
        return <UserDashboardView />;
      case 'check-document':
        return <CheckDocumentView />;
      case 'track-progress':
        return <TrackProgressView />;
      default:
        return isAuthenticated ? <UserDashboardView /> : <SignInPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1E293B] flex flex-col antialiased font-sans">
      {/* Official Indian Government Navy Header Bar with Ashoka Emblem & Hindi/English Switcher */}
      <OfficialGovHeader />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full overflow-y-auto bg-[#F4F6F9] relative focus:outline-none">
        {renderActivePage()}
      </main>

      {/* Official Government Footer Strip */}
      <OfficialGovFooter />
    </div>
  );
};
