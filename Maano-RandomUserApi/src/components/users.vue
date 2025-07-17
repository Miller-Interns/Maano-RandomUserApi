<!-- components/users.vue -->
<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import userModal from './userModal.vue';
import type { User } from '../types/Data';
import loadingSpinner from './loadingSpinner.vue';

const userStore = useUserStore();
const { 
  paginatedUsers, // Use the new getter for display
  currentPage, 
  totalPages,
  loading, 
  error 
} = storeToRefs(userStore);

// This local ref is bound to the radio buttons
const selectedFilter = ref('all');
const selectedUser = ref<User | null>(null);

// Watch for changes on the filter and trigger a new API fetch
watch(selectedFilter, (newFilter) => {
  // This is the "purge and replace" logic
  userStore.fetchUsers(newFilter);
});

const openModal = (user: User) => {
  selectedUser.value = user;
};

const closeModal = () => {
  selectedUser.value = null;
};

// On component mount, call the store's initialization action
onMounted(() => {
  userStore.initializeApp();
});
</script>

<template>
  <!-- Filter Controls: Replaced <select> with radio buttons -->
  <div class="filter-controls">
    <label>
      <input type="radio" v-model="selectedFilter" value="all" /> All
    </label>
    <label>
      <input type="radio" v-model="selectedFilter" value="female" /> Female
    </label>
    <label>
      <input type="radio" v-model="selectedFilter" value="male" /> Male
    </label>
  </div>

  <div class="user-container">
    <div v-if="error" class="error-message">{{ error }}</div>

    <transition name="fade" mode="out-in">
      <loadingSpinner v-if="loading" key="spinner" />

      <div v-else-if="paginatedUsers.length === 0" class="empty-state" key="empty">
        <p>No users found.</p>
      </div>

      <!-- Iterate over the new `paginatedUsers` getter -->
      <ul v-else class="user-grid" key="grid">
        <li v-for="user in paginatedUsers" :key="user.login.uuid" @click="openModal(user)">
          <img :src="user.picture.large" :alt="`${user.name.first} ${user.name.last}`">
        </li>
      </ul>
    </transition>
    
    <div class="pagination-controls" v-if="!loading && paginatedUsers.length > 0">
      <!-- Call the new `changePage` action. Disable based on currentPage. -->
      <button @click="userStore.changePage('previous')" :disabled="currentPage <= 1">
        Previous Page
      </button>
      
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      
      <button @click="userStore.changePage('next')" :disabled="currentPage >= totalPages">
        Next Page
      </button>
    </div>
  </div>

  <userModal :user="selectedUser" @close="closeModal" />
</template>

<style scoped>
.filter-controls {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.filter-controls label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

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

.user-grid li {
  flex: 0 1 calc(20% - 1rem); /* 5 users per row */
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
  display: flex;
  align-items: center;
  gap: 1rem;
}

.error-message, .empty-state {
  color: #c0392b;
  background-color: #fadbd8;
  border: 1px solid #c0392b;
  padding: 1rem;
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>