/**
 * FinCalc v2 - Global UI Interactivity (Theme, Search, FAQ, Navigation)
 */

(function () {
  'use strict';

  // 1. Theme Switcher (Dark / Light)
  const initTheme = () => {
    const savedTheme = localStorage.getItem('fincalc_theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('fincalc_theme', newTheme);
      });
    }
  };

  // 2. Search Modal (Ctrl/Cmd + K)
  const initSearchModal = () => {
    const modal = document.getElementById('search-modal');
    const trigger = document.getElementById('search-trigger-btn');
    const searchInput = document.getElementById('modal-search-input');
    const resultsContainer = document.getElementById('modal-search-results');

    if (!modal) return;

    const openModal = () => {
      modal.classList.add('open');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 50);
        filterResults('');
      }
    };

    const closeModal = () => {
      modal.classList.remove('open');
    };

    if (trigger) trigger.addEventListener('click', openModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (modal.classList.contains('open')) closeModal();
        else openModal();
      } else if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    const filterResults = (query) => {
      if (!resultsContainer) return;
      const items = resultsContainer.querySelectorAll('.search-result-item');
      const q = query.toLowerCase().trim();
      let matchCount = 0;

      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          item.style.display = 'flex';
          matchCount++;
        } else {
          item.style.display = 'none';
        }
      });
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => filterResults(e.target.value));
    }
  };

  // 3. FAQ Accordion
  const initFaqAccordion = () => {
    document.querySelectorAll('.faq-question, .faq-question-btn, .faq-v1-trigger').forEach((button) => {
      button.addEventListener('click', () => {
        const parent = button.closest('.faq-item, .faq-v1-item');
        if (parent) {
          const isOpen = parent.classList.contains('open');
          // Close all other items
          document.querySelectorAll('.faq-item, .faq-v1-item').forEach((item) => item.classList.remove('open'));
          if (!isOpen) {
            parent.classList.add('open');
          }
        }
      });
    });
  };

  // 4. Schedule Toggle
  const initScheduleToggle = () => {
    const toggleBtn = document.getElementById('btn-toggle-schedule');
    const scheduleBox = document.getElementById('schedule-table-wrap');
    if (toggleBtn && scheduleBox) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = scheduleBox.style.display === 'none' || !scheduleBox.style.display;
        scheduleBox.style.display = isHidden ? 'block' : 'none';
        toggleBtn.textContent = isHidden ? 'Hide Full Schedule' : 'View Full Amortization Schedule';
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSearchModal();
    initFaqAccordion();
    initScheduleToggle();
  });
})();
