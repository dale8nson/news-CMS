import { DragEventHandler } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setSelectedComponentTemplate } from "@/lib/editor-layout-slice";

const Slot = ({parentNode, index}:{parentNode: Element, index: number}) => {

    const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate);

    const dispatch = useAppDispatch();

    const dragEnterHandler: DragEventHandler = e => {
      e.preventDefault();
      const el = e.target as Element;
      el.setAttribute('class', 'border-solid border-[2px] h-[2px] w-full border-blue');
    }

    const dragLeaveHandler: DragEventHandler = e => {
      e.preventDefault();
      const el = e.target as Element;
      el.setAttribute('class', '');
    }

    const dropHandler: DragEventHandler = e => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(setSelectedComponentTemplate({...selectedComponentTemplate, index, parentId:parentNode.getAttribute('id')}));

    }

  return (
    <div onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDrop={dropHandler}>
    </div>
  )
}

export default Slot;