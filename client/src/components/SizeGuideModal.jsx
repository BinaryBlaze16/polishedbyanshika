import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('standard');
  const [measurements, setMeasurements] = useState({
    thumb: '', index: '', middle: '', ring: '', pinky: ''
  });
  const [suggestedSize, setSuggestedSize] = useState(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const calculateSize = () => {
    // Simple average logic for demonstration
    const vals = Object.values(measurements).map(v => parseFloat(v)).filter(v => !isNaN(v));
    if (vals.length < 5) return;
    const avg = vals.reduce((a, b) => a + b, 0) / 5;
    
    if (avg < 13) setSuggestedSize('S');
    else if (avg < 15) setSuggestedSize('M');
    else setSuggestedSize('L');
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white border border-rose-100 w-full max-w-2xl rounded-2xl shadow-luxury overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-rose-100">
          <h2 className="text-2xl font-display font-bold text-dark-800 flex items-center gap-2">
            <Ruler className="text-rose-500" /> Size Guide
          </h2>
          <button onClick={onClose} className="p-2 text-dark-400 hover:text-dark-700 rounded-full hover:bg-rose-50 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-rose-100">
          <button 
            className={`flex-1 py-4 font-medium transition-colors ${activeTab === 'standard' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-dark-400 hover:text-dark-600'}`}
            onClick={() => setActiveTab('standard')}
          >
            Standard Sizes
          </button>
          <button 
            className={`flex-1 py-4 font-medium transition-colors ${activeTab === 'measure' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-dark-400 hover:text-dark-600'}`}
            onClick={() => setActiveTab('measure')}
          >
            Measure My Size
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'standard' ? (
            <div className="space-y-6">
              <p className="text-dark-400 text-sm">Find your perfect fit using our standard sizing chart. Measurements are in millimeters (mm).</p>
              
              <div className="overflow-x-auto rounded-xl border border-rose-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-rose-50 text-dark-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Size</th>
                      <th className="px-4 py-3 font-semibold">Thumb</th>
                      <th className="px-4 py-3 font-semibold">Index</th>
                      <th className="px-4 py-3 font-semibold">Middle</th>
                      <th className="px-4 py-3 font-semibold">Ring</th>
                      <th className="px-4 py-3 font-semibold">Pinky</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50 text-dark-500">
                    <tr className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-dark-800">S</td>
                      <td className="px-4 py-3">15mm</td>
                      <td className="px-4 py-3">11mm</td>
                      <td className="px-4 py-3">12mm</td>
                      <td className="px-4 py-3">11mm</td>
                      <td className="px-4 py-3">8mm</td>
                    </tr>
                    <tr className="bg-rose-50/50 hover:bg-rose-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-rose-500">M</td>
                      <td className="px-4 py-3">16mm</td>
                      <td className="px-4 py-3">12mm</td>
                      <td className="px-4 py-3">13mm</td>
                      <td className="px-4 py-3">12mm</td>
                      <td className="px-4 py-3">9mm</td>
                    </tr>
                    <tr className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-dark-800">L</td>
                      <td className="px-4 py-3">18mm</td>
                      <td className="px-4 py-3">13mm</td>
                      <td className="px-4 py-3">14mm</td>
                      <td className="px-4 py-3">13mm</td>
                      <td className="px-4 py-3">10mm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gold-50 border border-gold-200 p-4 rounded-xl">
                <h4 className="text-gold-600 font-medium mb-1 text-sm">💡 Pro Tip</h4>
                <p className="text-dark-400 text-xs">If you are between sizes, it's always better to size up! You can file down the edges of larger press-ons for a perfect custom fit.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-dark-800 font-medium">How to measure:</h3>
                  <ol className="list-decimal list-inside text-sm text-dark-400 space-y-2">
                    <li>Place a piece of clear tape across the widest part of your nail.</li>
                    <li>Mark the side edges of your nail on the tape with a pen.</li>
                    <li>Remove tape and measure the distance between marks with a ruler in millimeters (mm).</li>
                    <li>Repeat for all 10 fingers.</li>
                  </ol>
                  
                  <div className="mt-4 p-4 border border-dashed border-rose-200 rounded-xl bg-rose-50/50 flex items-center justify-center">
                    <span className="text-dark-300 italic text-sm">Visual diagram placeholder</span>
                  </div>
                </div>

                <div className="bg-linen-100 p-5 rounded-xl border border-rose-100">
                  <h3 className="text-dark-800 font-medium mb-4">Enter Measurements (mm)</h3>
                  <div className="space-y-3">
                    {['thumb', 'index', 'middle', 'ring', 'pinky'].map((finger) => (
                      <div key={finger} className="flex items-center justify-between">
                        <label className="text-sm text-dark-500 capitalize w-20">{finger}</label>
                        <input 
                          type="number" 
                          min="5" max="25"
                          value={measurements[finger]}
                          onChange={(e) => setMeasurements({...measurements, [finger]: e.target.value})}
                          className="bg-white border border-rose-200 text-dark-800 rounded-lg px-3 py-1.5 w-24 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-right"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={calculateSize}
                    className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Find My Size
                  </button>

                  {suggestedSize && (
                    <div className="mt-4 text-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <p className="text-sm text-dark-500">Your suggested size is:</p>
                      <p className="text-2xl font-bold text-emerald-600">{suggestedSize}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
