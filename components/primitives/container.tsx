'use client';
import type { MouseEventHandler, ReactNode, ReactElement,  } from "react"
import { forwardRef, useState, createElement, useRef, useEffect, useMemo } from 'react';
import type { DragEventHandler } from "react";
import ContainerPlaceholder from "../editor/primitives/container-placeholder";
import { useAppStore, useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setDraggedId } from "@/lib/rootreducer";
import { ItemProps, initPendingTemplateList } from "@/lib/editor-layout-slice";


const Container = forwardRef(
  function Container(
    {
      id,
      parentId,
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
      parentId?: string,
      children?: ReactNode,
      className?: string,
      mode?: 'dummy' | 'content' | 'preview',
      editable?: boolean,
      draggable?: boolean,
      tabIndex?: number,
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
    const containerRef = useRef<any>(null);
    const containerId = useMemo(() => parentId || crypto.randomUUID(),[parentId]);
    const dispatch = useAppDispatch();
    dispatch(initPendingTemplateList(parentId));

    const [parentNode, setParentNode] = useState<Element | null>(null);
    const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);

    // console.log(`editMode: ${editMode}`);

    // console.log(`editable: ${editable}`);

    const dragStartHandler: DragEventHandler = (e) => {

    }

    const dragOverHandler: DragEventHandler = (e) => {
      e.preventDefault();

    }

    const initRef = (node: any) => {
      if (!node) return;
      console.log(`initRef node.id:`, node.id);
      if (!!ref) {
        if (typeof ref === 'function') {
          ref(node)
        } else {
          ref.current = node;
        }        
      }
    }

    const initContainerRef = (node: Element) => {
      if(!node) return;
      containerRef.current = node as Element;
      console.log(`container containerId:`, containerRef.current.getAttribute('id'));
      setParentNode(containerRef.current);
    }

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
        <div draggable={editable && editMode === 'dummy'} ref={initContainerRef as any} id={containerId} className="flex-col justify-evenly" />
        {children}
        {!!parentNode && <div className={`w-full h-full ${editMode !== 'dummy' || !editable ? 'hidden' : ''}`} draggable={false}><ContainerPlaceholder parentNode={parentNode} parentId={containerId} className={`z-20`} /></div>}
      </div>
    )
  });

export default Container;