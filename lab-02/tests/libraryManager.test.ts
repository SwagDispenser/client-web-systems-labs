import { expect } from 'chai';

import { Book } from '../src/models/Book';
import { User } from '../src/models/User';
import { Library } from '../src/services/Library';
import { LibraryManager } from '../src/services/LibraryManager';

describe('LibraryManager', () => {
  const createManager = (): LibraryManager =>
    new LibraryManager(
      new Library<Book>([
        new Book('book-1', 'Clean Code', 'Robert C. Martin', 2008),
        new Book('book-2', 'The Pragmatic Programmer', 'Andrew Hunt', 1999),
      ]),
      new Library<User>([new User('1001', 'Марія Коваль', 'maria@example.com')]),
    );

  it('borrows and returns a book while keeping both models in sync', () => {
    const manager = createManager();

    const borrowedBook = manager.borrowBook('book-1', '1001');
    const user = manager.getUsers()[0];

    expect(borrowedBook.borrowedBy).to.equal('1001');
    expect(user?.borrowedBookIds).to.deep.equal(['book-1']);

    manager.returnBook('book-1');

    expect(borrowedBook.borrowedBy).to.equal(null);
    expect(user?.borrowedBookIds).to.deep.equal([]);
  });

  it('enforces the three-book limit', () => {
    const user = new User('1001', 'Марія Коваль', 'maria@example.com', [
      'existing-1',
      'existing-2',
      'existing-3',
    ]);
    const manager = new LibraryManager(
      new Library<Book>([new Book('book-1', 'Clean Code', 'Robert C. Martin', 2008)]),
      new Library<User>([user]),
    );

    expect(() => manager.borrowBook('book-1', '1001')).to.throw(
      'Користувач не може позичити більше трьох книг',
    );
  });

  it('searches by title or author without regard to case', () => {
    const manager = createManager();

    expect(manager.searchBooks('clean').map(({ id }) => id)).to.deep.equal(['book-1']);
    expect(manager.searchBooks('ANDREW').map(({ id }) => id)).to.deep.equal(['book-2']);
  });

  it('returns borrowed books when their user is deleted', () => {
    const manager = createManager();
    manager.borrowBook('book-1', '1001');

    manager.deleteUser('1001');

    expect(manager.getUsers()).to.deep.equal([]);
    expect(manager.getBooks()[0]?.isBorrowed).to.equal(false);
  });

  it('removes a deleted borrowed book from its user', () => {
    const manager = createManager();
    manager.borrowBook('book-1', '1001');

    manager.deleteBook('book-1');

    expect(manager.getBooks().map(({ id }) => id)).to.deep.equal(['book-2']);
    expect(manager.getUsers()[0]?.borrowedBookIds).to.deep.equal([]);
  });
});
