import type { User } from '../../models/User';
import type { Page } from '../../services/Paginator';
import { createPagination } from './Pagination';

interface UserListHandlers {
  onDelete: (userId: string) => void;
  onPageChange: (page: number) => void;
}

export class UserList {
  public readonly element: HTMLElement;

  private readonly content: HTMLElement;

  public constructor(private readonly handlers: UserListHandlers) {
    this.element = document.createElement('section');
    this.element.className = 'card border-0 shadow-sm';

    const header = document.createElement('div');
    header.className = 'card-header bg-white border-0 px-4 pt-4 pb-0';

    const title = document.createElement('h2');
    title.className = 'h5 mb-1';
    title.textContent = 'Користувачі';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-body-secondary small mb-0';
    subtitle.textContent = 'Читачі та кількість позичених ними книг';

    this.content = document.createElement('div');
    this.content.className = 'card-body p-4';

    header.append(title, subtitle);
    this.element.append(header, this.content);
  }

  public render(page: Page<User>): void {
    this.content.replaceChildren();

    if (page.items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state text-center py-5';

      const title = document.createElement('h3');
      title.className = 'h6';
      title.textContent = 'Користувачів поки немає';

      const message = document.createElement('p');
      message.className = 'text-body-secondary small mb-0';
      message.textContent = 'Створіть перший читацький профіль.';

      empty.append(title, message);
      this.content.append(empty);
      return;
    }

    const list = document.createElement('div');
    list.className = 'vstack gap-2';

    for (const user of page.items) {
      const item = document.createElement('article');
      item.className = 'library-item d-flex align-items-center gap-3';

      const avatar = document.createElement('div');
      avatar.className = 'user-avatar flex-shrink-0';
      avatar.textContent = user.name.charAt(0).toLocaleUpperCase('uk');

      const details = document.createElement('div');
      details.className = 'flex-grow-1 min-width-0';

      const name = document.createElement('h3');
      name.className = 'h6 mb-1 text-truncate';
      name.textContent = user.name;

      const meta = document.createElement('p');
      meta.className = 'small text-body-secondary mb-0 text-truncate';
      meta.textContent = `ID ${user.id} · ${user.email}`;

      details.append(name, meta);

      const borrowedCount = document.createElement('span');
      borrowedCount.className = 'badge rounded-pill text-bg-light fw-normal flex-shrink-0';
      borrowedCount.textContent = `${user.borrowedBookIds.length} / 3 книг`;

      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-sm btn-outline-danger flex-shrink-0';
      deleteButton.type = 'button';
      deleteButton.textContent = 'Видалити';
      deleteButton.addEventListener('click', () => this.handlers.onDelete(user.id));

      item.append(avatar, details, borrowedCount, deleteButton);
      list.append(item);
    }

    this.content.append(
      list,
      createPagination({
        currentPage: page.currentPage,
        totalPages: page.totalPages,
        onChange: this.handlers.onPageChange,
      }),
    );
  }
}
