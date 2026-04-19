// Cookie Consent Banner
(function () {
  if (document.cookie.split(';').some(c => c.trim().startsWith('cookie_consent='))) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner__inner">
      <p class="cookie-banner__text">
        We use cookies on our website to see how you interact with it. By accepting, you agree to our use of such cookies.
        <a data-wpembed="inline" href="https://app.websitepolicies.com/policies/view/oamn2e25">Privacy policy</a>
      </p>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__btn cookie-banner__btn--accept">Accept</button>
        <button class="cookie-banner__btn cookie-banner__btn--decline">Decline</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Load WebsitePolicies embed script
  const wpScript = document.createElement('script');
  wpScript.src = 'https://cdn.websitepolicies.io/lib/embed/embed.min.js';
  wpScript.defer = true;
  document.head.appendChild(wpScript);

  function dismiss(accepted) {
    const value = accepted ? 'accepted' : 'declined';
    document.cookie = `cookie_consent=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    banner.classList.add('cookie-banner--hidden');
    banner.addEventListener('transitionend', () => banner.remove());
  }

  banner.querySelector('.cookie-banner__btn--accept').addEventListener('click', () => dismiss(true));
  banner.querySelector('.cookie-banner__btn--decline').addEventListener('click', () => dismiss(false));

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      banner.classList.add('cookie-banner--visible');
    });
  });
})();
