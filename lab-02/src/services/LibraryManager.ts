import { Book } from '../models/Book';
import { User } from '../models/User';
import { Library } from './Library';

export class LibraryManager {
  public constructor(
    private readonly books: Library<Book>,
    private readonly users: Library<User>,
    private readonly onChange: () => void = () => undefined,
  ) {}

  public getBooks(): Book[] {
    return this.books.getAll();
  }

  public getUsers(): User[] {
    return this.users.getAll();
  }

  public addBook(book: Book): void {
    this.books.add(book);
    this.onChange();
  }

  public addUser(user: User): void {
    this.users.add(user);
    this.onChange();
  }

  public deleteBook(bookId: string): boolean {
    const book = this.books.findById(bookId);

    if (!book) {
      return false;
    }

    if (book.borrowedBy) {
      const borrower = this.users.findById(book.borrowedBy);

      if (borrower?.borrowedBookIds.includes(book.id)) {
        borrower.returnBook(book.id);
      }
    }

    this.books.remove(bookId);
    this.onChange();
    return true;
  }

  public deleteUser(userId: string): boolean {
    const user = this.users.findById(userId);

    if (!user) {
      return false;
    }

    for (const bookId of user.borrowedBookIds) {
      const book = this.books.findById(bookId);

      if (book?.borrowedBy === user.id) {
        book.returnToLibrary();
      }
    }

    this.users.remove(userId);
    this.onChange();
    return true;
  }

  public borrowBook(bookId: string, userId: string): Book {
    const book = this.books.findById(bookId);
    const user = this.users.findById(userId);

    if (!book) {
      throw new Error('Книгу не знайдено');
    }

    if (!user) {
      throw new Error('Користувача з таким ID не знайдено');
    }

    if (book.isBorrowed) {
      throw new Error('Книга вже позичена');
    }

    if (user.borrowedBookIds.length >= User.MAX_BORROWED_BOOKS) {
      throw new Error('Користувач не може позичити більше трьох книг');
    }

    user.borrowBook(book.id);
    book.borrow(user.id);
    this.onChange();
    return book;
  }

  public returnBook(bookId: string): Book {
    const book = this.books.findById(bookId);

    if (!book) {
      throw new Error('Книгу не знайдено');
    }

    if (!book.borrowedBy) {
      throw new Error('Книга вже знаходиться в бібліотеці');
    }

    const user = this.users.findById(book.borrowedBy);

    if (user?.borrowedBookIds.includes(book.id)) {
      user.returnBook(book.id);
    }

    book.returnToLibrary();
    this.onChange();
    return book;
  }

  public searchBooks(query: string): Book[] {
    const normalizedQuery = query.trim().toLocaleLowerCase('uk');

    if (!normalizedQuery) {
      return this.getBooks();
    }

    return this.books.find(
      (book) =>
        book.title.toLocaleLowerCase('uk').includes(normalizedQuery) ||
        book.author.toLocaleLowerCase('uk').includes(normalizedQuery),
    );
  }
}
