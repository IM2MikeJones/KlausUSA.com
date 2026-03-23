// Material 3 Components
// Consolidated file containing Navigation, Modal, and Accordion functionality

(function() {
  'use strict';

  // ============================================================================
  // NAVIGATION - Mobile Menu Toggle
  // ============================================================================
  
  function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuScrim = document.getElementById('menu-scrim');

    function openMenu() {
      if (mobileMenu) {
        mobileMenu.classList.add('m3-navigation-drawer--open');
      }
      if (menuScrim) {
        menuScrim.classList.add('m3-navigation-drawer__scrim--open');
      }
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      if (mobileMenu) {
        mobileMenu.classList.remove('m3-navigation-drawer--open');
      }
      if (menuScrim) {
        menuScrim.classList.remove('m3-navigation-drawer__scrim--open');
      }
      document.body.style.overflow = '';
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', openMenu);
    }

    if (menuClose) {
      menuClose.addEventListener('click', closeMenu);
    }

    if (menuScrim) {
      menuScrim.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on a link
    const drawerLinks = document.querySelectorAll('.m3-navigation-drawer__link');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  // Dropdown menu functionality
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.m3-dropdown');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.m3-dropdown__trigger');
      
      if (trigger) {
        trigger.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.toggle('m3-dropdown--open');
        });
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('m3-dropdown--open');
        }
      });
    });
  }

  // ============================================================================
  // MODAL - Modal Open/Close Functionality
  // ============================================================================
  
  function setupModal(cardId, modalId, scrimId, closeId) {
    const card = document.getElementById(cardId);
    const modal = document.getElementById(modalId);
    const scrim = document.getElementById(scrimId);
    const close = document.getElementById(closeId);

    if (!modal) return null;

    function openModal() {
      modal.classList.add('m3-modal--open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('m3-modal--open');
      document.body.style.overflow = '';
    }

    // Open modal when card is clicked
    if (card) {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
      });
    }

    // Close modal when close button is clicked
    if (close) {
      close.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
      });
    }

    // Close modal when scrim (background) is clicked
    if (scrim) {
      scrim.addEventListener('click', function(e) {
        if (e.target === scrim) {
          closeModal();
        }
      });
    }

    // Return closeModal function for Escape key handler
    return closeModal;
  }

  function initModals() {
    // Setup Superior Reliability modal
    const closeSuperiorReliabilityModal = setupModal(
      'superior-reliability-card',
      'superior-reliability-modal',
      'superior-reliability-modal-scrim',
      'superior-reliability-modal-close'
    );

    // Setup Local Expertise modal
    const closeLocalExpertiseModal = setupModal(
      'local-expertise-card',
      'local-expertise-modal',
      'local-expertise-modal-scrim',
      'local-expertise-modal-close'
    );

    // Setup Proven Technology modal
    const closeProvenTechnologyModal = setupModal(
      'proven-technology-card',
      'proven-technology-modal',
      'proven-technology-modal-scrim',
      'proven-technology-modal-close'
    );

    // Setup Engineered Safety modal
    const closeEngineeredSafetyModal = setupModal(
      'engineered-safety-card',
      'engineered-safety-modal',
      'engineered-safety-modal-scrim',
      'engineered-safety-modal-close'
    );

    // Setup Lifetime Support modal
    const closeLifetimeSupportModal = setupModal(
      'lifetime-support-card',
      'lifetime-support-modal',
      'lifetime-support-modal-scrim',
      'lifetime-support-modal-close'
    );

    // Setup Design Assistance modal
    const closeDesignAssistanceModal = setupModal(
      'design-assistance-card',
      'design-assistance-modal',
      'design-assistance-modal-scrim',
      'design-assistance-modal-close'
    );

    // Setup Learn More About Technology modal
    const closeLearnMoreTechnologyModal = setupModal(
      'learn-more-technology-button',
      'learn-more-technology-modal',
      'learn-more-technology-modal-scrim',
      'learn-more-technology-modal-close'
    );

    // Close modal when Escape key is pressed
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const superiorReliabilityModal = document.getElementById('superior-reliability-modal');
        const localExpertiseModal = document.getElementById('local-expertise-modal');
        const provenTechnologyModal = document.getElementById('proven-technology-modal');
        const engineeredSafetyModal = document.getElementById('engineered-safety-modal');
        const lifetimeSupportModal = document.getElementById('lifetime-support-modal');
        const designAssistanceModal = document.getElementById('design-assistance-modal');
        const learnMoreTechnologyModal = document.getElementById('learn-more-technology-modal');
        
        if (superiorReliabilityModal && superiorReliabilityModal.classList.contains('m3-modal--open') && closeSuperiorReliabilityModal) {
          closeSuperiorReliabilityModal();
        } else if (localExpertiseModal && localExpertiseModal.classList.contains('m3-modal--open') && closeLocalExpertiseModal) {
          closeLocalExpertiseModal();
        } else if (provenTechnologyModal && provenTechnologyModal.classList.contains('m3-modal--open') && closeProvenTechnologyModal) {
          closeProvenTechnologyModal();
        } else if (engineeredSafetyModal && engineeredSafetyModal.classList.contains('m3-modal--open') && closeEngineeredSafetyModal) {
          closeEngineeredSafetyModal();
        } else if (lifetimeSupportModal && lifetimeSupportModal.classList.contains('m3-modal--open') && closeLifetimeSupportModal) {
          closeLifetimeSupportModal();
        } else if (designAssistanceModal && designAssistanceModal.classList.contains('m3-modal--open') && closeDesignAssistanceModal) {
          closeDesignAssistanceModal();
        } else if (learnMoreTechnologyModal && learnMoreTechnologyModal.classList.contains('m3-modal--open') && closeLearnMoreTechnologyModal) {
          closeLearnMoreTechnologyModal();
        }
      }
    });
  }

  // ============================================================================
  // ACCORDION - Accordion Functionality
  // ============================================================================
  
  function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.m3-accordion-header');
    const topAppBar = document.querySelector('.m3-top-app-bar');
    const headerHeight = topAppBar ? topAppBar.offsetHeight : 64;

    accordionHeaders.forEach(function(header) {
      header.addEventListener('click', function() {
        const clickedHeader = this; // Capture 'this' for use in nested functions
        const isExpanded = clickedHeader.getAttribute('aria-expanded') === 'true';
        const content = document.getElementById(clickedHeader.getAttribute('aria-controls'));
        const accordionItem = clickedHeader.closest('.m3-accordion-item');
        
        // If collapsing, just toggle and return
        if (isExpanded) {
          clickedHeader.setAttribute('aria-expanded', 'false');
          clickedHeader.classList.remove('m3-accordion-header--open');
          if (content) {
            content.classList.remove('m3-accordion-content--open');
          }
          return;
        }

        // For expanding: capture position BEFORE changes, then make changes, then scroll
        // Get the clicked header's absolute position BEFORE any DOM changes
        const headerRectBefore = clickedHeader.getBoundingClientRect();
        const scrollTopBefore = window.pageYOffset || document.documentElement.scrollTop;
        const headerAbsoluteTopBefore = headerRectBefore.top + scrollTopBefore;
        
        // Calculate how much height will be removed by collapsing items BEFORE the clicked item
        let heightToRemove = 0;
        const clickedItemRectBefore = accordionItem ? accordionItem.getBoundingClientRect() : null;
        const clickedItemAbsoluteTopBefore = clickedItemRectBefore ? clickedItemRectBefore.top + scrollTopBefore : headerAbsoluteTopBefore;
        
        accordionHeaders.forEach(function(otherHeader) {
          if (otherHeader !== clickedHeader && otherHeader.getAttribute('aria-expanded') === 'true') {
            const otherContent = document.getElementById(otherHeader.getAttribute('aria-controls'));
            const otherItem = otherHeader.closest('.m3-accordion-item');
            if (otherContent && otherItem) {
              const otherItemRect = otherItem.getBoundingClientRect();
              const otherItemAbsoluteTop = otherItemRect.top + scrollTopBefore;
              // If this item is before (above) the clicked item, its collapse will affect the clicked item's position
              if (otherItemAbsoluteTop < clickedItemAbsoluteTopBefore) {
                heightToRemove += otherContent.scrollHeight;
              }
            }
          }
        });
        
        // Expand the clicked item first
        clickedHeader.setAttribute('aria-expanded', 'true');
        clickedHeader.classList.add('m3-accordion-header--open');
        if (content) {
          content.classList.add('m3-accordion-content--open');
        }

        // Close all other accordion items
        accordionHeaders.forEach(function(otherHeader) {
          if (otherHeader !== clickedHeader) {
            const otherContent = document.getElementById(otherHeader.getAttribute('aria-controls'));
            otherHeader.setAttribute('aria-expanded', 'false');
            otherHeader.classList.remove('m3-accordion-header--open');
            if (otherContent) {
              otherContent.classList.remove('m3-accordion-content--open');
            }
          }
        });

        // After items have been toggled, scroll to position the clicked item header at the top
        if (clickedHeader) {
          // Use requestAnimationFrame and setTimeout to allow DOM updates and animations to process
          requestAnimationFrame(function() {
            setTimeout(function() {
              // Get the actual header height at scroll time (might be different on mobile)
              const actualHeaderHeight = topAppBar ? topAppBar.offsetHeight : headerHeight;
              const desiredOffset = actualHeaderHeight + 16; // header height + 16px padding
              
              // The clicked header's new absolute position after collapse is its old position minus height removed
              const headerNewAbsoluteTop = headerAbsoluteTopBefore - heightToRemove;
              
              // Calculate target scroll position to place header at desired offset from top
              const targetScrollPosition = headerNewAbsoluteTop - desiredOffset;
              const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
              
              // Safety check: ensure target position is within valid scroll range
              if (targetScrollPosition >= 0 && targetScrollPosition <= maxScroll) {
                window.scrollTo({
                  top: targetScrollPosition,
                  behavior: 'smooth'
                });
              } else if (targetScrollPosition > maxScroll) {
                // If item would be below viewport, scroll to max position
                window.scrollTo({
                  top: maxScroll,
                  behavior: 'smooth'
                });
              }
            }, 300); // Increased delay to allow collapse animations to complete on all devices
          });
        }
      });
    });
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  function initialize() {
    initNavigation();
    initDropdowns();
    initModals();
    initAccordion();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
