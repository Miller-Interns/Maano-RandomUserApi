<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import userModal from '@/components/userModal.vue'; // Adjust the path if necessary
import type { Results as User } from '@/types/Data'; // Import the type

const userStore = useUserStore();
const { users } = storeToRefs(userStore);
const { fetchUsers, loadLocalStorage } = userStore;

// A ref to hold the user object that should be displayed in the modal
const selectedUser = ref<User | null>(null);

// Function to set the selected user, which shows the modal
const openModal = (user: User) => {
  selectedUser.value = user;
};

// Function to clear the selected user, which hides the modal
const closeModal = () => {
  selectedUser.value = null;
};

onMounted(() => {
  loadLocalStorage();
});
</script>

<template>
  <div>
    <button @click="fetchUsers">
      Fetch Users
    </button>
  </div>
  <div class="user-container">
    <ul class="user-grid">
      <!-- When a list item is clicked, call openModal with that user's data -->
      <li v-for="user in users" :key="user.login.uuid" @click="openModal(user)">
        <img :src="user.picture.large" alt="User Picture">
      </li>
    </ul>
  </div>

  <!-- 
    The modal component itself.
    - It receives the selectedUser as a prop.
    - It listens for a 'close' event to call the closeModal function.
  -->
  <userModal :user="selectedUser" @close="closeModal" />
</template>

<style scoped>
.user-container {
  display: flex;
  justify-content: center;
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
  cursor: pointer; /* Important for user experience */
  transition: transform 0.2s ease-in-out;
}

.user-grid li:hover {
  transform: scale(1.05); /* Adds a nice interactive feel */
}

.user-grid li img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}
</style>