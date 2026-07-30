import React, { useState, useEffect } from 'react';
import { X, Home, Briefcase, Users, MapPin, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

const AddressModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('Home');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      addressType: 'Home',
      houseNumber: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isDefault: false
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        addressType: initialData.addressType || 'Home',
        houseNumber: initialData.houseNumber || initialData.addressLine1 || '',
        street: initialData.street || initialData.addressLine2 || '',
        landmark: initialData.landmark || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pincode: initialData.pincode || '',
        country: initialData.country || 'India',
        isDefault: Boolean(initialData.isDefault)
      });
      setSelectedType(initialData.addressType || 'Home');
    } else {
      reset({
        fullName: '',
        phone: '',
        addressType: 'Home',
        houseNumber: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false
      });
      setSelectedType('Home');
    }
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setValue('addressType', type);
  };

  const onSubmitForm = async (data) => {
    setLoading(true);
    try {
      await onSave({ ...data, addressType: selectedType });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addressTypes = [
    { type: 'Home', icon: Home },
    { type: 'Office', icon: Briefcase },
    { type: 'Parents', icon: Users },
    { type: 'Other', icon: MapPin },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#FDF8F4] border border-rose-100 w-full max-w-xl rounded-3xl shadow-luxury overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-rose-100">
          <div>
            <h3 className="text-xl font-display font-bold text-dark-800">
              {initialData ? 'Edit Address 🏠' : 'Add New Address 📍'}
            </h3>
            <p className="text-xs text-dark-400 mt-0.5">
              {initialData ? 'Update your saved delivery address' : 'Enter your shipping details below'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-dark-800 rounded-full hover:bg-rose-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar space-y-4">
          
          {/* Address Type Buttons */}
          <div>
            <label className="block text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
              Address Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {addressTypes.map(({ type, icon: Icon }) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                    selectedType === type
                      ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-sm font-semibold'
                      : 'border-rose-200 bg-white text-dark-600 hover:border-rose-300'
                  }`}
                >
                  <Icon size={14} /> {type}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark-600 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Anshika Sharma"
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-dark-800"
              />
              {errors.fullName && <span className="text-xs text-rose-500 mt-1">{errors.fullName.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-600 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                {...register('phone', { required: 'Phone is required' })}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-dark-800"
              />
              {errors.phone && <span className="text-xs text-rose-500 mt-1">{errors.phone.message}</span>}
            </div>
          </div>

          {/* House / Building No */}
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">
              Flat / House No. / Building Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 402, Royal Palms Apartments"
              {...register('houseNumber', { required: 'House / Building is required' })}
              className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-dark-800"
            />
            {errors.houseNumber && <span className="text-xs text-rose-500 mt-1">{errors.houseNumber.message}</span>}
          </div>

          {/* Street / Area */}
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">
              Street / Area / Locality *
            </label>
            <input
              type="text"
              placeholder="e.g. MG Road, Civil Lines"
              {...register('street', { required: 'Street/Area is required' })}
              className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-dark-800"
            />
            {errors.street && <span className="text-xs text-rose-500 mt-1">{errors.street.message}</span>}
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">
              Landmark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Near City Hospital"
              {...register('landmark')}
              className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-dark-800"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark-600 mb-1">
                City *
              </label>
              <input
                type="text"
                placeholder="e.g. Lucknow"
                {...register('city', { required: 'City is required' })}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-dark-800"
              />
              {errors.city && <span className="text-xs text-rose-500 mt-1">{errors.city.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-600 mb-1">
                State *
              </label>
              <input
                type="text"
                placeholder="e.g. Uttar Pradesh"
                {...register('state', { required: 'State is required' })}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-dark-800"
              />
              {errors.state && <span className="text-xs text-rose-500 mt-1">{errors.state.message}</span>}
            </div>
          </div>

          {/* Pincode & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark-600 mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                placeholder="6-digit PIN code"
                {...register('pincode', { required: 'PIN Code is required' })}
                className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-dark-800"
              />
              {errors.pincode && <span className="text-xs text-rose-500 mt-1">{errors.pincode.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-600 mb-1">
                Country
              </label>
              <input
                type="text"
                disabled
                value="India"
                className="w-full bg-linen-100 border border-rose-200 rounded-xl px-4 py-2.5 text-sm text-dark-500 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* Make Default Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              {...register('isDefault')}
              className="w-4 h-4 rounded text-rose-500 border-rose-300 focus:ring-rose-500 cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-xs font-medium text-dark-700 cursor-pointer">
              Set as my default delivery address
            </label>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-rose-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-rose-200 text-dark-600 hover:bg-rose-50 rounded-xl font-medium text-sm transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl font-semibold text-sm transition-all shadow-glow-rose flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                initialData ? 'Update Address' : 'Save & Use Address'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AddressModal;
