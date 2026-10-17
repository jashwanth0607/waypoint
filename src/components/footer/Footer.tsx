import React from 'react';
import Link from 'next/link';
import { Compass, MapPin, Calendar, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-canvas-subtle border-t border-sand-300 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-sand-200">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-ink flex items-center justify-center text-canvas">
                <Compass className="w-3.5 h-3.5 text-canvas" />
              </div>
              <span className="font-serif tracking-[0.2em] text-base font-bold uppercase text-ink">
                WAYFARER
              </span>
            </div>
            <p className="text-xs text-ink-muted max-w-sm leading-relaxed">
              An intentional travel planning tool designed for thoughtful explorers.
              Organize destinations, curate day-by-day itineraries, and keep your
              travel notes together without unnecessary noise.
            </p>
            <div className="pt-2 text-[11px] text-ink-faint">
              Editorial design and structured travel management.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link
                  href="/destinations"
                  className="hover:text-ink transition-colors"
                >
                  Destination Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations?filter=featured"
                  className="hover:text-ink transition-colors"
                >
                  Featured Regions
                </Link>
              </li>
              <li>
                <Link
                  href="/trips"
                  className="hover:text-ink transition-colors"
                >
                  My Itineraries
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations?filter=saved"
                  className="hover:text-ink transition-colors"
                >
                  Saved Places
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink">
              Legal & Information
            </h3>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-ink transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-ink transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <a
                  href="#top"
                  className="hover:text-ink transition-colors inline-block"
                >
                  Back to top
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ink-muted">
          <p>
            &copy; {new Date().getFullYear()} WAYFARER Studio. All rights reserved.
          </p>
          <p className="text-ink-faint">
            Crafted for intentional, unhurried travel planning.
          </p>
        </div>
      </div>
    </footer>
  );
}
