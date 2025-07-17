<script setup lang="ts">
// Import the specific type from your Data.ts file
import type { User } from '@/types/Data';

defineProps<{
    user: User | null;
}>();

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};
</script>

<template>
    <div v-if="user" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <button @click="closeModal" class="close-button">×</button>
            <h2>{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</h2>
            <img :src="user.picture.large" :alt="user.name.first + '\'s picture'" class="modal-image">
            <div class="user-details">
                <!-- Personal Information -->
                <div class="detail-section">
                    <h3>Personal</h3>
                    <dl>
                        <dt>Gender</dt>
                        <dd>{{ user.gender }}</dd>
                        <dt>Date of Birth</dt>
                        <dd>{{ user.dob.date }} (Age: {{ user.dob.age }})</dd>
                        <dt>Nationality</dt>
                        <dd>{{ user.nat }}</dd>
                        <dt>National ID</dt>
                        <dd>{{ user.id.name }}: {{ user.id.value || 'N/A' }}</dd>
                    </dl>
                </div>
                <!-- Contact Information -->
                <div class="detail-section">
                    <h3>Contact</h3>
                    <dl>
                        <dt>Email</dt>
                        <dd>{{ user.email }}</dd>
                        <dt>Phone</dt>
                        <dd>{{ user.phone }}</dd>
                        <dt>Cell</dt>
                        <dd>{{ user.cell }}</dd>
                    </dl>
                </div>

                <!-- Full Location Details -->
                <div class="detail-section">
                    <h3>Location</h3>
                    <dl>
                        <dt>Address</dt>
                        <dd>{{ user.location.street.number }} {{ user.location.street.name }}, {{ user.location.city }},
                            {{ user.location.state }}, {{ user.location.country }} - {{ user.location.postcode }}</dd>
                        <dt>Coordinates</dt>
                        <dd>Lat: {{ user.location.coordinates.latitude }}, Lon: {{ user.location.coordinates.longitude
                        }}</dd>
                        <dt>Timezone</dt>
                        <dd>{{ user.location.timezone.description }} ({{ user.location.timezone.offset }})</dd>
                    </dl>
                </div>

                <!-- Login & Security Details -->
                <div class="detail-section">
                    <h3 class="warning">Login Credentials (Sensitive Data)</h3>
                    <dl>
                        <dt>Username</dt>
                        <dd>{{ user.login.username }}</dd>
                        <dt>UUID</dt>
                        <dd><code>{{ user.login.uuid }}</code></dd>
                    </dl>
                    <pre class="code-block"><code><strong>Password:</strong> {{ user.login.password }}
                    <strong>Salt:</strong>     {{ user.login.salt }}
                    <strong>MD5:</strong>      {{ user.login.md5 }}
                    <strong>SHA1:</strong>     {{ user.login.sha1 }}
                    <strong>SHA256:</strong>   {{ user.login.sha256 }}</code></pre>
                </div>

                <!-- Account Registration -->
                <div class="detail-section">
                    <h3>Account</h3>
                    <dl>
                        <dt>Registered On</dt>
                        <dd>{{ user.registered.date }} ({{ user.registered.age }} years ago)</dd>
                    </dl>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  z-index: 1000;

  /* --- MODIFICATIONS FOR SCROLLING --- */
  /* 1. Add a scrollbar if content is too tall */
  overflow-y: auto;
  /* 2. Align modal to the top for better scroll experience */
  align-items: flex-start;
  /* 3. Add padding to prevent modal from touching screen edges */
  padding: 5vh 1rem;
}

.modal-content {
  background-color: rgb(0, 0, 0);
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 50vw; /* Increased max-width slightly for the dense data */
  position: relative;
  text-align: center;
  /* Add a small bottom margin for spacing on mobile */
  margin-bottom: 2rem;
}

/* --- HEADER STYLES --- */
.modal-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

h2 {
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
}

.username {
  color: #666;
  margin-top: 0;
  margin-bottom: 2rem;
  font-style: italic;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
}
.close-button:hover {
  color: #000;
}

/* --- DETAILS SECTION STYLES --- */
.user-details {
  text-align: left;
  margin-top: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-section h3 {
  font-size: 1.1rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.detail-section h3.warning {
  color: #d9534f;
}

.detail-section dl {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 0.5rem 1rem;
}

.detail-section dt {
  font-weight: bold;
  color: #555;
}

.detail-section dd {
  margin: 0;
  word-wrap: break-word;
}

.code-block {
  background-color: #f4f4f4;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.code-block code {
  color: #333;
}
</style>