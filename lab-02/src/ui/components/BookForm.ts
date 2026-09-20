import { Validation } from '../../utils/validators';

type BookSubmitHandler = (input: Validation.BookInput) => boolean;

export class BookForm {
  public readonly element: HTMLElement;

  private readonly form: HTMLFormElement;
  private readonly inputs: Record<keyof Validation.BookInput, HTMLInputElement>;
  private readonly errors: Record<keyof Validation.BookInput, HTMLElement>;

  public constructor(private readonly onSubmit: BookSubmitHandler) {
    this.element = document.createElement('section');
    this.element.className = 'card border-0 shadow-sm h-100';

    const body = document.createElement('div');
    body.className = 'card-body p-4';

    const heading = document.createElement('h2');
    heading.className = 'h5 mb-1';
    heading.textContent = 'Додати книгу';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-body-secondary small mb-4';
    subtitle.textContent = 'Заповніть інформацію про нове видання';

    this.form = document.createElement('form');
    this.form.noValidate = true;

    const titleControl = this.createControl('title', 'Назва', 'Наприклад, Clean Code');
    const authorControl = this.createControl('author', 'Автор', 'Наприклад, Robert C. Martin');
    const yearControl = this.createControl('publicationYear', 'Рік видання', 'Наприклад, 2008');
    yearControl.input.inputMode = 'numeric';

    this.inputs = {
      title: titleControl.input,
      author: authorControl.input,
      publicationYear: yearControl.input,
    };
    this.errors = {
      title: titleControl.error,
      author: authorControl.error,
      publicationYear: yearControl.error,
    };

    const submitButton = document.createElement('button');
    submitButton.className = 'btn btn-primary w-100 mt-2';
    submitButton.type = 'submit';
    submitButton.textContent = 'Додати книгу';

    this.form.append(
      titleControl.wrapper,
      authorControl.wrapper,
      yearControl.wrapper,
      submitButton,
    );
    this.form.addEventListener('submit', (event) => this.handleSubmit(event));

    body.append(heading, subtitle, this.form);
    this.element.append(body);
  }

  private createControl(
    name: keyof Validation.BookInput,
    labelText: string,
    placeholder: string,
  ): { wrapper: HTMLElement; input: HTMLInputElement; error: HTMLElement } {
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-3';

    const label = document.createElement('label');
    label.className = 'form-label fw-medium';
    label.htmlFor = `book-${name}`;
    label.textContent = labelText;

    const input = document.createElement('input');
    input.className = 'form-control';
    input.id = `book-${name}`;
    input.name = name;
    input.placeholder = placeholder;
    input.autocomplete = 'off';

    const error = document.createElement('div');
    error.className = 'invalid-feedback';

    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      error.textContent = '';
    });

    wrapper.append(label, input, error);
    return { wrapper, input, error };
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const input: Validation.BookInput = {
      title: this.inputs.title.value.trim(),
      author: this.inputs.author.value.trim(),
      publicationYear: this.inputs.publicationYear.value.trim(),
    };
    const validation = Validation.validateBook(input);

    this.showErrors(validation.errors);

    if (validation.isValid && this.onSubmit(input)) {
      this.form.reset();
    }
  }

  private showErrors(errors: Validation.Errors<Validation.BookInput>): void {
    const fields = Object.keys(this.inputs) as (keyof Validation.BookInput)[];

    for (const field of fields) {
      const message = errors[field] ?? '';
      this.inputs[field].classList.toggle('is-invalid', Boolean(message));
      this.errors[field].textContent = message;
    }
  }
}
