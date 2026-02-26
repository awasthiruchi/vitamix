function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default async function decorate(block) {
  block.innerHTML = `<div id="pixlee_container"></div>`;

  window.PixleeAsyncInit = function () {
    window.Pixlee.init({ apiKey: '21Zd2RSf2TKMzGbhr0rr' });
    window.Pixlee.addSimpleWidget({ widgetId: 6665206 });
  };

  await loadScriptOnce('https://assets.pxlecdn.com/assets/pixlee_widget_1_0_0.js');
}
