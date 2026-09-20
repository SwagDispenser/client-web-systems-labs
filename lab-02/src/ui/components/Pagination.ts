interface PaginationOptions {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const createPagination = ({
  currentPage,
  totalPages,
  onChange,
}: PaginationOptions): HTMLElement => {
  const nav = document.createElement('nav');
  nav.className = 'mt-4';
  nav.ariaLabel = 'Навігація сторінками';

  if (totalPages <= 1) {
    return nav;
  }

  const list = document.createElement('ul');
  list.className = 'pagination pagination-sm justify-content-center mb-0';

  const appendButton = (label: string, page: number, disabled: boolean, active = false): void => {
    const item = document.createElement('li');
    item.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;

    const button = document.createElement('button');
    button.className = 'page-link';
    button.type = 'button';
    button.textContent = label;
    button.disabled = disabled;
    button.addEventListener('click', () => onChange(page));

    item.append(button);
    list.append(item);
  };

  appendButton('‹', currentPage - 1, currentPage === 1);

  for (let page = 1; page <= totalPages; page += 1) {
    appendButton(String(page), page, false, page === currentPage);
  }

  appendButton('›', currentPage + 1, currentPage === totalPages);
  nav.append(list);
  return nav;
};
