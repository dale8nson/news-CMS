
import { createSlice } from "@reduxjs/toolkit";
import { staticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage.external";
export { ContainerPlaceholder, ImagePlaceholder, Container, ArticleGroup1} from '@/components';

type Block = { id: string, source: string }
interface BlockRegistry { [componentName: string]: Block }

const initialState: BlockRegistry = {};

const BlockRegistry = createSlice({
  name: 'BlockRegistry',
  initialState,
  reducers: {
    registerBlock (state, action) {

      return {
        ...state, [action.payload.componentName]: { id: crypto.randomUUID(), source: action.payload.source }
      }
    }
  }
})

export default BlockRegistry.reducer;
export const { registerBlock } = BlockRegistry.actions;