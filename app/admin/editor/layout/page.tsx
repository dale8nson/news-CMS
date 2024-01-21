'use client';
import { useState } from "react";
import Container from "@/components/primitives/container";
import ImagePlaceholder from "@/components/editor/primitives/image-placeholder";
import ContainerPlaceholder from "@/components/editor/primitives/container-placeholder";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPageTemplate, setSelectedComponentTemplate } from "@/lib/editor-layout-slice";

const Page = () => {
  console.log(`/admin/editor/layout`);

  const pageTemplate = useAppSelector(state => state.editorLayoutSlice.pageTemplate);

  const dispatch = useAppDispatch();

  const clickHandler = (e: any) => {
    // e.preventDefault();
    console.log(`clickHandler`)
    dispatch(setSelectedComponentTemplate(pageTemplate));
  }

  return (
    <div className={`flex-col relative m-auto`} style={{...pageTemplate?.props}} onClick={clickHandler} >
      <Container className='border-solid border-2 relative' style={{display:'flex', flex:1, height:'max-content' }} >
        <Container mode={'editor'} className='border-solid border-2 relative flex-col' style={{width:'50%', height:'100%', }} />
        <Container mode={'editor'} className="border-solid border-2 flex-col relative w-6/12" style={{height:'max-content'}} />
      </Container>
    </div>
  )
}

export default Page;

export const dynamic = 'force-dynamic';