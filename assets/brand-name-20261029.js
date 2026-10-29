// Display-name update for the existing published website. No account or consent changes.
const preservedLegalPage = /\/testflight\//.test(location.pathname)
  || /^\/(?:en|zh-cn|zh-tw)\/(?:privacy|terms)\/?$/.test(location.pathname);
if (!preservedLegalPage) {
  const rename = value => value.replace(/\bBailu Practice\b/g, 'Bailu Hub').replace(/\bBailu\b(?! Hub\b)/g, 'Bailu Hub');
  const observer = new MutationObserver(updateBrandName);
  function observe() {
    observer.observe(document.documentElement, {subtree:true, childList:true, characterData:true,
      attributes:true, attributeFilter:['lang','content','aria-label','alt']});
  }
  function updateBrandName() {
    observer.disconnect();
    if (document.body) {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.parentElement?.closest('script,style,noscript,input,textarea,code,pre,[contenteditable],[data-user-content]')) continue;
        const next = rename(node.nodeValue || '');
        if (next !== node.nodeValue) node.nodeValue = next;
      }
    }
    const title = rename(document.title);
    if (document.title !== title) document.title = title;
    document.querySelectorAll('meta[name="application-name"],meta[name="apple-mobile-web-app-title"],meta[name="description"],meta[property^="og:"],meta[name^="twitter:"]').forEach(node => {
      const value = node.getAttribute('content') || '';
      const next = rename(value);
      if (next !== value) node.setAttribute('content', next);
    });
    document.querySelectorAll('a[aria-label],img[alt]').forEach(node => {
      const name = node.tagName === 'IMG' ? 'alt' : 'aria-label';
      const value = node.getAttribute(name) || '';
      const next = rename(value);
      if (next !== value) node.setAttribute(name, next);
    });
    document.querySelectorAll('script[type="application/ld+json"]').forEach(node => {
      try {
        const data = JSON.parse(node.textContent);
        let changed = false;
        function visit(value) {
          if (!value || typeof value !== 'object') return;
          Object.entries(value).forEach(([key, child]) => {
            if (['name','description','headline'].includes(key) && typeof child === 'string') {
              const next = rename(child);
              if (next !== child) { value[key] = next; changed = true; }
            } else if (typeof child === 'object') visit(child);
          });
        }
        visit(data);
        if (changed) node.textContent = JSON.stringify(data);
      } catch { /* Leave unrelated structured data unchanged. */ }
    });
    observe();
  }
  updateBrandName();
}
