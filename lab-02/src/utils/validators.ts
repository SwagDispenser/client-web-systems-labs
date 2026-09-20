export namespace Validation {
  export interface BookInput {
    title: string;
    author: string;
    publicationYear: string;
  }

  export interface UserInput {
    id: string;
    name: string;
    email: string;
  }

  export type Errors<T> = Partial<Record<keyof T, string>>;

  export interface Result<T> {
    isValid: boolean;
    errors: Errors<T>;
  }

  export const isRequired = (value: string): boolean => value.trim().length > 0;

  export const isUserId = (value: string): boolean => /^\d+$/.test(value.trim());

  export const isPublicationYear = (value: string): boolean => {
    const normalizedValue = value.trim();

    if (!/^(?:1\d{3}|2\d{3})$/.test(normalizedValue)) {
      return false;
    }

    return Number(normalizedValue) <= new Date().getFullYear();
  };

  export const isEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  export const validateBook = (input: BookInput): Result<BookInput> => {
    const errors: Errors<BookInput> = {};

    if (!isRequired(input.title)) {
      errors.title = 'Вкажіть назву книги';
    }

    if (!isRequired(input.author)) {
      errors.author = 'Вкажіть автора книги';
    }

    if (!isRequired(input.publicationYear)) {
      errors.publicationYear = 'Вкажіть рік видання';
    } else if (!isPublicationYear(input.publicationYear)) {
      errors.publicationYear = 'Введіть коректний чотиризначний рік';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  export const validateUser = (input: UserInput): Result<UserInput> => {
    const errors: Errors<UserInput> = {};

    if (!isRequired(input.id)) {
      errors.id = 'Вкажіть ID користувача';
    } else if (!isUserId(input.id)) {
      errors.id = 'ID користувача повинен містити лише цифри';
    }

    if (!isRequired(input.name)) {
      errors.name = "Вкажіть ім'я користувача";
    }

    if (!isRequired(input.email)) {
      errors.email = 'Вкажіть email користувача';
    } else if (!isEmail(input.email)) {
      errors.email = 'Введіть коректний email';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };
}
