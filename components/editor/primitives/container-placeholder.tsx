'use client';
import type { DragEventHandler, ReactElement } from "react";
import { useRef, useState, createElement, useEffect, useContext } from 'react';
import { renderToString } from "react-dom/server";
import type { ReactNode, FunctionComponent, RefObject } from "react";
import { createPortal } from "react-dom";
import Container from "@/components/primitives/container";
import { AppStore } from "@/lib/store";
import { useAppStore, useAppSelector, useAppDispatch } from "@/lib/hooks";
import editorLayoutSlice, { ComponentTemplate } from "@/lib/editor-layout-slice";
import ImagePlaceholder from "./image-placeholder";
import { registerBlock } from "@/lib/block-registry";
import { BlockRegistryProvider } from "@/components";
import { BlockRegistry } from "@/components/block-registry-provider";

const ContainerPlaceholder = ({ parentNode, className }: { parentNode: Element | null, className: string }) => {
  console.log(`ContainerPlaceHolder`);
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<ReactNode[] | [] | null>([]);

  const store = useAppStore();

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
    const selectedComponentTemplate = store.getState().editorLayoutSlice.selectedComponentTemplate;
    const { componentName, dragAction,  props } = selectedComponentTemplate as ComponentTemplate;

    ref?.current?.classList.replace('bg-white', 'bg-gray-400');
    console.log(`BlockRegistry:`, Registry);
    const block = Registry[componentName].el({ ...props, canEdit: true, dragAction:'move', id: selectedComponentTemplate?.dragAction === 'move' ? selectedComponentTemplate?.id : null }, null);
    console.log(`block:`, block);

    setBlocks([...blocks as ReactElement[], block]);

    if(dragAction === 'move') {
      const element = document.getElementById(selectedComponentTemplate?.id as string);
      element?.remove();
    }
  }

  console.log(`blocks:`, blocks);

  return (
    <>
      {parentNode && createPortal(blocks, parentNode as Element)}
      <div draggable={false} className={`bg-gray-400 w-full z-30 ${className}`} style={{ minHeight: '4vw', position: 'relative' }} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler} onDragStart={dragStartHandler} ref={ref}>
        <div className='flex items-center justify-items-center' draggable={false} style={{ width: '100%', height: 'max-content', display: 'flex', flexDirection: 'column' }} >
          <i className='pi pi-plus p-2 text-4xl text-black' draggable={false} />
        </div>
      </div>
    </>
  )
}

export default ContainerPlaceholder;