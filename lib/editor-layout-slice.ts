import { createSlice } from "@reduxjs/toolkit";
import { staticGenerationAsyncStorage } from "next/dist/client/components/static-generation-async-storage.external";

export type Prop = string | number | null;

export interface ItemProps { [prop: string]: Prop | null | ItemProps }

export interface ComponentTemplate {
  id: string | null | undefined,
  parentId?: string | undefined,
  index?: number | undefined,
  componentName: string,
  displayName: string,
  editable: boolean,
  selectOnMount?: boolean | undefined,
  dragAction: 'copy' | 'move' | undefined,
  props?: ItemProps,
  children?: ComponentTemplate[],
  blockIds?: string[],
  size?: { width: number | null, height: number | null }
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
  componentTemplates: { [id: string]: ComponentTemplate } | null,
  components: { [id: string]: Component } | null
  editMode: 'dummy' | 'content' | 'preview',
  blockTree: { [parentId: string]: string[] },
  pendingTemplates: {[parentId: string]: ComponentTemplate[]}
}

const initialState: State = {
  selectedComponentTemplate: null,
  editMode: 'dummy',
  pageTemplate: {
    id: crypto.randomUUID(),
    dragAction: 'move',
    componentName: 'div',
    displayName: 'Default Page Template',
    editable: true,
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
  components: {},
  blockTree: {},
  pendingTemplates: {}
}

const editorLayoutSlice = createSlice({
  name: 'editor-layout',
  initialState,
  reducers: {
    setSelectedComponentTemplate: (state, action) => ({ ...state, selectedComponentTemplate: action.payload }),
    setPageTemplate: (state, action) => ({ ...state, pageTemplate: action.payload }),
    registerComponentTemplate: (state, action) => ({ ...state, componentTemplates: { ...state.componentTemplates, [action.payload.id]: action.payload } }),
    updateComponentTemplate: (state, action) => ({ ...state, componentTemplates: { ...state.componentTemplates, [action.payload.id]: action.payload } }),
    deleteComponentTemplate: (state: any, action: any) => {
      const newState = { ...state, componentTemplates: { ...state.componentTemplates, [action.payload]: undefined } };
      return newState;
    },
    registerComponent: (state, action) => ({ ...state, components: { ...state.components, [action.payload.id]: { ...action.payload } } }),
    updateComponent: (state, action) => ({ ...state, components: { ...state.components, [action.payload.id]: { ...action.payload } } }),
    setEditMode: (state, action) => ({ ...state, editMode: action.payload }),
    setBlockTree: (state, action) => ({ ...state, blockTree: action.payload }),
    initPendingTemplateList: (state, action) => ({...state, pendingTemplates: {...state.pendingTemplates, [action.payload]:[]}}),
    queueTemplate: (state, action) => ({...state, pendingTemplates: {...state.pendingTemplates, [action.payload.parentId]: [...state.pendingTemplates[action.payload.parentId] as ComponentTemplate[], action.payload] }}),
    dequeueTemplates:(state, action) => ({...state, pendingTemplates: {...state.pendingTemplates, [action.payload]: [] }})
  }
})

export default editorLayoutSlice.reducer;

export const { setSelectedComponentTemplate, setPageTemplate, registerComponentTemplate, updateComponentTemplate, registerComponent, updateComponent, setEditMode, deleteComponentTemplate, setBlockTree, initPendingTemplateList, queueTemplate, dequeueTemplates } = editorLayoutSlice.actions;