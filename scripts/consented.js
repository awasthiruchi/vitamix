import { loadScript } from './aem.js';

// add delayed functionality here
window.config = {
  POOLID: 'us-east-1:d54ecd7d-db6e-456d-bf35-d26346122a63',
  REGION: 'us-east-1',
  BOTID: 'JBPXLTC0LW',
  BOTALIASID: 'HUKYDI5LGI',
};

loadScript('https://www.vitamix.com/etc.clientlibs/vitamix/clientlibs/clientlib-chatbot.lc-5aa4591c22ce9007a60fafc1f19aa690-lc.min.js');
loadScript('https://www.vitamix.com/etc.clientlibs/core/wcm/components/commons/site/clientlibs/container.lc-0a6aff292f5cc42142779cde92054524-lc.min.js');
loadScript('https://assets.adobedtm.com/launch-EN40f2d69539754c3ea73511e70c65c801.min.js');
loadScript('https://js.adsrvr.org/up_loader.1.1.0.js');

loadScript('https://www.vitamix.com/etc.clientlibs/vitamix/clientlibs/clientlib-chatbot.lc-5aa4591c22ce9007a60fafc1f19aa690-lc.min.js');

await loadScript('https://www.vitamix.com/etc.clientlibs/vitamix/clientlibs/clientlib-library.lc-259cf15444c5fe1f89e5c54df7b6e1e9-lc.min.js');
loadScript('https://www.vitamix.com/etc.clientlibs/vitamix/clientlibs/clientlib-analytics.lc-26814920488a848ff91c1f425646d010-lc.min.js');
loadScript('https://www.vitamix.com/etc.clientlibs/vitamix/clientlibs/clientlib-base.lc-daf5b8dac79e9cf7cb1c0b30d8372e7a-lc.min.js');

/* eslint-disable */

loadScript('https://www.googletagmanager.com/gtag/js?id=AW-1070742187', { 'data-cookieconsent': 'marketing' });
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'AW-1070742187');

loadScript('https://www.googletagmanager.com/gtag/js?id=G-XJB3SPQE38');
gtag('js', new Date());
gtag('config', 'G-XJB3SPQE38');


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
loadScript('https://cdn.evgnet.com/beacon/vitamixmgmtcorp/vitamix_us/scripts/evergage.min.js');

loadScript('https://www.googletagmanager.com/gtag/js?id=DC-10418690');
gtag('js', new Date());
gtag('config', 'DC-10418690');


// Facebook Pixel Code

!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1597403650511067');
fbq('track', 'PageView');

// End Facebook Pixel Code
// AcuityAds Pixel
    'use strict'
    !(function(a, e) {
        if (!a.aap) {
            a.aap = function(e) {
                ;(a.acuityAdsEventQueue = a.acuityAdsEventQueue || []).push(e)
            }
            var t = 'script'
            var i = e.createElement(t)
            i.async = true
            i.src = 'https://origin.acuityplatform.com/event/v2/pixel.js'
            var c = e.getElementsByTagName(t)[0]
            c.parentNode.insertBefore(i, c)
            a.acuityPiggybackCallback = function(e) {
                a.acuityParseResponse(e)
            }
        }
    })(window, document)
    aap({ pixelKey: '5133925694833979260' })
// End of AcuityAds Pixel // End of global snippet

// Snap Pixel Code
try {
  (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
    {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
    a.queue=[];var s='script';const r=t.createElement(s);r.async=!0;
    r.src=n;var u=t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r,u);})
    (window,document,'https://sc-static.net/scevent.min.js');
    snaptr('init', '308aeb00-4528-4312-b257-3d04cbdc93a0', {'user_email': 'email_variable'});
    snaptr('track', 'PAGE_VIEW');
} catch (error) {
  console.error('Snap Pixel Code failed to load', error);
}
// End of Snap Pixel Code

// Pinterest Tag
!function(e){
if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(
Array.prototype.slice.call(arguments))};
var n=window.pintrk;n.queue=[],n.version="3.0";
var t=document.createElement("script");t.async=!0,t.src=e;
var r=document.getElementsByTagName("script")[0];
r.parentNode.insertBefore(t,r)}}
("https://s.pinimg.com/ct/core.js");
pintrk('load', '2621075961855'); pintrk('page');
// End of Pinterest Tag




// TV Scientific Pixel Code
try {
setTimeout(function () {var p, s, d, w;d = document;w = window.location;p = d.createElement("IMG");s = w.protocol + "//tvspix.com/t.png?&t=" + (new Date).getTime() + "&l=tvscientific-pix-o-4b66e973-23f2-45e9-91e5-aa5f89462df5&u3=" + encodeURIComponent(w.href);p.setAttribute("src", s);
p.setAttribute("height", "0");p.setAttribute("width", "0");p.setAttribute("alt", "");p.style.setProperty("display", "none");p.style.setProperty("position", "absolute");
p.style.setProperty("visibility", "hidden");d.body.appendChild(p);},500);
} catch (error) {
  console.error('TV Scientific Pixel Code failed to load', error);
}


// Tune Pixel Code
!function(){var e=window.tdl=window.tdl||[];if(e.invoked)window.console&&console.error&&console.error("Tune snippet has been included more than once.");else{e.invoked=!0,e.methods=["init","identify","convert"],e.factory=function(t){return function(){var n=Array.prototype.slice.call(arguments);return n.unshift(t),e.push(n),e}};for(var t=0;t<e.methods.length;t++){var n=e.methods[t];e[n]=e.factory(n)}e.init=function(t){var n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://js.go2sdk.com/v2/tune.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(n,r),e.domain=t}}}();
tdl.init("https://perkspot.go2cloud.org");
tdl.identify();
// End of Tune Pixel Code

// Krateo pixel
    (function(a,b,c,d){
        var cookieUrl = encodeURIComponent("https://www.vitamix.com/us/en_us/cookie/index/index");
        a='https://www.mczbf.com/tags/11931/tag.js?cookieUrl='+cookieUrl;
        b=document;c='script';d=b.createElement(c);d.src=a;
        d.type='text/java'+c;d.async=true;
        d.id='cjapitag';
        a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a)
    })();



await loadScript('https://www.googletagmanager.com/gtag/js?id=AW-992994739');
gtag('js', new Date());
gtag('config', 'AW-992994739');



loadScript('https://cdn.datasteam.io/js/D26F66D1AD707A.js');


