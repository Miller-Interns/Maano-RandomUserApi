import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/Data';

const USERS_TO_FETCH = 50;
const USERS_PER_PAGE = 10;

export const useUserStore = defineStore('userStore', () => {
  const users = ref<User[]>([]);
  const currentPage = ref(1);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentFilter = ref('all');

  const totalPages = computed(() => {
    return Math.ceil(users.value.length / USERS_PER_PAGE);
  });

  const paginatedUsers = computed(() => {
    const startIndex = (currentPage.value - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return users.value.slice(startIndex, endIndex);
  });

  async function fetchUsers(filter: string = 'all') {
    loading.value = true;
    error.value = null;
    currentFilter.value = filter;

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
      users.value = data.results;
      currentPage.value = 1;

    } catch (e: any) {
      console.error('API Fetch Error:', e);
      error.value = e.message || 'An unknown error occurred.';
      users.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function initializeApp() {
    if (users.value.length === 0) {
      await fetchUsers('all');
    }
  }

  function changePage(direction: 'next' | 'previous') {
    if (direction === 'next' && currentPage.value < totalPages.value) {
      currentPage.value++;
    } else if (direction === 'previous' && currentPage.value > 1) {
      currentPage.value--;
    }
  }

  return {
    users,
    currentPage,
    loading,
    error,
    currentFilter,
    totalPages,
    paginatedUsers,
    fetchUsers,
    initializeApp,
    changePage,
  };
});