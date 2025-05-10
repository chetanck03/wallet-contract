import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import WalletConnector from './components/WalletConnector';
import HomePage from './components/HomePage';
import PresaleActions from './components/PresaleActions';
import RevenueDashboard from './components/RevenueDashboard';
import StakingPage from './components/StakingPage';
import LearnMorePage from './components/LearnMorePage'; // Import LearnMorePage
import { WalletProvider } from './hooks/useWallet';
import { useEffect, useState } from 'react';

// Removed the SVG Logo Placeholder

function App() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location]);

  const NavItem = ({ to, children, isMobile = false }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ease-in-out transform hover:scale-105 
        ${isMobile ? 'block w-full text-left my-1 ' : ''}
        ${isActive 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
          : 'text-gray-300 hover:bg-gray-700/50 hover:text-indigo-300'}`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-gray-200 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
        <header className="bg-gray-800/80 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-gray-700/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center text-2xl sm:text-3xl font-bold text-white hover:text-indigo-300 transition-colors">
                <img src="/logo.jpg" alt="BitFrac Logo" className="h-10 w-10 mr-3 rounded-md object-contain" /> {/* Added image logo */}
                <span>BitFrac</span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
                <NavItem to="/">Dashboard</NavItem>
                <NavItem to="/presale">Presale</NavItem>
                <NavItem to="/revenue">Revenue</NavItem>
                <NavItem to="/staking">Staking</NavItem>
              </nav>

              <div className="hidden md:flex items-center">
                <WalletConnector />
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-label="Open main menu"
                >
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-700/60">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavItem to="/" isMobile>Dashboard</NavItem>
                <NavItem to="/presale" isMobile>Presale</NavItem>
                <NavItem to="/revenue" isMobile>Revenue</NavItem>
                <NavItem to="/staking" isMobile>Staking</NavItem>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700/60">
                <div className="px-5 flex justify-center">
                    <WalletConnector isMobileView={true} />
                </div>              
              </div>
            </div>
          )}
        </header>

        <main className="container mx-auto flex-grow p-4 sm:p-6 lg:p-8 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/presale" element={<PresaleActions />} />
            <Route path="/revenue" element={<RevenueDashboard />} />
            <Route path="/staking" element={<StakingPage />} />
            <Route path="/learn-more" element={<LearnMorePage />} /> {/* Add route for LearnMorePage */}
          </Routes>
        </main>

        <footer className="bg-gray-800/50 p-6 text-center border-t border-gray-700/60 mt-auto shadow-inner">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} BitFrac Protocol. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-1">
            Disclaimer: This is a decentralized application. Always do your own research before investing.
          </p>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
