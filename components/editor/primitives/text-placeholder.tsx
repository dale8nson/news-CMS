import { useMemo, useRef, useEffect, useState } from "react";
import { ComponentTemplate } from "@/lib/editor-layout-slice";
import Placeholder from "./placeholder";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { registerComponent } from "@/lib/editor-layout-slice";
import { stringify } from "querystring";

const TextPlaceholder = ({ id, editable, parentId, selectOnMount, width, height, dragAction }: { id?: string | undefined, editable: boolean, parentId?: string, selectOnMount?: boolean | undefined, width?: string | undefined, height?: string | undefined, dragAction?: 'move' | 'copy' | undefined }) => {

  
  const blockId = useMemo(() => id as string || crypto.randomUUID(),[id]);
  console.log(`blockId:`, blockId);

  const w = Number(width?.match(/\d{1,4}/));
  const h = Number(height?.match(/\d{1,4}/));
  const maxWidth = 15 > (w || 220) ? 15 : w || 220;
  const maxHeight = 15 > (h || 132) ? 15 : h || 132;

  const [rect, setRect] = useState<DOMRect>(new DOMRect(0, 0, maxWidth, maxHeight));

  const registeredTemplate = useAppSelector(state => state.editorLayoutSlice.componentTemplates?.[blockId]);

  console.log(`maxWidth: ${maxWidth}, maxHeight: ${maxHeight}`);
  const componentTemplate = useMemo(() => ({
    id: blockId,
    componentName: 'TextPlaceholder',
    displayName: 'Text Placeholder',
    editable,
    selectOnMount,
    dragAction: dragAction,
    parentId,
    props: {
      style: {
        width:  `220px`,
        height: `132px`
      }
    }
  }),[blockId, dragAction, editable, selectOnMount, parentId])

  let observer = useRef<ResizeObserver>();
  const containerRef = useRef<Element>(null);

  useEffect(() => {
    console.log(`blockId:`, blockId);
    console.log(` TextPlaceholder registeredComponentTemplates?.[${blockId}]:`, registeredTemplate)

    if (containerRef) {
      observer.current = new ResizeObserver(entries => {
        setRect(entries[0].contentRect)
      });

      observer.current.observe(containerRef?.current as Element);
    }
  }, [registeredTemplate, blockId])

  const icon = (
    <div className="p-1 bg-gray-300"  >
      <svg  width='100%' height='100%' className='bg-gray-300' viewBox={`0 0 ${rect.width} ${rect.height}`} >
        {rect && Array(Math.floor(rect.height / ((Math.max(rect.width, rect.height) / Math.min(rect.width, rect.height))))).fill(null).map((_, index) => {
          return (
            <line {...{inert:true}} key={crypto.randomUUID()} stroke="#000" strokeWidth={(5 * (rect.width / rect.height))} x1={2} y1={index * (Math.max(rect.width, rect.height) / Math.min(rect.width, rect.height)) * 8} x2={index % 5 === Math.floor(Math.random() * 5) ? rect.width - ((8 / 35) * rect.width) : rect.width - 4} y2={index * (Math.max(rect.width, rect.height) / Math.min(rect.width, rect.height)) * 8} />
          )
        })}
      </svg>
    </div>
  )
  return ( 
      <Placeholder template={componentTemplate} defaultTemplateOverride={{style:{width:`${maxWidth}px`, height:`${maxHeight}px`}}} icon={icon} ref={containerRef} />
  )
}

export default TextPlaceholder;