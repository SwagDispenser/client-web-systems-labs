<script setup lang="ts">
import Users from './components/Users.vue'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-content">
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
  color: #222;
  background: #f5f5f5;
  font-family:
    Arial, Helvetica, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
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
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.header-content,
.main-content {
  width: min(1100px, calc(100% - 2rem));
  margin: 0 auto;
}

.header-content {
  padding: 2rem 0;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: #666;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  line-height: 1.2;
}

.header-description {
  margin: 0.6rem 0 0;
  color: #666;
  line-height: 1.5;
}

.main-content {
  padding: 2rem 0 3rem;
}
</style>
