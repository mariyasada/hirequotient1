export const FilterReducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_QUERY":
      return { ...state, searchByQuery: action.payload };

    case "CLEAR_SEARCH":
      return { ...state, searchByQuery: action.payload };

    default:
      return state;
  }
};
