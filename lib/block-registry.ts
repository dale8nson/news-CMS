
import { createSlice } from "@reduxjs/toolkit";
export { ContainerPlaceholder, ImagePlaceholder, Container, ArticleGroup1} from '@/components';

type Block = { id: string, source: string }
interface BlockRegistry { [id: string]: Block }

const initialState: BlockRegistry = {};

const BlockRegistry = createSlice({
  name: 'BlockRegistry',
  initialState,
  reducers: {
    registerBlock (state, action) {

      return {
        ...state, [action.payload.id]: { props: action.payload.props }
      }
    }
  }
})

export default BlockRegistry.reducer;
export const { registerBlock } = BlockRegistry.actions;