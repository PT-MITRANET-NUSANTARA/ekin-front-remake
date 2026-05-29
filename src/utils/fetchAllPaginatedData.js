/**
 * Fetch all pages from a paginated API endpoint
 * @param {Function} fetchFn - Async function that takes { page, perPage, ...rest } and returns { data, pagination }
 * @param {Object} params - Parameters to pass to fetchFn (token, search, etc.)
 * @param {number} perPage - Items per page (default: 100 for optimal performance)
 * @returns {Promise<Array>} - Combined array of all data from all pages
 */
export async function fetchAllPaginatedData(fetchFn, params = {}, perPage = 100) {
  let allData = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    while (currentPage <= totalPages) {
      const response = await fetchFn({
        ...params,
        page: currentPage,
        perPage: perPage
      });

      if (!response.data) {
        break;
      }

      // Handle both array and object responses
      const dataArray = Array.isArray(response.data) ? response.data : [response.data];
      allData = [...allData, ...dataArray];

      // Get pagination info from response
      const pagination = response.pagination;
      if (pagination) {
        // Handle different pagination format
        totalPages = pagination.totalPages || pagination.last_page || 1;
        currentPage = (pagination.page || pagination.current_page || 1) + 1;
      } else {
        // If no pagination info, assume we got all data
        break;
      }

      // Safety check to avoid infinite loops
      if (currentPage > 1000) {
        console.warn('fetchAllPaginatedData: Stopped at page 1000 to prevent infinite loop');
        break;
      }
    }

    return allData;
  } catch (error) {
    console.error('Error fetching paginated data:', error);
    throw error;
  }
}

/**
 * Fetch all pages using a service method that returns paginated results
 * @param {Function} serviceMethod - Service method like GoalsService.getAll
 * @param {string} token - Auth token
 * @param {Object} filters - Additional filters
 * @param {number} perPage - Items per page
 * @returns {Promise<Array>} - Combined array of all data
 */
export async function fetchAllFromService(serviceMethod, token, filters = {}, perPage = 100) {
  return fetchAllPaginatedData(
    (params) => serviceMethod({ ...params, token }),
    filters,
    perPage
  );
}
