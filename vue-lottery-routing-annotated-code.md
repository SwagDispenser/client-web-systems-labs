# Повний код лабораторної: керування маршрутами з vue-router

Гілка feature/routing проєкту /Users/dmytro/vue-lottery-app, порівняно з main.

Нижче наведено повний вміст кожного доданого або зміненого файлу коду й конфігурації. Пояснення стоять перед файлами, щоб сам код можна було копіювати без редагування. Автоматично створений package-lock.json і прозовий README.md не включені.

## Зміст

1. [.env.example](#file-1)
2. [.github/workflows/deploy.yml](#file-2)
3. [.gitignore](#file-3)
4. [index.html](#file-4)
5. [package.json](#file-5)
6. [public/404.html](#file-6)
7. [src/App.vue](#file-7)
8. [src/api/httpClient.ts](#file-8)
9. [src/components/AppHeader.vue](#file-9)
10. [src/components/AppNavigation.vue](#file-10)
11. [src/components/Logo.vue](#file-11)
12. [src/components/LotteryApp.vue](#file-12)
13. [src/components/UserForm.vue](#file-13)
14. [src/layouts/AuthLayout.vue](#file-14)
15. [src/layouts/DefaultLayout.vue](#file-15)
16. [src/main.ts](#file-16)
17. [src/repositories/AuthService.ts](#file-17)
18. [src/repositories/ServiceProvider.ts](#file-18)
19. [src/repositories/UserService.ts](#file-19)
20. [src/repositories/contracts.ts](#file-20)
21. [src/router/index.ts](#file-21)
22. [src/stores/auth.ts](#file-22)
23. [src/stores/pinia.ts](#file-23)
24. [src/stores/userDirectory.ts](#file-24)
25. [src/types/auth.ts](#file-25)
26. [src/types/user.ts](#file-26)
27. [src/views/AboutView.vue](#file-27)
28. [src/views/HomeView.vue](#file-28)
29. [src/views/LoginView.vue](#file-29)
30. [src/views/NotFoundView.vue](#file-30)
31. [src/views/UserDetailView.vue](#file-31)
32. [src/views/UserEditView.vue](#file-32)
33. [src/views/UsersView.vue](#file-33)
34. [tests/httpClient.test.ts](#file-34)
35. [vite.config.ts](#file-35)

## 1. `.env.example` <a id="file-1"></a>

- **Коментар:** Приклад VITE_API_URL для локального .env. Фактичний .env не комітиться.

```text
VITE_API_URL=https://dummyjson.com
```

## 2. `.github/workflows/deploy.yml` <a id="file-2"></a>

- **Коментар:** Push у feature/routing запускає npm ci, lint, тести й build.

- **Коментар:** Результат dist передається GitHub Pages. Права pages:write та id-token:write потрібні деплою.

- **Коментар:** На час створення документа власний workflow ще мав помилку configure-pages.

```yaml
name: Deploy feature/routing to GitHub Pages

on:
  push:
    branches:
      - feature/routing
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: cp .env.example .env
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 3. `.gitignore` <a id="file-3"></a>

- **Коментар:** Додані правила для .env та .env.*, а виняток !.env.example дозволяє комітити приклад. Решта файлу походить із шаблону.

```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
.DS_Store
dist
dist-ssr
coverage
*.local
.env
.env.*
!.env.example

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

*.tsbuildinfo

.eslintcache

# Cypress
/cypress/videos/
/cypress/screenshots/

# Vitest
__screenshots__/

# Vite
*.timestamp-*-*.mjs
```

## 4. `index.html` <a id="file-4"></a>

- **Коментар:** Скрипт читає __spa_redirect після перенаправлення з 404.html.

- **Коментар:** history.replaceState відновлює маршрут, query та hash до запуску Vue Router; перевірка basePath утримує URL у межах сайту.

```html
<!DOCTYPE html>
<html lang="uk">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Lottery</title>
    <script>
      const redirectedRoute = new URLSearchParams(location.search).get('__spa_redirect')

      if (redirectedRoute !== null) {
        const basePath = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`
        const restoredUrl = new URL(redirectedRoute, `${location.origin}${basePath}`)

        if (restoredUrl.pathname.startsWith(basePath)) {
          history.replaceState(null, '', restoredUrl.pathname + restoredUrl.search + restoredUrl.hash)
        }
      }
    </script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## 5. `package.json` <a id="file-5"></a>

- **Коментар:** Додані vue-router, pinia, vee-validate, yup і сценарій test. Build запускає TypeScript-перевірку та Vite-збірку.

```json
{
  "name": "vue-lottery-app",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --build",
    "lint": "eslint src",
    "test": "vitest run"
  },
  "dependencies": {
    "@vee-validate/yup": "^4.15.1",
    "bootstrap": "^5.3.8",
    "pinia": "^4.0.3",
    "vee-validate": "^4.15.1",
    "vue": "^3.5.42",
    "vue-router": "^5.4.0",
    "yup": "^1.7.1"
  },
  "devDependencies": {
    "@tsconfig/node24": "^24.0.5",
    "@types/node": "^24.13.4",
    "@vitejs/plugin-vue": "^6.0.8",
    "@vue/tsconfig": "^0.9.1",
    "eslint": "^10.12.0",
    "eslint-plugin-vue": "^10.11.1",
    "npm-run-all2": "^9.0.3",
    "sass": "^1.105.1",
    "typescript": "~6.0.0",
    "typescript-eslint": "^8.71.0",
    "vite": "^8.2.2",
    "vitest": "^4.1.11",
    "vue-eslint-parser": "^10.4.1",
    "vue-tsc": "^3.3.11"
  },
  "engines": {
    "node": "^22.18.0 || >=24.12.0"
  }
}
```

## 6. `public/404.html` <a id="file-6"></a>

- **Коментар:** GitHub Pages не знає SPA-маршрутів. Цей файл кодує запитаний шлях, query і hash у параметр __spa_redirect та повертає браузер на корінь сайту.

```html
<!DOCTYPE html>
<html lang="uk">
  <head>
    <meta charset="UTF-8">
    <title>Перехід до Vue Lottery</title>
    <script>
      const pathParts = location.pathname.split('/').slice(1)
      const basePath = `/${pathParts[0]}/`
      const route = pathParts.slice(1).join('/') + location.search + location.hash

      location.replace(`${basePath}?__spa_redirect=${encodeURIComponent(route)}`)
    </script>
  </head>
  <body></body>
</html>
```

## 7. `src/App.vue` <a id="file-7"></a>

- **Коментар:** Кореневий компонент обчислює layout з meta.layout і показує поточну сторінку через RouterView.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AuthLayout from './layouts/AuthLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()
const layout = computed(() => route.meta.layout === 'auth' ? AuthLayout : DefaultLayout)
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
```

## 8. `src/api/httpClient.ts` <a id="file-8"></a>

- **Коментар:** ApiError зберігає статус. RequestOptions описує параметри fetch.

- **Коментар:** request формує URL з VITE_API_URL, JSON-body та Bearer-заголовок.

- **Коментар:** Після 401 refreshInFlight об’єднує одночасні оновлення токена, після чого запит повторюється один раз.

```ts
export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  query?: URLSearchParams
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
  skipAuth?: boolean
}

interface AuthHandlers {
  getAccessToken: () => string | null
  refreshAccessToken: () => Promise<string | null>
  onUnauthorized: () => void
}

export class HttpClient {
  private authHandlers: AuthHandlers | null = null
  private refreshInFlight: Promise<string | null> | null = null

  constructor(private readonly baseUrl: string) {
    if (!baseUrl) throw new Error('VITE_API_URL не налаштовано. Перевірте файл .env.')
  }

  setAuthHandlers(handlers: AuthHandlers): void {
    this.authHandlers = handlers
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(path.replace(/^\//, ''), `${this.baseUrl.replace(/\/$/, '')}/`)
    if (options.query) url.search = options.query.toString()

    const send = (token: string | null): Promise<Response> => {
      const headers = new Headers(options.headers)
      if (options.body !== undefined) headers.set('Content-Type', 'application/json')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return fetch(url, {
        method: options.method ?? 'GET',
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: options.signal,
      })
    }

    const token = options.skipAuth ? null : (this.authHandlers?.getAccessToken() ?? null)
    let response = await send(token)

    if (response.status === 401 && token && !options.skipAuth && this.authHandlers) {
      try {
        const currentToken = this.authHandlers.getAccessToken()
        const refreshedToken = currentToken && currentToken !== token
          ? currentToken
          : await this.refreshTokenOnce()
        if (refreshedToken) response = await send(refreshedToken)
      } catch { /* Original 401 is reported below after clearing the session. */ }
      if (response.status === 401) this.authHandlers.onUnauthorized()
    }

    const data: unknown = await response.json().catch(() => null)
    if (!response.ok) {
      const message = typeof data === 'object' && data !== null && 'message' in data &&
        typeof data.message === 'string' ? data.message : `HTTP ${response.status}`
      throw new ApiError(message, response.status)
    }

    return data as T
  }

  private async refreshTokenOnce(): Promise<string | null> {
    if (!this.authHandlers) return null
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.authHandlers.refreshAccessToken()
        .finally(() => { this.refreshInFlight = null })
    }
    return this.refreshInFlight
  }
}

export const httpClient = new HttpClient(import.meta.env.VITE_API_URL)
```

## 9. `src/components/AppHeader.vue` <a id="file-9"></a>

- **Коментар:** Поєднує Logo і AppNavigation у адаптивному заголовку.

```vue
<script setup lang="ts">
import AppNavigation from './AppNavigation.vue'
import Logo from './Logo.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header { background: #fff; border-bottom: 1px solid #e1e6e8; }
.app-header__inner { width: min(100% - 32px, 1040px); min-height: 74px; margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
@media (max-width: 620px) { .app-header__inner { padding: 12px 0; align-items: flex-start; flex-direction: column; gap: 10px; } }
</style>
```

## 10. `src/components/AppNavigation.vue` <a id="file-10"></a>

- **Коментар:** RouterLink показує Home, About author і Users та підсвічує активний маршрут.

- **Коментар:** За станом Pinia показується Login або Logout; Logout очищає сесію й переходить на /login.

```vue
<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About author' },
  { to: '/users', label: 'Users' },
] as const

async function logout(): Promise<void> {
  auth.logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <nav
    class="navigation"
    aria-label="Основна навігація"
  >
    <RouterLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="navigation__link"
      :exact-active-class="link.to === '/' ? 'navigation__link--active' : undefined"
    >
      {{ link.label }}
    </RouterLink>
    <button
      v-if="auth.isAuthenticated"
      class="navigation__link navigation__logout"
      type="button"
      @click="logout"
    >
      Logout
    </button>
    <RouterLink
      v-else
      to="/login"
      class="navigation__link"
    >
      Login
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.navigation { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.navigation__link { padding: 8px 12px; border-radius: 4px; color: #64757c; font-weight: 600; text-decoration: none; transition: background .15s, color .15s; }
.navigation__link:hover { color: #008fad; background: #eef9fc; }
.navigation__link.router-link-active, .navigation__link--active { color: #008fad; background: #e6f7fb; }
.navigation__logout { border: 0; background: transparent; }
@media (max-width: 620px) { .navigation { gap: 2px; } .navigation__link { padding: 7px 9px; font-size: 13px; } }
</style>
```

## 11. `src/components/Logo.vue` <a id="file-11"></a>

- **Коментар:** SVG-логотип веде на Home; aria-label пояснює призначення посилання.

- **Коментар:** defineOptions задає багатослівну назву AppLogo.

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineOptions({ name: 'AppLogo' })
</script>

<template>
  <RouterLink
    class="brand"
    to="/"
    aria-label="Vue Lottery — головна сторінка"
  >
    <svg
      class="brand__mark"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        fill="#00acd2"
      />
      <circle
        cx="15"
        cy="17"
        r="5"
        fill="white"
      />
      <circle
        cx="25"
        cy="17"
        r="5"
        fill="white"
        opacity=".72"
      />
      <path
        d="M13 27h14"
        stroke="white"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
    <span>Vue <strong>Lottery</strong></span>
  </RouterLink>
</template>

<style scoped lang="scss">
.brand { display: inline-flex; align-items: center; gap: 10px; color: #263238; text-decoration: none; font-size: 18px; white-space: nowrap; }
.brand__mark { width: 40px; height: 40px; flex: none; }
.brand strong { color: #008fad; }
</style>
```

## 12. `src/components/LotteryApp.vue` <a id="file-12"></a>

- **Коментар:** Сюди перенесено лотерею з попередньої лабораторної, щоб вона залишилася лише на Home.

- **Коментар:** Компонент координує блок переможців, форму реєстрації та таблицю.

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from './AppButton.vue'
import AppModal from './AppModal.vue'
import ParticipantFields from './ParticipantFields.vue'
import ParticipantsTable from './ParticipantsTable.vue'
import RegistrationForm from './RegistrationForm.vue'
import WinnersPanel from './WinnersPanel.vue'
import type { Participant, ParticipantInput } from '../types/participant'
import { normalizeEmail } from '../utils/validation'

const STORAGE_KEY = 'vue-lottery-participants'

function restoreParticipants(): Participant[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is Participant =>
      typeof item === 'object' && item !== null &&
      typeof item.id === 'string' && typeof item.name === 'string' &&
      typeof item.birthDate === 'string' && typeof item.email === 'string' &&
      typeof item.phone === 'string',
    )
  } catch {
    return []
  }
}

const participants = ref<Participant[]>(restoreParticipants())
const winnerIds = ref<string[]>([])
const editingParticipant = ref<Participant | null>(null)
const deletingParticipant = ref<Participant | null>(null)
const storageError = ref('')

watch(participants, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    storageError.value = ''
  } catch {
    storageError.value = 'Не вдалося зберегти учасників у браузері.'
  }
}, { deep: true })

const winners = computed(() => winnerIds.value
  .map((id) => participants.value.find((participant) => participant.id === id))
  .filter((participant): participant is Participant => Boolean(participant)))

const eligibleParticipants = computed(() => participants.value.filter(
  (participant) => !winnerIds.value.includes(participant.id),
))
const canDraw = computed(() => winners.value.length < 3 && eligibleParticipants.value.length > 0)

function registerParticipant(input: ParticipantInput): void {
  if (participants.value.some((participant) => normalizeEmail(participant.email) === normalizeEmail(input.email))) return
  participants.value.push({ id: crypto.randomUUID(), ...input })
}

function drawWinner(): void {
  if (!canDraw.value) return
  const index = Math.floor(Math.random() * eligibleParticipants.value.length)
  const winner = eligibleParticipants.value[index]
  if (winner) winnerIds.value.push(winner.id)
}

function updateParticipant(input: ParticipantInput): void {
  if (!editingParticipant.value) return
  Object.assign(editingParticipant.value, input)
  editingParticipant.value = null
}

function deleteParticipant(): void {
  if (!deletingParticipant.value) return
  const id = deletingParticipant.value.id
  participants.value = participants.value.filter((participant) => participant.id !== id)
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
  deletingParticipant.value = null
}
</script>

<template>
  <section
    class="lottery-app"
    aria-label="Лотерея"
  >
    <p
      v-if="storageError"
      class="lottery-app__error"
      role="alert"
    >
      {{ storageError }}
    </p>
    <WinnersPanel
      :winners="winners"
      :can-draw="canDraw"
      @draw="drawWinner"
      @remove="winnerIds = winnerIds.filter((id) => id !== $event)"
    />
    <RegistrationForm
      :participants="participants"
      @register="registerParticipant"
    />
    <ParticipantsTable
      :participants="participants"
      @edit="editingParticipant = $event"
      @delete="deletingParticipant = $event"
    />
  </section>

  <AppModal
    v-if="editingParticipant"
    title="Редагувати дані учасника"
    @close="editingParticipant = null"
  >
    <ParticipantFields
      :key="editingParticipant.id"
      :participants="participants"
      :initial="editingParticipant"
      mode="edit"
      @save="updateParticipant"
    />
  </AppModal>

  <AppModal
    v-if="deletingParticipant"
    title="Видалення учасника"
    @close="deletingParticipant = null"
  >
    <p class="lottery-app__confirm-text">
      Ви дійсно бажаєте видалити учасника "{{ deletingParticipant.name }}", "{{ deletingParticipant.email }}"?
    </p>
    <div class="lottery-app__confirm-actions">
      <AppButton
        variant="danger"
        @click="deleteParticipant"
      >
        Так
      </AppButton>
      <AppButton
        variant="secondary"
        @click="deletingParticipant = null"
      >
        Ні
      </AppButton>
    </div>
  </AppModal>
</template>

<style scoped lang="scss">
.lottery-app { width: min(100%, 802px); margin: 28px auto 80px; }
.lottery-app > :not(:last-child) { margin-bottom: 18px; }
.lottery-app__error { padding: 10px 14px; border: 1px solid #f3c4c4; border-radius: 4px; color: #a43636; background: #fff4f4; }
.lottery-app__confirm-text { margin: 0 0 24px; }
.lottery-app__confirm-actions { display: flex; justify-content: flex-end; gap: 10px; }
@media (max-width: 700px) { .lottery-app { margin-top: 32px; } }
</style>
```

## 13. `src/components/UserForm.vue` <a id="file-13"></a>

- **Коментар:** Спільна форма create/edit отримує initial через props і видає save з CreateUserDto.

- **Коментар:** VeeValidate та Yup перевіряють обов’язковість, email, пароль від 6 символів, вік 1–120 і стать.

- **Коментар:** Помилки поля та сервера відображаються біля форми.

```vue
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import AppButton from '@/components/AppButton.vue'
import type { CreateUserDto, User } from '@/types/user'

const props = withDefaults(defineProps<{
  initial?: User
  busy?: boolean
  serverError?: string
  submitLabel?: string
}>(), {
  initial: undefined,
  busy: false,
  serverError: '',
  submitLabel: 'Зберегти',
})
const emit = defineEmits<{ save: [input: CreateUserDto] }>()

const requiredText = 'Поле обов’язкове.'
const schema = toTypedSchema(yup.object({
  firstName: yup.string().trim().required(requiredText),
  lastName: yup.string().trim().required(requiredText),
  email: yup.string().trim().required(requiredText).email('Введіть коректний email.'),
  username: yup.string().trim().required(requiredText),
  password: yup.string().required(requiredText).min(6, 'Пароль має містити щонайменше 6 символів.'),
  age: yup.number().typeError('Введіть вік числом.').required(requiredText)
    .integer('Вік має бути цілим числом.').min(1, 'Вік має бути більшим за нуль.')
    .max(120, 'Введіть коректний вік.'),
  gender: yup.string().required(requiredText).oneOf(['male', 'female', 'other'], 'Оберіть стать.'),
  phone: yup.string().trim().required(requiredText),
}))

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: props.initial?.firstName ?? '',
    lastName: props.initial?.lastName ?? '',
    email: props.initial?.email ?? '',
    username: props.initial?.username ?? '',
    password: props.initial?.password ?? '',
    age: props.initial?.age,
    gender: props.initial?.gender ?? '',
    phone: props.initial?.phone ?? '',
  },
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [age, ageAttrs] = defineField('age')
const [gender, genderAttrs] = defineField('gender')
const [phone, phoneAttrs] = defineField('phone')

const submit = handleSubmit((values) => emit('save', values))
</script>

<template>
  <form
    class="user-form"
    novalidate
    @submit="submit"
  >
    <div class="user-form__grid">
      <label>
        <span>Ім’я</span>
        <input
          v-model="firstName"
          v-bind="firstNameAttrs"
          class="form-control"
          type="text"
          autocomplete="given-name"
          :aria-invalid="Boolean(errors.firstName)"
        >
        <small v-if="errors.firstName">{{ errors.firstName }}</small>
      </label>
      <label>
        <span>Прізвище</span>
        <input
          v-model="lastName"
          v-bind="lastNameAttrs"
          class="form-control"
          type="text"
          autocomplete="family-name"
          :aria-invalid="Boolean(errors.lastName)"
        >
        <small v-if="errors.lastName">{{ errors.lastName }}</small>
      </label>
      <label>
        <span>Email</span>
        <input
          v-model="email"
          v-bind="emailAttrs"
          class="form-control"
          type="email"
          autocomplete="email"
          :aria-invalid="Boolean(errors.email)"
        >
        <small v-if="errors.email">{{ errors.email }}</small>
      </label>
      <label>
        <span>Username</span>
        <input
          v-model="username"
          v-bind="usernameAttrs"
          class="form-control"
          type="text"
          autocomplete="username"
          :aria-invalid="Boolean(errors.username)"
        >
        <small v-if="errors.username">{{ errors.username }}</small>
      </label>
      <label>
        <span>Пароль</span>
        <input
          v-model="password"
          v-bind="passwordAttrs"
          class="form-control"
          type="password"
          autocomplete="new-password"
          :aria-invalid="Boolean(errors.password)"
        >
        <small v-if="errors.password">{{ errors.password }}</small>
      </label>
      <label>
        <span>Вік</span>
        <input
          v-model.number="age"
          v-bind="ageAttrs"
          class="form-control"
          type="number"
          min="1"
          max="120"
          :aria-invalid="Boolean(errors.age)"
        >
        <small v-if="errors.age">{{ errors.age }}</small>
      </label>
      <label>
        <span>Стать</span>
        <select
          v-model="gender"
          v-bind="genderAttrs"
          class="form-select"
          :aria-invalid="Boolean(errors.gender)"
        >
          <option value="">Оберіть стать</option>
          <option value="female">Жіноча</option>
          <option value="male">Чоловіча</option>
          <option value="other">Інша</option>
        </select>
        <small v-if="errors.gender">{{ errors.gender }}</small>
      </label>
      <label>
        <span>Телефон</span>
        <input
          v-model="phone"
          v-bind="phoneAttrs"
          class="form-control"
          type="tel"
          autocomplete="tel"
          :aria-invalid="Boolean(errors.phone)"
        >
        <small v-if="errors.phone">{{ errors.phone }}</small>
      </label>
    </div>

    <p
      v-if="serverError"
      class="user-form__server-error"
      role="alert"
    >
      {{ serverError }}
    </p>
    <div class="user-form__actions">
      <AppButton
        type="submit"
        :disabled="busy"
      >
        {{ busy ? 'Збереження…' : submitLabel }}
      </AppButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.user-form label { display: grid; align-content: start; gap: 6px; font-weight: 600; }
.user-form input, .user-form select { min-width: 0; font-weight: 400; }
.user-form small { color: #bd3434; font-size: 12px; font-weight: 400; }
.user-form [aria-invalid="true"] { border-color: #d9534f; }
.user-form__server-error { margin: 20px 0 0; color: #ad3434; }
.user-form__actions { display: flex; justify-content: flex-end; margin-top: 24px; }
@media (max-width: 580px) { .user-form__grid { grid-template-columns: 1fr; } }
</style>
```

## 14. `src/layouts/AuthLayout.vue` <a id="file-14"></a>

- **Коментар:** Окремий компактний layout для сторінки Login: Logo та слот із формою.

```vue
<script setup lang="ts">
import Logo from '@/components/Logo.vue'
</script>

<template>
  <main class="auth-layout">
    <Logo />
    <div class="auth-layout__content panel">
      <slot />
    </div>
  </main>
</template>

<style scoped lang="scss">
.auth-layout { width: min(100% - 32px, 440px); margin: 100px auto 60px; }
.auth-layout__content { margin-top: 24px; padding: 28px; }
@media (max-width: 620px) { .auth-layout { margin-top: 40px; } }
</style>
```

## 15. `src/layouts/DefaultLayout.vue` <a id="file-15"></a>

- **Коментар:** Загальний layout містить AppHeader і слот для вмісту сторінки.

```vue
<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <div class="default-layout">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.default-layout { width: min(100% - 32px, 1040px); margin: 0 auto; padding: 36px 0 72px; }
</style>
```

## 16. `src/main.ts` <a id="file-16"></a>

- **Коментар:** Точка входу підключає SCSS, створює застосунок, реєструє Pinia та Router.

- **Коментар:** Сесія відновлюється до встановлення Router, а HTTP-клієнт отримує обробники токена та 401.

```ts
import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import { httpClient } from './api/httpClient'
import { router } from './router'
import { useAuthStore } from './stores/auth'
import { pinia } from './stores/pinia'

const app = createApp(App)
app.use(pinia)

const auth = useAuthStore(pinia)
auth.restoreSession()
httpClient.setAuthHandlers({
  getAccessToken: () => auth.accessToken || null,
  refreshAccessToken: () => auth.refreshAccessToken(),
  onUnauthorized: () => auth.logout(),
})

app.use(router)
app.mount('#app')
```

## 17. `src/repositories/AuthService.ts` <a id="file-17"></a>

- **Коментар:** login викликає /auth/login, me — /auth/me, refresh — /auth/refresh.

- **Коментар:** skipAuth запобігає використанню старого токена для login і refresh.

```ts
import type { HttpClient } from '@/api/httpClient'
import type { AuthSession, AuthTokens, AuthUser, LoginDto } from '@/types/auth'

export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginDto): Promise<AuthSession> {
    return this.http.request<AuthSession>('/auth/login', {
      method: 'POST',
      body: credentials,
      skipAuth: true,
    })
  }

  me(): Promise<AuthUser> {
    return this.http.request<AuthUser>('/auth/me')
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return this.http.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      skipAuth: true,
    })
  }
}
```

## 18. `src/repositories/ServiceProvider.ts` <a id="file-18"></a>

- **Коментар:** Фабрика передає один HttpClient до UserService та AuthService; параметр конструктора полегшує тестування.

```ts
import { httpClient, type HttpClient } from '@/api/httpClient'
import { AuthService } from './AuthService'
import { UserService } from './UserService'

export class ServiceProvider {
  readonly users: UserService
  readonly auth: AuthService

  constructor(client: HttpClient = httpClient) {
    this.users = new UserService(client)
    this.auth = new AuthService(client)
  }
}

export const services = new ServiceProvider()
```

## 19. `src/repositories/UserService.ts` <a id="file-19"></a>

- **Коментар:** list обчислює skip=(page-1)*limit та вибирає /users або /users/search.

- **Коментар:** Інші методи викликають get, add, update і delete endpoints без повного URL.

```ts
import type { HttpClient } from '@/api/httpClient'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'
import type { Creatable, Deletable, Editable, ListOptions, Page, Readable } from './contracts'

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export class UserService implements
  Readable<User>,
  Creatable<User, CreateUserDto>,
  Editable<User, UpdateUserDto>,
  Deletable<User> {
  constructor(private readonly http: HttpClient) {}

  async list({ page, limit, query = '', signal }: ListOptions): Promise<Page<User>> {
    const params = new URLSearchParams({
      limit: String(limit),
      skip: String((page - 1) * limit),
    })
    const search = query.trim()
    if (search) params.set('q', search)

    const data = await this.http.request<UsersResponse>(
      search ? '/users/search' : '/users',
      { query: params, signal },
    )

    return { items: data.users, total: data.total, page, limit }
  }

  getById(id: number, signal?: AbortSignal): Promise<User> {
    return this.http.request<User>(`/users/${id}`, { signal })
  }

  create(input: CreateUserDto): Promise<User> {
    return this.http.request<User>('/users/add', { method: 'POST', body: input })
  }

  update(id: number, input: UpdateUserDto): Promise<User> {
    return this.http.request<User>(`/users/${id}`, { method: 'PUT', body: input })
  }

  delete(id: number): Promise<User> {
    return this.http.request<User>(`/users/${id}`, { method: 'DELETE' })
  }
}
```

## 20. `src/repositories/contracts.ts` <a id="file-20"></a>

- **Коментар:** Generic-інтерфейси Readable, Creatable, Editable і Deletable описують CRUD.

- **Коментар:** Page і ListOptions типізують пагінацію, пошук і AbortSignal.

```ts
export interface ListOptions {
  page: number
  limit: number
  query?: string
  signal?: AbortSignal
}

export interface Page<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface Readable<T> {
  list(options: ListOptions): Promise<Page<T>>
  getById(id: number, signal?: AbortSignal): Promise<T>
}

export interface Creatable<T, TInput = Partial<T>> {
  create(input: TInput): Promise<T>
}

export interface Editable<T, TInput = Partial<T>> {
  update(id: number, input: TInput): Promise<T>
}

export interface Deletable<T> {
  delete(id: number): Promise<T>
}
```

## 21. `src/router/index.ts` <a id="file-21"></a>

- **Коментар:** RouteMeta типізує title, layout і requiresAuth. Усі сторінки завантажуються через import().

- **Коментар:** Маршрут edit вкладений у деталі; id передається props.

- **Коментар:** beforeEach перевіряє авторизацію і redirect; afterEach встановлює заголовок вкладки.

```ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores/pinia'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    layout?: 'default' | 'auth'
    requiresAuth?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Home', layout: 'default' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: 'About author', layout: 'default' },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UsersView.vue'),
    meta: { title: 'Users', layout: 'default', requiresAuth: true },
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('../views/UserDetailView.vue'),
    props: true,
    meta: { title: 'User details', layout: 'default', requiresAuth: true },
    children: [
      {
        path: 'edit',
        name: 'user-edit',
        component: () => import('../views/UserEditView.vue'),
        props: true,
        meta: { title: 'Edit user', layout: 'default' },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Login', layout: 'auth' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page not found', layout: 'default' },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore(pinia)
  if (to.meta.requiresAuth && !await auth.ensureAuthenticated()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && await auth.ensureAuthenticated()) {
    return { name: 'users' }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title} · Vue Lottery`
})
```

## 22. `src/stores/auth.ts` <a id="file-22"></a>

- **Коментар:** Pinia-стан зберігає токени, профіль, verified та помилку localStorage.

- **Коментар:** watch синхронізує сесію, restoreSession перевіряє JSON, ensureAuthenticated викликає /auth/me.

- **Коментар:** logout очищає сесію та локальні зміни Users; refreshAccessToken зберігає нову пару токенів.

```ts
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { services } from '@/repositories/ServiceProvider'
import { userDirectory } from '@/stores/userDirectory'
import type { AuthSession, AuthUser, LoginDto } from '@/types/auth'

const STORAGE_KEY = 'vue-lottery-auth'

function profileFromSession(session: AuthSession): AuthUser {
  return {
    id: session.id,
    username: session.username,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    gender: session.gender,
    image: session.image,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('')
  const refreshToken = ref('')
  const user = ref<AuthUser | null>(null)
  const verified = ref(false)
  const storageError = ref('')
  const isAuthenticated = computed(() => Boolean(accessToken.value && refreshToken.value && user.value))
  let verificationInFlight: Promise<boolean> | null = null

  watch([accessToken, refreshToken, user], () => {
    try {
      if (isAuthenticated.value) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          accessToken: accessToken.value,
          refreshToken: refreshToken.value,
          user: user.value,
        }))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
      storageError.value = ''
    } catch {
      storageError.value = 'Не вдалося зберегти сесію в браузері.'
    }
  }, { deep: true })

  function restoreSession(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const stored: unknown = JSON.parse(raw)
      if (typeof stored !== 'object' || stored === null ||
        !('accessToken' in stored) || typeof stored.accessToken !== 'string' ||
        !('refreshToken' in stored) || typeof stored.refreshToken !== 'string' ||
        !('user' in stored) || typeof stored.user !== 'object' || stored.user === null ||
        !('id' in stored.user) || typeof stored.user.id !== 'number' ||
        !('username' in stored.user) || typeof stored.user.username !== 'string') {
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      accessToken.value = stored.accessToken
      refreshToken.value = stored.refreshToken
      user.value = stored.user as AuthUser
      verified.value = false
    } catch {
      storageError.value = 'Не вдалося відновити сесію з браузера.'
    }
  }

  function logout(): void {
    accessToken.value = ''
    refreshToken.value = ''
    user.value = null
    verified.value = false
    userDirectory.reset()
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      storageError.value = 'Не вдалося очистити збережену сесію.'
    }
  }

  async function refreshAccessToken(): Promise<string | null> {
    if (!refreshToken.value) return null
    const tokens = await services.auth.refresh(refreshToken.value)
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    return tokens.accessToken
  }

  async function ensureAuthenticated(): Promise<boolean> {
    if (!isAuthenticated.value) return false
    if (verified.value) return true
    if (!verificationInFlight) {
      verificationInFlight = services.auth.me()
        .then((profile) => {
          user.value = profile
          verified.value = true
          return true
        })
        .catch(() => {
          logout()
          return false
        })
        .finally(() => { verificationInFlight = null })
    }
    return verificationInFlight
  }

  async function login(credentials: LoginDto): Promise<void> {
    const session = await services.auth.login(credentials)
    accessToken.value = session.accessToken
    refreshToken.value = session.refreshToken
    user.value = profileFromSession(session)
    verified.value = false
    if (!await ensureAuthenticated()) throw new Error('Не вдалося підтвердити сесію користувача.')
  }

  return {
    accessToken,
    refreshToken,
    user,
    verified,
    storageError,
    isAuthenticated,
    restoreSession,
    logout,
    refreshAccessToken,
    ensureAuthenticated,
    login,
  }
})
```

## 23. `src/stores/pinia.ts` <a id="file-23"></a>

- **Коментар:** Один екземпляр Pinia доступний і точці входу, і navigation guard.

```ts
import { createPinia } from 'pinia'

export const pinia = createPinia()
```

## 24. `src/stores/userDirectory.ts` <a id="file-24"></a>

- **Коментар:** Map зберігають створених, змінених, видалених і кешованих користувачів поверх DummyJSON.

- **Коментар:** list поєднує ці зміни із серверною сторінкою та коригує total.

- **Коментар:** Для створених записів використовуються від’ємні id; revision реактивно оновлює інтерфейс. Стан зникає після повного перезавантаження.

```ts
import { ref } from 'vue'
import { services } from '@/repositories/ServiceProvider'
import type { ListOptions, Page } from '@/repositories/contracts'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'

const createdUsers = new Map<number, User>()
const updatedUsers = new Map<number, User>()
const deletedUsers = new Map<number, User>()
const cachedUsers = new Map<number, User>()
const revision = ref(0)
let nextLocalId = -1

function matchesSearch(user: User, query: string): boolean {
  if (!query) return true
  const searchable = `${user.firstName} ${user.lastName} ${user.maidenName ?? ''} ${user.username} ${user.email}`
  return searchable.toLocaleLowerCase().includes(query.toLocaleLowerCase())
}

async function list(options: ListOptions): Promise<Page<User>> {
  const result = await services.users.list(options)
  for (const user of result.items) cachedUsers.set(user.id, user)

  const query = options.query?.trim() ?? ''
  const remoteUsers = result.items
    .filter((user) => !deletedUsers.has(user.id))
    .map((user) => updatedUsers.get(user.id) ?? user)
    .filter((user) => !updatedUsers.has(user.id) || matchesSearch(user, query))
  const newlyMatchingUsers = options.page === 1 && query
    ? [...updatedUsers.values()].filter((user) => {
      const original = cachedUsers.get(user.id)
      return original && !matchesSearch(original, query) && matchesSearch(user, query)
    })
    : []
  const localUsers = options.page === 1
    ? [...createdUsers.values()].filter((user) => matchesSearch(user, query))
    : []

  const removedCount = [...deletedUsers.values()].filter((user) => matchesSearch(user, query)).length
  const createdCount = [...createdUsers.values()].filter((user) => matchesSearch(user, query)).length
  const updateAdjustment = [...updatedUsers.values()].reduce((count, user) => {
    const original = cachedUsers.get(user.id)
    if (!original) return count
    return count + Number(matchesSearch(user, query)) - Number(matchesSearch(original, query))
  }, 0)

  return {
    ...result,
    items: [...localUsers, ...newlyMatchingUsers, ...remoteUsers],
    total: Math.max(0, result.total + createdCount - removedCount + updateAdjustment),
  }
}

async function getById(id: number, signal?: AbortSignal): Promise<User> {
  if (deletedUsers.has(id)) throw new Error('Користувача видалено.')
  const local = createdUsers.get(id) ?? updatedUsers.get(id) ?? cachedUsers.get(id)
  if (local) return local

  const user = await services.users.getById(id, signal)
  cachedUsers.set(id, user)
  return user
}

async function create(input: CreateUserDto): Promise<User> {
  const response = await services.users.create(input)
  // DummyJSON повертає один і той самий id для кожного POST; локальні id мають бути унікальними.
  const user = { ...input, ...response, id: nextLocalId-- }
  createdUsers.set(user.id, user)
  revision.value += 1
  return user
}

async function update(id: number, input: UpdateUserDto): Promise<User> {
  const current = await getById(id)
  if (createdUsers.has(id)) {
    const user = { ...current, ...input }
    createdUsers.set(id, user)
    revision.value += 1
    return user
  }

  const response = await services.users.update(id, input)
  const user = { ...current, ...response, ...input, id }
  updatedUsers.set(id, user)
  revision.value += 1
  return user
}

async function remove(id: number): Promise<void> {
  const current = await getById(id)
  if (createdUsers.has(id)) {
    createdUsers.delete(id)
  } else {
    await services.users.delete(id)
    deletedUsers.set(id, cachedUsers.get(id) ?? current)
    updatedUsers.delete(id)
    cachedUsers.delete(id)
  }
  revision.value += 1
}

function reset(): void {
  createdUsers.clear()
  updatedUsers.clear()
  deletedUsers.clear()
  cachedUsers.clear()
  nextLocalId = -1
  revision.value += 1
}

export const userDirectory = { revision, list, getById, create, update, remove, reset }
```

## 25. `src/types/auth.ts` <a id="file-25"></a>

- **Коментар:** LoginDto типізує форму, AuthTokens — токени, AuthUser — профіль, AuthSession — відповідь входу.

```ts
export interface LoginDto {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export type AuthSession = AuthUser & AuthTokens
```

## 26. `src/types/user.ts` <a id="file-26"></a>

- **Коментар:** User описує дані DummyJSON, включно з необов’язковими вкладеними структурами.

- **Коментар:** CreateUserDto містить вісім полів форми, UpdateUserDto дозволяє передати їх частину.

```ts
export interface UserAddress {
  address: string
  city: string
  state: string
  country: string
  postalCode?: string
}

export interface UserCompany {
  department: string
  name: string
  title: string
  address?: UserAddress
}

export interface UserHair {
  color: string
  type: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: number
  gender: string
  phone: string
  image?: string
  birthDate?: string
  maidenName?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  hair?: UserHair
  university?: string
  address?: UserAddress
  company?: UserCompany
  role?: string
}

export type CreateUserDto = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'username' | 'password' | 'age' | 'gender' | 'phone'
>

export type UpdateUserDto = Partial<CreateUserDto>
```

## 27. `src/views/AboutView.vue` <a id="file-27"></a>

- **Коментар:** Сторінка показує ПІБ Довгешко Д.С., Technical skills і посилання на SwagDispenser.

```vue
<script setup lang="ts">
const skills = ['Vue 3', 'TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS', 'Git']
</script>

<template>
  <main class="about-view panel">
    <p class="about-view__eyebrow">
      About author
    </p>
    <h1>Довгешко Д.С.</h1>
    <p>Студент, автор навчального застосунку Vue Lottery.</p>

    <section aria-labelledby="skills-title">
      <h2 id="skills-title">
        Technical skills
      </h2>
      <ul class="about-view__skills">
        <li
          v-for="skill in skills"
          :key="skill"
        >
          {{ skill }}
        </li>
      </ul>
    </section>

    <a
      href="https://github.com/SwagDispenser"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub: SwagDispenser ↗
    </a>
  </main>
</template>

<style scoped lang="scss">
.about-view { max-width: 760px; padding: 32px; }
.about-view__eyebrow { margin: 0 0 8px; color: #008fad; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
h1 { margin: 0 0 8px; font-size: 30px; font-weight: 700; }
p { color: #64757c; }
section { margin: 30px 0; }
h2 { font-size: 18px; font-weight: 700; }
.about-view__skills { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; }
.about-view__skills li { padding: 7px 12px; background: #eaf8fb; border-radius: 3px; color: #087e99; }
a { color: #008fad; font-weight: 600; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>
```

## 28. `src/views/HomeView.vue` <a id="file-28"></a>

- **Коментар:** Новий вступ описує проєкт, технології та дає посилання на GitHub.

- **Коментар:** Нижче рендериться збережений LotteryApp.

```vue
<script setup lang="ts">
import LotteryApp from '@/components/LotteryApp.vue'

const technologies = [
  'Vue 3', 'Composition API', 'TypeScript', 'Vue Router', 'Pinia',
  'VeeValidate', 'Yup', 'DummyJSON REST API', 'Bootstrap SCSS',
]
</script>

<template>
  <main>
    <section
      class="home-intro panel"
      aria-labelledby="home-title"
    >
      <p class="home-intro__eyebrow">
        Навчальний SPA-проєкт
      </p>
      <h1 id="home-title">
        Лотерея учасників
      </h1>
      <p class="home-intro__description">
        Інтерактивний застосунок для реєстрації учасників, пошуку, редагування даних
        і випадкового вибору до трьох переможців. У цьому розділі працює початкова
        лотерея; сторінка Users використовуватиме окреме REST API.
      </p>
      <ul
        class="home-intro__technologies"
        aria-label="Технології проєкту"
      >
        <li
          v-for="technology in technologies"
          :key="technology"
        >
          {{ technology }}
        </li>
      </ul>
      <a
        href="https://github.com/SwagDispenser/vue-lottery-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Переглянути проєкт на GitHub ↗
      </a>
    </section>
    <LotteryApp />
  </main>
</template>

<style scoped lang="scss">
.home-intro { padding: 28px 32px; }
.home-intro__eyebrow { margin: 0 0 8px; color: #008fad; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
h1 { margin: 0 0 12px; font-size: clamp(28px, 4vw, 38px); font-weight: 700; }
.home-intro__description { max-width: 720px; color: #607078; line-height: 1.65; }
.home-intro__technologies { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; margin: 20px 0; padding: 0; }
.home-intro__technologies li { padding: 5px 10px; border-radius: 3px; background: #eaf8fb; color: #087e99; font-size: 12px; font-weight: 600; }
a { color: #008fad; font-weight: 600; text-decoration: none; }
a:hover { text-decoration: underline; }
@media (max-width: 620px) { .home-intro { padding: 22px 20px; } }
</style>
```

## 29. `src/views/LoginView.vue` <a id="file-29"></a>

- **Коментар:** VeeValidate перевіряє username і пароль; API-помилки показуються у формі.

- **Коментар:** Після входу перевіряється внутрішній redirect та виконується перехід на запитану сторінку.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import AppButton from '@/components/AppButton.vue'
import { ApiError } from '@/api/httpClient'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const loginError = ref('')

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(yup.object({
    username: yup.string().trim().required('Введіть username.'),
    password: yup.string().required('Введіть пароль.')
      .min(6, 'Пароль має містити щонайменше 6 символів.'),
  })),
  initialValues: { username: '', password: '' },
})

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

const submit = handleSubmit(async (credentials) => {
  if (loading.value) return
  loading.value = true
  loginError.value = ''
  try {
    await auth.login(credentials)
    const requestedPath = route.query.redirect
    const destination = typeof requestedPath === 'string' && requestedPath.startsWith('/') &&
      !requestedPath.startsWith('//') ? requestedPath : '/users'
    await router.replace(destination)
  } catch (cause) {
    loginError.value = cause instanceof ApiError && [400, 401].includes(cause.status)
      ? 'Неправильний username або пароль.'
      : cause instanceof Error ? cause.message : 'Не вдалося увійти. Спробуйте ще раз.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="login-view">
    <p class="login-view__eyebrow">
      Доступ до Users
    </p>
    <h1>Login</h1>
    <p class="login-view__intro">
      Увійдіть, щоб працювати зі списком користувачів DummyJSON.
    </p>

    <form
      class="login-view__form"
      novalidate
      @submit="submit"
    >
      <label>
        <span>Username</span>
        <input
          v-model="username"
          v-bind="usernameAttrs"
          class="form-control"
          type="text"
          autocomplete="username"
          :aria-invalid="Boolean(errors.username)"
        >
        <small v-if="errors.username">{{ errors.username }}</small>
      </label>
      <label>
        <span>Пароль</span>
        <input
          v-model="password"
          v-bind="passwordAttrs"
          class="form-control"
          type="password"
          autocomplete="current-password"
          :aria-invalid="Boolean(errors.password)"
        >
        <small v-if="errors.password">{{ errors.password }}</small>
      </label>

      <p
        v-if="loginError || auth.storageError"
        class="login-view__error"
        role="alert"
      >
        {{ loginError || auth.storageError }}
      </p>
      <AppButton
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Вхід…' : 'Login' }}
      </AppButton>
    </form>

    <p class="login-view__hint">
      Тестовий акаунт: emilys / emilyspass
    </p>
  </section>
</template>

<style scoped lang="scss">
.login-view__eyebrow { margin: 0 0 7px; color: #008fad; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
h1 { margin: 0 0 9px; font-size: 30px; font-weight: 700; }
.login-view__intro { margin: 0; color: #64757c; line-height: 1.6; }
.login-view__form { display: grid; gap: 18px; margin-top: 28px; }
.login-view__form label { display: grid; gap: 7px; font-weight: 600; }
.login-view__form input { min-height: 40px; font-weight: 400; }
.login-view__form small, .login-view__error { color: #bd3434; font-size: 12px; font-weight: 400; }
.login-view__form [aria-invalid="true"] { border-color: #d9534f; }
.login-view__form button { justify-self: end; min-width: 100px; }
.login-view__hint { margin: 24px 0 0; color: #829197; font-size: 12px; }
</style>
```

## 30. `src/views/NotFoundView.vue` <a id="file-30"></a>

- **Коментар:** Сторінка для catch-all маршруту показує 404 та посилання на Home.

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="not-found panel">
    <p class="not-found__code">
      404
    </p>
    <h1>Сторінку не знайдено</h1>
    <p>Перевірте адресу або поверніться до застосунку.</p>
    <RouterLink to="/">
      На головну →
    </RouterLink>
  </main>
</template>

<style scoped lang="scss">
.not-found { max-width: 680px; padding: 44px 32px; text-align: center; }
.not-found__code { margin: 0; color: #00acd2; font-size: 64px; font-weight: 800; line-height: 1; }
h1 { margin: 14px 0 10px; font-size: 28px; font-weight: 700; }
p { color: #64757c; }
a { display: inline-block; margin-top: 14px; color: #008fad; font-weight: 700; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>
```

## 31. `src/views/UserDetailView.vue` <a id="file-31"></a>

- **Коментар:** id приходить через props; watch завантажує профіль і реагує на revision.

- **Коментар:** Сторінка показує повні поля DummyJSON та вкладений RouterView для edit.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { userDirectory } from '@/stores/userDirectory'
import type { User } from '@/types/user'

const props = defineProps<{ id: string }>()
const route = useRoute()
const user = ref<User | null>(null)
const loading = ref(false)
const error = ref('')

watch([() => props.id, userDirectory.revision], async ([rawId], _previous, onCleanup) => {
  const id = Number(rawId)
  if (!Number.isSafeInteger(id) || id === 0) {
    user.value = null
    loading.value = false
    error.value = 'Некоректний ідентифікатор користувача.'
    return
  }

  const controller = new AbortController()
  onCleanup(() => controller.abort())
  loading.value = true
  error.value = ''
  try {
    const result = await userDirectory.getById(id, controller.signal)
    if (!controller.signal.aborted) user.value = result
  } catch (cause) {
    if (controller.signal.aborted) return
    user.value = null
    error.value = cause instanceof Error ? cause.message : 'Не вдалося завантажити користувача.'
  } finally {
    if (!controller.signal.aborted) loading.value = false
  }
}, { immediate: true })
</script>

<template>
  <main class="user-detail panel">
    <RouterLink
      class="user-detail__back"
      :to="{ name: 'users', query: route.query }"
    >
      ← До списку
    </RouterLink>

    <p
      v-if="loading"
      role="status"
    >
      Завантаження користувача…
    </p>
    <p
      v-else-if="error"
      class="user-detail__error"
      role="alert"
    >
      {{ error }}
    </p>
    <template v-else-if="user">
      <div class="user-detail__heading">
        <img
          v-if="user.image"
          :src="user.image"
          :alt="`Фото ${user.firstName} ${user.lastName}`"
          width="76"
          height="76"
        >
        <div>
          <p class="user-detail__eyebrow">
            {{ user.id > 0 ? `Користувач #${user.id}` : 'Локально створений користувач' }}
          </p>
          <h1>{{ user.firstName }} {{ user.lastName }}</h1>
          <p>@{{ user.username }}</p>
        </div>
      </div>

      <dl class="user-detail__facts">
        <div><dt>Email</dt><dd>{{ user.email }}</dd></div>
        <div><dt>Телефон</dt><dd>{{ user.phone }}</dd></div>
        <div><dt>Вік</dt><dd>{{ user.age }}</dd></div>
        <div><dt>Стать</dt><dd>{{ user.gender }}</dd></div>
        <div v-if="user.birthDate">
          <dt>Дата народження</dt><dd>{{ user.birthDate }}</dd>
        </div>
        <div v-if="user.role">
          <dt>Роль</dt><dd>{{ user.role }}</dd>
        </div>
        <div v-if="user.maidenName">
          <dt>Дівоче прізвище</dt><dd>{{ user.maidenName }}</dd>
        </div>
        <div v-if="user.bloodGroup">
          <dt>Група крові</dt><dd>{{ user.bloodGroup }}</dd>
        </div>
        <div v-if="user.height">
          <dt>Зріст</dt><dd>{{ user.height }} см</dd>
        </div>
        <div v-if="user.weight">
          <dt>Вага</dt><dd>{{ user.weight }} кг</dd>
        </div>
        <div v-if="user.eyeColor">
          <dt>Колір очей</dt><dd>{{ user.eyeColor }}</dd>
        </div>
        <div v-if="user.hair?.color">
          <dt>Волосся</dt><dd>{{ user.hair.color }}, {{ user.hair.type }}</dd>
        </div>
        <div v-if="user.university">
          <dt>Університет</dt><dd>{{ user.university }}</dd>
        </div>
        <div v-if="user.address?.address">
          <dt>Адреса</dt>
          <dd>
            {{ user.address.address }}, {{ user.address.city }}, {{ user.address.state }},
            {{ user.address.postalCode }}, {{ user.address.country }}
          </dd>
        </div>
        <div v-if="user.company?.name">
          <dt>Компанія</dt>
          <dd>{{ user.company.name }} — {{ user.company.title }} ({{ user.company.department }})</dd>
        </div>
      </dl>

      <RouterLink
        v-if="route.name !== 'user-edit'"
        class="user-detail__edit"
        :to="{ name: 'user-edit', params: { id: user.id }, query: route.query }"
      >
        Редагувати дані
      </RouterLink>
      <RouterView />
    </template>
  </main>
</template>

<style scoped lang="scss">
.user-detail { max-width: 850px; padding: 30px 32px; }
.user-detail__back { color: #008fad; font-weight: 600; text-decoration: none; }
.user-detail__heading { display: flex; align-items: center; gap: 20px; margin: 24px 0; }
.user-detail__heading img { border-radius: 50%; background: #eaf8fb; object-fit: cover; }
.user-detail__eyebrow { margin: 0 0 5px; color: #008fad; font-size: 12px; font-weight: 700; text-transform: uppercase; }
h1 { margin: 0 0 5px; font-size: 30px; }
.user-detail__heading p:last-child { margin: 0; color: #7b8b91; }
.user-detail__facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin: 0 0 26px; }
.user-detail__facts div { padding: 16px; border: 1px solid #e8edef; border-radius: 4px; }
.user-detail__facts dt { margin-bottom: 5px; color: #809096; font-size: 12px; text-transform: uppercase; }
.user-detail__facts dd { margin: 0; overflow-wrap: anywhere; font-weight: 600; }
.user-detail__error { color: #b03b3b; }
.user-detail__edit { display: inline-block; padding: 9px 15px; border-radius: 3px; background: #00acd2; color: #fff; font-weight: 600; text-decoration: none; }
@media (max-width: 620px) { .user-detail { padding: 22px 18px; } .user-detail__facts { grid-template-columns: 1fr; } }
</style>
```

## 32. `src/views/UserEditView.vue` <a id="file-32"></a>

- **Коментар:** Вкладений маршрут завантажує дані, передає їх у UserForm і після збереження відкриває оновлені деталі.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserForm from '@/components/UserForm.vue'
import { userDirectory } from '@/stores/userDirectory'
import type { CreateUserDto, User } from '@/types/user'

const props = defineProps<{ id: string }>()
const route = useRoute()
const router = useRouter()
const user = ref<User | null>(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

watch(() => props.id, async (rawId, _previous, onCleanup) => {
  const id = Number(rawId)
  if (!Number.isSafeInteger(id) || id === 0) {
    user.value = null
    loading.value = false
    error.value = 'Некоректний ідентифікатор користувача.'
    return
  }

  const controller = new AbortController()
  onCleanup(() => controller.abort())
  loading.value = true
  error.value = ''
  try {
    const result = await userDirectory.getById(id, controller.signal)
    if (!controller.signal.aborted) user.value = result
  } catch (cause) {
    if (!controller.signal.aborted) error.value = cause instanceof Error ? cause.message : 'Не вдалося завантажити форму.'
  } finally {
    if (!controller.signal.aborted) loading.value = false
  }
}, { immediate: true })

async function save(input: CreateUserDto): Promise<void> {
  if (!user.value || saving.value) return
  saving.value = true
  error.value = ''
  try {
    await userDirectory.update(user.value.id, input)
    await router.push({ name: 'user-detail', params: { id: user.value.id }, query: route.query })
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не вдалося оновити користувача.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section
    class="user-edit"
    aria-labelledby="edit-user-title"
  >
    <h2 id="edit-user-title">
      Редагувати дані
    </h2>
    <p
      v-if="loading"
      role="status"
    >
      Завантаження форми…
    </p>
    <UserForm
      v-else-if="user"
      :key="user.id"
      :initial="user"
      :busy="saving"
      :server-error="error"
      submit-label="Оновити дані"
      @save="save"
    />
    <p
      v-else-if="error"
      role="alert"
    >
      {{ error }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.user-edit { padding-top: 28px; border-top: 1px solid #e8edef; }
.user-edit h2 { margin: 0 0 20px; font-size: 20px; }
</style>
```

## 33. `src/views/UsersView.vue` <a id="file-33"></a>

- **Коментар:** page і q читаються з URL; PAGE_SIZE дорівнює 10.

- **Коментар:** watch пошуку має debounce 300 мс, а завантаження скасовує застарілий запит через AbortController.

- **Коментар:** Таблиця показує loading/error, пагінацію, створення через UserForm у модальному вікні та підтвердження видалення.

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/AppButton.vue'
import AppModal from '@/components/AppModal.vue'
import UserForm from '@/components/UserForm.vue'
import { userDirectory } from '@/stores/userDirectory'
import type { CreateUserDto, User } from '@/types/user'

const PAGE_SIZE = 10
const route = useRoute()
const router = useRouter()

function queryValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

const page = computed(() => {
  const value = Number(queryValue(route.query.page))
  return Number.isSafeInteger(value) && value > 0 ? value : 1
})
const query = computed(() => queryValue(route.query.q).trim())
const searchText = ref(query.value)
const users = ref<User[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref('')
const createOpen = ref(false)
const creating = ref(false)
const createError = ref('')
const deletingUser = ref<User | null>(null)
const deleting = ref(false)
const deleteError = ref('')
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

watch(query, (value) => {
  searchText.value = value
})

watch(searchText, (value, _previous, onCleanup) => {
  const nextQuery = value.trim()
  if (nextQuery === query.value) return

  const timer = window.setTimeout(() => {
    void router.replace({
      name: 'users',
      query: { q: nextQuery || undefined },
    })
  }, 300)
  onCleanup(() => window.clearTimeout(timer))
})

watch([page, query, userDirectory.revision], async ([currentPage, currentQuery], _previous, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  loading.value = true
  error.value = ''

  try {
    const result = await userDirectory.list({
      page: currentPage,
      limit: PAGE_SIZE,
      query: currentQuery,
      signal: controller.signal,
    })
    if (controller.signal.aborted) return

    users.value = result.items
    total.value = result.total
    const lastPage = Math.max(1, Math.ceil(result.total / PAGE_SIZE))
    if (currentPage > lastPage) {
      void router.replace({
        name: 'users',
        query: { page: lastPage > 1 ? String(lastPage) : undefined, q: currentQuery || undefined },
      })
    }
  } catch (cause) {
    if (controller.signal.aborted) return
    users.value = []
    total.value = 0
    error.value = cause instanceof Error ? cause.message : 'Не вдалося завантажити користувачів.'
  } finally {
    if (!controller.signal.aborted) loading.value = false
  }
}, { immediate: true })

function goToPage(nextPage: number): void {
  if (nextPage < 1 || nextPage > pageCount.value || nextPage === page.value) return
  void router.push({
    name: 'users',
    query: { page: nextPage > 1 ? String(nextPage) : undefined, q: query.value || undefined },
  })
}

async function createUser(input: CreateUserDto): Promise<void> {
  if (creating.value) return
  creating.value = true
  createError.value = ''
  try {
    await userDirectory.create(input)
    createOpen.value = false
    if (page.value !== 1 || query.value) await router.push({ name: 'users' })
  } catch (cause) {
    createError.value = cause instanceof Error ? cause.message : 'Не вдалося створити користувача.'
  } finally {
    creating.value = false
  }
}

async function deleteUser(): Promise<void> {
  if (!deletingUser.value || deleting.value) return
  deleting.value = true
  deleteError.value = ''
  try {
    await userDirectory.remove(deletingUser.value.id)
    deletingUser.value = null
  } catch (cause) {
    deleteError.value = cause instanceof Error ? cause.message : 'Не вдалося видалити користувача.'
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <main class="users-view panel">
    <div class="users-view__heading">
      <div>
        <p class="users-view__eyebrow">
          DummyJSON Users
        </p>
        <h1>Користувачі</h1>
        <p class="users-view__subtitle">
          Пошук і сторінка списку зберігаються в адресі браузера.
        </p>
      </div>
      <div class="users-view__heading-actions">
        <span class="users-view__count">Усього: {{ total }}</span>
        <AppButton @click="createOpen = true">
          Створити користувача
        </AppButton>
      </div>
    </div>

    <label class="users-view__search">
      <span>Пошук за іменем</span>
      <input
        v-model="searchText"
        class="form-control"
        type="search"
        placeholder="Введіть ім’я користувача"
      >
    </label>

    <p
      v-if="error"
      class="users-view__error"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="loading"
      class="users-view__state"
      role="status"
    >
      Завантаження користувачів…
    </p>
    <template v-else>
      <div class="users-view__table-wrap">
        <table class="table users-view__table">
          <thead>
            <tr>
              <th scope="col">
                #
              </th>
              <th scope="col">
                Ім’я
              </th>
              <th scope="col">
                Username
              </th>
              <th scope="col">
                Email
              </th>
              <th scope="col">
                Телефон
              </th>
              <th scope="col">
                Вік
              </th>
              <th scope="col">
                Дії
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
            >
              <td>{{ user.id > 0 ? user.id : '—' }}</td>
              <td class="users-view__name">
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.age }}</td>
              <td>
                <div class="users-view__row-actions">
                  <RouterLink :to="{ name: 'user-detail', params: { id: user.id }, query: route.query }">
                    Деталі
                  </RouterLink>
                  <RouterLink :to="{ name: 'user-edit', params: { id: user.id }, query: route.query }">
                    Редагувати
                  </RouterLink>
                  <button
                    type="button"
                    @click="deletingUser = user"
                  >
                    Видалити
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td
                class="users-view__empty"
                colspan="7"
              >
                За цим запитом користувачів не знайдено.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="users-view__pagination">
        <span>Сторінка {{ page }} із {{ pageCount }}</span>
        <div class="users-view__pagination-actions">
          <AppButton
            variant="secondary"
            :disabled="page <= 1"
            @click="goToPage(page - 1)"
          >
            Назад
          </AppButton>
          <AppButton
            variant="secondary"
            :disabled="page >= pageCount"
            @click="goToPage(page + 1)"
          >
            Далі
          </AppButton>
        </div>
      </div>
    </template>
  </main>

  <AppModal
    v-if="createOpen"
    title="Створити користувача"
    @close="createOpen = false"
  >
    <UserForm
      :busy="creating"
      :server-error="createError"
      submit-label="Створити користувача"
      @save="createUser"
    />
  </AppModal>

  <AppModal
    v-if="deletingUser"
    title="Видалити користувача"
    @close="deletingUser = null"
  >
    <p>Видалити {{ deletingUser.firstName }} {{ deletingUser.lastName }} ({{ deletingUser.email }})?</p>
    <p
      v-if="deleteError"
      class="users-view__error"
      role="alert"
    >
      {{ deleteError }}
    </p>
    <div class="users-view__confirm-actions">
      <AppButton
        variant="secondary"
        @click="deletingUser = null"
      >
        Скасувати
      </AppButton>
      <AppButton
        variant="danger"
        :disabled="deleting"
        @click="deleteUser"
      >
        {{ deleting ? 'Видалення…' : 'Так, видалити' }}
      </AppButton>
    </div>
  </AppModal>
</template>

<style scoped lang="scss">
.users-view { padding: 30px 32px; }
.users-view__heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.users-view__heading-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.users-view__eyebrow { margin: 0 0 6px; color: #008fad; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
h1 { margin: 0 0 8px; font-size: 30px; font-weight: 700; }
.users-view__subtitle { margin: 0; color: #71828a; }
.users-view__count { padding: 7px 11px; border-radius: 3px; background: #eaf8fb; color: #087e99; white-space: nowrap; }
.users-view__search { display: grid; gap: 7px; width: min(100%, 350px); margin: 30px 0 24px; font-weight: 600; }
.users-view__search input { min-height: 38px; font-weight: 400; }
.users-view__state, .users-view__error { padding: 18px; border-radius: 4px; }
.users-view__state { background: #eef8fb; color: #477080; }
.users-view__error { border: 1px solid #f3c4c4; background: #fff4f4; color: #a43636; }
.users-view__table-wrap { overflow-x: auto; }
.users-view__table { min-width: 940px; margin-bottom: 0; }
.users-view__table th { color: #48585f; white-space: nowrap; }
.users-view__table td { color: #65747b; vertical-align: middle; }
.users-view__table td.users-view__name { color: #27363d; font-weight: 600; white-space: nowrap; }
.users-view__empty { padding: 30px !important; text-align: center; }
.users-view__row-actions { display: flex; align-items: center; gap: 8px; }
.users-view__row-actions a, .users-view__row-actions button { padding: 4px 6px; border: 0; background: none; color: #008fad; font-size: 12px; font-weight: 600; text-decoration: none; white-space: nowrap; }
.users-view__row-actions button { color: #c13f3f; }
.users-view__row-actions a:hover, .users-view__row-actions button:hover { text-decoration: underline; }
.users-view__confirm-actions { display: flex; justify-content: flex-end; gap: 9px; margin-top: 24px; }
.users-view__pagination { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 22px; color: #65747b; }
.users-view__pagination-actions { display: flex; gap: 8px; }
@media (max-width: 620px) { .users-view { padding: 22px 18px; } .users-view__heading, .users-view__pagination { flex-wrap: wrap; } }
</style>
```

## 34. `tests/httpClient.test.ts` <a id="file-34"></a>

- **Коментар:** Три тести Vitest перевіряють успішний refresh і повтор запиту, невдалий refresh та відсутність refresh для Login.

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpClient } from '../src/api/httpClient'

afterEach(() => vi.unstubAllGlobals())

describe('HttpClient 401 handling', () => {
  it('refreshes the access token and repeats the original request once', async () => {
    const client = new HttpClient('https://example.test')
    let token = 'expired-token'
    const refresh = vi.fn(async () => {
      token = 'fresh-token'
      return token
    })
    const unauthorized = vi.fn()
    client.setAuthHandlers({
      getAccessToken: () => token,
      refreshAccessToken: refresh,
      onUnauthorized: unauthorized,
    })

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'Expired' }), { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1 }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(client.request<{ id: number }>('/auth/me')).resolves.toEqual({ id: 1 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('Authorization'))
      .toBe('Bearer expired-token')
    expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get('Authorization'))
      .toBe('Bearer fresh-token')
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(unauthorized).not.toHaveBeenCalled()
  })

  it('clears authorization when refresh fails without retrying forever', async () => {
    const client = new HttpClient('https://example.test')
    const refresh = vi.fn(async () => { throw new Error('Refresh failed') })
    const unauthorized = vi.fn()
    client.setAuthHandlers({
      getAccessToken: () => 'expired-token',
      refreshAccessToken: refresh,
      onUnauthorized: unauthorized,
    })
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Expired' }), { status: 401 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(client.request('/auth/me')).rejects.toMatchObject({ status: 401 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(unauthorized).toHaveBeenCalledTimes(1)
  })

  it('does not refresh an unauthenticated login request', async () => {
    const client = new HttpClient('https://example.test')
    const refresh = vi.fn(async () => 'fresh-token')
    client.setAuthHandlers({
      getAccessToken: () => 'expired-token',
      refreshAccessToken: refresh,
      onUnauthorized: vi.fn(),
    })
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(client.request('/auth/login', { method: 'POST', skipAuth: true }))
      .rejects.toMatchObject({ status: 401 })
    expect(refresh).not.toHaveBeenCalled()
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).has('Authorization')).toBe(false)
  })
})
```

## 35. `vite.config.ts` <a id="file-35"></a>

- **Коментар:** Для production команда build задає base /vue-lottery-app/, а локальний dev лишається на /. Псевдонім @ вказує на src.

```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vue-lottery-app/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
```
