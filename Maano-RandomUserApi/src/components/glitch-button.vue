<script setup lang="ts">
defineProps<{
  buttonLabel: string;
  disabled?: boolean;
}>();
</script>

<template>
  <button class="glitch-btn" :data-text="buttonLabel" :disabled="disabled">
    {{ buttonLabel }}
  </button>
</template>

<style scoped>
@keyframes glitch-text {
  0% {
    text-shadow: 1px 0 0 red, -1px 0 0 cyan;
    transform: translate(0);
  }

  10% {
    text-shadow: 1px 0 0 red, -1px 0 0 cyan;
  }

  11% {
    text-shadow: -1px 0 0 red, 1px 0 0 cyan;
  }

  30% {
    text-shadow: -1px 0 0 red, 1px 0 0 cyan;
    transform: translate(-1px, 1px);
  }

  31% {
    text-shadow: 1px 0 0 red, -1px 0 0 cyan;
  }

  50% {
    text-shadow: 1px 0 0 red, -1px 0 0 cyan;
    transform: translate(0);
  }

  60% {
    text-shadow: 3px 0 0 red, -3px 0 0 cyan;
  }

  61% {
    text-shadow: 1px 0 0 red, -1px 0 0 cyan;
  }

  80% {
    text-shadow: 1px 0 0 red, -1px 0 0 cyan;
    transform: translate(1px, -1px);
  }

  81% {
    text-shadow: -1px 0 0 red, 1px 0 0 cyan;
  }

  100% {
    text-shadow: -1px 0 0 red, 1px 0 0 cyan;
    transform: translate(0);
  }
}

@keyframes glitch-layers {
  0% {
    transform: translate(0);
  }

  20% {
    transform: translate(-2px, 2px);
  }

  40% {
    transform: translate(-2px, -2px);
  }

  60% {
    transform: translate(2px, 2px);
  }

  80% {
    transform: translate(2px, -2px);
  }

  100% {
    transform: translate(0);
  }
}

.glitch-btn {
  position: relative;
  color: #00ff00;
  background: #111;
  border: 2px solid #00ff00;
  padding: 10px 20px;
  margin-right: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
  text-transform: uppercase;
  cursor: crosshair;
  transition: background 0.2s ease, color 0.2s ease;
}

.glitch-btn:not(:disabled):hover::before,
.glitch-btn:not(:disabled):hover::after {
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

.glitch-btn:not(:disabled):hover::before {
  left: 2px;
  text-shadow: -2px 0 red;
  animation: glitch-layers 350ms infinite linear alternate-reverse;
}

.glitch-btn:not(:disabled):hover::after {
  left: -2px;
  text-shadow: -2px 0 cyan, 2px 2px red;
  animation: glitch-layers 350ms infinite linear alternate-reverse;
  animation-delay: -100ms;
}

.glitch-btn:not(:disabled):active {
  background: #00ff00;
  color: #000;
  box-shadow: 0 0 5px #00ff00, 0 0 15px #00ff00, 0 0 25px #00ff00;
  animation: glitch-text 400ms infinite;
}

.glitch-btn:not(:disabled):active::before,
.glitch-btn:not(:disabled):active::after {
  display: none;
}

.glitch-btn:disabled {
  opacity: 0.5;
  border-color: #008f00;
  color: #008f00;
  cursor: not-allowed;
}
</style>