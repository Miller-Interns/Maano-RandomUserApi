<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const userStore = useUserStore();
const { users } = storeToRefs(userStore);
const { fetchUsers, loadLocalStorage } = userStore;

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
  <div>
    <!-- CHANGE 1: The class="user-grid" is moved here, to the container <ul> -->
    <ul class="user-grid">
      <!-- 
        The class is removed from the <li>.
        CHANGE 2: The :key is now user.login.uuid, a guaranteed unique ID.
      -->
      <li v-for="user in users" :key="user.login.uuid">
        <img :src="user.picture.large" alt="User Picture">
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* This CSS now correctly targets the <ul> container */
.user-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 80vw;
  
  /* These are fine */
  list-style-type: none;
  padding: 0;
  margin: 0;
}

/* This rule now correctly styles the <img> inside the <li> which is inside the .user-grid */
.user-grid li img {
  /* 
   * CHANGE 3: Changed from 300px to 100%. This makes the image
   * fluid and allows it to fill the grid column it's in.
  */
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}
</style>