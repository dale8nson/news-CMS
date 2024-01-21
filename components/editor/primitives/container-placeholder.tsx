'use client';
import type { DragEventHandler, ReactElement } from "react";
import { useRef, useState, createElement } from 'react';
import type { ReactNode, FunctionComponent, RefObject } from "react";
import { createPortal } from "react-dom";
import Container from "@/components/primitives/container";
import { AppStore } from "@/lib/store";
import { useAppStore, useAppSelector } from "@/lib/hooks";
import { ComponentTemplate } from "@/lib/editor-layout-slice";
import ImagePlaceholder from "./image-placeholder";
// import BlockRegistry, { getBlockUrl } from "@/components/block-registry";

const BlockRegistry: { [component: string]: () => ReactElement } = {
  'ImagePlaceholder': ImagePlaceholder
}
const ContainerPlaceholder = ({ parentNode, className }: { parentNode: Element | null, className: string }) => {
  console.log(`ContainerPlaceHolder`);

  const ref = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<ReactNode[] | [] | null>([]);

  const selectedItemProps = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate);
  // if(!!selectedItemProps) {
  const { componentName, props } = selectedItemProps as ComponentTemplate;
  console.log(`component:`, componentName);
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

    // ref?.current?.classList.replace('h-full', 'h-max');
    ref?.current?.classList.replace('bg-white', 'bg-gray-400');
    // ref?.current?.classList.replace('w-full', 'w-auto');

    const block = createElement(BlockRegistry[componentName], { ...props, key: crypto.randomUUID() }, null);
    setBlocks([...blocks as ReactElement[], block]);
  }

  console.log(`blocks:`, blocks);

  return (
    <>
      {parentNode && createPortal(blocks, parentNode as Element)}
      <div draggable={false} className={`bg-gray-400 w-full z-30 ${className}`} style={{ display:'flex', minHeight:'4vw', position: 'relative'}} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler} ref={ref}>
        <div className='' draggable={false} style={{ width: '100%', height:'max-content', display: 'flex', flexDirection: 'column' }} >
          <i className='pi pi-plus p-2 justify-center align-center text-4xl text-black' draggable={false} />
        </div>
      </div>
    </>
  )
}

export default ContainerPlaceholder;