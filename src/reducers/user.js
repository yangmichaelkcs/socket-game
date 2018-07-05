const user = (state = [], action) => {
  switch (action.type) {
    case "SET_USER_NAME":
      return {};
    default:
      return state;
  }
};

export default user;
