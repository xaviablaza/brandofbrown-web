// Cookie Consent Banner
(function () {
  if (document.cookie.indexOf('cookie_consent=') !== -1) return;

  var div = document.createElement('div');
  div.id = 'cookie-banner';
  div.innerHTML =
    '<p>We use cookies on our website to see how you interact with it. By accepting, you agree to our use of such cookies. ' +
    '<a href="https://app.websitepolicies.com/policies/view/oamn2e25" target="_blank" style="color:#D4A574;text-decoration:underline">Privacy policy</a></p>' +
    '<button id="cookie-accept" style="background:#fff;color:#000;border:1px solid #fff;padding:8px 20px;cursor:pointer;border-radius:4px">Accept</button>' +
    '<button id="cookie-decline" style="background:transparent;color:#fff;border:1px solid #fff;padding:8px 20px;cursor:pointer;border-radius:4px">Decline</button>';

  var s = div.style;
  s.cssText = 'position:fixed;bottom:0;left:0;width:100%;background:#000;color:#fff;padding:14px 20px;font-size:14px;line-height:1.5;display:flex;align-items:center;gap:12px;flex-wrap:wrap;z-index:99999;box-sizing:border-box';

  document.body.appendChild(div);

  function dismiss(v) {
    document.cookie = 'cookie_consent=' + v + ';path=/;max-age=31536000;SameSite=Lax';
    div.parentNode.removeChild(div);
  }

  document.getElementById('cookie-accept').onclick = function () { dismiss('accepted'); };
  document.getElementById('cookie-decline').onclick = function () { dismiss('declined'); };
})();
