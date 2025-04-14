// Helper functions for the application
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
};

export function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : 'N/A';
};

//function capitalizeFirstLetter(string) {
//  return string.replace(/^./, string[0].toUpperCase())
//}

// function capitalizeFirstLetter(string) {
//   return string.split('').map((char, index) =>
//     index === 0 ? char.toUpperCase() : char).join('')
// }