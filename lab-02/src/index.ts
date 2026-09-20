import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

import { Book, type BookData } from './models/Book';
import { User, type UserData } from './models/User';
import { Library } from './services/Library';
import { LibraryManager } from './services/LibraryManager';
import { NotificationService } from './services/NotificationService';
import { Storage } from './services/Storage';
import { LibraryApp } from './ui/render';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Application root element was not found');
}

const bookStorage = new Storage<BookData[]>('library.books');
const userStorage = new Storage<UserData[]>('library.users');
const books = new Library<Book>((bookStorage.load() ?? []).map(Book.fromJSON));
const users = new Library<User>((userStorage.load() ?? []).map(User.fromJSON));

const persist = (): void => {
  bookStorage.save(books.getAll().map((book) => book.toJSON()));
  userStorage.save(users.getAll().map((user) => user.toJSON()));
};

const manager = new LibraryManager(books, users, persist);
const notifications = new NotificationService();
const app = new LibraryApp(root, manager, notifications);

app.mount();
