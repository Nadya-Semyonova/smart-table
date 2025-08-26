import "./fonts/ys-display/fonts.css";
import "./style.css";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";
// @todo: подключение
import { initSearching } from "./components/searching.js";
import { initFiltering } from "./components/filtering.js";
import { initSorting } from "./components/sorting.js";
import { initPagination } from "./components/pagination.js";

// Исходные данные используемые в render()
const api = initData();

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const formData = new FormData(sampleTable.container);
  const state = processFormData(formData);

  return {
    ...state,
    rowsPerPage: parseInt(state.rowsPerPage) || 10,
    page: parseInt(state.page) || 1,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query = {}; // копируем для последующего изменения
  // @todo: использование
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  try {
    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
  } catch (error) {
    console.error("Ошибка при рендере:", error);
    sampleTable.render([]);
  }
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);
const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

const applySearching = initSearching("search");

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  try {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
      searchBySeller: indexes.sellers,
    });

    await render();
  } catch (error) {
    console.error("Ошибка инициализации:", error);
    await render();
  }
}

init().catch(console.error);
