// Utility for formatting Indian Rupees
export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date to DD MMM YYYY
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Returns Tailwind CSS color class for order status
export const getStatusColor = (status) => {
  const map = {
    Pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Accepted: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Preparing: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    Packed: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    Shipped: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    'Out For Delivery': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    Delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
    Cancelled: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  };
  return map[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
};

// Returns emoji icon for order status
export const getStatusIcon = (status) => {
  const map = {
    Pending: '⏳',
    Accepted: '✅',
    Preparing: '🎨',
    Packed: '📦',
    Shipped: '🚚',
    'Out For Delivery': '🏍️',
    Delivered: '🎉',
    Cancelled: '❌',
  };
  return map[status] || '📋';
};
