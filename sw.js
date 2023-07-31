var CACHE_NAME = 'my-site-cache-v1'; // cache对象的名字
var urlCache=[
  './',
  './index.html',
  './assets/about.html',
  './assets/changelog.html',
  './assets/docs.html',
  './assets/feedback.html',
  './assets/thanks.html',
  './img/background-icon.png',
  './img/by.gif',
  './img/bzy.gif',
  './img/zy.gif',
  './img/zby.gif',
  './img/in.gif',
  './img/logo.svg',
  './media/ring.mp3'
]

// 如果所有文件都成功缓存，则将安装成功
self.addEventListener('install', function(event) {
  // 执行安装步骤
  // ExtendableEvent.waitUntil()方法延长了安装过程，直到其传回的Promise被resolve之后才会安装成功
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // console.log('Opened cache');
        return cache.addAll(urlCache);
      })
  );
});

self.addEventListener("activate", function(event) {
  
  console.log("service worker is active");
});

self.addEventListener('fetch', event => {
  const { request } = event; // 获取request
  const findResponsePromise = caches.open(CACHE_NAME)
  // 在match的时候，需要请求的url和header都一致才是相同的资源
  // caches.match(event.request, {ignoreVary: true}) 表示只要请求url相同就认为是同一个资源。
  .then(cache => cache.match(request)) // 查看cache对象中是否有匹配的项
  .then(response => {
      if (response) { // 如果response不为空，则返回response，否则发送网络请求
        caches.open(CACHE_NAME).then(function(cache){
          return cache.add(request);
        })
        return response;
      }

      return fetch(request);
  });
  // event.respondWith 是一个 FetchEvent 对象中的特殊方法，用于将请求的响应发送回浏览器。它接收一个对响应（或网络错误）resolve 后的 Promise 对象作为参数。
  event.respondWith(findResponsePromise);
});