import { expect } from 'chai';

import { Book } from '../src/models/Book';

describe('Book', () => {
  it('changes its state when borrowed and returned', () => {
    const book = new Book('book-1', 'Clean Code', 'Robert C. Martin', 2008);

    book.borrow('1001');

    expect(book.isBorrowed).to.equal(true);
    expect(book.borrowedBy).to.equal('1001');

    book.returnToLibrary();

    expect(book.isBorrowed).to.equal(false);
    expect(book.borrowedBy).to.equal(null);
  });

  it('does not allow an already borrowed book to be borrowed again', () => {
    const book = new Book('book-1', 'Clean Code', 'Robert C. Martin', 2008);

    book.borrow('1001');

    expect(() => book.borrow('1002')).to.throw('Книга вже позичена');
  });
});
