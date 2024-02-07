'use client';
import type { DragEventHandler, ReactElement, ReactNode } from "react";
import { useRef, useState, useEffect, useContext } from 'react';
import { createPortal } from "react-dom";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { ComponentTemplate, ItemProps, setPageTemplate, setSelectedComponentTemplate, updateComponent, deleteComponentTemplate, registerComponentTemplate, updateComponentTemplate, setBlockTree } from "@/lib/editor-layout-slice";
import { BlockRegistry } from "@/components/block-registry-provider";
import Slot from "./slot";

const ContainerPlaceholder = ({ parentNode, className }: { parentNode: Element | null, className?: string }) => {
  console.log(`ContainerPlaceHolder`);
  console.log(`parentNode:`, parentNode);
  const dispatch = useAppDispatch();

  const [blockList, setBlockList] = useState<ReactElement[]>([]);

  const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate)

  const componentTemplates = useAppSelector(state => state.editorLayoutSlice.componentTemplates);

  const blockTree = useAppSelector(state => state.editorLayoutSlice.blockTree);
  const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);


  const ref = useRef<HTMLDivElement>(null);

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

    const { componentName, displayName, dragAction, editable, selectOnMount, props, id, parentId } = selectedComponentTemplate as ComponentTemplate;

    console.log(`parentId: ${parentId} parentNode?.id: ${parentNode?.id}`);

    if (!parentId || parentId !== parentNode?.getAttribute('id')) {
      let newTemplate = { ...selectedComponentTemplate, id: dragAction === 'move' ? id : null, parentId: parentNode?.getAttribute('id'), index: blockList.length, editable: true, selectOnMount: true, dragAction: 'move' }

      const block = Registry[componentName].el(newTemplate, null);
      const blk = block as ReactElement;
      newTemplate = { ...newTemplate, id: blk?.props.id }

      console.log(`block:`, block);

      if (!!parentNode) {
        const pid = parentNode?.getAttribute('id') as string;
        const props = blk?.props;
        let childIds: string[] = blockTree[pid] || [];
        console.log(`childIds:`, childIds);
        childIds = [...childIds, props.id];

        if (!!parentId && parentId !== parentNode?.id) {

          console.log(`parentId: ${parentId}`);

          const oldParentChildIds = blockTree[parentId as string];
          console.log(`oldParentChildIds:`, oldParentChildIds);
          if (!!oldParentChildIds) {
            const index = oldParentChildIds.indexOf(id as string);
            const oldParentNewChildIds = oldParentChildIds.toSpliced(index, 1);
            dispatch(setBlockTree({ ...blockTree, [parentNode.getAttribute('id') as string]: childIds, [parentId]: oldParentNewChildIds }));
          }

        } else {

          dispatch(setBlockTree({ ...blockTree, [parentNode.getAttribute('id') as string]: childIds }));
        }

        const placeHolders: ReactElement[] = [];
        for (const id of childIds) {
          const blk = blockList.find(blk => {
            return blk?.props.id === id;
          })
          if (blk) {
            placeHolders.push(blk);
          }
        }

        setBlockList([...placeHolders, block as ReactElement]);

      }

      console.log(`blockList:`, blockList);

      dispatch(updateComponentTemplate(newTemplate));
    }

  }

  const node = useRef<ReactNode>();

  useEffect(() => {

    console.log(`parentNode?.getAttribute('id'):`, parentNode?.getAttribute('id'));

    let childIds: string[] = blockTree[parentNode?.getAttribute('id') as string] || [];

    console.log(`childIds:`, childIds);
    if (childIds.length > 0) {

      const placeHolders: ReactElement[] = [];
      for (const id of childIds) {
        const block = blockList.find(blk => {
          return blk?.props.id === id;
        })
        if (block) {
          placeHolders.push(block);
        }
      }
      console.log(`placeHolders:`, placeHolders);
      setBlockList(placeHolders);

      console.log(`blockList:`, blockList);
      node.current = placeHolders
        .map((blk, index) => {
          return (
            <>
              {editMode === 'dummy' && <Slot key={crypto.randomUUID()} {...{ parentNode: parentNode as Element, index}} />}
              {blk}
            </>
          )
        })
    }
    // setBlockList(blockList.filter(block => {
    //   const blk = block as ReactElement;
    //   const template = componentTemplates?.[blk?.props?.id];
    //   return template?.parentId === parentNode?.getAttribute('id');
    // })
    // );
   


    console.log(`setBlocks componentTemplates:`, componentTemplates);

  }, [componentTemplates, node, parentNode, editMode, blockTree])



  return (
    <>
      {createPortal(node.current, parentNode as Element)}
      <div draggable={false} className={`relative bg-gray-400 w-full h-full z-30 flex-col justify-items-center items-center ${className}`} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler} onDragStart={dragStartHandler} ref={ref}>
        <div className='flex items-center justify-items-center m-auto' draggable={false} >
          <span className='pi pi-plus p-2 text-4xl text-black m-auto' draggable={false} />
        </div>
      </div>
    </>
  )
}

export default ContainerPlaceholder;
