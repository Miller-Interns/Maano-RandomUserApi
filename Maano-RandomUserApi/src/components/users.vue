<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import userModal from './userModal.vue';
// Use the new 'User' type. Make sure the import path is correct.
import type { User } from '../types/Data';

const userStore = useUserStore();
// We still need currentPage for filtering and allUsers for the source data.
const { allUsers, currentPage } = storeToRefs(userStore);

// Ref for the gender filter dropdown
const selectedGender = ref<string>(''); // Default to 'All'

// NEW: A single computed property to get the right users to display.
// It reactively filters based on BOTH the current page AND the selected gender.
const usersToDisplay = computed(() => {
  return allUsers.value.filter(user => {
    const isCorrectPage = user.page === currentPage.value;
    // If no gender is selected, the second part is always true.
    const isCorrectGender = !selectedGender.value || user.gender === selectedGender.value;
    return isCorrectPage && isCorrectGender;
  });
});

// A ref to hold the User object for the modal
const selectedUser = ref<User | null>(null);

// Function to open the modal
const openModal = (user: User) => {
  selectedUser.value = user;
};

// Function to close the modal
const closeModal = () => {
  selectedUser.value = null;
};

// REMOVED: The filterGender() function is no longer needed!
// The 'usersToDisplay' computed property handles this automatically
// whenever 'selectedGender' changes thanks to v-model.

onMounted(() => {
  userStore.loadLocalStorage();
});
</script>

<template>
  <div>
    <!-- The v-model is now all you need. No more @change handler. -->
    <select v-model="selectedGender">
      <option value="">All</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
    </select>
  </div>
  <div class="user-container">
    <!-- MODIFIED: Loop over the new computed property 'usersToDisplay' -->
    <ul class="user-grid">
      <li v-for="user in usersToDisplay" :key="user.login.uuid" @click="openModal(user)">
        <img :src="user.picture.large" :alt="`${user.name.first} ${user.name.last}`">
      </li>
    </ul>
    
    <!-- Pagination Controls (no changes needed here) -->
    <div class="pagination-controls">
      <button @click="userStore.previousPage()" :disabled="!userStore.hasPreviousPage">
        Previous Page
      </button>
      
      <span>Page {{ userStore.currentPage }} of {{ userStore.totalPages }}</span>
      
      <button @click="userStore.nextPage()" :disabled="userStore.loading">
        Next Page
      </button>
    </div>
  </div>

  <userModal :user="selectedUser" @close="closeModal" />
</template>

<style scoped>
/* Renamed classes for clarity */
.user-container {
  display: flex;
  flex-direction: column; /* To stack grid and controls */
  align-items: center;
  width: 100%;
  padding: 1rem;
}

.user-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 80vw;
  gap: 1rem;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.user-grid li {
  flex: 0 1 calc(20% - 1rem);
  box-sizing: border-box;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.user-grid li:hover {
  transform: scale(1.05);
}

.user-grid li img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

.pagination-controls {
  margin-top: 2rem;
}
</style>