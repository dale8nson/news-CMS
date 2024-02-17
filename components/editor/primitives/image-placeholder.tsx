'use client';
import type { DragEventHandler, MouseEventHandler } from "react";
import Container from "@/components/primitives/container";
import { useState, useRef, useEffect, useMemo} from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSelectedComponentTemplate, registerComponentTemplate } from "@/lib/editor-layout-slice";
import type { ItemProps } from "@/lib/editor-layout-slice";

interface Size {
  width: number,
  height: number
}

function ImagePlaceholder({ id, parentId, editable,  selectOnMount, width, height, dragAction }: { id?: string, parentId?: string, editable: boolean, selectOnMount?: boolean | undefined, width?: string | undefined, height?: string | undefined, dragAction: 'move' | 'copy' | 'link' | 'none' }) {

  const blockId = useMemo(() => id || crypto.randomUUID(), [id]);

  const componentTemplate = useMemo(() => ({
    id: blockId,
    parentId,
    componentName: 'ImagePlaceholder',
    displayName: 'Image Placeholder',
    editable,
    selectOnMount,
    dragAction: dragAction,
    props: {
      style: {
        width: '220px',
        height: '132px'
      }
    }
  }),[blockId, editable, selectOnMount, dragAction]);

  const dispatch = useAppDispatch();

  const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);

  const registeredTemplate = useAppSelector(state => state.editorLayoutSlice?.componentTemplates?.[blockId]);

  console.log(`ImagePlaceholder`);
  const ref: any = useRef<any>(null);
  const idRef: any = useMemo(() => crypto.randomUUID(), []);
  
  const [rect, setRect] = useState<Size>();
  const observer = useRef<ResizeObserver>();

  const dragStartHandler: DragEventHandler = (e) => {
    // e.preventDefault();
    console.log(`dragStartHandler`);
    // e.stopPropagation();
    console.log(`ImagePlaceholder dragStart containerId:`, registeredTemplate?.parentId)
    e.dataTransfer.dropEffect = dragAction;
    const el = e.target as Element;
    const rect = el.getBoundingClientRect();
    console.log(`rect:`, rect);
    const sz = {width:rect.width, height:rect.height};
    console.log(`sz:`, sz);
    const props = registeredTemplate?.props as ItemProps;
    const style = props.style as ItemProps;
    const widthStr = style.width as string;
    const width = widthStr.match(/\d{1,4}/);
    const heightStr = style.height as string;
    const height = heightStr.match(/\d{1,4}/);

    dispatch(setSelectedComponentTemplate({...registeredTemplate, size: {width, height}}));
  }

  const clickHandler: MouseEventHandler = (e) => {
    e.preventDefault();
    if (editable) {
      dispatch(setSelectedComponentTemplate(registeredTemplate));
    }
  }

  const initRef = (node: Element) => {
    if (!node) return;
    ref.current = node;
  }

  useEffect(() => {

    dispatch(registerComponentTemplate(registeredTemplate || componentTemplate));

    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }

    observer.current = new ResizeObserver(entries => {
      const size = entries[0].borderBoxSize[0];
      setRect({ width: size.inlineSize, height: size.blockSize });
    })

    observer.current.observe(ref.current);

    if (selectOnMount) {
      dispatch(setSelectedComponentTemplate(registeredTemplate));
    }

  }, [dispatch, registeredTemplate, componentTemplate, selectOnMount]);

  const style = registeredTemplate?.props?.style as ItemProps;

  return (
    <Container
      id={blockId}
      parentId={parentId}
      draggable={editMode === 'dummy'}
      onDragStart={dragStartHandler}
      onClick={clickHandler}
      editable={false}
      className="z-0 flex m-auto bg-gray-300 relative items-center justify-items-center"
      ref={initRef}
      style={{width: width || style?.width , height: height || style?.height }}
    >
      <div className="bg-transparent flex  z-10 relative items-center justify-items-center m-auto">
        <span className='pi pi-image text-center text-4xl text-black z-20 w-full h-full m-auto  bg-gray-300' />
      </div>
      {rect && <svg className={`absolute top-0 bg-gray-300 h-[${rect.height}px] w-[${rect.width}px] [z-index:9]`} viewBox={`0 0 ${rect.width} ${rect.height}`} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1={rect.height} x2={rect.width} y2="0" stroke="black" />
      </svg>}
    </Container>
  )
}

export default ImagePlaceholder;