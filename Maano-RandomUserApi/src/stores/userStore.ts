// stores/userStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// Use the new 'User' type. Make sure the import path is correct.
import type { User } from '../types/Data';

const USERS_PER_PAGE = 10;

export const useUserStore = defineStore('user', () => {
    // --- STATE ---

    /** All users ever fetched, with a 'page' property on each. */
    const allUsers = ref<User[]>([]);
    
    /** The page number we are currently viewing. */
    const currentPage = ref(1);
    
    const loading = ref(false);
    const error = ref<string | null>(null);

    // --- GETTERS (Computed Properties) ---

    // REMOVED: paginatedUsers is no longer needed here.
    // The component will be responsible for filtering the flat `allUsers` list.

    /** Calculates the total number of pages based on all fetched users. */
    const totalPages = computed(() => {
        if (allUsers.value.length === 0) return 1;
        return Math.ceil(allUsers.value.length / USERS_PER_PAGE);
    });

    /** A helper to know if we can go back. */
    const hasPreviousPage = computed(() => currentPage.value > 1);

    // --- ACTIONS (Functions) ---

    /**
     * Fetches 10 new random users and adds them to the store.
     * It now assigns the correct page number to each new user.
     * @param {number} pageToAssign - The page number these new users belong to.
     */
    async function fetchAndAddNewUsers(pageToAssign: number) {
        if (loading.value) return;
        
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`https://randomuser.me/api/?results=${USERS_PER_PAGE}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();

            // MODIFIED: Map over the results to add the page number
            const newUsersWithPage: User[] = data.results.map((user: any) => ({
                ...user,
                page: pageToAssign, // Assign the page number
            }));

            allUsers.value.push(...newUsersWithPage);
            
            localStorage.setItem('users', JSON.stringify(allUsers.value));
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An unknown error occurred';
            console.error(error.value);
        } finally {
            loading.value = false;
        }
    }
    
    /**
     * The main action to go to the next page.
     */
    async function nextPage() {
        // If the next page already exists in our data, just move to it.
        if ((currentPage.value + 1) <= totalPages.value) {
            currentPage.value++;
        } else {
            // Otherwise, we need to fetch a new page of users.
            // The new page's number will be the current total pages + 1.
            const newPageNumber = totalPages.value + 1;
            await fetchAndAddNewUsers(newPageNumber);
            // After fetching, go to the newly created page.
            currentPage.value = newPageNumber;
        }
        localStorage.setItem('currentPage', String(currentPage.value));
    }

    /**
     * The main action to go to the previous page.
     */
    function previousPage() {
        if (hasPreviousPage.value) {
            currentPage.value--;
            localStorage.setItem('currentPage', String(currentPage.value));
        }
    }

    /**
     * Gets everything ready on app start.
     */
    async function loadLocalStorage() {
        const storedUsers = localStorage.getItem('users');
        const storedPage = localStorage.getItem('currentPage');

        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            // CRITICAL CHANGE: When loading from localStorage, users won't have the 'page'
            // property. We must calculate and add it back based on their index.
            allUsers.value = parsedUsers.map((user: any, index: number) => ({
                ...user,
                page: Math.floor(index / USERS_PER_PAGE) + 1,
            }));
        }

        if (storedPage) {
            currentPage.value = Number(storedPage);
        }
        
        // If our list is empty, fetch the first page.
        if (allUsers.value.length === 0) {
            await fetchAndAddNewUsers(1); // Fetch for page 1
        }
    }

    return {
        // State
        allUsers,
        currentPage,
        loading,
        error,
        // Getters
        totalPages,
        hasPreviousPage,
        // Actions
        nextPage,
        previousPage,
        loadLocalStorage,
    };
});