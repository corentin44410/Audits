if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,o)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let r={};const l=e=>n(e,t),c={module:{uri:t},exports:r,require:l};s[t]=Promise.all(i.map((e=>c[e]||l(e)))).then((e=>(o(...e),r)))}}define(["./workbox-b833909e"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-Bx7t097r.css",revision:null},{url:"assets/index-QSbtu2Ym.js",revision:null},{url:"assets/workbox-window.prod.es5-DL_hIMXg.js",revision:null},{url:"index.html",revision:"d9f273b84292f0b24c24be4571c244e9"},{url:"favicon.ico",revision:"d24da28f068ada2c533a988e53499440"},{url:"pwa-192x192.png",revision:"d1c453226584ff1975328663a97abd74"},{url:"pwa-512x512.png",revision:"58a277eaa2eb4d3e36832259945699e3"},{url:"manifest.webmanifest",revision:"aceb59e462ee74a00d4d3f5ff3fd7146"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
