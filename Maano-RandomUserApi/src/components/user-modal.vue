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
/*
  =====================================
  DARK WEB / HACKER TERMINAL MODAL THEME
  =====================================
*/

/* --- Animations --- */
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
}

/* This is the same glitch animation from the button */
@keyframes glitch-text {
  0% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; }
  25% { text-shadow: -1px 0 0 red, 1px 0 0 cyan; }
  50% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; }
  75% { text-shadow: -2px 0 0 red, 2px 0 0 cyan; }
  100% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; }
}

/* --- Main Overlay & Scanlines --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 25, 10, 0.5); /* Dark green tint */
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  align-items: flex-start;
  padding: 5vh 1rem;
  font-family: 'Courier New', Courier, monospace;
}

/* The Scanline Effect */
.modal-overlay::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.25) 50%
  ), linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.06),
    rgba(0, 255, 0, 0.02),
    rgba(0, 0, 255, 0.06)
  );
  background-size: 100% 3px, 4px 100%;
  z-index: 1001;
  pointer-events: none; /* Allows clicks to pass through */
  animation: flicker 0.15s infinite;
}

/* --- Modal Content Window --- */
.modal-content {
  background-color: rgba(0, 10, 0, 0.85);
  border: 2px solid #00ff00;
  padding: 2rem;
  border-radius: 4px;
  width: 90%;
  max-width: 60vw; /* Wider for more content */
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
  color: #00dd00; /* Dimmer green for body text */
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 15px rgba(0, 255, 0, 0.3);
  animation: flicker 0.5s infinite alternate;
  z-index: 1002;
}

/* --- Themed Image --- */
.modal-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 4px solid #00ff00;
  /* This filter creates the green phosphor screen effect */
  filter: grayscale(100%) contrast(1.2) sepia(100%) hue-rotate(55deg) saturate(1000%);
  box-shadow: 0 0 15px #00ff00;
}

/* --- Typography & Headers --- */
h2 {
  color: #00ff00;
  text-transform: uppercase;
  text-shadow: 0 0 7px #00ff00, 0 0 10px #00ff00;
  margin-top: 0;
  animation: glitch-text 250ms infinite;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: crosshair;
  color: #00ff00;
  text-shadow: 0 0 5px #00ff00;
  transition: all 0.2s;
}
.close-button:hover {
  color: #fff;
  text-shadow: 0 0 10px #fff;
  transform: rotate(90deg);
}

/* --- Details Section Styling --- */
.user-details {
  text-align: left;
  margin-top: 2rem;
}

.detail-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px dashed rgba(0, 255, 0, 0.3);
}
.detail-section:last-child {
  border-bottom: none;
}

.detail-section h3 {
  font-size: 1.2rem;
  color: #00ff00;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  text-shadow: 0 0 5px #00ff00;
  font-weight: bold;
}

.detail-section h3.warning {
  color: #ff0044;
  text-shadow: 0 0 7px #ff0044;
}

/* --- Definition List (Key-Value Pairs) --- */
.detail-section dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.5rem 1rem;
}

.detail-section dt {
  font-weight: bold;
  color: #00ff00; /* Brighter green for keys */
  text-shadow: 0 0 3px rgba(0, 255, 0, 0.5);
}

.detail-section dd {
  margin: 0;
  word-wrap: break-word;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.2); /* Slight white shadow for readability */
}

/* --- Themed Code Block for Sensitive Data --- */
.code-block {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 0, 0.5);
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  margin-top: 1rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
}

.code-block code {
  color: #00ffff; /* Cyan for code for that classic terminal look */
}
</style>