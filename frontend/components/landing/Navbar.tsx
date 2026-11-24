import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Briefcase, Menu, X, ArrowRight, UserCircle, LogOut } from 'lucide-react';

export interface NavbarProps {
  currentUser: any;
  currentUserRole: string | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
  onNavigateView: (view: 'home' | 'jobs' | 'companies' | 'blog' | 'dashboard') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentUserRole,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onNavigateView,
  currentView,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'jobs', label: 'Explore Jobs' },
    { id: 'companies', label: 'Companies' },
    { id: 'blog', label: 'Community' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-white/85 backdrop-blur-md border-b border-border shadow-sm'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigateView('home')}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#38BDF8] flex items-center justify-center text-white shadow-glow-violet transition-transform duration-300 group-hover:scale-105">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-extrabold tracking-tight text-neutral flex items-center gap-1 font-sans">
                Job<span className="text-[#6C5CE7]">Executive</span>
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/70 shadow-sm">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigateView(link.id as any)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#6C5CE7] text-white shadow-sm'
                      : 'text-neutral-secondary hover:text-neutral hover:bg-slate-100/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigateView('dashboard')}
                  leftIcon={<UserCircle className="w-4 h-4" />}
                >
                  Dashboard
                </Button>
                <div className="flex items-center gap-2 pl-2 border-l border-border">
                  <Badge variant="violet" size="sm">
                    {currentUserRole}
                  </Badge>
                  <button
                    onClick={onLogoutClick}
                    title="Logout"
                    className="p-2 text-neutral-secondary hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLoginClick}
                  className="font-semibold"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSignupClick}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-neutral hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-border shadow-xl animate-in slide-in-from-top-4 duration-200 space-y-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigateView(link.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    currentView === link.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-neutral-secondary hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      onNavigateView('dashboard');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Go to Dashboard ({currentUserRole})
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center text-rose-600"
                    onClick={() => {
                      onLogoutClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onLoginClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      onSignupClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
