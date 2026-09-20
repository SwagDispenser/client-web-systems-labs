import { expect } from 'chai';

import { generateId } from '../src/utils/idGenerator';

describe('generateId', () => {
  it('returns a non-empty unique identifier', () => {
    const firstId = generateId();
    const secondId = generateId();

    expect(firstId).to.be.a('string');
    expect(firstId).to.not.equal('');
    expect(secondId).to.not.equal(firstId);
  });
});
