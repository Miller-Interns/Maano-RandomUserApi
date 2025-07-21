<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import userModal from './user-modal.vue';
import type { User } from '../types/Data';
import loadingSpinner from './loading-spinner.vue';
import filterControls from './filter-controls.vue';
import glitchButton from './glitch-button.vue';

const userStore = useUserStore();
const {
  paginatedUsers,
  currentPage,
  totalPages,
  loading,
  error
} = storeToRefs(userStore);

// Radio buttons
const selectedFilter = ref('all');
const selectedUser = ref<User | null>(null);

watch(selectedFilter, (newFilter) => {
  userStore.fetchUsers(newFilter);
});

const openModal = (user: User) => {
  selectedUser.value = user;
};

const closeModal = () => {
  selectedUser.value = null;
};

onMounted(() => {
  userStore.initializeApp();
});
</script>

<template>
  <div class="user-container">
    <div class="top-controls-container">
      <filterControls v-model="selectedFilter" />
      <glitchButton @click="userStore.fetchUsers(selectedFilter)" button-label="Fetch" />
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <transition name="fade" mode="out-in">
      <loadingSpinner v-if="loading" key="spinner" />
      <div v-else-if="paginatedUsers.length === 0" class="empty-state" key="empty">
        <p>No users found.</p>
      </div>
      <ul v-else class="user-grid" key="grid">
        <li v-for="user in paginatedUsers" :key="user.login.uuid" @click="openModal(user)">
          <img :src="user.picture.large" :alt="`${user.name.first} ${user.name.last}`">
        </li>
      </ul>
    </transition>

    <div class="pagination-controls" v-if="!loading && paginatedUsers.length > 0">
      <glitchButton @click="userStore.changePage('previous')" button-label="Prev Page" :disabled="currentPage <= 1" />
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <glitchButton @click="userStore.changePage('next')" button-label="Next Page"
        :disabled="currentPage >= totalPages" />
    </div>
  </div>

  <userModal :user="selectedUser" @close="closeModal" />
</template>

<style scoped>
.top-controls-container {
  width: 85vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
  font-family: 'Courier New', Courier, monospace;
}

.user-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 85vw;
  gap: 1.5rem;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.user-grid li {
  border: 2px solid #ff0044;
  box-shadow: 0 0 5px rgba(255, 0, 68, 0.4);
  flex: 0 1 calc(20% - 1.5rem);
  box-sizing: border-box;
  cursor: crosshair;
  background-color: #111;
  padding: 4px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-grid li:hover {
  box-shadow: 0 0 15px #ff0044, 0 0 25px #ff0044;
  transform: scale(1.05) rotate(1deg);
  z-index: 10;
}

.user-grid li:hover img {
  filter: grayscale(100%) contrast(1.2) sepia(100%) hue-rotate(330deg) saturate(1000%);
}

.user-grid li img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 2px;
  transition: filter 0.3s ease;
}

.user-grid li:hover img {
  filter: grayscale(100%) contrast(1.2) sepia(100%) hue-rotate(330deg) saturate(1000%);
}

.pagination-controls {
  margin-top: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.pagination-controls span {
  color: #00ff00;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 0 0 5px #00ff00;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.error-message,
.empty-state {
  font-family: 'Courier New', Courier, monospace;
  background-color: rgba(50, 0, 0, 0.7);
  color: #ff0044;
  border: 2px solid #ff0044;
  text-shadow: 0 0 5px #ff0044;
  box-shadow: 0 0 10px rgba(255, 0, 68, 0.5);
  padding: 1.5rem;
  border-radius: 4px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  text-transform: uppercase;
  font-weight: bold;
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