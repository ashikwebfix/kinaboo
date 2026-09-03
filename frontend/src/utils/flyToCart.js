/**
 * Fly-to-Cart Animation Utility
 * Creates a smooth parabolic flying product particle from the clicked element
 * to the cart icon in the navbar, triggers a haptic bounce effect on the cart,
 * and executes a callback to open the SideCart drawer.
 */

export const flyToCart = (source, imageUrl, onComplete) => {
  try {
    let sourceEl = source;
    if (source && source.currentTarget) {
      sourceEl = source.currentTarget;
    } else if (source && source.target) {
      sourceEl = source.target;
    }

    // Identify target cart icon in the top navbar or mobile bottom nav
    let targetEl = document.getElementById('nav-cart-btn');
    const mobileCartEl = document.getElementById('mobile-nav-cart-btn');
    
    if (window.innerWidth <= 768 && mobileCartEl && mobileCartEl.offsetParent !== null) {
      targetEl = mobileCartEl;
    } else if (!targetEl) {
      targetEl = document.querySelector('.cart-trigger-btn') || mobileCartEl;
    }

    // Calculate source element position
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;
    if (sourceEl && typeof sourceEl.getBoundingClientRect === 'function') {
      const startRect = sourceEl.getBoundingClientRect();
      startX = startRect.left + startRect.width / 2;
      startY = startRect.top + startRect.height / 2;
    }

    // Calculate target element position
    let targetX = window.innerWidth - 60;
    let targetY = 40;
    if (targetEl && typeof targetEl.getBoundingClientRect === 'function') {
      const targetRect = targetEl.getBoundingClientRect();
      targetX = targetRect.left + targetRect.width / 2;
      targetY = targetRect.top + targetRect.height / 2;
    }

    // Create flying particle container
    const flyer = document.createElement('div');
    flyer.className = 'fly-to-cart-particle';
    flyer.style.left = `${startX - 26}px`;
    flyer.style.top = `${startY - 26}px`;

    // Create inner thumbnail image
    const img = document.createElement('img');
    img.src = imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200';
    img.alt = 'Flying product';
    flyer.appendChild(img);

    document.body.appendChild(flyer);

    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    // Smooth physics-based curved path animation
    const animation = flyer.animate(
      [
        {
          transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
          opacity: 1,
          boxShadow: '0 12px 28px rgba(255, 106, 61, 0.45), 0 4px 10px rgba(0,0,0,0.15)'
        },
        {
          transform: `translate3d(${deltaX * 0.4}px, ${deltaY * 0.2 - 80}px, 0) scale(1.15) rotate(45deg)`,
          opacity: 0.95,
          offset: 0.35
        },
        {
          transform: `translate3d(${deltaX * 0.75}px, ${deltaY * 0.65 - 30}px, 0) scale(0.7) rotate(90deg)`,
          opacity: 0.85,
          offset: 0.7
        },
        {
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.18) rotate(140deg)`,
          opacity: 0.1
        }
      ],
      {
        duration: 650,
        easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
        fill: 'forwards'
      }
    );

    animation.onfinish = () => {
      if (flyer.parentNode) {
        flyer.parentNode.removeChild(flyer);
      }

      // Add bounce bump animation to the target cart button
      if (targetEl) {
        targetEl.classList.remove('cart-bump-animation');
        void targetEl.offsetWidth; // Trigger reflow
        targetEl.classList.add('cart-bump-animation');
        setTimeout(() => {
          if (targetEl) targetEl.classList.remove('cart-bump-animation');
        }, 600);
      }

      // Run onComplete callback (open sidecart drawer)
      if (typeof onComplete === 'function') {
        onComplete();
      }
    };
  } catch (err) {
    console.error('Fly to cart error:', err);
    if (typeof onComplete === 'function') {
      onComplete();
    }
  }
};
