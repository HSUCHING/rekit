import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

// NOTE: Do not change middleares delaration pattern since rekit plugins may register middlewares to it.
const middlewares = [
  thunk,
];

let devToolsExtension = f => f;

/* istanbul ignore if  */
if (process.env.NODE_ENV === 'dev') {
  const createLogger = require('redux-logger');

  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);

  if (window.devToolsExtension) {
    devToolsExtension = window.devToolsExtension();
  }
}

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares),
    devToolsExtension
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default; // eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
