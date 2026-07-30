import React, { useState } from 'react';
import { Home, Briefcase, Users, MapPin, CheckCircle, Edit2, Trash2, Star, Check } from 'lucide-react';

const AddressCard = ({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  selectable = true
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = () => {
    switch (address.addressType) {
      case 'Office':
        return <Briefcase size={16} className="text-blue-500" />;
      case 'Parents':
        return <Users size={16} className="text-purple-500" />;
      case 'Other':
        return <MapPin size={16} className="text-emerald-500" />;
      default:
        return <Home size={16} className="text-rose-500" />;
    }
  };

  const handleDeleteConfirm = () => {
    if (window.confirm('Are you sure you want to delete this saved address?')) {
      setIsDeleting(true);
      onDelete(address._id || address.id);
    }
  };

  return (
    <div
      onClick={() => selectable && onSelect && onSelect(address)}
      className={`relative bg-white rounded-2xl p-5 md:p-6 border transition-all duration-300 ${
        selectable ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'border-2 border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20 shadow-card'
          : 'border-rose-100 hover:border-rose-300 hover:shadow-card-hover'
      }`}
    >
      {/* Header Badges */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            {getIcon()}
            {address.addressType || 'Home'}
          </span>
          {address.isDefault && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300/80 shadow-xs">
              <Star size={12} className="fill-amber-500 text-amber-500" /> Default
            </span>
          )}
        </div>

        {selectable && (
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                isSelected
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : 'border-rose-300 bg-white'
              }`}
            >
              {isSelected && <Check size={12} className="stroke-[3]" />}
            </div>
          </div>
        )}
      </div>

      {/* Name & Phone */}
      <div className="mb-2">
        <h4 className="font-semibold text-dark-800 text-base flex items-center gap-2">
          {address.fullName}
        </h4>
        <p className="text-xs text-dark-400 font-medium">📞 {address.phone}</p>
      </div>

      {/* Address Details */}
      <div className="text-sm text-dark-600 leading-relaxed space-y-0.5 mb-4">
        <p className="font-medium text-dark-800">
          {address.houseNumber}, {address.street}
        </p>
        {address.landmark && (
          <p className="text-xs text-dark-400">Landmark: {address.landmark}</p>
        )}
        <p>
          {address.city}, {address.state} — <span className="font-semibold text-dark-800">{address.pincode}</span>
        </p>
        <p className="text-xs text-dark-400">{address.country || 'India'}</p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-rose-100/60 text-xs">
        <div className="flex items-center gap-3">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="flex items-center gap-1 text-dark-500 hover:text-rose-600 font-medium transition-colors p-1"
            >
              <Edit2 size={14} /> Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConfirm();
              }}
              disabled={isDeleting}
              className="flex items-center gap-1 text-red-400 hover:text-red-600 font-medium transition-colors p-1 disabled:opacity-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>

        {onSetDefault && !address.isDefault && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetDefault(address._id || address.id);
            }}
            className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-medium transition-colors p-1 hover:underline"
          >
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
