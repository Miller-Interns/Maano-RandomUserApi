<!-- users.vue -->
<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import userModal from './userModal.vue';
import type { User } from '../types/Data';
import loadingSpinner from './loadingSpinner.vue'; // <-- ADDED: Import the new component

const userStore = useUserStore();
// <-- MODIFIED: Destructure 'loading' from the store
const { allUsers, currentPage, loading, error } = storeToRefs(userStore);
 // <-- ADDED 'error' for display

const selectedGender = ref<string>('');

const usersToDisplay = computed(() => {
  return allUsers.value.filter(user => {
    const isCorrectPage = user.page === currentPage.value;
    const isCorrectGender = !selectedGender.value || user.gender === selectedGender.value;
    return isCorrectPage && isCorrectGender;
  });
});

const selectedUser = ref<User | null>(null);

const openModal = (user: User) => {
  selectedUser.value = user;
};

const closeModal = () => {
  selectedUser.value = null;
};

onMounted(() => {
  userStore.loadLocalStorage();
});
</script>

<template>
  <div>
    <select v-model="selectedGender">
      <option value="">All</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
    </select>
    <button @click="userStore.purgeUsers">Purge Users</button>
  </div>
  <div class="user-container">
    <!-- ADDED: Display error messages from the store -->
    <div v-if="error" class="error-message">{{ error }}</div>

    <transition name="fade" mode="out-in">
      <loadingSpinner v-if="loading" key="spinner" />
      
      <!-- ADDED: Show a message when a filtered page is empty but not loading -->
      <div v-else-if="usersToDisplay.length === 0" class="empty-state" key="empty">
        <p>No users match the current filter on this page.</p>
        <p>Click "Next Page" to find more.</p>
      </div>

      <ul v-else class="user-grid" key="grid">
        <!-- ... v-for loop is the same ... -->
        <li v-for="user in usersToDisplay" :key="user.login.uuid" @click="openModal(user)">
          <img :src="user.picture.large" :alt="`${user.name.first} ${user.name.last}`">
        </li>
      </ul>
    </transition>
    
    <div class="pagination-controls">
      <button @click="userStore.previousPage()" :disabled="!userStore.hasPreviousPage || loading">
        Previous Page
      </button>
      
      <span>Page {{ userStore.currentPage }} of {{ userStore.totalPages }}</span>
      
      <!-- MODIFIED: Pass the selectedGender to the nextPage action -->
      <button @click="userStore.nextPage(selectedGender)" :disabled="loading">
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
  flex-direction: column;
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

/* ... other styles remain the same ... */
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

/* <-- ADDED: CSS for the fade transition --> */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>