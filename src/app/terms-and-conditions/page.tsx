import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions',
  description: 'Terms of service and usage conditions for the WAYFARER travel planner.',
};

export default function TermsAndConditionsPage() {
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
          <FileText className="w-4 h-4" />
          <span>Usage Agreement</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-ink-muted">
          Last revised: October 17, 2026. Please read these terms carefully before utilizing the WAYFARER application.
        </p>
      </div>

      {/* Legal Review Note */}
      <div className="p-5 rounded-lg bg-sand-100 border-l-4 border-terracotta-500 text-xs text-ink-secondary leading-relaxed space-y-1">
        <span className="font-semibold text-ink block">
          Review Notice for Deployment
        </span>
        <p>
          This document represents draft operational terms reflecting the actual software behavior.
          Formal commercial launch requires customization with your legal entity name, jurisdiction,
          and governing law.
        </p>
      </div>

      {/* Terms Body */}
      <div className="space-y-10 text-sm text-ink-secondary leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            1. Nature of the Application
          </h2>
          <p>
            WAYFARER is an independent travel planning application designed to help users organize itineraries, structure daily schedules, record travel notes, and discover curated destination highlights.
          </p>
          <p>
            WAYFARER is not a travel agency, tour operator, commercial airline, booking broker, or lodging provider. We do not sell airline tickets, book hotel reservations, or collect commissions on reservations.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            2. Travel Information and Guidance
          </h2>
          <p>
            All editorial recommendations, opening hours, seasonal tips, and neighborhood highlights are provided for general educational and planning purposes.
          </p>
          <p>
            Travelers are solely responsible for verifying operating hours, entry visas, health requirements, local weather forecasts, and safety advisories directly with official venue or governmental authorities before traveling.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            3. User Content and Data Responsibility
          </h2>
          <p>
            You retain full ownership of all custom itineraries, day schedules, notes, and checklist items you enter into WAYFARER.
          </p>
          <p>
            Because data is stored in your personal browser storage, you are responsible for maintaining backups using the provided Export feature if you intend to preserve plans across device migrations or browser cache resets.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            4. Acceptable Use
          </h2>
          <p>
            You agree to use WAYFARER only for lawful personal or group travel planning purposes. You agree not to attempt to disrupt the service, reverse engineer backend infrastructure, or perform unauthorized security penetration testing on production servers.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            5. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, WAYFARER and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the application, canceled flights, weather disruptions, or travel itinerary changes.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink">
            6. Governing Law and Amendments
          </h2>
          <p>
            These terms may be updated from time to time to reflect product enhancements or statutory updates.
          </p>
          <p className="text-xs text-ink-muted">
            For inquiries regarding terms of use, please contact legal@wayfarer-travel.example.
          </p>
        </section>
      </div>
    </div>
  );
}
