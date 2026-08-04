<template>
  <section id="entourage" class="entourage">
    <header class="section-header">
      <p class="eyebrow">Together with our loved ones</p>
      <h2>Wedding Entourage</h2>
    </header>

    <div class="group">
      <h3>Parents</h3>
      <div class="divider"><span></span><i>❦</i><span></span></div>

      <div class="two-col">
        <div>
          <h4>Parents of the Groom</h4>
          <p>{{ groomFather }}</p>
          <p>{{ groomMother }}</p>
        </div>

        <div>
          <h4>Parents of the Bride</h4>
          <p>{{ brideFather }}</p>
          <p>{{ brideMother }}</p>
        </div>
      </div>
    </div>

    <div class="group">
      <h3>Principal Sponsors</h3>
      <div class="divider"><span></span><i>❦</i><span></span></div>

      <div class="sponsor-grid">
        <template v-for="(pair, i) in principalSponsors" :key="i">
          <p>{{ pair.left }}</p>
          <p>{{ pair.right }}</p>
        </template>
      </div>
    </div>

    <div class="group">
      <h3>Secondary Sponsors</h3>
      <div class="divider"><span></span><i>❦</i><span></span></div>

      <div class="secondary">
        <div
          v-for="item in secondarySponsors"
          :key="item.role"
          class="secondary-row"
        >
          <strong>{{ item.role }}</strong>
          <div class="names">
            <span>{{ item.left }}</span>
            <span>{{ item.right }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="group">
      <div class="two-col">
        <div>
          <h3>Best Man</h3>
          <p>{{ bestMan }}</p>
        </div>
        <div>
          <h3>Matron of Honor</h3>
          <p>{{ matronOfHonor }}</p>
        </div>
      </div>
    </div>

    <div class="group">
      <h3>Wedding Bearers</h3>
      <div class="divider"><span></span><i>❦</i><span></span></div>

      <div class="bearers">
        <div v-for="item in bearers" :key="item.role" class="bearer">
          <strong>{{ item.role }}</strong>
          <p v-for="n in item.names" :key="n">{{ n }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const groomFather = "Name of Father";
const groomMother = "Name of Mother";
const brideFather = "Name of Father";
const brideMother = "Name of Mother";

const principalSponsors = [
  { left: "Sponsor Name", right: "Sponsor Name" },
  { left: "Sponsor Name", right: "Sponsor Name" },
  { left: "Sponsor Name", right: "Sponsor Name" },
  { left: "Sponsor Name", right: "Sponsor Name" },
  { left: "Sponsor Name", right: "Sponsor Name" },
  { left: "Sponsor Name", right: "Sponsor Name" },
];

const secondarySponsors = [
  { role: "Candle Sponsors", left: "Name", right: "Name" },
  { role: "Veil Sponsors", left: "Name", right: "Name" },
  { role: "Cord Sponsors", left: "Name", right: "Name" },
];

const bestMan = "Name";
const matronOfHonor = "Name";

const bearers = [
  { role: "Ring Bearer", names: ["Name"] },
  { role: "Bible Bearer", names: ["Name"] },
  { role: "Coin Bearer", names: ["Name"] },
  { role: "Flower Girls", names: ["Name", "Name"] },
];
</script>

<style scoped>
.entourage {
  max-width: 980px;
  margin: auto;
  padding: 7rem 1.5rem;
  color: #24313a;
}
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}
.eyebrow {
  font-family: "Allura", cursive;
  color: #efb49f;
  font-size: 2rem;
}
h2 {
  font-family: "Cormorant Garamond", serif;
  font-style: italic;
  font-size: 4rem;
  color: #284d67;
}
.group {
  margin: 5rem 0;
}
.group > h3 {
  font-family: "Cormorant Garamond", serif;
  font-size: 2.4rem;
  font-style: italic;
  text-align: center;
  color: #284d67;
  margin-bottom: 1rem;
}
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 2.5rem;
}
.divider span {
  width: 80px;
  height: 1px;
  background: #cfc5bc;
}
.divider i {
  font-style: normal;
  color: #efb49f;
}
.two-col,
.sponsor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.two-col h4 {
  font:
    600 0.75rem Manrope,
    sans-serif;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #a64248;
  margin-bottom: 1rem;
}
.two-col p,
.sponsor-grid p,
.secondary span,
.bearer p {
  font:
    300 1rem Manrope,
    sans-serif;
  line-height: 2;
}
.sponsor-grid p {
  text-align: center;
}
.secondary-row {
  margin-bottom: 2rem;
  text-align: center;
}
.secondary-row strong,
.bearer strong {
  display: block;
  font:
    italic 1.6rem "Cormorant Garamond",
    serif;
  color: #284d67;
  margin-bottom: 0.8rem;
}
.names {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.bearers {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  text-align: center;
}
@media (max-width: 768px) {
  .two-col,
  .sponsor-grid,
  .names,
  .bearers {
    grid-template-columns: 1fr;
  }
  .group {
    text-align: center;
  }
}
</style>
