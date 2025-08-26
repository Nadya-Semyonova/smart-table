import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  const pageTemplate = pages.firstElementChild.cloneNode(true); // в качестве шаблона берём первый элемент из контейнера со страницами
  pages.firstElementChild.remove(); // и удаляем его (предполагаем, что там больше ничего, как вариант, можно и всё удалить из pages)

  let pageCount = 1;

  const applyPagination = (query, state, action) => {
    const limit = parseInt(state.rowsPerPage) || 10;
    let page = parseInt(state.page) || 1;

    // переносим код, который делали под @todo: #2.6
    // @todo: #2.6 — обработать действия
    if (action)
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break; // переход на предыдущую страницу
        case "next":
          page = Math.min(pageCount, page + 1);
          break; // переход на следующую страницу
        case "first":
          page = 1;
          break; // переход на первую страницу
        case "last":
          page = pageCount;
          break; // переход на последнюю страницу
      }

    return { ...query, limit, page };
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit) || 1;

    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      })
    );

    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    fromRow.textContent = from > to ? 0 : from;
    toRow.textContent = to;
    totalRows.textContent = total;
  };

  return {
    applyPagination,
    updatePagination,
  };
};
