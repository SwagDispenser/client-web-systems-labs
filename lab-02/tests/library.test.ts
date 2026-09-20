import { expect } from 'chai';

import type { IEntity } from '../src/models/interfaces/IEntity';
import { Library } from '../src/services/Library';

interface TestItem extends IEntity {
  name: string;
}

describe('Library<T>', () => {
  const firstItem: TestItem = { id: '1', name: 'First' };
  const secondItem: TestItem = { id: '2', name: 'Second' };

  it('adds an item to the collection', () => {
    const library = new Library<TestItem>();

    library.add(firstItem);

    expect(library.getAll()).to.deep.equal([firstItem]);
    expect(library.size).to.equal(1);
  });

  it('rejects duplicate identifiers', () => {
    const library = new Library<TestItem>([firstItem]);

    expect(() => library.add(firstItem)).to.throw("Об'єкт з ідентифікатором 1 уже існує");
  });

  it('removes and returns an existing item', () => {
    const library = new Library<TestItem>([firstItem]);

    const removedItem = library.remove(firstItem.id);

    expect(removedItem).to.equal(firstItem);
    expect(library.findById(firstItem.id)).to.equal(null);
  });

  it('returns null when removing an unknown item', () => {
    const library = new Library<TestItem>();

    expect(library.remove('unknown')).to.equal(null);
  });

  it('finds an item by its identifier', () => {
    const library = new Library<TestItem>([firstItem, secondItem]);

    expect(library.findById(secondItem.id)).to.equal(secondItem);
    expect(library.findById('unknown')).to.equal(null);
  });

  it('finds all items matching a predicate', () => {
    const library = new Library<TestItem>([firstItem, secondItem]);

    expect(library.find(({ name }) => name.startsWith('S'))).to.deep.equal([secondItem]);
  });
});
