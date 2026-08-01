import React, { useState, useRef, useEffect } from 'react';
import { X, Star, Upload, Trash2, Loader2, Camera, CheckCircle2 } from 'lucide-react';
import reviewService from '../services/reviewService';
import toast from 'react-hot-toast';

const STAR_LABELS = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent!'];

export default function WriteReviewModal({ order, item, existingReview, onClose, onSuccess }) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [images, setImages] = useState([]); // new File[] to upload
  const [existingImages, setExistingImages] = useState(existingReview?.images || []);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const total = images.length + existingImages.length + files.length;
    if (total > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files].slice(0, 5));
  };

  const removeNewImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));
  const removeExistingImage = (idx) => setExistingImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    if (!comment.trim()) { toast.error('Please write a review comment'); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (!existingReview) {
        formData.append('productId', item.product?.toString() || item.product);
        formData.append('orderId', order._id);
        formData.append('orderItemId', item._id);
      }
      formData.append('rating', rating);
      formData.append('title', title.trim());
      formData.append('comment', comment.trim());
      images.forEach(img => formData.append('images', img));

      if (existingReview) {
        await reviewService.updateReview(existingReview._id, formData);
        toast.success('Review updated! Pending re-approval. 🔄');
      } else {
        await reviewService.submitReview(formData);
      }
      onSuccess();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to submit review';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-rose-100 shrink-0">
          <div>
            <h2 className="text-lg font-display font-bold text-dark-800">
              {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h2>
            <p className="text-xs text-dark-400 mt-0.5 truncate max-w-[260px]">{item.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-rose-50 text-dark-400 hover:text-rose-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Product info strip */}
          <div className="flex items-center gap-3 p-3 bg-[#FDF8F4] rounded-2xl border border-rose-50">
            <img
              src={item.image || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=100'}
              alt={item.name}
              className="w-12 h-12 rounded-xl object-cover border border-rose-100"
            />
            <div className="min-w-0">
              <p className="font-semibold text-dark-800 text-sm truncate">{item.name}</p>
              <p className="text-xs text-dark-400">Qty: {item.qty}{item.selectedShape ? ` · ${item.selectedShape}` : ''}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">Your Rating *</label>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={`transition-colors ${n <= displayRating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  />
                </button>
              ))}
              {displayRating > 0 && (
                <span className="ml-2 text-sm font-semibold text-amber-600">
                  {STAR_LABELS[displayRating]}
                </span>
              )}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">
              Review Title <span className="text-dark-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              maxLength={120}
              placeholder="Summarize your experience..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm text-dark-800 bg-white transition-all"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Your Review *</label>
            <textarea
              rows={4}
              maxLength={2000}
              placeholder="Tell others about your experience with this product — quality, fit, wear time, application ease..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm text-dark-800 bg-white resize-none transition-all"
            />
            <p className="text-xs text-dark-400 mt-1 text-right">{comment.length}/2000</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">
              Add Photos <span className="text-dark-400 font-normal">(up to 5)</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {/* Existing images from server */}
              {existingImages.map((url, i) => (
                <div key={`existing-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-rose-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}

              {/* New images preview */}
              {images.map((file, i) => (
                <div key={`new-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-rose-100">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}

              {/* Upload button */}
              {(images.length + existingImages.length) < 5 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-rose-200 hover:border-rose-400 flex flex-col items-center justify-center text-dark-400 hover:text-rose-500 transition-colors"
                >
                  <Camera size={20} />
                  <span className="text-[10px] mt-1">Add Photo</span>
                </button>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <p className="text-xs text-dark-400 mt-2">JPG, PNG, WEBP · Max 5MB each</p>
          </div>

          {/* Verified badge note */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <p className="text-xs text-emerald-700">This is a <strong>Verified Purchase</strong> review. Your review will be visible after admin approval.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-rose-100 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-rose-200 rounded-2xl text-dark-600 font-semibold text-sm hover:bg-rose-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting...</>
            ) : (
              <>{existingReview ? 'Update Review' : 'Submit Review'} <Star size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
