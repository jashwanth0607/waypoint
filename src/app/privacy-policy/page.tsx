import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How WAYFARER handles your travel planning data, browser storage, and privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 pb-8 border-b border-sand-300">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-600">
          <Shield className="w-4 h-4" />
          <span>Transparency & Data Handling</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-ink-muted">
          Last revised: October 17, 2026. This policy describes our current data practices for the WAYFARER application.
        </p>
      </div>

      {/* Notice Banner */}
      <div className="p-5 rounded-lg bg-sand-100 border-l-4 border-terracotta-500 text-xs text-ink-secondary leading-relaxed space-y-1">
        <span className="font-semibold text-ink block">
          Legal Notice & Scope
        </span>
        <p>
          This document reflects the actual technical operation of the WAYFARER travel planner.
          Specific legal entity names, jurisdiction choices, and formal corporate counsel review
          remain subject to final operational deployment.
        </p>
      </div>

      {/* Policy Content */}
      <div className="space-y-10 text-sm text-ink-secondary leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            1. Core Principle: Local Client-Side Storage
          </h2>
          <p>
            WAYFARER is architected to prioritize user privacy and independence. By default, your created itineraries, day-by-day activities, notes, and saved destination bookmarks are stored directly on your personal device using standard web browser local storage (localStorage).
          </p>
          <p>
            We do not transmit your private trip itineraries, travel dates, or packing lists to remote marketing databases, data brokers, or advertisement networks.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            2. Information We Do Not Collect
          </h2>
          <p>Because WAYFARER operates as an intentional planning workspace:</p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-ink-secondary">
            <li>We do not collect credit card numbers, banking details, or financial credentials.</li>
            <li>We do not collect passport numbers or government identity credentials.</li>
            <li>We do not track real-time GPS locations or device movement histories.</li>
            <li>We do not sell, rent, or monetize your travel plans or personal browsing habits.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            3. Web Hosting and Infrastructure
          </h2>
          <p>
            The application is served via modern cloud hosting infrastructure (such as Render).
            Standard server request logs (including IP addresses, browser user agent strings, and request timestamps) may be generated temporarily by the hosting provider solely for traffic routing, DDoS defense, and operational security monitoring.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            4. External Images and Third-Party Assets
          </h2>
          <p>
            To deliver authentic travel photography, the website loads curated imagery from Unsplash and typography from Google Fonts. When your browser requests these image files and font weights, your browser establishes a direct HTTP connection to their content delivery networks (CDNs).
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            5. Managing and Deleting Your Travel Data
          </h2>
          <p>
            Because your trips exist in your browser local storage, you maintain full control:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-ink-secondary">
            <li>You can export your complete itinerary data as a JSON file at any time from the Trips page.</li>
            <li>You can delete individual trips or clear your browser cache and local storage to remove all data permanently.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            6. Changes and Contact
          </h2>
          <p>
            Should future versions introduce optional cloud synchronization or user accounts, this policy will be updated before any remote storage becomes active.
          </p>
          <p className="text-xs text-ink-muted">
            For questions regarding this policy, contact privacy@wayfarer-travel.example.
          </p>
        </section>
      </div>
    </div>
  );
}
