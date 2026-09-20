import { expect } from 'chai';

import { Validation } from '../src/utils/validators';

describe('Validation', () => {
  describe('isRequired', () => {
    it('rejects empty and whitespace-only values', () => {
      expect(Validation.isRequired('')).to.equal(false);
      expect(Validation.isRequired('   ')).to.equal(false);
      expect(Validation.isRequired('Книга')).to.equal(true);
    });
  });

  describe('isUserId', () => {
    it('accepts only digits', () => {
      expect(Validation.isUserId('12345')).to.equal(true);
      expect(Validation.isUserId('12a45')).to.equal(false);
      expect(Validation.isUserId('-123')).to.equal(false);
    });
  });

  describe('isPublicationYear', () => {
    it('accepts a four-digit year that is not in the future', () => {
      expect(Validation.isPublicationYear('2008')).to.equal(true);
      expect(Validation.isPublicationYear('999')).to.equal(false);
      expect(Validation.isPublicationYear('20O8')).to.equal(false);
      expect(Validation.isPublicationYear(String(new Date().getFullYear() + 1))).to.equal(false);
    });
  });

  describe('validateBook', () => {
    it('returns messages for every empty field', () => {
      const result = Validation.validateBook({ title: '', author: ' ', publicationYear: '' });

      expect(result.isValid).to.equal(false);
      expect(result.errors).to.have.keys('title', 'author', 'publicationYear');
    });
  });

  describe('validateUser', () => {
    it('validates required fields, numeric ID and email', () => {
      const result = Validation.validateUser({ id: 'user-1', name: '', email: 'invalid' });

      expect(result.isValid).to.equal(false);
      expect(result.errors).to.have.keys('id', 'name', 'email');
    });
  });
});
