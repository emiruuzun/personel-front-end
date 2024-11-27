export const setCookie = (name, value, expiryDays) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(
      value
    )};${expires};path=/;domain=${
      window.location.hostname
    };SameSite=Lax;Secure`;
  } catch (error) {
    console.error(`Cookie ${name} ayarlanamadı: `, error);
  }
};

export const getCookie = (name) => {
  try {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    console.warn(`Cookie ${name} bulunamadı.`);
    return null;
  } catch (error) {
    console.error(`Cookie ${name} okunamadı: `, error);
    return null;
  }
};

// export const deleteCookie = (name) => {
//   try {
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//     console.log(`Cookie ${name} başarıyla silindi.`);
//   } catch (error) {
//     console.error(`Cookie ${name} silinemedi: `, error);
//   }
// };

export const deleteCookie = (name) => {
  try {
    const isLocalhost = window.location.hostname === "localhost";
    const secureFlag = isLocalhost ? "" : "Secure";
    const sameSite = isLocalhost ? "Lax" : "None";
    const domain = isLocalhost ? "" : `domain=${window.location.hostname};`;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${domain} SameSite=${sameSite}; ${secureFlag}`;
    console.log(`Cookie ${name} başarıyla silindi.`);
    console.log(getCookie("access_token")); // null dönerse silme işlemi başarılı
  } catch (error) {
    console.error(`Cookie ${name} silinemedi: `, error);
  }
};
