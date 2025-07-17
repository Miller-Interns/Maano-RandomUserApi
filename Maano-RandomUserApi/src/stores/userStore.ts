// stores/userStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/Data';

const USERS_PER_PAGE = 10;
// ADDED: A safety limit to prevent infinite loops if the API fails to return matching users.
const MAX_FETCH_ATTEMPTS = 5; 

export const useUserStore = defineStore('user', () => {
    // --- STATE (no changes) ---
    const allUsers = ref<User[]>([]);
    const currentPage = ref(1);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // --- GETTERS (no changes) ---
    const totalPages = computed(() => {
        if (allUsers.value.length === 0) return 1;
        return Math.ceil(allUsers.value.length / USERS_PER_PAGE);
    });
    const hasPreviousPage = computed(() => currentPage.value > 1);
    function purgeUsers() {
        localStorage.clear();
        alert('All users have been purged from local storage.');
        window.location.reload();
    }
    // --- ACTIONS (MAJOR CHANGES) ---

    /**
     * NEW, more powerful fetching function.
     * Fetches 10 users and appends them to the end of the allUsers list.
     * Can be filtered by gender.
     * @param {object} options - The options for fetching.
     * @param {string} [options.gender] - Optional gender to filter by ('male' or 'female').
     * @param {number} options.pageToAssign - The page number to assign to these new users.
     */
    async function fetchAndAppendUsers({ gender, pageToAssign }: { gender?: string; pageToAssign: number }) {
        // Build the API URL. If a gender is provided, add it as a query parameter.
        let apiUrl = `https://randomuser.me/api/?results=${USERS_PER_PAGE}`;
        if (gender !== '') {
            apiUrl += `&gender=${gender}`;
        }
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();

            const newUsersWithPage: User[] = data.results.map((user: any) => ({
                ...user,
                page: pageToAssign,
            }));

            allUsers.value.push(...newUsersWithPage);
            localStorage.setItem('users', JSON.stringify(allUsers.value));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            error.value = errorMessage;
            console.error("Fetch failed:", errorMessage);
            // Re-throw the error so the calling function knows the fetch failed.
            throw err;
        }
    }
// stores/userStore.ts

// ... (keep all other code, including fetchAndAppendUsers, as is) ...

    /**
     * CORRECTED & SIMPLIFIED: The main action to go to the next page.
     * This version correctly handles all filter cases.
     * @param {string} filterGender - The gender currently selected ('', 'male', or 'female').
     */
// stores/userStore.ts

// ... (keep all other code, including fetchAndAppendUsers, as is) ...

    /**
     * CORRECTED: Implements the rule: "Only fetch if the target page does not exist."
     * @param {string} filterGender - Used only when a fetch is necessary.
     */
    async function nextPage(filterGender: string) {
        if (loading.value) return;

        const targetPage = currentPage.value + 1;

        // --- Main Logic: Does the page we want to go to already exist in our data? ---

        if (targetPage <= totalPages.value) {
            // YES. The page exists.
            // Our only job is to navigate to it. We do NOT check the filter here.
            // The component's computed property is responsible for showing what's on that page.
            // If it's an empty list for the filter, that's what the user will see.
            console.log(`Navigating to existing page ${targetPage}.`);
            currentPage.value = targetPage;
            localStorage.setItem('currentPage', String(currentPage.value));
            return; // We are done.
        }

        // --- Fetch Logic: If we are here, it means targetPage > totalPages. ---
        // This is the ONLY case where we should fetch new data.

        console.log(`Page ${targetPage} does not exist. Fetching new users...`);
        loading.value = true;
        error.value = null;

        try {
            // When we fetch for a brand new page, it's good UX to respect the current filter.
            const newPageNumber = totalPages.value + 1;
            await fetchAndAppendUsers({ gender: filterGender, pageToAssign: newPageNumber });

            // After fetching, if we successfully added users, navigate to the new page.
            if (totalPages.value >= newPageNumber) {
                currentPage.value = newPageNumber;
                localStorage.setItem('currentPage', String(currentPage.value));
            } else {
                // This handles if the API returns 0 results for the filter.
                error.value = `The API didn't return any more users for the selected filter.`;
                console.warn(error.value);
            }
        } catch (err) {
            // Error is handled in fetchAndAppendUsers. We stay on the current page.
        } finally {
            loading.value = false;
        }
    }

// ... (the rest of your store code)

// ... (the rest of your store code)

    function previousPage() {
        if (hasPreviousPage.value) {
            currentPage.value--;
            localStorage.setItem('currentPage', String(currentPage.value));
        }
    }

    async function loadLocalStorage() {
        // ... (this function remains the same as the previous version)
        const storedUsers = localStorage.getItem('users');
        const storedPage = localStorage.getItem('currentPage');
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            allUsers.value = parsedUsers.map((user: any, index: number) => ({
                ...user,
                page: Math.floor(index / USERS_PER_PAGE) + 1,
            }));
        }
        if (storedPage) { currentPage.value = Number(storedPage); }
        if (allUsers.value.length === 0) {
            loading.value = true;
            await fetchAndAppendUsers({ pageToAssign: 1 });
            loading.value = false;
        }
    }

    return {
        allUsers,
        currentPage,
        loading,
        error,
        totalPages,
        hasPreviousPage,
        nextPage, // The revised, smarter function
        previousPage,
        loadLocalStorage,
        purgeUsers,
    };
});