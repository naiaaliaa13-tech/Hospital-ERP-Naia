import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, Pill, FileText, Menu, X, Bell, Search, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import EHR from './pages/EHR';
import Finance from './pages/Finance';
import Inventory from './pages/Inventory';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, path, active, onClick }: { icon: any, label: string, path: string, active: boolean, onClick: () => void }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 group ${
      active
        ? 'bg-teal-900/5 text-teal-700 font-semibold shadow-sm'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon className={`w-5 h-5 transition-colors ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
    <span className="text-sm tracking-wide">{label}</span>
  </div>
);

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const navigate = (path: string) => window.location.hash = path;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-teal-600/20">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-slate-900 font-bold text-lg tracking-tight">Aethelgard</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Hospital ERP</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          <SidebarItem
            icon={LayoutDashboard}
            label="Executive Dashboard"
            path="/"
            active={location.pathname === '/'}
            onClick={() => navigate('/')}
          />
          <SidebarItem
            icon={Stethoscope}
            label="Patient EHR"
            path="/ehr"
            active={location.pathname === '/ehr'}
            onClick={() => navigate('/ehr')}
          />
          <SidebarItem
            icon={FileText}
            label="Core Finance"
            path="/finance"
            active={location.pathname === '/finance'}
            onClick={() => navigate('/finance')}
          />
          <SidebarItem
            icon={Pill}
            label="Pharmacy Inventory"
            path="/inventory"
            active={location.pathname === '/inventory'}
            onClick={() => navigate('/inventory')}
          />
           <div className="pt-6 mt-6 border-t border-slate-100 mx-4">
            <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System</p>
             <SidebarItem
              icon={Users}
              label="Staff Management"
              path="/staff"
              active={location.pathname === '/staff'}
              onClick={() => {}}
            />
            <SidebarItem
              icon={Settings}
              label="Configuration"
              path="/settings"
              active={location.pathname === '/settings'}
              onClick={() => {}}
            />
           </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200/50">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
               <img src="https://picsum.photos/100/100" alt="Prof. User" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-700 truncate">Prof. A. Vance</p>
              <p className="text-xs text-slate-500 truncate">Chief of Data Governance</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
    <div className="flex items-center gap-4">
      <button onClick={onMenuClick} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden">
        <Menu size={20} />
      </button>
      <div className="relative hidden md:block w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search patients, transactions, or medicines..."
          className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-700 placeholder-slate-400 transition-all"
        />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        <button className="p-2 text-slate-500 hover:text-teal-600 transition-colors">
          <Bell size={20} />
        </button>
      </div>
    </div>
  </header>
);

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ehr" element={<EHR />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}