'use client';
import { createElement, useState, useEffect } from "react";
import Container from "@/components/primitives/container";
import ImagePlaceholder from "@/components/editor/primitives/image-placeholder";
import ContainerPlaceholder from "@/components/editor/primitives/container-placeholder";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { setPageTemplate, setSelectedComponentTemplate } from "@/lib/editor-layout-slice";
import type { PageTemplate } from "@/lib/editor-layout-slice";

const Page = () => {
  console.log(`/admin/editor/layout`);
  console.log(`this:`, this);
  const BlockRegistry = useAppSelector(state => state.BlockRegistry)
  // const pageTemplate = useAppSelector(state => state.editorLayoutSlice.pageTemplate);
  const [pageTemplate, setPageTemplate] = useState<PageTemplate>();

  console.log(`BlockRegistry:`, BlockRegistry);
  // const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate);
  const store = useAppStore();
  
  const dispatch = useAppDispatch();
  
  const clickHandler = (e: any) => {
    // e.preventDefault();
    console.log(`clickHandler`)
    dispatch(setSelectedComponentTemplate(pageTemplate));
  }

  useEffect(() => {
    const { selectedComponentTemplate }  = store.getState().editorLayoutSlice;
    setPageTemplate(store.getState().editorLayoutSlice.pageTemplate as PageTemplate)
    
    if(!selectedComponentTemplate) {
      dispatch(setSelectedComponentTemplate(pageTemplate));
    }

  },[])

  return (
    <div className={`flex-col relative m-0`} style={{...pageTemplate?.props.style}} onClick={clickHandler} >
      <Container className='border-solid border-2 relative' style={{display:'flex', flex:1, height:'max-content' }} >
        <Container mode={'editor'} className='border-solid border-2 relative flex-col' style={{width:'50%', height:'100%', }} />
        <Container mode={'editor'} className="border-solid border-2 flex-col relative w-4/12" style={{height:'max-content'}} />
        <Container {...{mode:'editor', className:'border-solid border-2 flex-col relative w-4/12'}} />
      </Container>
    </div>
  )
}

export default Page;

