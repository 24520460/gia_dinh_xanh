// js/pages/landing.js
// Logic trang chủ khách hàng

export function initLandingPage() {
  const quickBookForm = document.getElementById('quick-book-form');
  if (quickBookForm) {
    quickBookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const serviceType = document.querySelector('input[name="serviceType"]:checked')?.value || 'clean';
      const address = document.getElementById('quick-address')?.value || '';
      sessionStorage.setItem('gdx_quick_service', serviceType);
      sessionStorage.setItem('gdx_quick_address', address);
      window.location.href = 'customer-booking.html';
    });
  }

  // Quick service buttons
  const serviceCards = document.querySelectorAll('.service-quick-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.service || 'clean';
      sessionStorage.setItem('gdx_quick_service', type);
      window.location.href = 'customer-booking.html';
    });
  });
}

document.addEventListener('DOMContentLoaded', initLandingPage);
