import type { Book } from '../../models/Book';
import type { Page } from '../../services/Paginator';
import { createPagination } from './Pagination';

interface BookListHandlers {
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onPageChange: (page: number) => void;
}

export class BookList {
  public readonly element: HTMLElement;

  private readonly content: HTMLElement;

  public constructor(private readonly handlers: BookListHandlers) {
    this.element = document.createElement('section');
    this.element.className = 'card border-0 shadow-sm';

    const header = document.createElement('div');
    header.className = 'card-header bg-white border-0 px-4 pt-4 pb-0';

    const title = document.createElement('h2');
    title.className = 'h5 mb-1';
    title.textContent = 'Каталог книг';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-body-secondary small mb-0';
    subtitle.textContent = 'Позичайте, повертайте та керуйте виданнями';

    this.content = document.createElement('div');
    this.content.className = 'card-body p-4';

    header.append(title, subtitle);
    this.element.append(header, this.content);
  }

  public render(page: Page<Book>): void {
    this.content.replaceChildren();

    if (page.items.length === 0) {
      this.content.append(
        this.createEmptyState(
          'Книг поки немає',
          'Додайте першу книгу або змініть пошуковий запит.',
        ),
      );
      return;
    }

    const list = document.createElement('div');
    list.className = 'vstack gap-3';

    for (const book of page.items) {
      list.append(this.createBookItem(book));
    }

    const count = document.createElement('p');
    count.className = 'small text-body-secondary text-center mt-3 mb-0';
    count.textContent = `Усього знайдено: ${page.totalItems}`;

    this.content.append(
      list,
      createPagination({
        currentPage: page.currentPage,
        totalPages: page.totalPages,
        onChange: this.handlers.onPageChange,
      }),
      count,
    );
  }

  private createBookItem(book: Book): HTMLElement {
    const item = document.createElement('article');
    item.className = 'library-item d-flex flex-column flex-lg-row gap-3 align-items-lg-center';

    const cover = document.createElement('div');
    cover.className = 'book-cover flex-shrink-0';
    cover.textContent = book.title.charAt(0).toLocaleUpperCase('uk');

    const details = document.createElement('div');
    details.className = 'flex-grow-1 min-width-0';

    const title = document.createElement('h3');
    title.className = 'h6 mb-1 text-truncate';
    title.textContent = book.title;

    const author = document.createElement('p');
    author.className = 'small text-body-secondary mb-1';
    author.textContent = book.author;

    const meta = document.createElement('div');
    meta.className = 'd-flex flex-wrap align-items-center gap-2';

    const year = document.createElement('span');
    year.className = 'badge text-bg-light fw-normal';
    year.textContent = String(book.publicationYear);

    const status = document.createElement('span');
    status.className = `badge rounded-pill ${book.isBorrowed ? 'text-bg-warning' : 'text-bg-success'}`;
    status.textContent = book.isBorrowed ? `Позичена · ID ${book.borrowedBy}` : 'Доступна';

    meta.append(year, status);
    details.append(title, author, meta);

    const actions = document.createElement('div');
    actions.className = 'd-flex gap-2 flex-shrink-0';

    const primaryButton = document.createElement('button');
    primaryButton.className = `btn btn-sm ${book.isBorrowed ? 'btn-outline-primary' : 'btn-primary'}`;
    primaryButton.type = 'button';
    primaryButton.textContent = book.isBorrowed ? 'Повернути' : 'Позичити';
    primaryButton.addEventListener('click', () => {
      if (book.isBorrowed) {
        this.handlers.onReturn(book.id);
      } else {
        this.handlers.onBorrow(book.id);
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm btn-outline-danger';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Видалити';
    deleteButton.addEventListener('click', () => this.handlers.onDelete(book.id));

    actions.append(primaryButton, deleteButton);
    item.append(cover, details, actions);
    return item;
  }

  private createEmptyState(titleText: string, messageText: string): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'empty-state text-center py-5';

    const icon = document.createElement('div');
    icon.className = 'empty-state-icon mx-auto mb-3';
    icon.textContent = 'К';

    const title = document.createElement('h3');
    title.className = 'h6';
    title.textContent = titleText;

    const message = document.createElement('p');
    message.className = 'text-body-secondary small mb-0';
    message.textContent = messageText;

    wrapper.append(icon, title, message);
    return wrapper;
  }
}
