import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Application root element was not found');
}

const page = document.createElement('main');
page.className = 'container py-5';

const heading = document.createElement('h1');
heading.className = 'display-6 fw-semibold text-center mb-2';
heading.textContent = 'Система управління бібліотекою';

const description = document.createElement('p');
description.className = 'text-body-secondary text-center mb-0';
description.textContent = 'Застосунок завантажено. Наступний етап — моделі даних.';

page.append(heading, description);
root.append(page);
