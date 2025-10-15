export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we can't access window.top due to cross-origin restrictions,
    // we're definitely in an iframe
    return true;
  }
};

export const isInGoHighLevelIframe = (): boolean => {
  if (!isInIframe()) return false;
  
  try {
    // Try to check the parent origin
    const parentOrigin = document.referrer;
    
    // GoHighLevel domains to whitelist
    const ghlDomains = [
      'gohighlevel.com',
      'highlevel.com',
      'msgsndr.com', // GHL's infrastructure domain
    ];
    
    return ghlDomains.some(domain => parentOrigin.includes(domain));
  } catch (e) {
    // If we can't check the referrer, assume it's valid if we're in an iframe
    // (more permissive approach)
    return true;
  }
};
