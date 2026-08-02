<script setup>
import { ref } from 'vue'
import IntroScreen from './components/IntroScreen.vue'
import HeroSection from './components/HeroSection.vue'
import OurStory from './components/OurStory.vue'
import WeddingDetails from './components/WeddingDetails.vue'
import WeddingTimeline from './components/WeddingTimeline.vue'
import EntourageSection from './components/EntourageSection.vue'
import GallerySection from './components/GallerySection.vue'
import RSVPSection from './components/RSVPSection.vue'
import FAQSection from './components/FAQSection.vue'
import ClosingSection from './components/ClosingSection.vue'
import BackgroundCanvas from './components/layout/BackgroundCanvas.vue'
import DressCodeSection from './components/DressCodeSection.vue'

const invitationOpened = ref(false)
const handleInvitationOpened = () => {
  invitationOpened.value = true

  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    })
  })
}
</script>

<template>
  <IntroScreen
    v-if="!invitationOpened"
    @opened="handleInvitationOpened"
  />

  <main v-else class="site-shell">
    
    <HeroSection />
    <OurStory />
    <WeddingDetails />
    <WeddingTimeline />
    <EntourageSection />
    <DressCodeSection />
    <GallerySection />
    <RSVPSection />
    <FAQSection />
    <ClosingSection />
  </main>
</template>
