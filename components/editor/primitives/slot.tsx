import { DragEventHandler, useState, useMemo, useContext } from "react";
import { BlockRegistry } from "@/components/block-registry-provider";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { registerComponentTemplate, setBlockTree, setSelectedComponentTemplate, updateComponent, updateComponentTemplate, queueTemplate } from "@/lib/editor-layout-slice";
import type { ComponentTemplate, ItemProps } from "@/lib/editor-layout-slice";

const Slot = ({ parentNode, parentId, index }: { parentNode: Element, parentId: string, index: number }) => {
  const containerId = useMemo<string>(() => parentNode?.getAttribute('id') as string, []);
  console.log(`slot containerId:`, containerId);
  const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate);
  const componentTemplates = useAppSelector(state => state.editorLayoutSlice.componentTemplates);

  const blockTree = useAppSelector(state => state.editorLayoutSlice.blockTree);
  const childNodes = blockTree[parentId];

  const [size, setSize] = useState<{ width: number | null, height: number | null }>();
  const Registry = useContext(BlockRegistry);

  const dispatch = useAppDispatch();

  const dragEnterHandler: DragEventHandler = e => {
    e.preventDefault();
    const el = e.target as Element;
    el.classList.remove('border-2', 'h-1');
    console.log(`e.dataTransfer:`, e);
    // const json = e.dataTransfer.getData('application/json');
    // console.log(`json: ${json}`);
    const sz = selectedComponentTemplate?.size;
    const registeredTemplate = componentTemplates?.[selectedComponentTemplate?.id as string];
    const style = registeredTemplate?.props?.style as ItemProps;
    const widthStr = style?.width as string;
    const width = Number(widthStr.match(/\d{1,4}/));
    const heightStr = style?.height as string;
    const height = Number(heightStr.match(/\d{1,4}/));
    // dispatch(setSelectedComponentTemplate({...selectedComponentTemplate, size: {width, height}}))
    setSize({ width, height });
    console.log(`slot sz:`, sz);
    el.classList.add('border-dashed', 'border-4', 'border-blue-600');
  }

  const dragLeaveHandler: DragEventHandler = e => {
    e.preventDefault();
    const el = e.target as Element;
    // const sz = JSON.parse(e.dataTransfer.getData('application/json'));
    const sz = selectedComponentTemplate?.size;
    el.classList.remove('border-dashed', 'border-8', 'border-blue-600');
    el.classList.add('border-2', 'h-1');
    // dispatch(setSelectedComponentTemplate({...selectedComponentTemplate, size:{width:null, height:null}}));
    setSize({ width: null, height: null });
  }

  const dropHandler: DragEventHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`selectedComponentTemplate:`, selectedComponentTemplate);
    const el = e.target as Element;
    const sz = selectedComponentTemplate?.size;
    console.log(`slot sz:`, sz);
    el.classList.remove('border-dashed', 'border-8', 'border-blue-600');
    el.classList.add('border-2', 'h-1');
    setSize({ width: null, height: null });


    let newComponentTemplate: ComponentTemplate;
    if (selectedComponentTemplate?.dragAction === 'copy') {
      console.log(`selectedComponentTemplate?.dragAction === 'copy': ${selectedComponentTemplate?.dragAction === 'copy'}`)

      newComponentTemplate = { ...selectedComponentTemplate as ComponentTemplate, size: { width: null, height: null }, parentId, id: null, index, dragAction: 'move', selectOnMount: true, editable:true };
      console.log(`newComponentTemplate:`, newComponentTemplate);
      dispatch(setSelectedComponentTemplate(newComponentTemplate));
      dispatch(queueTemplate(newComponentTemplate))
    } else {
      newComponentTemplate = { ...selectedComponentTemplate as ComponentTemplate, index, parentId, size: { width: null, height: null } };
      dispatch(setSelectedComponentTemplate({ ...newComponentTemplate }));
      dispatch(updateComponentTemplate(newComponentTemplate));
      const oldIndex = childNodes.indexOf(selectedComponentTemplate?.id as string);
      console.log(`childNodes:`, childNodes);
      const newChildNodes = childNodes.toSpliced(oldIndex, 1).toSpliced(index, 0, selectedComponentTemplate?.id as string);
      console.log(`newChildNodes:`, newChildNodes);
      dispatch(setBlockTree({ ...blockTree, [parentNode.getAttribute('id') as string]: newChildNodes }));
    }
  }

  return (
    <div onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDrop={dropHandler} className='border-8 z-50 transition-all duration-500 delay-100' style={{ width: `${size?.width + 'px' || '100%'}`, height: `${size?.height || 4}px`, borderWidth:'20px' }} />
  )
}

export default Slot;