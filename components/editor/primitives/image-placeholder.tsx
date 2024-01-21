'use client';
import type { DragEventHandler } from "react";
import Container from "@/components/primitives/container";
import { srvLog } from "@/actions";
import { useState, useRef, useEffect, useMemo } from "react";
import { ReactNode, Ref, createElement } from "react";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { setDraggedId, clearDraggedId } from "@/lib/rootreducer";
import { setSelectedElementTemplate } from "@/lib/editor-layout-slice";
import type { ItemProps } from "@/lib/editor-layout-slice";

interface Size {
  width: number,
  height: number
}

const ImagePlaceholder = () => {

  const props: ItemProps = {
    component: 'ImagePlaceholder',
    name: 'Image Placeholder',
    props: {

    }
  }
  console.log(`ImagePlaceHolder`);
  const ref: any = useRef<any>(null);
  const idRef: any = useMemo(() => crypto.randomUUID(), []);
  const [rect, setRect] = useState<Size>();
  const dispatch = useAppDispatch();
  const observer = useRef<ResizeObserver>();
  let imgPh = null;

  const dragStartHandler: DragEventHandler = (e) => {
    console.log(`dragStartHandler`);
    // e.preventDefault()
    dispatch(setSelectedElementTemplate(props));
    // console.log(`store.getState():`, store.getState());
    // imgPh = createElement("ImagePlaceHolder",null,null);
    // console.log(`imgPh:`, imgPh)
    // console.log(`JSON.stringify(ImagePlaceHolder):`, JSON.stringify(imgPh));
    // e.dataTransfer.setData('application/json', JSON.stringify(ImagePlaceHolder))

  }

  const clickHandler = () => {
    console.log(`clickHandler`);

    dispatch(setSelectedElementTemplate(props));
  }

  useEffect(() => {
    if (!!ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }

    observer.current = new ResizeObserver(entries => {
      const size = entries[0].borderBoxSize[0];
      console.log(`size:`, size);
      setRect({ width: size.inlineSize, height: size.blockSize });
    });

    observer.current.observe(ref.current.parentNode)

  }, [])

  return (
    <Container
      containerId={idRef.current}
      draggable
      onDragStart={dragStartHandler}
      onClick={clickHandler}
      className="z-0 relative flex-col w-full h-auto !min-h-[36.5px]"
      ref={ref}
      style={{height:'max-content'}}
    >
      <div className="bg-gray-300 m-auto z-10 h-max w-max absolute top-0 left-0" style={{marginInline:'calc(50% - 18px)', marginTop:'auto'}}>
        <i className='pi pi-image w-[36px] h-[36.5px] text-4xl text-black z-20' />
      </div>
      {rect && <svg className={`absolute bg-gray-300 m-auto left-0 top-0 h-[${rect.height}px] w-[${rect.width}px] [z-index:5]`} viewBox={`0 0 ${rect.width} ${rect.height}`} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2={rect.width} y2={rect.height} stroke="black" />
      </svg>}
    </Container>
  )
}

export default ImagePlaceholder;