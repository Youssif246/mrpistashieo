/**
 * Centralized Application Configuration
 * All social media links and WhatsApp contacts are managed here.
 */

export const APP_CONFIG = {
  // Replace this phone number with the official company WhatsApp number (with international country code, no + or spaces)
  whatsappNumber: '34600000000',

  social: {
    instagram: 'https://www.instagram.com/mister.pistachio/',
    facebook: 'https://www.facebook.com/profile.php?id=61594005164773',
    youtube: 'https://youtube.com/@mister_pistachio'
  },

  // Generates a direct WhatsApp link with a contextually pre-filled message
  getWhatsAppUrl(message?: string): string {
    const defaultMsg = 'Hello, I would like to know more about your pistachio plants.';
    const text = encodeURIComponent(message || defaultMsg);
    return `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${text}`;
  }
};
