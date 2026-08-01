import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { Sparkles, Save, HelpCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    businessName: "",
    businessWhatsapp: "",
    businessInstagram: "",
    businessUpi: "",
    shippingCharge: 0,
    freeShippingAbove: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res && res.success) {
        const settingsMap = {};
        res.data.forEach((s) => {
          settingsMap[s.key] = s.value;
        });
        setSettings({
          businessName: settingsMap.businessName || "PolishedByAnshika",
          businessWhatsapp: settingsMap.businessWhatsapp || "",
          businessInstagram: settingsMap.businessInstagram || "",
          businessEmail: settingsMap.businessEmail || "polishedbyanshika@gmail.com",
          businessUpi: settingsMap.businessUpi || "",
          shippingCharge: Number(settingsMap.shippingCharge) || 0,
          freeShippingAbove: Number(settingsMap.freeShippingAbove) || 0,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load studio settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving settings...");
    try {
      // Save settings sequentially/parallelly
      const promises = Object.entries(settings).map(([key, value]) =>
        adminService.updateSetting(key, String(value))
      );
      await Promise.all(promises);
      toast.success("Settings updated successfully! ✨", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-dark-800">Studio Configurations</h1>
        <p className="text-dark-400 text-sm mt-1">Control your business metadata, payment details, and shipping thresholds.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Business Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white0 border border-rose-900/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-dark-800 border-b border-rose-900/10 pb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-rose-500" /> Business Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={settings.businessName}
                  onChange={handleInputChange}
                  required
                  className="input-dark w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">WhatsApp Number</label>
                <input
                  type="text"
                  name="businessWhatsapp"
                  value={settings.businessWhatsapp}
                  onChange={handleInputChange}
                  required
                  placeholder="+91..."
                  className="input-dark w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Instagram Handle</label>
                <input
                  type="text"
                  name="businessInstagram"
                  value={settings.businessInstagram}
                  onChange={handleInputChange}
                  placeholder="@polishedbyanshika"
                  className="input-dark w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Business Support Email</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={settings.businessEmail || ''}
                  onChange={handleInputChange}
                  placeholder="polishedbyanshika@gmail.com"
                  className="input-dark w-full"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">UPI ID for Payments</label>
                <input
                  type="text"
                  name="businessUpi"
                  value={settings.businessUpi}
                  onChange={handleInputChange}
                  placeholder="anshika@upi"
                  className="input-dark w-full"
                />
              </div>
            </div>
          </div>

          {/* Shipping configurations */}
          <div className="bg-white0 border border-rose-900/20 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-dark-800 border-b border-rose-900/10 pb-3 flex items-center gap-2">
              🚚 Shipping Policy Settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Standard Shipping Fee (₹)</label>
                <input
                  type="number"
                  name="shippingCharge"
                  value={settings.shippingCharge}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="input-dark w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Free Shipping Minimum Threshold (₹)</label>
                <input
                  type="number"
                  name="freeShippingAbove"
                  value={settings.freeShippingAbove}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="input-dark w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Column & Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-rose-950/20 to-purple-950/20 border border-rose-500/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-md font-bold text-dark-800 flex items-center gap-2">
              <HelpCircle size={18} className="text-rose-500" /> Save Configurations
            </h3>
            <p className="text-xs text-dark-400 leading-relaxed">
              Updating these fields affects the client-side checkout calculation, WhatsApp message redirects, and banner defaults in real-time.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary flex items-center justify-center gap-2 shadow-glow-rose disabled:opacity-50 py-3 rounded-xl font-bold"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Studio Configurations
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
