<template>
  <div class="spinner-container">
    <div class="loading-text">
      ACCESSING_DATA
    </div>
  </div>
</template>

<style scoped>
/*
  ====================================
  DARK WEB / TERMINAL LOADING SPINNER
  ====================================
*/

/* --- Keyframe Animations --- */

/* A subtle flicker effect to mimic a CRT monitor */
@keyframes flicker {
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 7px #00ff00, 0 0 10px #00ff00;
  }
  50% {
    opacity: 0.8;
    text-shadow: 0 0 7px #00ff00, 0 0 12px #00ff00;
  }
}

/* Animates the trailing dots to show progress */
@keyframes dots {
  0%, 20% {
    content: ".";
  }
  40%, 60% {
    content: "..";
  }
  80%, 100% {
    content: "...";
  }
}

/* --- Component Styles --- */

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px; /* Ensures vertical centering */
  font-family: 'Courier New', Courier, monospace;
}

.loading-text {
  position: relative;
  color: #00ff00; /* Neon green text */
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  /* Apply the flicker animation */
  animation: flicker 1.5s infinite linear;
}

/* The pseudo-element for the animated dots */
.loading-text::after {
  /* This content will be replaced by the animation */
  content: "."; 
  
  /* Position the dots right after the text */
  display: inline-block;
  position: absolute;
  
  /* Apply the dots animation */
  animation: dots 1.5s infinite;
}
</style>