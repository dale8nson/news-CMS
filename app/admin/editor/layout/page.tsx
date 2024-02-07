'use client';
import { createElement, useState, useEffect } from "react";
import Container from "@/components/primitives/container";
import ImagePlaceholder from "@/components/editor/primitives/image-placeholder";
import ContainerPlaceholder from "@/components/editor/primitives/container-placeholder";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { setPageTemplate, setSelectedComponentTemplate } from "@/lib/editor-layout-slice";
import type { PageTemplate } from "@/lib/editor-layout-slice";

const Page = () => {
  // console.log(`/admin/editor/layout`);
  // console.log(`this:`, this);
  const BlockRegistry = useAppSelector(state => state.BlockRegistry);
  const pageTemplate = useAppSelector(state => state.editorLayoutSlice.pageTemplate);
  const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);

  console.log(`BlockRegistry:`, BlockRegistry);
  const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate);
  const store = useAppStore();
  
  const dispatch = useAppDispatch();
  
  const clickHandler = (e: any) => {
    // e.preventDefault();
    console.log(`clickHandler`)
    dispatch(setSelectedComponentTemplate(pageTemplate));
  }

  useEffect(() => {
    
    if(!selectedComponentTemplate) {
      dispatch(setSelectedComponentTemplate(pageTemplate));
    }

  },[])

  return (
    <div className={`flex-col relative mt-[8rem] `} style={{...pageTemplate?.props.style}} onClick={clickHandler} >
      <Container editable={false} className={`${editMode === 'dummy' ? 'border-dashed border-gray-300': 'border-transparent'} border-2 relative flex flex-1`} >
        <Container editable={true} className={`${editMode === 'dummy' ? 'hover:border-solid hover:border-gray-300' : ''} border-2 border-transparent relative h-full grid grid-flow-row auto-cols-auto`} />
        {/* <Container editable={true} className={`${editMode === 'dummy' ? 'hover:border-solid hover:border-gray-300' : ''} border-transparent border-2 flex-col flex-1 relative`} style={{height:'max-content'}} />
        <Container editable={true} {...{className:`${editMode === 'dummy' ? 'hover:border-solid hover:border-gray-300' : ''} border-transparent h-full border-2 flex-col flex-1 relative`}} /> */}
      </Container>
    </div>
  )
}

export default Page;

