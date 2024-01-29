'use client';
import type { DragEventHandler, ReactElement } from "react";
import { useRef, useState, createElement, useEffect, useContext } from 'react';
import { renderToString } from "react-dom/server";
import type { ReactNode, FunctionComponent, RefObject } from "react";
import { createPortal } from "react-dom";
import Container from "@/components/primitives/container";
import { AppStore } from "@/lib/store";
import { useAppStore, useAppSelector, useAppDispatch } from "@/lib/hooks";
import editorLayoutSlice, { ComponentTemplate, setPageTemplate, setSelectedComponentTemplate, updateComponent } from "@/lib/editor-layout-slice";
import ImagePlaceholder from "./image-placeholder";
import { registerBlock } from "@/lib/block-registry";
import { BlockRegistryProvider } from "@/components";
import { BlockRegistry } from "@/components/block-registry-provider";

const ContainerPlaceholder = ({ parentNode, className }: { parentNode?: Element | null, className?: string }) => {
  console.log(`ContainerPlaceHolder`);
  const dispatch = useAppDispatch();

  const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate)

  const componentTemplates = useAppSelector(state => state.editorLayoutSlice.componentTemplates);

  const pageTemplate = useAppSelector(state => state.editorLayoutSlice.pageTemplate);

  const ref = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<ReactNode[] | [] | null>([]);            

  const Registry = useContext(BlockRegistry)

  const dragStartHandler: DragEventHandler = (e) => {
    e.preventDefault();
  }

  const dragOverHandler: DragEventHandler = (e) => {
    e.preventDefault();

    ref?.current?.classList.replace('bg-gray-400', 'bg-white');
  }

  const dragLeaveHandler: DragEventHandler = (e) => {
    e.preventDefault();

    ref?.current?.classList.replace('bg-white', 'bg-gray-400');
  }

  const dropHandler: DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { componentName, dragAction,  props } = selectedComponentTemplate as ComponentTemplate;

    
    // dispatch(setSelectedComponentTemplate(newTemplate));
    // if(pageTemplate?.id === selectedComponentTemplate?.id) {
    //   dispatch(setPageTemplate(newTemplate))
    // } else {
    //   dispatch(updateComponent(newTemplate));
    // }

    ref?.current?.classList.replace('bg-white', 'bg-gray-400');

    const block = Registry[componentName].el({ ...props, editable: true, selectOnMount:true, dragAction:'move', id: dragAction === 'move' ? selectedComponentTemplate?.id : null }, null);
    console.log(`block:`, block);

    setBlocks([...blocks as ReactElement[], block]);

    if(dragAction === 'move') {
      const element = document.getElementById(selectedComponentTemplate?.id as string);
      element?.remove();
    }

    console.log(`block:`, block);

    // const element = block as ReactElement;

    // const newTemplate = {...componentTemplates?.[element?.props?.id as string], id: selectedComponentTemplate?.dragAction === 'move' ? element.props.id as string: selectedComponentTemplate?.id, editable:true }

    // console.log(`newTemplate:`, newTemplate);
    // dispatch(setSelectedComponentTemplate(newTemplate));

  }


  console.log(`blocks:`, blocks);

  return (
    <>
      {parentNode && createPortal(blocks, parentNode as Element)}
      <div draggable={false} className={`relative bg-gray-400 w-full h-full z-30 flex-col justify-items-center items-center ${className}`} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler} onDragStart={dragStartHandler} ref={ref}>
        <div className='flex items-center justify-items-center m-auto' draggable={false} >
          <span className='pi pi-plus p-2 text-4xl text-black m-auto' draggable={false} />
        </div>
      </div>
    </>
  )
}

export default ContainerPlaceholder;