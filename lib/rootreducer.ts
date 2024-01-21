import { createReducer, createAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  draggedId: ''
}

export const setDraggedId = createAction<string, 'setDraggedId'>('setDraggedId');

export const clearDraggedId = createAction<string, 'clearDraggedId'>('clearDraggedId');

const rootReducer = createReducer(
  initialState,
  builder => {
    builder
      .addCase(setDraggedId, (state, action) => {
        return { ...state, draggedId: action.payload }
      })
      .addCase(clearDraggedId, (state, action) => {
        return { ...state, draggedId: '' }
      })
  });

console.log(`rootReducer:`, rootReducer);
console.log(`setDraggedId:`, setDraggedId);


export default rootReducer;