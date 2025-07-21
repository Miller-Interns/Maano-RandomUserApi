<template>
  <div class="spinner-container">
    <div class="loading-text">
      ACCESSING_DATA
    </div>
  </div>
</template>

<style scoped>
@keyframes flicker {

  0%,
  100% {
    opacity: 1;
    text-shadow: 0 0 7px #00ff00, 0 0 10px #00ff00;
  }

  50% {
    opacity: 0.8;
    text-shadow: 0 0 7px #00ff00, 0 0 12px #00ff00;
  }
}

@keyframes dots {

  0%,
  20% {
    content: ".";
  }

  40%,
  60% {
    content: "..";
  }

  80%,
  100% {
    content: "...";
  }
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
  font-family: 'Courier New', Courier, monospace;
}

.loading-text {
  position: relative;
  color: #00ff00;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: flicker 1.5s infinite linear;
}

.loading-text::after {
  content: ".";
  display: inline-block;
  position: absolute;
  animation: dots 1.5s infinite;
}
</style>