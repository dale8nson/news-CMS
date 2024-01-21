import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import { staticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage.external";

type Prop = string | number | null

export type ItemProps = { [prop: string]: Prop | { [prop: string]: Prop } | string | number | null }

export interface ComponentTemplate {
  componentName: string,
  displayName: string,
  props?: ItemProps,
  children?: ComponentTemplate[]
}

export interface PageTemplate extends ComponentTemplate {
  props: {
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    width: string,
    height: string,
    backgroundColor: string
  }
}

type State = {
  selectedComponentTemplate: ComponentTemplate | null,
  pageTemplate: PageTemplate | null
}

const initialState: State = {
  selectedComponentTemplate: {
    componentName: '',
    displayName: '',
    props: {}
  },
  pageTemplate: {
    componentName: 'div',
    displayName: 'Default Page Template',
    props: {
      paddingTop: '10%',
      paddingRight: '10%',
      paddingBottom: '10%',
      paddingLeft: '10%',
      width: '80%',
      height: '80%',
      backgroundColor: '#ffffff'
    }
  }
}

const editorLayoutSlice = createSlice({
    name: 'editor-layout',
    initialState,
    reducers: {
      setSelectedComponentTemplate: (state, action) => ({ ...state, selectedComponentTemplate: action.payload }),
      setPageTemplate: (state, action) => ({ ...state, pageTemplate: action.payload })
    }
  })

export default editorLayoutSlice.reducer;

  export const { setSelectedComponentTemplate, setPageTemplate } = editorLayoutSlice.actions;