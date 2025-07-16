import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Results } from '../types/Data';

export const useUserStore = defineStore('user', () => {
    const users = ref<Results[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    function loadLocalStorage() {
        const storedUsers = localStorage.getItem('users');
        users.value = storedUsers ? JSON.parse(storedUsers) : [];
    }
    async function fetchUsers() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch('https://randomuser.me/api/?results=1');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            users.value.push(...data.results);
            localStorage.setItem('users', JSON.stringify(users.value));
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An unknown error occurred';
            alert(err);
        } finally {
            loading.value = false;
        }
    }

    return {
        users,
        loading,
        error,
        fetchUsers,
        loadLocalStorage
    };
});