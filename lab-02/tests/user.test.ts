import { expect } from 'chai';

import { User } from '../src/models/User';

describe('User', () => {
  it('tracks borrowed books and returns a defensive copy', () => {
    const user = new User('1001', 'Марія Коваль', 'maria@example.com');

    user.borrowBook('book-1');
    const borrowedBookIds = user.borrowedBookIds as string[];
    borrowedBookIds.push('external-change');

    expect(user.borrowedBookIds).to.deep.equal(['book-1']);
  });

  it('does not allow more than three borrowed books', () => {
    const user = new User('1001', 'Марія Коваль', 'maria@example.com');

    user.borrowBook('book-1');
    user.borrowBook('book-2');
    user.borrowBook('book-3');

    expect(() => user.borrowBook('book-4')).to.throw(
      'Користувач не може позичити більше трьох книг',
    );
  });
});
