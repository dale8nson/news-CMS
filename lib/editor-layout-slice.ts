import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import { staticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage.external";

export type Prop = string | number | null | ItemProps;

export type ItemProps = { [prop: string]: Prop | { [prop: string]: Prop } | string | number | null }

export interface ComponentTemplate {
  id: string,
  componentName: string,
  displayName: string,
  props?: ItemProps,
  children?: ComponentTemplate[]
}

export interface Component extends ComponentTemplate { }

export interface PageTemplate extends ComponentTemplate {
  props: {
    style: {
      paddingTop: string,
      paddingRight: string,
      paddingBottom: string,
      paddingLeft: string,
      width: string,
      height: string,
      backgroundColor: string
    }
  }
}

type State = {
  selectedComponentTemplate: ComponentTemplate | null,
  pageTemplate: PageTemplate | null,
  componentTemplates: ComponentTemplate[] | null,
  components: Component[] | null
}

const initialState: State = {
  selectedComponentTemplate: null,
  pageTemplate: {
    id: crypto.randomUUID(),
    componentName: 'div',
    displayName: 'Default Page Template',
    props: {
      style: {
        paddingTop: '10%',
        paddingRight: '10%',
        paddingBottom: '10%',
        paddingLeft: '10%',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff'
      }
    }
  },
  componentTemplates: [],
  components: []
}

const editorLayoutSlice = createSlice({
  name: 'editor-layout',
  initialState,
  reducers: {
    setSelectedComponentTemplate: (state, action) => ({ ...state, selectedComponentTemplate: action.payload }),
    setPageTemplate: (state, action) => ({ ...state, pageTemplate: action.payload }),
    registerComponentTemplate: (state, action) => ({ ...state, componentTemplates: [...state.componentTemplates as ComponentTemplate[], { id: crypto.randomUUID(), ...action.payload }] }),
    registerComponent: (state, action) => ({...state, components: [...state.components as Component[], action.payload ]})
    }
})

export default editorLayoutSlice.reducer;

export const { setSelectedComponentTemplate, setPageTemplate, registerComponentTemplate, registerComponent } = editorLayoutSlice.actions;