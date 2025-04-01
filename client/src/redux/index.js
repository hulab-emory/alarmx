import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
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
      clearLocalStorage(["apps-remember"])
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

const context = require.context('../apps', true, /redux\/index\.js$/);
const dynamicAppReducers = {};

/**
 * context.keys() => array of matched files, e.g.:
 *   ["./cada/redux/index.js", "./m2d/redux/index.js", ...]
 */
context.keys().forEach((filePath) => {
  // Import the reducer module
  const module = context(filePath);
  const reducer = module.default || module;

  // Example filePath: "./cada/redux/index.js"
  // Split on '/' => [".", "cada", "redux", "index.js"]
  const pathParts = filePath.split('/');
  const appName = pathParts[1];

  dynamicAppReducers[appName] = reducer;
});

const rootReducer = combineReducers({
  main: mainReducer,
  ...dynamicAppReducers,
});

export default createStore(
  rootReducer,
  compose(applyMiddleware(thunk),
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
