import { useState, useEffect } from 'react';
import { PDF_TOOLS } from '../tools/registry';

const BASE_CANONICAL = 'https://pinkpdf.app';

// Helper to extract tool ID or route from current window.location
export function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  const pathname = window.location.pathname.replace(/^\//, '').trim();

  // Prefer hash if present, otherwise pathname
  let raw = hash || pathname;

  // Clean prefixes like "tools/" or "tool/"
  raw = raw.replace(/^tools?\//, '').replace(/\/$/, '');

  if (!raw || raw === 'index.html' || raw === 'home') {
    return { isHome: true, toolId: null, tool: null, isPrivacy: false, isTerms: false };
  }

  // Dedicated Static Policy Pages
  if (raw === 'privacy' || raw === 'privacy-policy') {
    return { isHome: false, isPrivacy: true, isTerms: false, toolId: null, tool: null };
  }
  if (raw === 'terms' || raw === 'terms-of-use' || raw === 'terms-of-service') {
    return { isHome: false, isPrivacy: false, isTerms: true, toolId: null, tool: null };
  }

  // Find tool by ID
  const matchedTool = PDF_TOOLS.find(t => t.id === raw || t.id === raw.toLowerCase());

  if (matchedTool) {
    return { isHome: false, toolId: matchedTool.id, tool: matchedTool, isPrivacy: false, isTerms: false };
  }

  return { isHome: false, toolId: raw, tool: null, isNotFound: true, isPrivacy: false, isTerms: false };
}

// Global navigate function with HTML5 pushState & popstate dispatch
export function navigateTo(path) {
  let targetPath = path;
  if (!targetPath.startsWith('/') && !targetPath.startsWith('#')) {
    targetPath = '/' + targetPath;
  }

  if (window.location.pathname !== targetPath && ('#' + window.location.hash) !== targetPath) {
    window.history.pushState(null, '', targetPath);
  }
  
  // Dispatch custom event to notify all listeners
  window.dispatchEvent(new Event('app-route-change'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to update SEO Meta and Schema dynamically
function updateRouteSEO(route) {
  const canonicalEl = document.getElementById('canonical-url');
  let metaDesc = document.querySelector('meta[name="description"]');
  let ogTitle = document.querySelector('meta[property="og:title"]');
  let ogDesc = document.querySelector('meta[property="og:description"]');
  let ogUrl = document.querySelector('meta[property="og:url"]');
  let twitterTitle = document.querySelector('meta[name="twitter:title"]');
  let twitterDesc = document.querySelector('meta[name="twitter:description"]');
  const schemaScript = document.getElementById('app-schema-jsonld');

  if (route.isPrivacy) {
    const title = `Privacy Policy (Zero Data Collection) — PINKPDF Suite`;
    const desc = `Official PINKPDF Privacy Policy. 100% client-side WebAssembly execution with zero server uploads, no cookies, no user tracking, and in-memory volatile processing.`;
    const pageUrl = `${BASE_CANONICAL}/privacy`;

    document.title = title;
    if (metaDesc) metaDesc.setAttribute('content', desc);
    if (canonicalEl) canonicalEl.setAttribute('href', pageUrl);
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDesc) ogDesc.setAttribute('content', desc);
    if (ogUrl) ogUrl.setAttribute('content', pageUrl);
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    if (twitterDesc) twitterDesc.setAttribute('content', desc);

    if (schemaScript) {
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "name": title,
            "description": desc,
            "url": pageUrl
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": BASE_CANONICAL + "/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Privacy Policy",
                "item": pageUrl
              }
            ]
          }
        ]
      });
    }
  } else if (route.isTerms) {
    const title = `Terms of Use — PINKPDF Suite`;
    const desc = `Official Terms of Use for PINKPDF. Read about our client-side software license, 100% user document ownership, and fair use guidelines.`;
    const pageUrl = `${BASE_CANONICAL}/terms`;

    document.title = title;
    if (metaDesc) metaDesc.setAttribute('content', desc);
    if (canonicalEl) canonicalEl.setAttribute('href', pageUrl);
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDesc) ogDesc.setAttribute('content', desc);
    if (ogUrl) ogUrl.setAttribute('content', pageUrl);
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    if (twitterDesc) twitterDesc.setAttribute('content', desc);

    if (schemaScript) {
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "name": title,
            "description": desc,
            "url": pageUrl
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": BASE_CANONICAL + "/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Terms of Use",
                "item": pageUrl
              }
            ]
          }
        ]
      });
    }
  } else if (route.tool) {
    const title = `${route.tool.name} — Free Online In-Browser PDF Tool | PINKPDF`;
    const desc = `${route.tool.desc} Processed 100% locally in your browser with zero server uploads, military-grade privacy, and WebAssembly speed.`;
    const toolUrl = `${BASE_CANONICAL}/${route.tool.id}`;

    document.title = title;
    if (metaDesc) metaDesc.setAttribute('content', desc);
    if (canonicalEl) canonicalEl.setAttribute('href', toolUrl);
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDesc) ogDesc.setAttribute('content', desc);
    if (ogUrl) ogUrl.setAttribute('content', toolUrl);
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    if (twitterDesc) twitterDesc.setAttribute('content', desc);

    if (schemaScript) {
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "SoftwareApplication",
            "name": route.tool.name,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "WebBrowser, Windows, macOS, Linux, iOS, Android",
            "description": desc,
            "url": toolUrl,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": BASE_CANONICAL + "/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": route.tool.categoryTitle,
                "item": `${BASE_CANONICAL}/#category-${route.tool.category}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": route.tool.name,
                "item": toolUrl
              }
            ]
          }
        ]
      });
    }
  } else if (route.isNotFound) {
    document.title = `Tool Not Found — PINKPDF`;
    if (canonicalEl) canonicalEl.setAttribute('href', `${BASE_CANONICAL}/404`);
  } else {
    // Home Page
    const homeTitle = `PINKPDF — 100% Private, In-Browser Client-Side PDF Suite (33 Tools)`;
    const homeDesc = `Organize, merge, split, compress, edit, convert, and sign PDF documents locally in your browser. 100% private, zero server uploads, unlimited file size, and blazing-fast WebAssembly speed.`;

    document.title = homeTitle;
    if (metaDesc) metaDesc.setAttribute('content', homeDesc);
    if (canonicalEl) canonicalEl.setAttribute('href', `${BASE_CANONICAL}/`);
    if (ogTitle) ogTitle.setAttribute('content', homeTitle);
    if (ogDesc) ogDesc.setAttribute('content', homeDesc);
    if (ogUrl) ogUrl.setAttribute('content', `${BASE_CANONICAL}/`);
    if (twitterTitle) twitterTitle.setAttribute('content', homeTitle);
    if (twitterDesc) twitterDesc.setAttribute('content', homeDesc);

    if (schemaScript) {
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": "https://pinkpdf.app/#website",
            "url": "https://pinkpdf.app/",
            "name": "PINKPDF Suite",
            "description": homeDesc,
            "inLanguage": "en"
          },
          {
            "@type": "SoftwareApplication",
            "@id": "https://pinkpdf.app/#application",
            "name": "PINKPDF Suite",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "WebBrowser, Windows, macOS, Linux, Android, iOS",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Are my files uploaded to any server?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. All operations run 100% locally in your browser memory via WebAssembly and JavaScript. No document data is ever transmitted to an external server."
                }
              },
              {
                "@type": "Question",
                "name": "Is there a limit on file size or number of conversions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Because files are processed locally on your computer rather than on a remote server, there are zero artificial size limits or conversion paywalls."
                }
              },
              {
                "@type": "Question",
                "name": "Does PINKPDF work offline without an internet connection?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Once the web application is loaded in your browser, all PDF manipulation engines operate completely offline without an active network connection."
                }
              }
            ]
          }
        ]
      });
    }
  }
}

// React Hook for active route
export function useAppRoute() {
  const [route, setRoute] = useState(() => parseRoute());

  useEffect(() => {
    const handleRouteChange = () => {
      const nextRoute = parseRoute();
      setRoute(nextRoute);
      updateRouteSEO(nextRoute);
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('app-route-change', handleRouteChange);

    // Initial update
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('app-route-change', handleRouteChange);
    };
  }, []);

  const goToTool = (toolOrId) => {
    const id = typeof toolOrId === 'string' ? toolOrId : toolOrId.id;
    navigateTo(`/${id}`);
  };

  const goToPrivacy = () => {
    navigateTo('/privacy');
  };

  const goToTerms = () => {
    navigateTo('/terms');
  };

  const goHome = () => {
    navigateTo('/');
  };

  return {
    ...route,
    goToTool,
    goToPrivacy,
    goToTerms,
    goHome,
    navigate: navigateTo
  };
}
