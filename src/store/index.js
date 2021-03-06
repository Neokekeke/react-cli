import { applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer  from './root.reducer.js';
import thunk from 'redux-thunk';

import rootSagas from './rootSaga';

const reducers = combineReducers(rootReducer);

// 日志
const logger = createLogger({
    // ...options
    collapsed: true
});

// saga: saga的意思就是任务列表，可以表示为任务列表的集合，sagaMiddleWare
const sagaMiddleWare = createSagaMiddleware();

// 中间件数组
const middlewareList = [sagaMiddleWare]; // thunk

if (process.env.NODE_ENV == 'development') {
    middlewareList.push(logger);
}

// redux create store
// createStore() 的第二个参数是可选的, 用于设置 state 初始状态。
// 这对开发同构应用时非常有用，服务器端 redux 应用的 state 结构可以与客户端保持一致, 服务端渲染
// 那么客户端可以将从网络接收到的服务端 state 直接用于本地数据初始化。
const store = createStore(
    reducers, 
    applyMiddleware(...middlewareList)
);

rootSagas.map(saga => sagaMiddleWare.run(saga));

console.log('------------[storestore]------------' + '\n', store.getState().toJS());

export default store;