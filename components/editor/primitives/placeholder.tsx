'use client';
import type { DragEventHandler, MouseEventHandler } from "react";
import Container from "@/components/primitives/container";
import { useState, useRef, useEffect, useMemo, useContext, startTransition } from "react";
import { flushSync } from "react-dom";
import { ReactNode, Ref, createElement } from "react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { setDraggedId, clearDraggedId } from "@/lib/rootreducer";
import { setSelectedComponentTemplate, registerComponentTemplate, registerComponent } from "@/lib/editor-layout-slice";
import type { ItemProps, ComponentTemplate } from "@/lib/editor-layout-slice";
import { registerBlock } from "@/lib/block-registry";

interface Size {
  width: number,
  height: number
}

function Placeholder({template, icon }: {template: ComponentTemplate, icon: string }) {

  const blockId = useMemo(() => template.id || crypto.randomUUID(), []);

  const [componentTemplate, setComponentTemplate] = useState<ComponentTemplate>({
    ...template,
    componentName: 'ImagePlaceholder',
    displayName: 'Image Placeholder'
  })

  const dispatch = useAppDispatch();

  const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);

  const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate);

  const registeredTemplate = useAppSelector(state => state.editorLayoutSlice?.componentTemplates?.[blockId]) as ComponentTemplate;

  const ref: any = useRef<any>(null);
  const idRef: any = useMemo(() => crypto.randomUUID(), []);
  const [rect, setRect] = useState<Size>();
  const observer = useRef<ResizeObserver>();

  const dragStartHandler: DragEventHandler = (e) => {
    console.log(`dragStartHandler`);
    // e.preventDefault()
    e.stopPropagation();
    dispatch(setSelectedComponentTemplate(registeredTemplate || componentTemplate));
  }

  const clickHandler: MouseEventHandler = (e) => {
    console.log(`clickHandler`);
    e.preventDefault();
    e.stopPropagation();
    if (registeredTemplate.editable) {
      dispatch(setSelectedComponentTemplate(registeredTemplate));
    }
  }

  const initRef = (node: Element) => {
    if (!node) return;
    console.log('initRef');
    ref.current = node;
  }

  useEffect(() => {
    dispatch(registerComponentTemplate(registeredTemplate || componentTemplate));
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }

    observer.current = new ResizeObserver(entries => {
      const size = entries[0].borderBoxSize[0];
      console.log(`size:`, size);
      setRect({ width: size.inlineSize, height: size.blockSize });
    })

    observer.current.observe(ref.current);

    if (registeredTemplate.selectOnMount) {
      dispatch(setSelectedComponentTemplate(registeredTemplate));
    }

  }, [dispatch, componentTemplate, registeredTemplate])

  return (
    <Container
      id={blockId}
      containerId={idRef.current}
      draggable={editMode === 'dummy'}
      onDragStart={dragStartHandler}
      onClick={clickHandler}
      editable={false}
      className="z-0 flex m-auto bg-gray-300 relative items-center justify-items-center"
      ref={initRef}
      style={template?.props?.style as ItemProps || {}}
    >
      <div className="bg-transparent flex  z-10 relative items-center justify-items-center m-auto">
        <span className={`${icon} text-center text-4xl text-black z-20 w-full h-full m-auto  bg-gray-300`} />
      </div>
      {rect && <svg className={`absolute top-0 bg-gray-300 h-[${rect.height}px] w-[${rect.width}px] [z-index:9]`} viewBox={`0 0 ${rect.width} ${rect.height}`} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1={rect.height} x2={rect.width} y2="0" stroke="black" />
      </svg>}
    </Container>
  )
}

export default Placeholder;