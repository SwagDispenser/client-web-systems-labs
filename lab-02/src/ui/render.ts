import { Book } from '../models/Book';
import { User } from '../models/User';
import { LibraryManager } from '../services/LibraryManager';
import { NotificationService } from '../services/NotificationService';
import { Paginator } from '../services/Paginator';
import { generateId } from '../utils/idGenerator';
import { Validation } from '../utils/validators';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';
import { Modal } from './components/Modal';
import { NotificationView } from './components/NotificationView';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';

export class LibraryApp {
  private readonly bookPaginator = new Paginator<Book>(5);
  private readonly userPaginator = new Paginator<User>(5);
  private readonly bookList: BookList;
  private readonly userList: UserList;
  private readonly notificationView: NotificationView;

  private bookPage = 1;
  private userPage = 1;
  private searchQuery = '';

  private readonly bookCount = document.createElement('strong');
  private readonly availableCount = document.createElement('strong');
  private readonly borrowedCount = document.createElement('strong');
  private readonly userCount = document.createElement('strong');

  public constructor(
    private readonly root: HTMLElement,
    private readonly manager: LibraryManager,
    private readonly notifications: NotificationService,
  ) {
    this.notificationView = new NotificationView(notifications);
    this.bookList = new BookList({
      onBorrow: (bookId) => void this.handleBorrow(bookId),
      onReturn: (bookId) => this.handleReturn(bookId),
      onDelete: (bookId) => void this.handleDeleteBook(bookId),
      onPageChange: (page) => {
        this.bookPage = page;
        this.renderData();
      },
    });
    this.userList = new UserList({
      onDelete: (userId) => void this.handleDeleteUser(userId),
      onPageChange: (page) => {
        this.userPage = page;
        this.renderData();
      },
    });
  }

  public mount(): void {
    const page = document.createElement('div');

    const header = this.createHeader();
    const main = document.createElement('main');
    main.className = 'container pb-5';

    const statistics = this.createStatistics();
    const forms = this.createForms();
    const search = this.createSearch();

    const lists = document.createElement('div');
    lists.className = 'row g-4 align-items-start';

    const booksColumn = document.createElement('div');
    booksColumn.className = 'col-xl-7';
    booksColumn.append(this.bookList.element);

    const usersColumn = document.createElement('div');
    usersColumn.className = 'col-xl-5';
    usersColumn.append(this.userList.element);

    lists.append(booksColumn, usersColumn);
    main.append(statistics, forms, search, lists);
    page.append(header, main, this.createFooter());
    this.root.replaceChildren(page);
    this.renderData();
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('header');
    header.className = 'app-hero mb-4';

    const container = document.createElement('div');
    container.className = 'container py-5';

    const badge = document.createElement('span');
    badge.className = 'hero-badge mb-3';
    badge.textContent = 'Електронний каталог';

    const heading = document.createElement('h1');
    heading.className = 'display-5 fw-bold mb-3';
    heading.textContent = 'Система управління бібліотекою';

    const subtitle = document.createElement('p');
    subtitle.className = 'lead mb-0 hero-subtitle';
    subtitle.textContent =
      'Керуйте каталогом, читацькими профілями та позичанням книг в одному місці.';

    container.append(badge, heading, subtitle);
    header.append(container);
    return header;
  }

  private createStatistics(): HTMLElement {
    const row = document.createElement('section');
    row.className = 'row g-3 stats-grid mb-4';
    row.ariaLabel = 'Статистика бібліотеки';

    const statistics: [string, string, HTMLElement][] = [
      ['Усього книг', '01', this.bookCount],
      ['Доступні', '02', this.availableCount],
      ['Позичені', '03', this.borrowedCount],
      ['Користувачі', '04', this.userCount],
    ];

    for (const [label, index, value] of statistics) {
      const column = document.createElement('div');
      column.className = 'col-6 col-lg-3';

      const card = document.createElement('article');
      card.className = 'stat-card h-100';

      const number = document.createElement('span');
      number.className = 'stat-index';
      number.textContent = index;

      value.className = 'display-6 d-block mb-1';

      const caption = document.createElement('span');
      caption.className = 'text-body-secondary small';
      caption.textContent = label;

      card.append(number, value, caption);
      column.append(card);
      row.append(column);
    }

    return row;
  }

  private createForms(): HTMLElement {
    const row = document.createElement('section');
    row.className = 'row g-4 mb-4';

    const bookColumn = document.createElement('div');
    bookColumn.className = 'col-lg-6';

    const userColumn = document.createElement('div');
    userColumn.className = 'col-lg-6';

    const bookForm = new BookForm((input) => this.addBook(input));
    const userForm = new UserForm((input) => this.addUser(input));

    bookColumn.append(bookForm.element);
    userColumn.append(userForm.element);
    row.append(bookColumn, userColumn);
    return row;
  }

  private createSearch(): HTMLElement {
    const wrapper = document.createElement('section');
    wrapper.className = 'card border-0 shadow-sm mb-4';

    const body = document.createElement('div');
    body.className = 'card-body p-3 p-md-4';

    const label = document.createElement('label');
    label.className = 'form-label fw-semibold';
    label.htmlFor = 'book-search';
    label.textContent = 'Пошук у каталозі';

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    const prefix = document.createElement('span');
    prefix.className = 'input-group-text bg-white';
    prefix.textContent = '⌕';

    const input = document.createElement('input');
    input.className = 'form-control';
    input.id = 'book-search';
    input.type = 'search';
    input.placeholder = 'Введіть назву книги або автора';
    input.addEventListener('input', () => {
      this.searchQuery = input.value;
      this.bookPage = 1;
      this.renderData();
    });

    inputGroup.append(prefix, input);
    body.append(label, inputGroup);
    wrapper.append(body);
    return wrapper;
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement('footer');
    footer.className = 'border-top bg-white';

    const container = document.createElement('div');
    container.className = 'container py-4 text-center small text-body-secondary';
    container.textContent = 'Лабораторна робота №2 · Клієнтські веб-системи';

    footer.append(container);
    return footer;
  }

  private addBook(input: Validation.BookInput): boolean {
    try {
      this.manager.addBook(
        new Book(generateId(), input.title, input.author, Number(input.publicationYear)),
      );
      this.bookPage = 1;
      this.renderData();
      this.notifications.publish({
        title: 'Книгу додано',
        message: `«${input.title}» збережено в каталозі.`,
        type: 'success',
      });
      return true;
    } catch (error) {
      this.publishError(error);
      return false;
    }
  }

  private addUser(input: Validation.UserInput): boolean {
    try {
      this.manager.addUser(new User(input.id, input.name, input.email));
      this.userPage = 1;
      this.renderData();
      this.notifications.publish({
        title: 'Користувача додано',
        message: `${input.name} тепер може позичати книги.`,
        type: 'success',
      });
      return true;
    } catch (error) {
      this.publishError(error);
      return false;
    }
  }

  private async handleBorrow(bookId: string): Promise<void> {
    const book = this.manager.getBooks().find(({ id }) => id === bookId);

    if (!book) {
      return;
    }

    const userId = await Modal.promptForUserId(book.title);

    if (!userId) {
      return;
    }

    try {
      this.manager.borrowBook(bookId, userId);
      this.renderData();
      this.notifications.publish({
        title: 'Книгу позичено',
        message: `«${book.title}» видано користувачу з ID ${userId}.`,
        type: 'success',
      });
    } catch (error) {
      const message = this.getErrorMessage(error);

      if (message.includes('трьох книг')) {
        await Modal.show('Досягнуто ліміт', message);
      } else {
        this.publishError(error);
      }
    }
  }

  private handleReturn(bookId: string): void {
    const book = this.manager.getBooks().find(({ id }) => id === bookId);

    if (!book) {
      return;
    }

    try {
      this.manager.returnBook(bookId);
      this.renderData();
      this.notifications.publish({
        title: 'Книгу повернено',
        message: `«${book.title}» знову доступна в каталозі.`,
        type: 'success',
      });
    } catch (error) {
      this.publishError(error);
    }
  }

  private async handleDeleteBook(bookId: string): Promise<void> {
    const book = this.manager.getBooks().find(({ id }) => id === bookId);

    if (!book) {
      return;
    }

    const confirmed = await Modal.confirm(
      'Видалити книгу?',
      `«${book.title}» буде остаточно видалено з каталогу.`,
    );

    if (confirmed && this.manager.deleteBook(bookId)) {
      this.renderData();
      this.notifications.publish({
        title: 'Книгу видалено',
        message: `«${book.title}» більше не відображається в каталозі.`,
        type: 'info',
      });
    }
  }

  private async handleDeleteUser(userId: string): Promise<void> {
    const user = this.manager.getUsers().find(({ id }) => id === userId);

    if (!user) {
      return;
    }

    const confirmed = await Modal.confirm(
      'Видалити користувача?',
      `Профіль ${user.name} буде видалено, а всі позичені книги — повернено.`,
    );

    if (confirmed && this.manager.deleteUser(userId)) {
      this.renderData();
      this.notifications.publish({
        title: 'Користувача видалено',
        message: `Профіль ${user.name} видалено.`,
        type: 'info',
      });
    }
  }

  private renderData(): void {
    const books = this.manager.getBooks();
    const users = this.manager.getUsers();
    const filteredBooks = this.manager.searchBooks(this.searchQuery);
    const bookPage = this.bookPaginator.paginate(filteredBooks, this.bookPage);
    const userPage = this.userPaginator.paginate(users, this.userPage);

    this.bookPage = bookPage.currentPage;
    this.userPage = userPage.currentPage;
    this.bookCount.textContent = String(books.length);
    this.availableCount.textContent = String(books.filter((book) => !book.isBorrowed).length);
    this.borrowedCount.textContent = String(books.filter((book) => book.isBorrowed).length);
    this.userCount.textContent = String(users.length);
    this.bookList.render(bookPage);
    this.userList.render(userPage);
  }

  private publishError(error: unknown): void {
    this.notifications.publish({
      title: 'Не вдалося виконати дію',
      message: this.getErrorMessage(error),
      type: 'danger',
    });
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Сталася невідома помилка';
  }
}
