import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MessageCircle, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAuthStore from '../store/useAuthStore';
import customRequestService from '../services/customRequestService';
import toast from 'react-hot-toast';
import usePublicSettings from '../hooks/usePublicSettings';

export default function CustomOrder() {
  const { user } = useAuthStore();
  const { settings } = usePublicSettings();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    shape: 'Almond',
    length: 'Medium',
    budget: '1500-2000',
    description: '',
    link: ''
  });

  const shapes = ['Almond', 'Coffin', 'Square', 'Stiletto', 'Oval'];
  const lengths = ['Short', 'Medium', 'Long', 'Extra Long'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a custom order");
      navigate("/login?redirect=/custom-order");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting custom design request...");
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("phone", formData.phone);
      fd.append("shape", formData.shape);
      fd.append("length", formData.length);
      fd.append("description", formData.description);
      fd.append("link", formData.link);
      fd.append("budget", formData.budget);

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          fd.append("referenceImages", files[i]);
        }
      }

      await customRequestService.submitCustomRequest(fd);
      toast.success("Request submitted successfully! 🎨", { id: toastId });

      // Build WhatsApp message
      const msg = `Hi ${settings.businessName}! I just submitted a custom request on the website.
Name: ${formData.name}
Shape: ${formData.shape}, Length: ${formData.length}
Budget: ₹${formData.budget}
Idea: ${formData.description}`;
      const rawWa = (settings.businessWhatsapp || '').replace(/[^0-9]/g, '') || "916394802184";
      window.open(`https://wa.me/${rawWa}?text=${encodeURIComponent(msg)}`, '_blank');

      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        shape: 'Almond',
        length: 'Medium',
        budget: '1500-2000',
        description: '',
        link: ''
      });
      setFiles([]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit custom request", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans flex flex-col relative">
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-rose-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 pt-24 md:pt-28 pb-12 lg:pb-20 flex flex-col lg:flex-row gap-16">
        
        {/* Left Side Content */}
        <div className="lg:w-5/12 space-y-8 z-10">
          <div>
            <span className="inline-block px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-sm font-medium mb-4 flex items-center gap-2 w-max">
              <Sparkles size={14} /> Bespoke Creations
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6 text-dark-800">
              Bring Your Dream <span className="text-rose-500">Nails</span> to Life
            </h1>
            <p className="text-dark-400 text-lg leading-relaxed">
              Have a specific design in mind? Seen something on Pinterest? Fill out the details and let's create a personalized, handcrafted set just for you.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4 p-4 rounded-2xl bg-white border border-rose-100">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <h4 className="font-bold text-dark-800 mb-1">Share your vision</h4>
                <p className="text-sm text-dark-400">Upload inspo pictures or describe your idea in detail.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white border border-rose-100">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 font-bold">2</div>
              <div>
                <h4 className="font-bold text-dark-800 mb-1">Get a quote</h4>
                <p className="text-sm text-dark-400">We'll review and give you a final price based on complexity.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white border border-rose-100">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 font-bold">3</div>
              <div>
                <h4 className="font-bold text-dark-800 mb-1">Creation & Delivery</h4>
                <p className="text-sm text-dark-400">Your unique set is handcrafted and shipped to your door.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:w-7/12 z-10">
          <div className="bg-white/[0.03] border border-rose-100 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-dark-400 mb-2">Name</label>
                  <input type="text" name="name" value={formData.name} required onChange={handleChange} className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-2">WhatsApp Number</label>
                  <input type="tel" name="phone" value={formData.phone} required onChange={handleChange} className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-400 mb-3">Preferred Shape</label>
                <div className="flex flex-wrap gap-3">
                  {shapes.map(s => (
                    <button type="button" key={s} onClick={() => setFormData({...formData, shape: s})} className={`px-5 py-2 rounded-full border text-sm transition-all ${formData.shape === s ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-rose-200 text-dark-400 hover:border-rose-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-400 mb-3">Preferred Length</label>
                <div className="flex flex-wrap gap-3">
                  {lengths.map(l => (
                    <button type="button" key={l} onClick={() => setFormData({...formData, length: l})} className={`px-5 py-2 rounded-full border text-sm transition-all ${formData.length === l ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-rose-200 text-dark-400 hover:border-rose-500'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-400 mb-2">Describe Your Design</label>
                <textarea name="description" value={formData.description} rows="4" required onChange={handleChange} placeholder="E.g., I want a black base with silver chrome stars..." className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm text-dark-400 mb-2">Reference Link (Instagram/Pinterest)</label>
                <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm text-dark-400 mb-2">Budget Range (INR)</label>
                <select name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none text-dark-800">
                  <option value="1000-1500">₹1,000 - ₹1,500</option>
                  <option value="1500-2000">₹1,500 - ₹2,000</option>
                  <option value="2000-3000">₹2,000 - ₹3,000</option>
                  <option value="3000+">₹3,000+</option>
                </select>
              </div>

              {/* File Upload UI */}
              <div className="border-2 border-dashed border-rose-200 rounded-2xl p-8 text-center hover:bg-white transition-colors cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const chosenFiles = Array.from(e.target.files);
                    if (chosenFiles.length > 3) {
                      toast.error("You can upload a maximum of 3 reference images");
                      setFiles(chosenFiles.slice(0, 3));
                    } else {
                      setFiles(chosenFiles);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload size={32} className="mx-auto text-dark-300 mb-4" />
                <p className="text-dark-800 font-medium mb-1">
                  {files.length > 0 ? `${files.length} file(s) selected` : "Drop reference images here"}
                </p>
                <p className="text-sm text-dark-400">
                  {files.length > 0 ? Array.from(files).map(f => f.name).join(', ') : "or click to browse (Max 3 files)"}
                </p>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#25D366] hover:bg-[#20b958] text-dark-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50">
                <MessageCircle size={24} /> Submit & Confirm via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
