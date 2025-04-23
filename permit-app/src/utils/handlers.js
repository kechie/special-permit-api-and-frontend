//TODO: Add a description of the file and its purpose
// This file contains functions to handle pagination and other UI interactions.
// It is used in the PermitList and Monitor component to manage the current page state
// and to handle page changes when the user interacts with the pagination controls.
export function handlePageChange(page) {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};
