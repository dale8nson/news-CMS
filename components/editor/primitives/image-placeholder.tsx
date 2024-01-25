'use client';
import type { DragEventHandler } from "react";
import Container from "@/components/primitives/container";
import { useState, useRef, useEffect, useMemo, useContext, startTransition } from "react";
import { flushSync } from "react-dom";
import { ReactNode, Ref, createElement } from "react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { setDraggedId, clearDraggedId } from "@/lib/rootreducer";
import { setSelectedComponentTemplate, registerComponentTemplate, registerComponent } from "@/lib/editor-layout-slice";
import type { ItemProps } from "@/lib/editor-layout-slice";
import { registerBlock } from "@/lib/block-registry";

interface Size {
  width: number,
  height: number
}

function ImagePlaceholder() {

  const componentTemplate = useMemo<ItemProps>(() => ({
    componentName: 'ImagePlaceholder',
    displayName: 'Image Placeholder',
    className:"bg-gray-300 m-auto z-10 h-max w-max absolute top-0 left-0",
    props: {
      style: {
        width: '150px',
        height: '15%',
        marginInline: 'calc(50% - 18px)', 
        marginTop: 'auto'
      }
    }
  }),[])

  const store = useAppStore();

  const dispatch = useAppDispatch();

  // const store = useAppStore();
  // console.log(`store:`, store);

  console.log(`ImagePlaceholder`);
  const ref: any = useRef<any>(null);
  const idRef: any = useMemo(() => crypto.randomUUID(), []);
  const [rect, setRect] = useState<Size>();
  const observer = useRef<ResizeObserver>();

  const dragStartHandler: DragEventHandler = (e) => {
    console.log(`dragStartHandler`);
    // e.preventDefault()
    e.stopPropagation();
    dispatch(setSelectedComponentTemplate(componentTemplate));
  }

  const clickHandler = () => {
    console.log(`clickHandler`);

    dispatch(setSelectedComponentTemplate(componentTemplate));
  }

  const initRef = (node: Element) => {
    ref.current = node;
    setRect(ref.current.getBoundingClientRect());
  }

  useEffect(() => {
    dispatch(registerComponentTemplate(componentTemplate));


    observer.current = new ResizeObserver(entries => {
      const size = entries[0].borderBoxSize[0];
      console.log(`size:`, size);
      setRect({ width: size.inlineSize, height: size.blockSize });

      observer.current?.observe(ref.current.parentNode);

    })
  },[componentTemplate, dispatch])

  return (
    <Container
      containerId={idRef.current}
      draggable
      onDragStart={dragStartHandler}
      onClick={clickHandler}
      className="z-0 relative flex-col h-auto"
      ref={initRef}
      style={componentTemplate.props?.style}
    >
      <div className="w-full h-full ">
        <i className='pi pi-image w-[36px] h-[36.5px] text-4xl text-black z-20' />
      </div>
      {rect && <svg className={`absolute bg-gray-300 m-auto left-0 top-0 h-[${rect.height}px] w-[${rect.width}px] [z-index:5]`} viewBox={`0 0 ${rect.width} ${rect.height}`} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2={rect.width} y2={rect.height} stroke="black" />
      </svg>}
    </Container>
  )
}

export default ImagePlaceholder;