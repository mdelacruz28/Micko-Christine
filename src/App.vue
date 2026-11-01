<script setup>
import { nextTick, onBeforeUnmount, ref } from 'vue'
import SharedPageBackground from './components/SharedPageBackground.vue'
import IntroScreen from './components/IntroScreen.vue'
import HeroSection from './components/HeroSection.vue'
import OurStory from './components/OurStory.vue'
import WeddingDetails from './components/WeddingDetails.vue'
import WeddingTimeline from './components/WeddingTimeline.vue'
// import EntourageSection from './components/EntourageSection.vue'
import FAQSection from './components/FAQSection.vue'
import RSVPSection from './components/RSVPSection.vue'
import ClosingSection from './components/ClosingSection.vue'
import DressCodeSection from './components/DressCodeSection.vue'

const invitationOpened = ref(false)
const mainRef = ref(null)
let openingFrame
let disposed = false
const handleInvitationOpened = async () => {
  if (invitationOpened.value) return
  invitationOpened.value = true
  await nextTick()
  if (disposed) return
  openingFrame = requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    mainRef.value?.querySelector('#hero-title')?.focus({ preventScroll: true })
  })
}
onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(openingFrame)
})
</script>

<template>
  <IntroScreen
    v-if="!invitationOpened"
    @opened="handleInvitationOpened"
  />

  <main v-else ref="mainRef" class="site-shell">
    <SharedPageBackground />
    
    <HeroSection />
    <OurStory />
    <WeddingDetails />
    <WeddingTimeline />
    <!-- <EntourageSection /> -->
    <DressCodeSection />
    <!-- <GallerySection /> -->
    <FAQSection />
    <RSVPSection />
    <ClosingSection />
  </main>
</template>
