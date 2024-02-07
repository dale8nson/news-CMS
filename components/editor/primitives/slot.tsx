import { DragEventHandler } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setBlockTree, setSelectedComponentTemplate, updateComponent, updateComponentTemplate } from "@/lib/editor-layout-slice";

const Slot = ({parentNode, index}:{parentNode: Element, index: number}) => {

    const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate);

    const blockTree = useAppSelector(state => state.editorLayoutSlice.blockTree);
    const childNodes = blockTree[parentNode.id];

    const dispatch = useAppDispatch();

    const dragEnterHandler: DragEventHandler = e => {
      e.preventDefault();
      const el = e.target as Element;
      el.classList.remove('border-2');
      el.classList.add('border-dashed', 'border-4', 'border-blue-600');
      // el.setAttribute('className', 'flex border-solid border-[2px] h-[20px] w-[50px] border-blue');
    }

    const dragLeaveHandler: DragEventHandler = e => {
      e.preventDefault();
      const el = e.target as Element;
      el.classList.remove('border-dashed', 'border-4', 'border-blue-600');
      el.classList.add('border-2');
    }

    const dropHandler: DragEventHandler = e => {
      e.preventDefault();
      e.stopPropagation();
      const el = e.target as Element;
      el.classList.remove('border-dashed', 'border-4', 'border-blue-600');
      el.classList.add('border-2');
      const newComponentTemplate = {...selectedComponentTemplate, index, parentId:parentNode.getAttribute('id')};
      dispatch(setSelectedComponentTemplate(newComponentTemplate));
      dispatch(updateComponentTemplate(newComponentTemplate));
      const oldIndex = childNodes.indexOf(selectedComponentTemplate?.id as string);
      console.log(`childNodes:`, childNodes);
      const newChildNodes = childNodes.toSpliced(oldIndex,1).toSpliced(index,0,selectedComponentTemplate?.id as string)
      console.log(`newChildNodes:`, newChildNodes);
      dispatch(setBlockTree({...blockTree, [parentNode.getAttribute('id') as string]:newChildNodes}));
    }

  return (
    <div onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDrop={dropHandler} className='border-2 h-[0px] z-50' />

  )
}

export default Slot;