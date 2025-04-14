export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
};

export function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : 'N/A';
};