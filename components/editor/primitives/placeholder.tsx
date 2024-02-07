'use client';
import type { DragEventHandler, ForwardedRef, MouseEventHandler, RefObject } from "react";
import Container from "@/components/primitives/container";
import { useState, useRef, useEffect, useMemo, useContext, startTransition } from "react";
import { ReactNode, Ref, createElement, forwardRef } from "react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { setSelectedComponentTemplate, registerComponentTemplate, registerComponent } from "@/lib/editor-layout-slice";
import type { ItemProps, ComponentTemplate } from "@/lib/editor-layout-slice";

interface Size {
  width: number,
  height: number
}

const Placeholder = forwardRef(function Placeholder({ template, defaultTemplateOverride, icon, iconStyle, blockIdRef }: { template: ComponentTemplate, defaultTemplateOverride?:any, icon: string | ReactNode, iconStyle?: ItemProps, blockIdRef?: any }, ref?: any) {

  const blockId = useMemo(() => template.id as string, [template]);
  console.log(`blockId:`, blockId);

  const containerIdRef = useRef<any>(crypto.randomUUID());

  const componentTemplate = useMemo<ComponentTemplate>(() => ({
    ...template,
    // parentId: containerIdRef.current
  }), [template])

  const dispatch = useAppDispatch();

  const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);

  const registeredTemplate = useAppSelector(state => state.editorLayoutSlice?.componentTemplates?.[blockId as string]);

  const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate);

  const containerRef: any = useRef<any>(null);
  

  const [rect, setRect] = useState<Size>();
  const observer = useRef<ResizeObserver>();

  const dragStartHandler: DragEventHandler = (e) => {
    e.stopPropagation();
    console.log(`registeredTemplate:`, registeredTemplate);
    dispatch(setSelectedComponentTemplate(registeredTemplate));
  }

  const clickHandler: MouseEventHandler = (e) => {
    console.log(`clickHandler`);
    e.preventDefault();
    e.stopPropagation();
    console.log(`registeredTemplate:`, registeredTemplate);
    dispatch(setSelectedComponentTemplate(registeredTemplate));
  }

  const initRef = (node: Element) => {
    if (!node) return;
    console.log('initRef');
    containerRef.current = node;
    if (ref) {
      ref.current = node;
    }
  }

  const [override, setOverride] = useState(template.dragAction === 'move' ? {} : defaultTemplateOverride);

  useEffect(() => {

    dispatch(registerComponentTemplate(registeredTemplate || componentTemplate));

    if (containerRef.current) {
      setRect(containerRef.current.getBoundingClientRect());
    }

    observer.current = new ResizeObserver(entries => {
      const size = entries[0].borderBoxSize[0];
      console.log(`size:`, size);
      setRect({ width: size.inlineSize, height: size.blockSize });
    })

    observer.current.observe(containerRef.current);

    if (componentTemplate.selectOnMount) {
      dispatch(setSelectedComponentTemplate(registeredTemplate || componentTemplate));

      // setOverride(registeredTemplate) ;

    }

  }, [dispatch, registeredTemplate, componentTemplate])

  

  return (
    <Container
      id={template.id as string}
      containerId={containerIdRef.current}
      draggable={editMode === 'dummy'}
      onDragStart={dragStartHandler}
      onClick={clickHandler}
      editable={false}
      className="z-0 flex m-auto bg-gray-300 relative items-center justify-items-center"
      ref={initRef}
      style={registeredTemplate?.props?.style as ItemProps}
      {...{...override}}
    >
      <div className="bg-transparent flex  z-10 relative items-center justify-items-center m-auto">
        {typeof icon === 'string' && <span className={`text-center text-black z-20 w-full h-full m-auto  bg-gray-300 ${icon}`} style={iconStyle} />}
        {typeof icon !== 'string' && icon}
      </div>
      {rect && <svg className={`absolute top-0 bg-gray-300 h-[${rect.height}px] w-[${rect.width}px] [z-index:9]`} viewBox={`0 0 ${rect.width} ${rect.height}`} xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1={rect.height} x2={rect.width} y2="0" stroke="black" />
      </svg>}
    </Container>
  )
})

export default Placeholder;