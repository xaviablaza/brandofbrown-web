// Cookie Consent Banner — fully self-contained with inline styles
(function () {
  if (document.cookie.split(';').some(function (c) { return c.trim().indexOf('cookie_consent=') === 0; })) return;

  // Build banner via DOM API — no innerHTML, no external CSS
  var banner = document.createElement('div');
  banner.setAttribute('style', [
    'position:fixed',
    'bottom:0',
    'left:0',
    'right:0',
    'top:auto',
    'width:100%',
    'height:auto',
    'max-height:none',
    'min-height:0',
    'z-index:99999',
    'background:#000',
    'color:#fff',
    'font-family:Questrial,Arial,Helvetica,sans-serif',
    'font-size:14px',
    'line-height:1.5',
    'box-sizing:border-box',
    'padding:16px 24px',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'gap:16px',
    'flex-wrap:wrap',
    'margin:0',
    'border:0',
    'overflow:visible',
    'transform:none',
    'opacity:1'
  ].join(';'));

  var text = document.createElement('p');
  text.setAttribute('style', 'margin:0;padding:0;flex:1 1 300px;font-size:14px;line-height:1.5;color:#fff');
  text.textContent = 'We use cookies on our website to see how you interact with it. By accepting, you agree to our use of such cookies. ';

  var link = document.createElement('a');
  link.href = 'https://app.websitepolicies.com/policies/view/oamn2e25';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Privacy policy';
  link.setAttribute('style', 'color:#D4A574;text-decoration:underline');
  text.appendChild(link);

  var btnWrap = document.createElement('div');
  btnWrap.setAttribute('style', 'display:flex;gap:8px;flex-shrink:0');

  function makeBtn(label, filled) {
    var b = document.createElement('button');
    b.textContent = label;
    b.setAttribute('style', [
      'padding:8px 20px',
      'font-size:14px',
      'font-family:inherit',
      'border:1px solid #fff',
      'border-radius:4px',
      'cursor:pointer',
      'white-space:nowrap',
      'background:' + (filled ? '#fff' : 'transparent'),
      'color:' + (filled ? '#000' : '#fff')
    ].join(';'));
    return b;
  }

  var acceptBtn = makeBtn('Accept', true);
  var declineBtn = makeBtn('Decline', false);
  btnWrap.appendChild(acceptBtn);
  btnWrap.appendChild(declineBtn);

  banner.appendChild(text);
  banner.appendChild(btnWrap);
  document.body.appendChild(banner);

  function dismiss(accepted) {
    var value = accepted ? 'accepted' : 'declined';
    document.cookie = 'cookie_consent=' + value + '; path=/; max-age=31536000; SameSite=Lax';
    banner.parentNode.removeChild(banner);
  }

  acceptBtn.addEventListener('click', function () { dismiss(true); });
  declineBtn.addEventListener('click', function () { dismiss(false); });
})();
