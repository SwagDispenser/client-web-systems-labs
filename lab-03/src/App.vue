<script setup lang="ts">
import Users from './components/Users.vue'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-content">
        <p class="eyebrow">Vue 3 · Composition API</p>
        <h1>Каталог користувачів</h1>
        <p class="header-description">
          Переглядайте профілі, інтереси та контактну інформацію користувачів.
        </p>
      </div>
    </header>

    <main class="main-content">
      <Users />
    </main>
  </div>
</template>

<style>
:root {
  color: #172033;
  background: #f3f5f9;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  min-height: 100vh;
}

.app-header {
  color: #fff;
  background:
    radial-gradient(circle at 80% 10%, rgb(255 255 255 / 18%), transparent 28%),
    linear-gradient(135deg, #312e81, #6366f1 58%, #8b5cf6);
}

.header-content,
.main-content {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
}

.header-content {
  padding: 4.5rem 0 5.5rem;
}

.eyebrow {
  margin: 0 0 0.9rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.8;
}

h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2.4rem, 7vw, 4.7rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.header-description {
  max-width: 650px;
  margin: 1.4rem 0 0;
  color: rgb(255 255 255 / 78%);
  font-size: 1.08rem;
  line-height: 1.65;
}

.main-content {
  padding-bottom: 4rem;
}

@media (max-width: 640px) {
  .header-content {
    padding: 3rem 0 4.5rem;
  }
}
</style>
