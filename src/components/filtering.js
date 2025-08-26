export function initFiltering() {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const select = elements[elementName];
      if (!select) return;

      Object.values(indexes[elementName]).forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    });
  };

  const applyFiltering = (query, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      const parent = action.parentElement;
      const input = parent.querySelector("input");

      if (input) {
        input.value = "";
      }

      const { [field]: removed, ...newQuery } = query;
      return newQuery;
    }

    const filter = {};
    Object.keys(state).forEach((key) => {
      if (
        ["seller", "customer", "date", "totalFrom", "totalTo"].includes(key) &&
        state[key]
      ) {
        filter[`filter[${key}]`] = state[key];
      }
    });

    return Object.keys(filter).length ? { ...query, ...filter } : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
