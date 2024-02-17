'use client';
import type { DragEventHandler, ReactElement, ReactNode } from "react";
import { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { createPortal } from "react-dom";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { ComponentTemplate, ItemProps, setPageTemplate, setSelectedComponentTemplate, updateComponent, deleteComponentTemplate, registerComponentTemplate, updateComponentTemplate, setBlockTree, dequeueTemplates } from "@/lib/editor-layout-slice";
import { BlockRegistry } from "@/components/block-registry-provider";
import Slot from "./slot";

const ContainerPlaceholder = ({ parentNode, parentId, className }: { parentNode: Element | null, parentId: string, className?: string }) => {
  console.log(`ContainerPlaceHolder`);
  console.log(`parentNode:`, parentNode);
  console.log(`ContainerPlaceholder parentId:`, parentId);
  const dispatch = useAppDispatch();
  const [blockList, setBlockList] = useState<ReactElement[]>([]);
  const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate)
  const componentTemplates = useAppSelector(state => state.editorLayoutSlice.componentTemplates);
  const blockTree = useAppSelector(state => state.editorLayoutSlice.blockTree);
  const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);
  const pendingTemplates = useAppSelector(state => state.editorLayoutSlice.pendingTemplates)
  console.log(`pendingTemplates:`, pendingTemplates);
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

    console.log(`dropHandler e.dataTransfer:`, e.dataTransfer);

    ref?.current?.classList.replace('bg-white', 'bg-gray-400');

    console.log(`selectedComponentTemplate:`, selectedComponentTemplate);

    const { componentName, displayName, dragAction, editable, selectOnMount, props, id, parentId: templateParentId } = selectedComponentTemplate as ComponentTemplate;

    console.log(`templateParentId: ${templateParentId} parentNode?.id: ${parentNode?.id}`);

    if (!templateParentId || templateParentId !== parentId) {
      let newTemplate = { ...selectedComponentTemplate, id: dragAction === 'move' ? id : null, parentId, index: blockList.length, editable: true, selectOnMount: true, dragAction: 'move' }

      const block = Registry[componentName].el(newTemplate, null);
      const blk = block as ReactElement;
      newTemplate = { ...newTemplate, id: blk.props.id }

      console.log(`block:`, block);

      if (!!parentNode) {
        const pid = parentId;
        const props = blk?.props;
        let childIds: string[] = blockTree[pid] || [];
        console.log(`childIds:`, childIds);
        childIds = [...childIds, props.id];

        if (!!templateParentId && templateParentId !== parentNode?.id) {

          console.log(`templateParentId: ${templateParentId}`);

          const oldParentChildIds = blockTree[templateParentId as string];
          console.log(`oldParentChildIds:`, oldParentChildIds);
          if (!!oldParentChildIds) {
            const index = oldParentChildIds.indexOf(id as string);
            const oldParentNewChildIds = oldParentChildIds.toSpliced(index, 1);
            dispatch(setBlockTree({ ...blockTree, [parentId]: childIds, [templateParentId]: oldParentNewChildIds }));
          }

        } else {

          dispatch(setBlockTree({ ...blockTree, [parentId]: childIds }));
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
      dispatch(setSelectedComponentTemplate({ ...newTemplate, size: { width: null, height: null } }));
    }
  }

  const node = useRef<ReactNode>();

  useEffect(() => {

    console.log(`parentId:`, parentId);

    let childIds: string[] = blockTree[parentId] || [];

    

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
              {editMode === 'dummy' && <Slot key={crypto.randomUUID()} {...{ parentNode: parentNode as Element, parentId, index }} />}
              {blk}
            </>
          )
        })
    }

    console.log(`setBlocks componentTemplates:`, componentTemplates);

  }, [componentTemplates, parentId, node, parentNode, editMode, blockTree, pendingTemplates]);


  console.log(`pending parentId:`, parentId);
  console.log(`pendingTemplates:`, pendingTemplates);
  const pendingTemplateList = pendingTemplates[parentId];

  console.log(`pendingTemplateList:`, pendingTemplateList);

    if (pendingTemplateList?.length > 0) {
      console.log(`pendingTemplateList?.length > 0:${pendingTemplateList?.length > 0}`)
      console.log(`pendingTemplateList:`, pendingTemplateList);
      console.log(`parentId: ${parentId}`);
      let blockIds = [...blockTree[parentId]] || [];
      console.log(`blockIds:`, blockIds);
      let list = [...blockList];
      for (const template of pendingTemplateList) {
        const block = Registry[template.componentName].el(template, null);
        console.log(`template of pendingTemplateList:`, template);
        console.log(`block:`, block);
        const el = block as ReactElement;
        console.group(`el:`, el);
        blockIds = blockIds.toSpliced(template.index as number, 0, el.props.id as string);
        console.log(`blockIds:`, blockIds);
        list = list.toSpliced(template.index as number, 0, el);
      }
      dispatch(setBlockTree({ ...blockTree, [parentId]: blockIds }));
      setBlockList(list);
      dispatch(dequeueTemplates(parentId));
    }

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
