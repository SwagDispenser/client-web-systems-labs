import { Validation } from '../../utils/validators';

type UserSubmitHandler = (input: Validation.UserInput) => boolean;

export class UserForm {
  public readonly element: HTMLElement;

  private readonly form: HTMLFormElement;
  private readonly inputs: Record<keyof Validation.UserInput, HTMLInputElement>;
  private readonly errors: Record<keyof Validation.UserInput, HTMLElement>;

  public constructor(private readonly onSubmit: UserSubmitHandler) {
    this.element = document.createElement('section');
    this.element.className = 'card border-0 shadow-sm h-100';

    const body = document.createElement('div');
    body.className = 'card-body p-4';

    const heading = document.createElement('h2');
    heading.className = 'h5 mb-1';
    heading.textContent = 'Додати користувача';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-body-secondary small mb-4';
    subtitle.textContent = 'Створіть читацький профіль';

    this.form = document.createElement('form');
    this.form.noValidate = true;

    const idControl = this.createControl('id', 'ID користувача', 'Лише цифри');
    idControl.input.inputMode = 'numeric';
    const nameControl = this.createControl('name', "Ім'я", 'Наприклад, Марія Коваль');
    const emailControl = this.createControl('email', 'Email', 'maria@example.com');
    emailControl.input.type = 'email';

    this.inputs = {
      id: idControl.input,
      name: nameControl.input,
      email: emailControl.input,
    };
    this.errors = {
      id: idControl.error,
      name: nameControl.error,
      email: emailControl.error,
    };

    const submitButton = document.createElement('button');
    submitButton.className = 'btn btn-dark w-100 mt-2';
    submitButton.type = 'submit';
    submitButton.textContent = 'Додати користувача';

    this.form.append(idControl.wrapper, nameControl.wrapper, emailControl.wrapper, submitButton);
    this.form.addEventListener('submit', (event) => this.handleSubmit(event));

    body.append(heading, subtitle, this.form);
    this.element.append(body);
  }

  private createControl(
    name: keyof Validation.UserInput,
    labelText: string,
    placeholder: string,
  ): { wrapper: HTMLElement; input: HTMLInputElement; error: HTMLElement } {
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-3';

    const label = document.createElement('label');
    label.className = 'form-label fw-medium';
    label.htmlFor = `user-${name}`;
    label.textContent = labelText;

    const input = document.createElement('input');
    input.className = 'form-control';
    input.id = `user-${name}`;
    input.name = name;
    input.placeholder = placeholder;
    input.autocomplete = name === 'email' ? 'email' : 'off';

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

    const input: Validation.UserInput = {
      id: this.inputs.id.value.trim(),
      name: this.inputs.name.value.trim(),
      email: this.inputs.email.value.trim(),
    };
    const validation = Validation.validateUser(input);

    this.showErrors(validation.errors);

    if (validation.isValid && this.onSubmit(input)) {
      this.form.reset();
    }
  }

  private showErrors(errors: Validation.Errors<Validation.UserInput>): void {
    const fields = Object.keys(this.inputs) as (keyof Validation.UserInput)[];

    for (const field of fields) {
      const message = errors[field] ?? '';
      this.inputs[field].classList.toggle('is-invalid', Boolean(message));
      this.errors[field].textContent = message;
    }
  }
}
