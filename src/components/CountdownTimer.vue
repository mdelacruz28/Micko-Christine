<script setup>
import { useCountdown } from "../composables/useCountdown";
const { parts } = useCountdown("2027-01-17T14:30:00+08:00");
const labels = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};
</script>
<template>
  <div class="countdown" aria-label="Countdown to the wedding">
    <div v-for="(label, key) in labels" :key="key" class="countdown__item">
      <strong>{{ String(parts[key]).padStart(2, "0") }}</strong
      ><span>{{ label }}</span>
    </div>
  </div>
</template>
<style scoped>
.countdown {
  display: grid;
  grid-template-columns: repeat(4, minmax(70px, 1fr));
  gap: 0.75rem;
  width: min(100%, 620px);
  margin: 2.25rem auto 0;
}
.countdown__item {
  padding: 1rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}
strong {
  display: block;
  font-family: var(--serif);
  font-size: clamp(1.7rem, 5vw, 3rem);
  font-weight: 400;
}
span {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.78;
}
@media (max-width: 520px) {
  .countdown {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
