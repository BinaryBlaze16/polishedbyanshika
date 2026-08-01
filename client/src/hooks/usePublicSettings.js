import { useState, useEffect } from 'react';
import api from '../services/api';

const DEFAULT_SETTINGS = {
  businessName: 'Polished By Anshika',
  businessWhatsapp: '+91 63948 02184',
  businessInstagram: '@polished_by_anshika',
  businessEmail: 'polishedbyanshika@gmail.com',
  businessUpi: 'srivastavaanant39@oksbi',
  shippingCharge: 50,
  freeShippingAbove: 999,
};

export const usePublicSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicSettings = async () => {
      try {
        const res = await api.get('/settings/public');
        if (isMounted && res.data && res.data.success && res.data.data) {
          const fetched = res.data.data;
          try {
            localStorage.setItem('settings-storage', JSON.stringify({ state: fetched }));
          } catch(e) {}
          setSettings({
            businessName: fetched.businessName || DEFAULT_SETTINGS.businessName,
            businessWhatsapp: fetched.businessWhatsapp || DEFAULT_SETTINGS.businessWhatsapp,
            businessInstagram: fetched.businessInstagram || DEFAULT_SETTINGS.businessInstagram,
            businessEmail: fetched.businessEmail || DEFAULT_SETTINGS.businessEmail,
            businessUpi: fetched.businessUpi || DEFAULT_SETTINGS.businessUpi,
            shippingCharge: Number(fetched.shippingCharge ?? DEFAULT_SETTINGS.shippingCharge),
            freeShippingAbove: Number(fetched.freeShippingAbove ?? DEFAULT_SETTINGS.freeShippingAbove),
          });
        }
      } catch (err) {
        console.error('Failed to load public settings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPublicSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Clean WhatsApp phone for wa.me link
  const rawPhone = (settings.businessWhatsapp || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawPhone || '916394802184'}`;

  // Clean Instagram handle for instagram.com link
  const rawInsta = (settings.businessInstagram || '').replace(/^@/, '').trim();
  const instagramUrl = `https://instagram.com/${rawInsta || 'polished_by_anshika'}`;
  const instagramHandle = `@${rawInsta || 'polished_by_anshika'}`;

  const emailUrl = `mailto:${settings.businessEmail || DEFAULT_SETTINGS.businessEmail}`;

  return {
    settings,
    loading,
    whatsappUrl,
    instagramUrl,
    instagramHandle,
    emailUrl,
  };
};

export default usePublicSettings;
