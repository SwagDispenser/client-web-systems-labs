interface ModalElements {
  dialog: HTMLElement;
  close: () => void;
}

export class Modal {
  public static promptForUserId(bookTitle: string): Promise<string | null> {
    return new Promise((resolve) => {
      const modal = Modal.create('Позичити книгу', () => resolve(null));
      const body = modal.dialog.querySelector<HTMLElement>('[data-modal-body]');
      const footer = modal.dialog.querySelector<HTMLElement>('[data-modal-footer]');

      if (!body || !footer) {
        modal.close();
        resolve(null);
        return;
      }

      const message = document.createElement('p');
      message.className = 'text-body-secondary';
      message.textContent = `Введіть ID користувача, який хоче позичити «${bookTitle}».`;

      const label = document.createElement('label');
      label.className = 'form-label fw-medium';
      label.htmlFor = 'borrow-user-id';
      label.textContent = 'ID користувача';

      const input = document.createElement('input');
      input.className = 'form-control';
      input.id = 'borrow-user-id';
      input.inputMode = 'numeric';
      input.placeholder = 'Лише цифри';

      const error = document.createElement('div');
      error.className = 'invalid-feedback';
      error.textContent = 'Введіть ID, що містить лише цифри';

      const cancelButton = Modal.createButton('Скасувати', 'btn-outline-secondary');
      const confirmButton = Modal.createButton('Позичити', 'btn-primary');

      const finish = (value: string | null): void => {
        modal.close();
        resolve(value);
      };

      cancelButton.addEventListener('click', () => finish(null));
      confirmButton.addEventListener('click', () => {
        const userId = input.value.trim();

        if (!/^\d+$/.test(userId)) {
          input.classList.add('is-invalid');
          input.focus();
          return;
        }

        finish(userId);
      });
      input.addEventListener('input', () => input.classList.remove('is-invalid'));
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          confirmButton.click();
        }
      });

      body.append(message, label, input, error);
      footer.append(cancelButton, confirmButton);
      window.setTimeout(() => input.focus(), 0);
    });
  }

  public static confirm(title: string, messageText: string): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = Modal.create(title, () => resolve(false));
      const body = modal.dialog.querySelector<HTMLElement>('[data-modal-body]');
      const footer = modal.dialog.querySelector<HTMLElement>('[data-modal-footer]');

      if (!body || !footer) {
        modal.close();
        resolve(false);
        return;
      }

      const message = document.createElement('p');
      message.className = 'mb-0 text-body-secondary';
      message.textContent = messageText;

      const cancelButton = Modal.createButton('Скасувати', 'btn-outline-secondary');
      const confirmButton = Modal.createButton('Підтвердити', 'btn-danger');

      cancelButton.addEventListener('click', () => {
        modal.close();
        resolve(false);
      });
      confirmButton.addEventListener('click', () => {
        modal.close();
        resolve(true);
      });

      body.append(message);
      footer.append(cancelButton, confirmButton);
    });
  }

  public static show(title: string, messageText: string): Promise<void> {
    return new Promise((resolve) => {
      const modal = Modal.create(title, resolve);
      const body = modal.dialog.querySelector<HTMLElement>('[data-modal-body]');
      const footer = modal.dialog.querySelector<HTMLElement>('[data-modal-footer]');

      if (!body || !footer) {
        modal.close();
        resolve();
        return;
      }

      const message = document.createElement('p');
      message.className = 'mb-0 text-body-secondary';
      message.textContent = messageText;

      const button = Modal.createButton('Зрозуміло', 'btn-primary');
      button.addEventListener('click', () => {
        modal.close();
        resolve();
      });

      body.append(message);
      footer.append(button);
    });
  }

  private static create(titleText: string, onDismiss: () => void): ModalElements {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';

    const dialog = document.createElement('div');
    dialog.className = 'modal fade show d-block';
    dialog.role = 'dialog';
    dialog.ariaModal = 'true';

    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog modal-dialog-centered';

    const content = document.createElement('div');
    content.className = 'modal-content border-0 shadow';

    const header = document.createElement('div');
    header.className = 'modal-header';

    const title = document.createElement('h2');
    title.className = 'modal-title fs-5';
    title.textContent = titleText;

    const closeButton = document.createElement('button');
    closeButton.className = 'btn-close';
    closeButton.type = 'button';
    closeButton.ariaLabel = 'Закрити';

    const body = document.createElement('div');
    body.className = 'modal-body';
    body.dataset.modalBody = '';

    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.dataset.modalFooter = '';

    const close = (): void => {
      dialog.remove();
      backdrop.remove();
      document.body.classList.remove('modal-open');
    };

    closeButton.addEventListener('click', () => {
      close();
      onDismiss();
    });
    header.append(title, closeButton);
    content.append(header, body, footer);
    modalDialog.append(content);
    dialog.append(modalDialog);
    document.body.classList.add('modal-open');
    document.body.append(backdrop, dialog);

    return { dialog, close };
  }

  private static createButton(label: string, variantClass: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `btn ${variantClass}`;
    button.type = 'button';
    button.textContent = label;
    return button;
  }
}
