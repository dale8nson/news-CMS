'use client';
import type { DragEventHandler, ReactElement, ReactNode } from "react";
import { useRef, useState, useEffect, useContext } from 'react';
import { createPortal } from "react-dom";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { ComponentTemplate, ItemProps, setPageTemplate, setSelectedComponentTemplate, updateComponent, deleteComponentTemplate, registerComponentTemplate, updateComponentTemplate } from "@/lib/editor-layout-slice";
import { BlockRegistry } from "@/components/block-registry-provider";

const ContainerPlaceholder = ({ parentNode, className }: { parentNode?: Element | null, className?: string }) => {
  console.log(`ContainerPlaceHolder`);
  console.log(`parentNode:`, parentNode);
  const dispatch = useAppDispatch();

  const [blockList, setBlockList] = useState<ReactElement[]>([]);

  const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate)

  const componentTemplates = useAppSelector(state => state.editorLayoutSlice.componentTemplates);

  const pageTemplate = useAppSelector(state => state.editorLayoutSlice.pageTemplate);

  const ref = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<ReactNode[] | null>([]);

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

    ref?.current?.classList.replace('bg-white', 'bg-gray-400');

    console.log(`selectedComponentTemplate:`, selectedComponentTemplate);

    const { componentName, displayName, dragAction, editable, selectOnMount, props, id } = selectedComponentTemplate as ComponentTemplate;

    // if(dragAction === 'move') {
    //   console.log(`componentTemplates:`, componentTemplates);
    //   console.log(`id to be removed:`, id);
    // dispatch(deleteComponentTemplate(id as any))
    // dispatch(updateComponent({...selectedComponentTemplate, parentId: parentNode?.id }));
    // dispatch(setSelectedComponentTemplate({...selectedComponentTemplate, parentId: parentNode?.id }))

    // }

    let newTemplate = { ...selectedComponentTemplate, id: dragAction === 'move' ? id : null, parentId: parentNode?.getAttribute('id'), editable: true, selectOnMount: true, dragAction: 'move' }

    const block = Registry[componentName].el(newTemplate, null);
    console.log(`block:`, block);

    const blk = block as ReactElement;
    newTemplate = { ...newTemplate, id: blk?.props?.id };
    dispatch(updateComponentTemplate(newTemplate));

    const newBlockList: ReactNode[] = [...blockList, block]

    setBlockList(newBlockList as ReactElement[])

    // console.log(`block:`, block);

  }

  useEffect(() => {
    
    setBlockList(blockList.filter(block => {
      const blk = block as ReactElement;
      const template = componentTemplates?.[blk?.props?.id];
      return template?.parentId === parentNode?.getAttribute('id')
    }));

    console.log(`setBlocks componentTemplates:`, componentTemplates);
    
  },[componentTemplates])

  return (
    <>
      {createPortal(blockList, parentNode as Element)}
      <div draggable={false} className={`relative bg-gray-400 w-full h-full z-30 flex-col justify-items-center items-center ${className}`} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler} onDragStart={dragStartHandler} ref={ref}>
        <div className='flex items-center justify-items-center m-auto' draggable={false} >
          <span className='pi pi-plus p-2 text-4xl text-black m-auto' draggable={false} />
        </div>
      </div>
    </>
  )
}

export default ContainerPlaceholder;
