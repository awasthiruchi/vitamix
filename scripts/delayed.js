import { loadScript } from './aem.js';

// add delayed functionality here
window.config = {
  POOLID: 'us-east-1:d54ecd7d-db6e-456d-bf35-d26346122a63',
  REGION: 'us-east-1',
  BOTID: 'JBPXLTC0LW',
  BOTALIASID: 'HUKYDI5LGI',
};

loadScript('https://www.vitamix.com/etc.clientlibs/vitamix/clientlibs/clientlib-chatbot.lc-5aa4591c22ce9007a60fafc1f19aa690-lc.min.js');
loadScript('https://www.vitamix.com/etc.clientlibs/vitamix/clientlibs/clientlib-library.lc-259cf15444c5fe1f89e5c54df7b6e1e9-lc.min.js', () => {
  loadScript('https://www.vitamix.com/etc.clientlibs/vitamix/clientlibs/clientlib-analytics.lc-26814920488a848ff91c1f425646d010-lc.min.js');
  loadScript('https://www.vitamix.com/etc.clientlibs/vitamix/clientlibs/clientlib-base.lc-daf5b8dac79e9cf7cb1c0b30d8372e7a-lc.min.js');
});
loadScript('https://www.vitamix.com/etc.clientlibs/core/wcm/components/commons/site/clientlibs/container.lc-0a6aff292f5cc42142779cde92054524-lc.min.js');
loadScript('https://assets.adobedtm.com/launch-EN40f2d69539754c3ea73511e70c65c801.min.js');
loadScript('https://js.adsrvr.org/up_loader.1.1.0.js');

/* eslint-disable */

loadScript('https://insight.adsrvr.org/track/up', () => {
  ttd_dom_ready(() => {
    if (typeof TTDUniversalPixelApi === 'function') {
      const universalPixelApi = new TTDUniversalPixelApi();
      universalPixelApi.init('um3hqnt', ['hqj90x6'], 'https://insight.adsrvr.org/track/up');
    }
  });
});


(function (d) {
  if (window.__cbtagLoaded) { return; }
  window.__cbtagLoaded = true;
  if (!window.cbtag) { window.cbtagdata = []; window.cbtag = function (event, args) { cbtagdata.push({ event, args }); }; }
  d.addEventListener('DOMContentLoaded', () => {
    var e = function (u) { return encodeURIComponent(u); };
    const cMacro = '';
    const sourceUrl = e('');
    const lidJson = e(JSON.stringify({
      a: 'www.vitamix.com',
    }));
    const ifr = (function () { try { return (!top.location.href ? 1 : 0); } catch (e) { return 1; } }());
    const isSF = (function () { if (window.$sf) { if ($sf.ext && $sf.ext.supports) { const s = $sf.ext.supports(); return s && s['exp-ovr'] ? 'sfexp' : 'sf'; } return 'sf'; } return 'nosf'; }());
    const ref = (function (w) {
      try {
        while (w.parent && w.parent !== window.top) {
          if (!w.parent.document) { break; } w = w.parent;
        }
      } catch (ignore) { } return w.document.referrer;
    }(window));
    var e = function (u) { return encodeURIComponent(u); }; const tid = `cbox_ph_${Math.floor(Math.random() * 10e6)}`; let h;
    const src = `https://ws.contobox.com/getcode.js?ph_id=${
      tid}&brandID=5393&websiteID=119&zoneID=176739&adID=176247&clientparam=&lid=${lidJson}&sourceUrl=${e(sourceUrl)}&ifr=${ifr}&isSF=${isSF}&clicktag=${e(cMacro)}&fromurl=${
      e(location.href)}&nomraid=true&ref=${e(ref)}`; const
      s = d.createElement('script'); s.type = 'text/javascript';
    s.async = true; s.src = src; d.body.appendChild(s);
  });
}(document));

loadScript('https://s-a.innovid.com/conversion/1hk0tl');
loadScript('https://arttrk.com/pixel/?ad_log=referer&action=content&pixid=82dc3545-14a0-41d8-9870-2156059087d9');
