'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Menu, X, Plus, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CreateTripModal } from '@/components/trips/CreateTripModal';
import { cn } from '@/lib/utils';
import { getSavedDestinations, subscribeToStorage } from '@/lib/storage';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update saved count
  useEffect(() => {
    const updateCount = () => {
      const saved = getSavedDestinations();
      setSavedCount(saved.length);
    };
    updateCount();
    return subscribeToStorage(updateCount);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';

  const navLinks = [
    { label: 'Discover', href: '/destinations' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'My Trips', href: '/trips' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled || !isHome
            ? 'bg-canvas/95 backdrop-blur-md border-b border-sand-200 py-3.5 shadow-fine'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Wordmark Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="WAYFARER Home"
          >
            <div className="w-8 h-8 rounded-sm bg-ink flex items-center justify-center text-canvas transition-transform group-hover:scale-105 duration-200">
              <Compass className="w-4 h-4 text-canvas" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-[0.2em] text-lg font-bold uppercase text-ink leading-none">
                WAYFARER
              </span>
              <span className="text-[9px] tracking-[0.25em] text-ink-muted uppercase font-medium mt-0.5">
                Travel Planner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/destinations"
              className={cn(
                'text-xs uppercase tracking-widest font-semibold transition-colors py-1',
                pathname === '/destinations'
                  ? 'text-terracotta-600 border-b-2 border-terracotta-500'
                  : 'text-ink-secondary hover:text-ink'
              )}
            >
              Discover
            </Link>

            <Link
              href="/trips"
              className={cn(
                'text-xs uppercase tracking-widest font-semibold transition-colors py-1 flex items-center gap-1.5',
                pathname.startsWith('/trips')
                  ? 'text-terracotta-600 border-b-2 border-terracotta-500'
                  : 'text-ink-secondary hover:text-ink'
              )}
            >
              My Trips
            </Link>

            {savedCount > 0 && (
              <Link
                href="/destinations?filter=saved"
                className="text-xs uppercase tracking-widest font-semibold text-ink-secondary hover:text-ink transition-colors flex items-center gap-1"
                title={`${savedCount} saved destinations`}
              >
                <Bookmark className="w-3.5 h-3.5 text-terracotta-600 fill-terracotta-500" />
                <span>Saved ({savedCount})</span>
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Plan a Trip</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-2.5 py-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Plan</span>
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-ink hover:bg-sand-200 transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-canvas border-b border-sand-300 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/destinations"
                className="px-3 py-2 text-sm font-medium text-ink hover:bg-sand-100 rounded-md transition-colors"
              >
                Discover Destinations
              </Link>
              <Link
                href="/trips"
                className="px-3 py-2 text-sm font-medium text-ink hover:bg-sand-100 rounded-md transition-colors"
              >
                My Trips
              </Link>
              <Link
                href="/destinations?filter=saved"
                className="px-3 py-2 text-sm font-medium text-ink hover:bg-sand-100 rounded-md transition-colors flex items-center justify-between"
              >
                <span>Saved Destinations</span>
                {savedCount > 0 && (
                  <span className="text-xs bg-terracotta-100 text-terracotta-700 px-2 py-0.5 rounded-sm">
                    {savedCount}
                  </span>
                )}
              </Link>
            </nav>
            <div className="pt-2 border-t border-sand-200">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCreateModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Plan a New Trip
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Trip Creation Modal */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
