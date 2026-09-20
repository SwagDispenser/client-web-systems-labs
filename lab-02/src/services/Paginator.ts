export interface Page<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export class Paginator<T> {
  public constructor(private readonly itemsPerPage = 5) {
    if (!Number.isInteger(itemsPerPage) || itemsPerPage < 1) {
      throw new Error('Кількість елементів на сторінці повинна бути додатним цілим числом');
    }
  }

  public paginate(items: readonly T[], requestedPage: number): Page<T> {
    const totalPages = Math.max(1, Math.ceil(items.length / this.itemsPerPage));
    const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
    const startIndex = (currentPage - 1) * this.itemsPerPage;

    return {
      items: items.slice(startIndex, startIndex + this.itemsPerPage),
      currentPage,
      totalPages,
      totalItems: items.length,
    };
  }
}
