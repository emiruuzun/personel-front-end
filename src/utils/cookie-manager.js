// cookie-manager.js
export const setCookie = (name, value, expiryDays) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    
    // Ortama göre domain ayarı
    const hostname = window.location.hostname;
    let domain = '';
    
    if (hostname !== 'localhost') {
      // Production ortamı için domain ayarı
      domain = hostname.startsWith('www.') 
        ? hostname.substring(4) 
        : hostname;
      domain = `domain=.${domain};`;
    }
    
    // Cookie ayarları
    document.cookie = `${name}=${value};${expires};path=/;${domain}secure;samesite=strict`;
    
    console.log('Cookie set:', {
      name,
      domain: domain || 'localhost',
      secure: true,
      sameSite: 'strict'
    });
  } catch (error) {
    console.error('setCookie error:', error);
  }
};

export const getCookie = (name) => {
  try {
    const cookies = document.cookie.split(';');
    console.log('All cookies:', cookies);
    
    const cookie = cookies.find(c => c.trim().startsWith(name + '='));
    
    if (cookie) {
      const value = cookie.split('=')[1].trim();
      console.log('Cookie found:', name, value);
      return value;
    }
    
    console.log('Cookie not found:', name);
    return null;
  } catch (error) {
    console.error('getCookie error:', error);
    return null;
  }
};

export const deleteCookie = (name) => {
  try {
    const hostname = window.location.hostname;
    let domain = '';
    
    if (hostname !== 'localhost') {
      domain = hostname.startsWith('www.') 
        ? hostname.substring(4) 
        : hostname;
      domain = `domain=.${domain};`;
    }
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;${domain}secure;samesite=strict`;
    console.log('Cookie deleted:', name);
  } catch (error) {
    console.error('deleteCookie error:', error);
  }
};