'use client';
import type { MouseEventHandler, ReactNode, ReactElement } from "react"
import { forwardRef, useState, createElement, useRef, useEffect } from 'react';
import type { DragEventHandler } from "react";
import ContainerPlaceholder from "../editor/primitives/container-placeholder";
import { useAppStore, useAppSelector } from "@/lib/hooks";
import { setDraggedId } from "@/lib/rootreducer";
import { ItemProps } from "@/lib/editor-layout-slice";


const Container = forwardRef(
  function Container(
    {
      containerId,
      children,
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
      style?: ItemProps
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
      if(!node) return;

      if (!!ref) {
        if (typeof ref === 'function') {
          ref(node)
        } else {
          ref.current = node;
        }
        // if(!!containerRef) containerRef.current = node;
      }
    }

    useEffect(() => {
      if (!containerRef) return;
      setParentNode(containerRef.current);
    }, [])

    return (
      <div
        id={containerId}
        className={className}
        ref={initRef}
        draggable={draggable}
        tabIndex={tabIndex}
        onDragStart={onDragStart || dragStartHandler}
        onDrop={onDrop}
        onDragOver={onDragOver || dragOverHandler}
        onDragLeave={onDragLeave}
        onDragEnter={onDragEnter}
        onDragExit={onDragExit}
        onClick={onClick}
        style={style}
      >
        {mode === 'editor' && <div draggable={false} ref={containerRef} className="flex-col justify-evenly" />}
        {mode !== 'editor' && children}
        {mode === 'editor' && <div className="w-full h-full relative" draggable={false}><ContainerPlaceholder parentNode={parentNode} className='z-20' /></div>}
      </div>
    )
  });

export default Container;