import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({
  duration: 0.9,
  ease: 'power3.out'
})

ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true
})

export { gsap, ScrollTrigger }
