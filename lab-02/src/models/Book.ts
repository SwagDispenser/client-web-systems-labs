import type { IBook } from './interfaces/IBook';

export interface BookData {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  borrowedBy: string | null;
}

export class Book implements IBook {
  private readonly bookId: string;
  private bookTitle: string;
  private bookAuthor: string;
  private bookPublicationYear: number;
  private borrowerId: string | null;

  public constructor(
    id: string,
    title: string,
    author: string,
    publicationYear: number,
    borrowedBy: string | null = null,
  ) {
    this.bookId = id;
    this.bookTitle = title;
    this.bookAuthor = author;
    this.bookPublicationYear = publicationYear;
    this.borrowerId = borrowedBy;
  }

  public get id(): string {
    return this.bookId;
  }

  public get title(): string {
    return this.bookTitle;
  }

  public set title(value: string) {
    this.bookTitle = value;
  }

  public get author(): string {
    return this.bookAuthor;
  }

  public set author(value: string) {
    this.bookAuthor = value;
  }

  public get publicationYear(): number {
    return this.bookPublicationYear;
  }

  public set publicationYear(value: number) {
    this.bookPublicationYear = value;
  }

  public get isBorrowed(): boolean {
    return this.borrowerId !== null;
  }

  public get borrowedBy(): string | null {
    return this.borrowerId;
  }

  public borrow(userId: string): void {
    if (this.isBorrowed) {
      throw new Error('Книга вже позичена');
    }

    this.borrowerId = userId;
  }

  public returnToLibrary(): void {
    if (!this.isBorrowed) {
      throw new Error('Книга вже знаходиться в бібліотеці');
    }

    this.borrowerId = null;
  }

  public toJSON(): BookData {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      publicationYear: this.publicationYear,
      borrowedBy: this.borrowedBy,
    };
  }

  public static fromJSON(data: BookData): Book {
    return new Book(data.id, data.title, data.author, data.publicationYear, data.borrowedBy);
  }
}
