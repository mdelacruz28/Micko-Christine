<template>
  <div class="background-canvas" aria-hidden="true">
    <div class="background-canvas__image"></div>
    <div class="background-canvas__paper"></div>
    <div class="background-canvas__wash"></div>
  </div>
</template>

<style scoped>
.background-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  pointer-events: none;
  z-index: -10;

  background-color: #f8f3e9;
}

/* Main watercolor artwork */
.background-canvas__image {
  position: absolute;
  inset: -2%;

  background-image: url('@/assets/backgrounds/lafayette-watercolor.png');
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;

  transform: scale(1.04);
  transform-origin: center top;

  filter: saturate(0.95) contrast(0.98);
}

/* Soft paper texture effect */
.background-canvas__paper {
  position: absolute;
  inset: 0;

  opacity: 0.2;
  mix-blend-mode: multiply;

  background-image:
    repeating-radial-gradient(
      circle at 20% 30%,
      rgba(79, 67, 49, 0.08) 0,
      rgba(79, 67, 49, 0.08) 0.5px,
      transparent 0.8px,
      transparent 4px
    );
}

/* Cream wash para readable pa rin ang text */
.background-canvas__wash {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      to bottom,
      rgba(250, 247, 239, 0.1) 0%,
      rgba(250, 247, 239, 0.12) 40%,
      rgba(250, 247, 239, 0.36) 100%
    );
}

/* Tablet */
@media (max-width: 1024px) {
  .background-canvas__image {
    background-position: 42% top;
    transform: scale(1.08);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .background-canvas__image {
    inset: 0;

    background-position: 37% top;
    background-size: auto 100%;

    transform: scale(1.02);
  }

  .background-canvas__wash {
    background:
      linear-gradient(
        to bottom,
        rgba(250, 247, 239, 0.12) 0%,
        rgba(250, 247, 239, 0.22) 48%,
        rgba(250, 247, 239, 0.48) 100%
      );
  }
}

/* Very narrow phones */
@media (max-width: 430px) {
  .background-canvas__image {
    background-position: 34% top;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .background-canvas__image {
    transform: none;
  }
}
</style>