import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import { actionAsyncStorage } from "next/dist/client/components/action-async-storage.external";
import { staticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage.external";

export type Prop = string | number | null;

export interface ItemProps { [prop: string]: Prop | null | ItemProps }

export interface ComponentTemplate {
  id: string,
  componentName: string,
  displayName: string,
  canEdit: boolean,
  dragAction: 'copy' | 'move' | undefined,
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
  componentTemplates:{[id: string]: ComponentTemplate } | null,
  components: {[id: string]: Component } | null
  editMode: 'dummy' | 'content' | 'preview'
}

const initialState: State = {
  selectedComponentTemplate: null,
  editMode: 'dummy',
  pageTemplate: {
    id: crypto.randomUUID(),
    dragAction:'move',
    componentName: 'div',
    displayName: 'Default Page Template',
    canEdit: true,
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
  componentTemplates: {},
  components: {}
}

const editorLayoutSlice = createSlice({
  name: 'editor-layout',
  initialState,
  reducers: {
    setSelectedComponentTemplate: (state, action) => ({ ...state, selectedComponentTemplate: action.payload }),
    setPageTemplate: (state, action) => ({ ...state, pageTemplate: action.payload }),
    registerComponentTemplate: (state, action) => ({ ...state, componentTemplates: {...state.componentTemplates,  [action.payload.id]: action.payload } }),
    updateComponentTemplate: (state, action) => ({ ...state, componentTemplates: {...state.componentTemplates,  [action.payload.id]: action.payload } }),
    registerComponent: (state, action) => ({...state, components: {...state.components, [action.payload.id]: {...action.payload} }}),
    updateComponent: (state, action) => ({...state, components: {...state.components, [action.payload.id]: {...action.payload} }}),
    setEditMode: (state, action) => ({...state, editMode: action.payload})
    }
})

export default editorLayoutSlice.reducer;

export const { setSelectedComponentTemplate, setPageTemplate, registerComponentTemplate, updateComponentTemplate, registerComponent, updateComponent, setEditMode } = editorLayoutSlice.actions;