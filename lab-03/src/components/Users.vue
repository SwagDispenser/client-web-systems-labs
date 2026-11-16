<script setup lang="ts">
import { computed, ref } from 'vue'

import usersJson from '../data/user.json'
import type { User, UserGender } from '../types/user'

defineOptions({ name: 'UsersList' })

const users = ref<User[]>(usersJson as User[])
const visibleDetails = ref<Set<number>>(new Set())
const genderFilter = ref<'all' | UserGender>('all')
const ageFilter = ref<'all' | '18-plus'>('all')
const sortOption = ref<'default' | 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc'>(
   'default',
)

const filteredUsers = computed<User[]>(() => {
  const result = users.value.filter((user) => {
    const matchesGender = genderFilter.value === 'all' || user.gender === genderFilter.value
    const matchesAge = ageFilter.value === 'all' || user.dob.age >= 18

    return matchesGender && matchesAge
  })

  return result.sort((firstUser, secondUser) => {
    switch (sortOption.value) {
      case 'name-asc':
        return getFullName(firstUser).localeCompare(getFullName(secondUser), 'uk')
      case 'name-desc':
        return getFullName(secondUser).localeCompare(getFullName(firstUser), 'uk')
      case 'age-asc':
        return firstUser.dob.age - secondUser.dob.age
      case 'age-desc':
        return secondUser.dob.age - firstUser.dob.age
      default:
        return 0
    }
  })
})

const hasActiveControls = computed(
  () =>
    genderFilter.value !== 'all' || ageFilter.value !== 'all' || sortOption.value !== 'default',
)

function resetControls(): void {
  genderFilter.value = 'all'
  ageFilter.value = 'all'
  sortOption.value = 'default'
}

function toggleDetails(userId: number): void {
  if (visibleDetails.value.has(userId)) {
    visibleDetails.value.delete(userId)
  } else {
    visibleDetails.value.add(userId)
  }
}

function getFullName(user: User): string {
  return `${user.name.first} ${user.name.last}`
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
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
      <span class="users-count">{{ filteredUsers.length }} із {{ users.length }}</span>
    </div>

    <div class="toolbar" aria-label="Керування списком користувачів">
      <fieldset class="control-group">
        <legend>Стать</legend>
        <div class="button-group">
          <button
            type="button"
            :class="{ active: genderFilter === 'all' }"
            :aria-pressed="genderFilter === 'all'"
            @click="genderFilter = 'all'"
          >
            Всі
          </button>
          <button
            type="button"
            :class="{ active: genderFilter === 'male' }"
            :aria-pressed="genderFilter === 'male'"
            @click="genderFilter = 'male'"
          >
            Чоловіки
          </button>
          <button
            type="button"
            :class="{ active: genderFilter === 'female' }"
            :aria-pressed="genderFilter === 'female'"
            @click="genderFilter = 'female'"
          >
            Жінки
          </button>
        </div>
      </fieldset>

      <fieldset class="control-group">
        <legend>Вік</legend>
        <div class="button-group">
          <button
            type="button"
            :class="{ active: ageFilter === 'all' }"
            :aria-pressed="ageFilter === 'all'"
            @click="ageFilter = 'all'"
          >
            Всі
          </button>
          <button
            type="button"
            :class="{ active: ageFilter === '18-plus' }"
            :aria-pressed="ageFilter === '18-plus'"
            @click="ageFilter = '18-plus'"
          >
            18+
          </button>
        </div>
      </fieldset>

      <fieldset class="control-group control-group-wide">
        <legend>Сортування</legend>
        <div class="button-group">
          <button
            type="button"
            :class="{ active: sortOption === 'name-asc' }"
            :aria-pressed="sortOption === 'name-asc'"
            @click="sortOption = 'name-asc'"
          >
            Ім’я ↑
          </button>
          <button
            type="button"
            :class="{ active: sortOption === 'name-desc' }"
            :aria-pressed="sortOption === 'name-desc'"
            @click="sortOption = 'name-desc'"
          >
            Ім’я ↓
          </button>
          <button
            type="button"
            :class="{ active: sortOption === 'age-asc' }"
            :aria-pressed="sortOption === 'age-asc'"
            @click="sortOption = 'age-asc'"
          >
            Вік ↑
          </button>
          <button
            type="button"
            :class="{ active: sortOption === 'age-desc' }"
            :aria-pressed="sortOption === 'age-desc'"
            @click="sortOption = 'age-desc'"
          >
            Вік ↓
          </button>
        </div>
      </fieldset>

      <button
        class="reset-button"
        type="button"
        :disabled="!hasActiveControls"
        @click="resetControls"
      >
        Очистити все
      </button>
    </div>

    <p v-if="filteredUsers.length === 0" class="empty-message">
      {{ users.length === 0 ? 'Список юзерів пустий' : 'За обраними фільтрами нікого не знайдено' }}
    </p>

    <div v-else class="users-grid">
      <article
        v-for="user in filteredUsers"
        :key="user.id"
        class="user-card"
        :class="{
          minor: user.dob.age < 18,
          young: user.dob.age >= 18 && user.dob.age <= 30,
          adult: user.dob.age >= 31 && user.dob.age <= 50,
          senior: user.dob.age > 50,
        }"
      >
        <aside class="profile-summary">
          <div class="avatar-placeholder" aria-hidden="true"></div>

          <h3>{{ user.name.title }} {{ getFullName(user) }}</h3>

          <div class="summary-facts">
            <span>{{ user.gender === 'male' ? 'Чоловік' : 'Жінка' }}</span>
            <span v-if="user.dob.age > 18">{{ user.dob.age }} років</span>
          </div>

          <address class="contact-list">
            <p>{{ user.location.city }}, {{ user.location.state }}, {{ user.location.country }}</p>
            <a :href="`mailto:${user.email}`">{{ user.email }}</a>
            <a :href="`tel:${user.phone}`">{{ user.phone }}</a>
            <a :href="`tel:${user.cell}`">{{ user.cell }}</a>
          </address>
        </aside>

        <div class="profile-information">
          <button
            class="about-button"
            type="button"
            :aria-expanded="visibleDetails.has(user.id)"
            :aria-controls="`details-${user.id}`"
            @click="toggleDetails(user.id)"
          >
            <span>Про користувача</span>
            <span aria-hidden="true">{{ visibleDetails.has(user.id) ? '−' : '+' }}</span>
          </button>

          <p
            v-show="visibleDetails.has(user.id)"
            :id="`details-${user.id}`"
            class="user-details"
          >
            {{ user.details }}
          </p>

          <div class="information-panel">
            <section class="information-section">
              <h4>Персональна інформація</h4>
              <dl class="information-list">
                <div>
                  <dt>Повне ім’я</dt>
                  <dd>{{ user.name.title }} {{ getFullName(user) }}</dd>
                </div>
                <div>
                  <dt>Стать</dt>
                  <dd>{{ user.gender === 'male' ? 'Чоловік' : 'Жінка' }}</dd>
                </div>
                <div>
                  <dt>Дата народження</dt>
                  <dd>
                    {{ formatDate(user.dob.date) }}
                    <span v-if="user.dob.age > 18">({{ user.dob.age }} років)</span>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{{ user.email }}</dd>
                </div>
                <div>
                  <dt>Телефон</dt>
                  <dd>{{ user.phone }}</dd>
                </div>
                <div>
                  <dt>Мобільний</dt>
                  <dd>{{ user.cell }}</dd>
                </div>
              </dl>
            </section>

            <section class="information-section">
              <h4>Адреса</h4>
              <dl class="information-list">
                <div>
                  <dt>Вулиця</dt>
                  <dd>{{ user.location.street.number }} {{ user.location.street.name }}</dd>
                </div>
                <div>
                  <dt>Місто</dt>
                  <dd>{{ user.location.city }}</dd>
                </div>
                <div>
                  <dt>Область / штат</dt>
                  <dd>{{ user.location.state }}</dd>
                </div>
                <div>
                  <dt>Країна</dt>
                  <dd>{{ user.location.country }}</dd>
                </div>
                <div>
                  <dt>Поштовий індекс</dt>
                  <dd>{{ user.location.postcode }}</dd>
                </div>
                <div>
                  <dt>Часовий пояс</dt>
                  <dd>
                    {{ user.location.timezone.offset }} ({{ user.location.timezone.description }})
                  </dd>
                </div>
              </dl>
            </section>

            <section class="information-section hobbies">
              <h4>Хобі</h4>
              <ul>
                <li v-for="hobby in user.hobbies" :key="hobby">{{ hobby }}</li>
              </ul>
            </section>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.section-heading {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-label {
  margin: 0 0 0.2rem;
  color: #777;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: 1.5rem;
}

.users-count {
  flex-shrink: 0;
  padding: 0.4rem 0.65rem;
  color: #444;
  font-size: 0.82rem;
  font-weight: 700;
  background: #e8e8e8;
  border-radius: 0.35rem;
}

.toolbar {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: end;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.control-group {
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
}

.control-group legend {
  padding: 0;
  margin-bottom: 0.4rem;
  color: #666;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.button-group button,
.reset-button {
  min-height: 2.2rem;
  padding: 0.45rem 0.65rem;
  color: #333;
  font-size: 0.78rem;
  font-weight: 600;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 0.35rem;
}

.button-group button:hover,
.reset-button:hover:not(:disabled) {
  background: #e9e9e9;
}

.button-group button.active {
  color: #fff;
  background: #333;
  border-color: #333;
}

.reset-button {
  background: #fff;
}

.reset-button:disabled {
  color: #999;
  background: #f5f5f5;
  border-color: #ddd;
  cursor: not-allowed;
}

.users-grid {
  display: grid;
  gap: 1.25rem;
}

.user-card {
  display: grid;
  grid-template-columns: minmax(240px, 32%) minmax(0, 1fr);
  overflow: hidden;
  background: #fff;
  border: 1px solid #d9e1ef;
  border-top: 4px solid var(--age-color);
  border-radius: 0.75rem;
}

.user-card.minor {
  --age-color: #d97706;
  --age-soft: #fff7ed;
  --age-ink: #92400e;
}

.user-card.young {
  --age-color: #16a34a;
  --age-soft: #f0fdf4;
  --age-ink: #166534;
}

.user-card.adult {
  --age-color: #2563eb;
  --age-soft: #eff6ff;
  --age-ink: #1e40af;
}

.user-card.senior {
  --age-color: #7c3aed;
  --age-soft: #f5f3ff;
  --age-ink: #5b21b6;
}

.profile-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem;
  border-right: 1px solid #e1e7f0;
}

.avatar-placeholder {
  width: 100%;
  aspect-ratio: 4 / 3;
  margin-bottom: 1.25rem;
  background: #d5d7dc;
  border: 1px solid #c7cad0;
  border-radius: 0.55rem;
}

h3 {
  margin: 0 0 0.8rem;
  color: #17264b;
  font-size: clamp(1.3rem, 3vw, 1.75rem);
  line-height: 1.2;
}

.summary-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1rem;
  color: #53668f;
  font-size: 0.86rem;
}

.summary-facts span + span {
  padding-left: 0.65rem;
  border-left: 1px solid #aab5ca;
}

.contact-list {
  width: 100%;
  padding-top: 1rem;
  font-style: normal;
  border-top: 1px solid #e1e7f0;
}

.contact-list p,
.contact-list a {
  display: block;
  margin: 0 0 0.7rem;
  overflow-wrap: anywhere;
  color: #53668f;
  font-size: 0.86rem;
  line-height: 1.45;
  text-decoration: none;
}

.contact-list a:hover {
  text-decoration: underline;
}

.profile-information {
  min-width: 0;
  padding: 1.5rem;
}

.about-button {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.9rem 1rem;
  color: #17264b;
  font-size: 1rem;
  font-weight: 700;
  text-align: left;
  background: #f3f6fb;
  border: 1px solid #e5eaf3;
  border-radius: 0.55rem;
}

.about-button:hover {
  background: #eaf0f9;
}

.user-details {
  padding: 0.85rem 1rem;
  margin: 0.65rem 0 0;
  color: #53668f;
  font-size: 0.86rem;
  line-height: 1.55;
  background: #f8faff;
  border-left: 3px solid var(--age-color);
}

.information-panel {
  margin-top: 1rem;
  border: 1px solid #dfe6f1;
  border-radius: 0.55rem;
}

.information-section {
  padding: 1rem;
}

.information-section + .information-section {
  border-top: 1px solid #e1e7f0;
}

.information-section h4 {
  margin: 0 0 0.85rem;
  color: #17264b;
  font-size: 1rem;
}

.information-list {
  margin: 0;
}

.information-list div {
  display: grid;
  grid-template-columns: minmax(120px, 32%) minmax(0, 1fr);
  gap: 1rem;
  padding: 0.2rem 0;
}

.information-list dt,
.information-list dd {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
}

.information-list dt {
  color: #607098;
}

.information-list dd {
  overflow-wrap: anywhere;
  color: #17264b;
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
  padding: 0.35rem 0.65rem;
  color: var(--age-ink);
  font-size: 0.76rem;
  font-weight: 600;
  background: var(--age-soft);
  border-radius: 999px;
}

.empty-message {
  padding: 3rem 1rem;
  margin: 0;
  color: #666;
  text-align: center;
  background: #fff;
  border: 1px dashed #bbb;
  border-radius: 0.5rem;
}

@media (max-width: 820px) {
  .toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .control-group-wide {
    grid-column: 1 / -1;
  }

  .reset-button {
    justify-self: start;
  }

  .user-card {
    grid-template-columns: 1fr;
  }

  .profile-summary {
    border-right: 0;
    border-bottom: 1px solid #e1e7f0;
  }

  .avatar-placeholder {
    max-width: 260px;
  }
}

@media (max-width: 520px) {
  .section-heading {
    align-items: center;
  }

  .toolbar {
    grid-template-columns: 1fr;
  }

  .control-group-wide {
    grid-column: auto;
  }

  .reset-button {
    width: 100%;
  }

  .profile-summary,
  .profile-information {
    padding: 1rem;
  }

  .information-list div {
    grid-template-columns: 1fr;
    gap: 0.05rem;
    padding: 0.35rem 0;
  }
}
</style>
