'use client';
import type { ReactNode } from "react"
import { forwardRef } from 'react';

const EditorContainer = forwardRef(
  function EditorContainer(
    {
      children,
      row = false,
      column = false,
      columnSpan = 12,
      grid = false,
      gridTemplateColumns = 'grid-cols-1',
      className = '', draggable = false }
      : {
        children?: ReactNode,
        row?: boolean,
        column?: boolean,
        columnSpan: number,
        grid?: boolean,
        gridTemplateColumns?: string,
        className?: string,
        draggable?: boolean
      },
    ref: any
    ) {
    return (
      <div className={`${!!row ? 'flex' : ''} ${!!column ? `flex-col` : ''} ${!!columnSpan ? `w-${columnSpan === 12 ? `full` : columnSpan}/12` : ''} ${!!grid ? `grid ${gridTemplateColumns}` : ''} ${className}`}
        ref={ref} >
        {children}
      </div>
    )
  });

export default EditorContainer;