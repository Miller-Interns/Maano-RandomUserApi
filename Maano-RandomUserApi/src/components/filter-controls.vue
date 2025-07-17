<!-- src/components/FilterControls.vue -->
<script setup lang="ts">
import { computed } from 'vue';

// 1. DEFINE PROPS & EMITS
// This component accepts a 'modelValue' prop and emits an 'update:modelValue' event.
// This is the standard pattern for creating a component compatible with v-model.
const props = defineProps<{
  modelValue: string; // The current filter value passed from the parent
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void; // The event to send the new value back up
}>();

// 2. CREATE A COMPUTED PROPERTY FOR V-MODEL
// It's bad practice to bind v-model directly to a prop.
// This computed property safely gets the prop's value and emits an event when set.
const selectedFilter = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<template>
  <!-- 3. PASTE THE HTML
    The `v-model` now binds to our new computed property.
    The `data-text` attributes remain the same.
  -->
  <div class="filter-controls">
    <label data-text="All">
      <input type="radio" v-model="selectedFilter" value="all" /> All
    </label>
    <label data-text="Female">
      <input type="radio" v-model="selectedFilter" value="female" /> Female
    </label>
    <label data-text="Male">
      <input type="radio" v-model="selectedFilter" value="male" /> Male
    </label>
  </div>
</template>

<style scoped>
/* 4. PASTE THE CSS
  All the styles for the filter controls now live inside this component.
*/
@keyframes glitch-text {
  0% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; transform: translate(0); }
  10% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; }
  11% { text-shadow: -1px 0 0 red, 1px 0 0 cyan; }
  30% { text-shadow: -1px 0 0 red, 1px 0 0 cyan; transform: translate(-1px, 1px); }
  31% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; }
  50% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; transform: translate(0); }
  60% { text-shadow: 3px 0 0 red, -3px 0 0 cyan; }
  61% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; }
  80% { text-shadow: 1px 0 0 red, -1px 0 0 cyan; transform: translate(1px, -1px); }
  81% { text-shadow: -1px 0 0 red, 1px 0 0 cyan; }
  100% { text-shadow: -1px 0 0 red, 1px 0 0 cyan; transform: translate(0); }
}

@keyframes glitch-layers {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

.filter-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  font-family: 'Courier New', Courier, monospace;
}

.filter-controls label {
  position: relative;
  color: #00ff00;
  background: #111;
  border: 2px solid #00ff00;
  padding: 10px 20px;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: crosshair;
  transition: background 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-controls input[type="radio"] {
  display: none;
}

.filter-controls label:hover::before,
.filter-controls label:hover::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #111;
  overflow: hidden;
  padding: 10px 20px;
  box-sizing: border-box;
}

.filter-controls label:hover::before {
  left: 2px;
  text-shadow: -2px 0 red;
  animation: glitch-layers 350ms infinite linear alternate-reverse;
}

.filter-controls label:hover::after {
  left: -2px;
  text-shadow: -2px 0 cyan, 2px 2px red;
  animation: glitch-layers 350ms infinite linear alternate-reverse;
  animation-delay: -100ms;
}

.filter-controls input[type="radio"]:checked + label {
  background: #00ff00;
  color: #000;
  box-shadow: 0 0 5px #00ff00, 0 0 15px #00ff00, 0 0 25px #00ff00;
  animation: glitch-text 400ms infinite;
}

.filter-controls input[type="radio"]:checked + label:hover::before,
.filter-controls input[type="radio"]:checked + label:hover::after {
  display: none;
}
</style>