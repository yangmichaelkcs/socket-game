const user = (state = { id: undefined }, action) => {
  switch (action.type) {
    case "SET_SOCKET_ID":
      return { socketId: action.socketId };
    default:
      return state;
  }
};

export default user;
