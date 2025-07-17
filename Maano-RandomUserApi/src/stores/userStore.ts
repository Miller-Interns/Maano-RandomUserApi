// stores/userStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/Data';

// Define constants for clarity and easy maintenance
const USERS_TO_FETCH = 50;
const USERS_PER_PAGE = 10;

export const useUserStore = defineStore('userStore', () => {
  // --- STATE ---
  const users = ref<User[]>([]);
  const currentPage = ref(1);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentFilter = ref('all'); // 'all', 'female', 'male'

  // --- GETTERS (Computed Properties) ---

  // Calculates the total number of pages based on the master list
  const totalPages = computed(() => {
    return Math.ceil(users.value.length / USERS_PER_PAGE);
  });

  // This is the core of client-side pagination.
  // It returns a "slice" of the master user list for the current page.
  const paginatedUsers = computed(() => {
    const startIndex = (currentPage.value - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return users.value.slice(startIndex, endIndex);
  });

  // --- ACTIONS ---

  /**
   * Fetches 50 users from the API, purging the existing list.
   * Can be filtered by gender.
   * @param {string} filter - 'all', 'female', or 'male'.
   */
  async function fetchUsers(filter: string = 'all') {
    loading.value = true;
    error.value = null;
    currentFilter.value = filter;

    // Build the API URL based on the filter
    let apiUrl = `https://randomuser.me/api/?results=${USERS_TO_FETCH}`;
    if (filter === 'female' || filter === 'male') {
      apiUrl += `&gender=${filter}`;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch users from the network.');
      }
      const data = await response.json();
      
      // Replace the old list with the new one
      users.value = data.results; 
      
      // Reset to the first page whenever new users are fetched
      currentPage.value = 1;

    } catch (e: any) {
      console.error('API Fetch Error:', e);
      error.value = e.message || 'An unknown error occurred.';
      users.value = []; // Clear users on error
    } finally {
      loading.value = false;
    }
  }

  /**
   * Handles the initial data load when the application starts.
   */
  async function initializeApp() {
    // Fetch initial users only if the list is empty
    if (users.value.length === 0) {
      await fetchUsers('all');
    }
  }

  /**
   * Changes the current page number. Does NOT fetch new data.
   * @param {'next' | 'previous'} direction - The direction to paginate.
   */
  function changePage(direction: 'next' | 'previous') {
    if (direction === 'next' && currentPage.value < totalPages.value) {
      currentPage.value++;
    } else if (direction === 'previous' && currentPage.value > 1) {
      currentPage.value--;
    }
  }

  return {
    // State
    users,
    currentPage,
    loading,
    error,
    currentFilter,
    // Getters
    totalPages,
    paginatedUsers,
    // Actions
    fetchUsers,
    initializeApp,
    changePage,
  };
});