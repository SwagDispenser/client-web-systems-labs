import type { IUser } from './interfaces/IUser';

export interface UserData {
  id: string;
  name: string;
  email: string;
  borrowedBookIds: string[];
}

export class User implements IUser {
  public static readonly MAX_BORROWED_BOOKS = 3;

  private readonly userId: string;
  private userName: string;
  private userEmail: string;
  private readonly userBorrowedBookIds: string[];

  public constructor(id: string, name: string, email: string, borrowedBookIds: string[] = []) {
    this.userId = id;
    this.userName = name;
    this.userEmail = email;
    this.userBorrowedBookIds = [...borrowedBookIds];
  }

  public get id(): string {
    return this.userId;
  }

  public get name(): string {
    return this.userName;
  }

  public set name(value: string) {
    this.userName = value;
  }

  public get email(): string {
    return this.userEmail;
  }

  public set email(value: string) {
    this.userEmail = value;
  }

  public get borrowedBookIds(): readonly string[] {
    return [...this.userBorrowedBookIds];
  }

  public borrowBook(bookId: string): void {
    if (this.userBorrowedBookIds.includes(bookId)) {
      throw new Error('Цю книгу вже закріплено за користувачем');
    }

    if (this.userBorrowedBookIds.length >= User.MAX_BORROWED_BOOKS) {
      throw new Error('Користувач не може позичити більше трьох книг');
    }

    this.userBorrowedBookIds.push(bookId);
  }

  public returnBook(bookId: string): void {
    const bookIndex = this.userBorrowedBookIds.indexOf(bookId);

    if (bookIndex === -1) {
      throw new Error('Книга не належить цьому користувачеві');
    }

    this.userBorrowedBookIds.splice(bookIndex, 1);
  }

  public toJSON(): UserData {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      borrowedBookIds: [...this.borrowedBookIds],
    };
  }

  public static fromJSON(data: UserData): User {
    return new User(data.id, data.name, data.email, data.borrowedBookIds);
  }
}
