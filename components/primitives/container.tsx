'use client';
import type { ReactNode } from "react"
import { forwardRef } from 'react';

const Container = forwardRef(function Container ({children, row=false, column=false, columnSpan=12, grid=false, gridTemplateColumns='grid-cols-1'}: {children: ReactNode, row?:boolean, column?:boolean, columnSpan:number, grid?:boolean, gridTemplateColumns?:string}, ref:any) {
  return (
    <div className={`${!!row ? 'flex' : ''} ${!!column ? `flex-col` : ''} ${!!columnSpan ? `w-${columnSpan === 12 ? `full` : columnSpan}/12`: ''} ${!!grid ? `grid ${gridTemplateColumns}` : ''}`} ref={ref} >
      {children}
    </div>
  )
});

export default Container;