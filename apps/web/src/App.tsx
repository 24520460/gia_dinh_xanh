import React, { useState } from 'react';
import { PlatformSwitcher } from './components/PlatformSwitcher';
import { CustomerAppointments } from './components/customer/CustomerAppointments';
import { CustomerBooking } from './components/customer/CustomerBooking';
import { CustomerLanding } from './components/customer/CustomerLanding';
import { CustomerTracking } from './components/customer/CustomerTracking';
import { RatingModal } from './components/customer/RatingModal';
import { PartnerJobBoard } from './components/partner/PartnerJobBoard';
import { PartnerShift } from './components/partner/PartnerShift';
import { PartnerWallet } from './components/partner/PartnerWallet';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPricing } from './components/admin/AdminPricing';
import { AdminKYC } from './components/admin/AdminKYC';
import { ScreenId } from '@gdx/shared-types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('customer-landing');
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#9cf2e8] selection:text-[#005c55]">
      {/* Active Screen View */}
      {currentScreen === 'customer-landing' && (
        <CustomerLanding onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'customer-booking' && (
        <CustomerBooking onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'customer-tracking' && (
        <CustomerTracking
          onNavigate={setCurrentScreen}
          onOpenRatingModal={() => setRatingModalOpen(true)}
        />
      )}

      {currentScreen === 'customer-appointments' && (
        <CustomerAppointments
          onNavigate={setCurrentScreen}
          onOpenRatingModal={() => setRatingModalOpen(true)}
        />
      )}

      {currentScreen === 'partner-shift' && (
        <PartnerShift onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'partner-board' && (
        <PartnerJobBoard onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'partner-wallet' && (
        <PartnerWallet onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'admin-dashboard' && (
        <AdminDashboard onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'admin-pricing' && (
        <AdminPricing onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'admin-kyc' && (
        <AdminKYC onNavigate={setCurrentScreen} />
      )}

      {/* 5-Star Customer Rating & Review Modal (Can be triggered from Appointments or Switcher) */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmitSuccess={() => {
          setRatingModalOpen(false);
          setCurrentScreen('customer-appointments');
        }}
      />

      {/* Floating 10-Screen Switcher & Preview Panel */}
      <PlatformSwitcher
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openRatingModal={() => setRatingModalOpen(true)}
      />
    </div>
  );
}
