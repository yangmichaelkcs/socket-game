const navigation = (state = [], action) => {
  switch (action.type) {
    case "NAVIGATE_TO":
      return [...state, action.destination];
    default:
      return state;
  }
};

export default navigation;
