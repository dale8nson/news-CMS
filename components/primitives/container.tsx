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
      id,
      containerId,
      children,
      className = '',
      editable,
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
      id?: string,
      containerId?: string,
      children?: ReactNode,
      className?: string,
      mode?: 'dummy' | 'content' | 'preview',
      editable?: boolean,
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
    const [blocks, setBlocks] = useState<ReactNode[] | [] | null>([]);
    const containerRef = useRef<any>(null);
    const [parentNode, setParentNode] = useState<Element | null>(null);
    const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);
    console.log(`editMode: ${editMode}`);

    console.log(`editable: ${editable}`);

    const dragStartHandler: DragEventHandler = (e) => {

    }

    const dragOverHandler: DragEventHandler = (e) => {
      e.preventDefault();

    }

    const initRef = (node: any) => {
      if (!node) return;

      if (!!ref) {
        if (typeof ref === 'function') {
          ref(node)
        } else {
          ref.current = node;
        }
      }
    }

    useEffect(() => {
      if (!containerRef) return;
      setParentNode(containerRef.current);
    }, [])

    return (
      <div
        id={id}
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
        { <div draggable={editable && editMode === 'dummy'} ref={containerRef} className="flex-col justify-evenly" />}
        {children}
        { <div className={`w-full h-full ${editMode !== 'dummy' || !editable ? 'hidden': ''}`} draggable={false}><ContainerPlaceholder parentNode={parentNode} className={`z-20`} /></div>}
      </div>
    )
  });

export default Container;