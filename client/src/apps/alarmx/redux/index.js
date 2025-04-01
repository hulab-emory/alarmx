
const initialState = {
  alert: null
};

export default function cadaReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_ALERT": {
      return {
        ...state,
        alert: action.alert,
      };
    }
    case "RESET_ALERT": {
      return {
        ...state,
        alert: null,
      };
    }

    default:
      return state;
  }
}
