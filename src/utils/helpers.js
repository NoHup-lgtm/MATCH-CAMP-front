// Validation utilities
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

// Formatting utilities
export const formatDistance = (meters) => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

export const formatAge = (birthDate) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const truncateText = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Compatibility score
export const calculateCompatibility = (user1Tags, user2Tags) => {
  const common = user1Tags.filter(tag => user2Tags.includes(tag));
  return Math.round((common.length / Math.max(user1Tags.length, user2Tags.length)) * 100);
};

// Async utilities
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Color utilities
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Storage utilities
export const storageKeys = {
  USER_DATA: 'USER_DATA',
  AUTH_TOKEN: 'AUTH_TOKEN',
  MATCHES: 'MATCHES',
  PREFERENCES: 'PREFERENCES',
};
