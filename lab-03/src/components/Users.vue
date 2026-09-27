<script setup lang="ts">
import { ref } from 'vue'

import usersJson from '../data/user.json'
import type { User } from '../types/user'

defineOptions({ name: 'UsersList' })

const users = ref<User[]>(usersJson as User[])
const visibleDetails = ref<Set<number>>(new Set())
const failedPictures = ref<Set<number>>(new Set())

function toggleDetails(userId: number): void {
  if (visibleDetails.value.has(userId)) {
    visibleDetails.value.delete(userId)
  } else {
    visibleDetails.value.add(userId)
  }
}

function handlePictureError(userId: number): void {
  failedPictures.value.add(userId)
}

function getInitials(user: User): string {
  return `${user.name.first.charAt(0)}${user.name.last.charAt(0)}`
}

function getFullName(user: User): string {
  return `${user.name.first} ${user.name.last}`
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
</script>

<template>
  <section class="users-section" aria-labelledby="users-heading">
    <div class="section-heading">
      <div>
        <p class="section-label">Усі профілі</p>
        <h2 id="users-heading">Користувачі</h2>
      </div>
      <span class="users-count">{{ users.length }} профілів</span>
    </div>

    <p v-if="users.length === 0" class="empty-message">Список юзерів пустий</p>

    <div v-else class="users-grid">
      <article
        v-for="user in users"
        :key="user.id"
        class="user-card"
        :class="{
          minor: user.dob.age < 18,
          young: user.dob.age >= 18 && user.dob.age <= 30,
          adult: user.dob.age >= 31 && user.dob.age <= 50,
          senior: user.dob.age > 50,
        }"
      >
        <div class="card-accent" aria-hidden="true"></div>

        <div class="user-summary">
          <div class="avatar" :aria-label="`Фото користувача ${getFullName(user)}`">
            <img
              v-if="!failedPictures.has(user.id)"
              v-bind:src="user.picture"
              v-bind:alt="`Фото ${getFullName(user)}`"
              @error="handlePictureError(user.id)"
            />
            <span v-else aria-hidden="true">{{ getInitials(user) }}</span>
          </div>

          <div class="identity">
            <span class="gender-label">{{ user.gender === 'male' ? 'Чоловік' : 'Жінка' }}</span>
            <h3>{{ user.name.title }} {{ getFullName(user) }}</h3>
            <p>{{ user.email }}</p>
          </div>
        </div>

        <dl class="user-meta">
          <div>
            <dt>Телефон</dt>
            <dd>{{ user.phone }}</dd>
          </div>
          <div>
            <dt>Дата народження</dt>
            <dd>{{ formatDate(user.dob.date) }}</dd>
          </div>
          <div v-if="user.dob.age > 18">
            <dt>Вік</dt>
            <dd>{{ user.dob.age }} років</dd>
          </div>
          <div class="full-width">
            <dt>Адреса</dt>
            <dd>
              {{ user.location.street.name }}, {{ user.location.street.number }},
              {{ user.location.city }}, {{ user.location.state }}, {{ user.location.country }},
              {{ user.location.postcode }}
            </dd>
          </div>
        </dl>

        <div class="hobbies">
          <h4>Хобі</h4>
          <ul>
            <li v-for="hobby in user.hobbies" :key="hobby">{{ hobby }}</li>
          </ul>
        </div>

        <button
          class="details-button"
          type="button"
          :aria-expanded="visibleDetails.has(user.id)"
          :aria-controls="`details-${user.id}`"
          @click="toggleDetails(user.id)"
        >
          {{ visibleDetails.has(user.id) ? 'Приховати деталі' : 'Показати деталі' }}
        </button>

        <p
          v-show="visibleDetails.has(user.id)"
          :id="`details-${user.id}`"
          class="user-details"
        >
          {{ user.details }}
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.users-section {
  margin-top: -2.1rem;
}

.section-heading {
  display: flex;
  gap: 1rem;
  align-items: end;
  justify-content: space-between;
  padding: 1.35rem 1.5rem;
  margin-bottom: 1.25rem;
  background: rgb(255 255 255 / 92%);
  border: 1px solid rgb(255 255 255 / 75%);
  border-radius: 1.25rem;
  box-shadow: 0 1rem 2.5rem rgb(29 36 63 / 10%);
  backdrop-filter: blur(14px);
}

.section-label {
  margin: 0 0 0.25rem;
  color: #6366f1;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: clamp(1.55rem, 4vw, 2.2rem);
  letter-spacing: -0.035em;
}

.users-count {
  flex-shrink: 0;
  padding: 0.55rem 0.8rem;
  color: #4f46e5;
  font-size: 0.82rem;
  font-weight: 700;
  background: #eef2ff;
  border-radius: 999px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.user-card {
  position: relative;
  padding: 1.5rem;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e8ebf1;
  border-radius: 1.25rem;
  box-shadow: 0 0.7rem 2rem rgb(29 36 63 / 7%);
}

.card-accent {
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: var(--age-color);
}

.user-card.minor {
  --age-color: #f59e0b;
  --age-soft: #fff7df;
  --age-ink: #9a5b00;
}

.user-card.young {
  --age-color: #22c55e;
  --age-soft: #eafbf0;
  --age-ink: #18753a;
}

.user-card.adult {
  --age-color: #6366f1;
  --age-soft: #eef2ff;
  --age-ink: #4338ca;
}

.user-card.senior {
  --age-color: #a855f7;
  --age-soft: #f7edff;
  --age-ink: #7e22ce;
}

.user-summary {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.avatar {
  display: grid;
  flex: 0 0 4.6rem;
  width: 4.6rem;
  height: 4.6rem;
  overflow: hidden;
  color: var(--age-ink);
  font-size: 1.2rem;
  font-weight: 800;
  background: var(--age-soft);
  border: 3px solid var(--age-soft);
  border-radius: 1.2rem;
  place-items: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.identity {
  min-width: 0;
}

.gender-label {
  display: inline-block;
  margin-bottom: 0.3rem;
  color: var(--age-ink);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h3 {
  margin: 0;
  overflow: hidden;
  font-size: 1.2rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.identity p {
  margin: 0.3rem 0 0;
  overflow: hidden;
  color: #6b7280;
  font-size: 0.86rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  padding: 1rem 0;
  margin: 1.2rem 0;
  border-top: 1px solid #edf0f4;
  border-bottom: 1px solid #edf0f4;
}

.user-meta div {
  min-width: 0;
}

.user-meta .full-width {
  grid-column: 1 / -1;
}

dt,
h4 {
  margin: 0 0 0.25rem;
  color: #8a91a0;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

dd {
  margin: 0;
  color: #303848;
  font-size: 0.86rem;
  line-height: 1.5;
}

.hobbies ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.hobbies li {
  padding: 0.36rem 0.62rem;
  color: var(--age-ink);
  font-size: 0.76rem;
  font-weight: 650;
  background: var(--age-soft);
  border-radius: 999px;
}

.details-button {
  width: 100%;
  padding: 0.65rem 0.9rem;
  margin-top: 1.2rem;
  color: #4f46e5;
  font-weight: 750;
  background: #fff;
  border: 1px solid #cfd3ff;
  border-radius: 0.75rem;
  transition: 150ms ease;
}

.details-button:hover {
  color: #fff;
  background: #4f46e5;
  border-color: #4f46e5;
}

.user-details {
  padding: 0.9rem;
  margin: 0.8rem 0 0;
  color: #4b5563;
  font-size: 0.86rem;
  line-height: 1.55;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.empty-message {
  padding: 4rem 1rem;
  margin: 0;
  color: #6b7280;
  text-align: center;
  background: #fff;
  border: 1px dashed #cbd1dc;
  border-radius: 1.25rem;
}

@media (max-width: 820px) {
  .users-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .section-heading {
    align-items: center;
  }

  .user-card {
    padding: 1.2rem;
  }

  .user-meta {
    grid-template-columns: 1fr;
  }

  .user-meta .full-width {
    grid-column: auto;
  }
}
</style>
