import { expect } from 'chai';

import { Paginator } from '../src/services/Paginator';

describe('Paginator<T>', () => {
  const items = Array.from({ length: 12 }, (_, index) => index + 1);

  it('returns five items per page by default', () => {
    const page = new Paginator<number>().paginate(items, 2);

    expect(page.items).to.deep.equal([6, 7, 8, 9, 10]);
    expect(page.currentPage).to.equal(2);
    expect(page.totalPages).to.equal(3);
  });

  it('clamps a page number to the available range', () => {
    const paginator = new Paginator<number>();

    expect(paginator.paginate(items, 99).currentPage).to.equal(3);
    expect(paginator.paginate(items, -2).currentPage).to.equal(1);
  });

  it('rejects an invalid page size', () => {
    expect(() => new Paginator<number>(0)).to.throw(
      'Кількість елементів на сторінці повинна бути додатним цілим числом',
    );
  });
});
