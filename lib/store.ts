import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit'
import createStore from "redux";
import rootReducer from './rootreducer';
import editorLayoutSlice from './editor-layout-slice';
import BlockRegistry from './block-registry';


export const makeStore = () => {
  return configureStore({
    reducer: {
      editorLayoutSlice,
      rootReducer,
      BlockRegistry
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];