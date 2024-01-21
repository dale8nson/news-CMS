'use client';
import type { MouseEventHandler, ReactNode, ReactElement } from "react"
import { forwardRef, useState, createElement, useRef, useEffect } from 'react';
import type { DragEventHandler } from "react";
import ContainerPlaceholder from "../editor/primitives/container-placeholder";
import { useAppStore, useAppSelector } from "@/lib/hooks";
import { setDraggedId } from "@/lib/rootreducer";
import ImagePlaceholder from "../editor/primitives/image-placeholder";

const BlockRegistry: { [component: string]: () => ReactElement } = {
  'ImagePlaceholder': ImagePlaceholder
}
const Container = forwardRef(
  function Container(
    {
      containerId,
      children,
      row = false,
      column = false,
      columnSpan = null,
      grid = false,
      gridTemplateColumns = 'grid-cols-1',
      className = '',
      mode = 'presentation',
      draggable,
      tabIndex,
      onDragStart,
      onDrop,
      onDragOver,
      onDragLeave,
      onDragEnter,
      onDragExit,
      onClick,
      style
     }: {
        containerId?: string,
        children?: ReactNode,
        row?: boolean,
        column?: boolean,
        columnSpan?: number | null,
        grid?: boolean,
        gridTemplateColumns?: string,
        className?: string,
        mode?: 'editor' | 'presentation',
        draggable?: boolean,
        tabIndex?: number
        onDragStart?: DragEventHandler,
        onDrop?: DragEventHandler,
        onDragOver?: DragEventHandler,
        onDragLeave?: DragEventHandler,
        onDragEnter?: DragEventHandler,
        onDragExit?: DragEventHandler,
        onClick?: MouseEventHandler,
        style?: object
      },
    ref?: any) {
      console.log(`Container`);
      const store = useAppStore();
      const [blocks, setBlocks] = useState<ReactNode[] | [] | null>([]);
      const containerRef = useRef<any>(null);
      const [parentNode, setParentNode] = useState<Element | null>(null);

    const dragStartHandler: DragEventHandler = (e) => {
      console.log(`dragStartHandler`);
      const target = e.target as HTMLDivElement;
      setDraggedId(target.id);
      console.log(`store.getState():`, store.getState());
      e.dataTransfer.setData('text/html', target.innerHTML);
      e.dataTransfer.dropEffect = "copy";
    }

    const dragOverHandler: DragEventHandler = (e) => {
      e.preventDefault();
  
    }

    // const dropHandler: DragEventHandler = (e) => {
    //   e.preventDefault();
  
    //   const block = createElement(BlockRegistry[component], {...props,key: crypto.randomUUID()}, null);
    //   setBlocks([...blocks as ReactElement[], block]);
    // }

    const initRef = (node: any) => {
      
      if(!!ref) ref.current = node;
      // if(!!containerRef) containerRef.current = node;
    }

    useEffect(() => {
      if(!containerRef) return;
      setParentNode(containerRef.current);
    },[])

    return (
      <div
        id={containerId}
        className={`${!!row ? 'flex' : ''} ${!!column ? `flex-col` : ''} ${!!columnSpan ? `w-${columnSpan === 12 ? `full` : `${columnSpan}/12`}` : ''} ${!!grid ? `grid ${gridTemplateColumns}` : ''} ${className} min-h-[4vw]`}
        ref={initRef}
        draggable={draggable || mode === 'editor'}
        tabIndex={tabIndex}
        onDragStart={onDragStart || dragStartHandler}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDragEnter={onDragEnter}
        onDragExit={onDragExit}
        onClick={onClick}
        style={style}
      >
        {mode === 'editor' && <div draggable={false} ref={containerRef} className="flex-col justify-evenly" /> }
        {mode !== 'editor' && children}
        {mode === 'editor' && <div className="w-full h-full relative" draggable={false}><ContainerPlaceholder parentNode={parentNode} className='z-20' /></div>}
      </div>
    )
  });

export default Container;