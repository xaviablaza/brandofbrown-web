// Cookie Consent Banner
(function () {
  if (document.cookie.split(';').some(c => c.trim().startsWith('cookie_consent='))) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner__inner">
      <p class="cookie-banner__text">
        We use cookies on our website to see how you interact with it. By accepting, you agree to our use of such cookies.
        <a href="https://app.websitepolicies.com/policies/view/oamn2e25" target="_blank" rel="noopener noreferrer">Privacy policy</a>
      </p>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__btn cookie-banner__btn--accept">Accept</button>
        <button class="cookie-banner__btn cookie-banner__btn--decline">Decline</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

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
