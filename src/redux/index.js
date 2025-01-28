import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import cadaReducer from './cada';
import m2dReducer from './m2d';
import deepCopy from '../utils/deepcopy';
import { clearLocalStorage } from '../utils/localStorage';

const mainReducer = function (
  state = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  },
  action
) {
  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem("user", JSON.stringify(action.user))
      return {
        ...state,
        user: action.user
      };
    }
    case "LOGOUT": {
      clearLocalStorage(["hulabapps-remember"])
      return {
        ...state,
        user: null
      };
    }
    case "GET_FEATURES": {
      console.log(action);
      return {
        ...state,
        features: action.features,
      };
    }
    case "UPDATE_AVATAR": {
      const new_user = deepCopy(state.user)
      new_user.avatar = action.value.avatar
      localStorage.setItem("user", JSON.stringify(new_user))
      return {
        ...state,
        user: new_user
      }
    }
    default: {
      return state;
    }
  }
};

const rootReducer = combineReducers({
  main: mainReducer,
  cada: cadaReducer,
  m2d: m2dReducer,
});

export default createStore(
  rootReducer,
  compose(applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
