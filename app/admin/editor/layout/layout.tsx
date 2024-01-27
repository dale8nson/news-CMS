'use client';
import { useEffect, useState, createContext } from 'react';
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useAppStore, useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber'
import { Panel } from 'primereact/panel';
import { InputSwitch } from 'primereact/inputswitch';
import { setSelectedComponentTemplate, setPageTemplate, updateComponentTemplate } from '@/lib/editor-layout-slice';
import type { ItemProps } from '@/lib/editor-layout-slice';
import ImagePlaceholder from '@/components/editor/primitives/image-placeholder';
import type { PageTemplate } from "@/lib/editor-layout-slice";

import { Dropdown } from 'primereact/dropdown';



export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  let crumbUrl = ''
  let crumbs: { [key: string]: string | (() => ReactElement) | undefined }[] = []
  crumbs.push(...pathname.split('/').splice(0).map(crumb => {

    console.log(`crumbUrl: ${crumbUrl}`)
    if (!crumb) {
      return {
        template: () => <Link href='/' ><i className='pi pi-home' /></Link>
      }
    }

    crumbUrl += `/${crumb}`;

    return {
      template: () => <Link href={crumbUrl} >{crumb}</Link>
    }
  }))

  console.log(`crumbs:`, crumbs);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [modeChecked, setModeChecked] = useState(false);
  const selectedComponentTemplate = useAppSelector(state => state.editorLayoutSlice.selectedComponentTemplate);
  const pageTemplate = useAppSelector(state => state.editorLayoutSlice.pageTemplate);
  const dispatch = useAppDispatch();

  const start = (
    <>
      <Button className='p-button' icon='pi pi-th-large text-3xl' onClick={() => setLeftSidebarVisible(true)} />
    </>
  )

  const end = (
    <>
      <div className='space-x-4 flex'>
        <div className='flex align-baseline space-x-4' >
          <h1>Dummy</h1>
          <InputSwitch className='m-auto' disabled checked={modeChecked} />
          <h1>Content</h1>
        </div>
        <Button className='p-button' icon='pi pi-sliders-h text-3xl' onClick={() => setRightSidebarVisible(true)} />
      </div>
    </>
  )

  const headingTemplate = (item: any) => {
    return (
      <h1 className='text-white text-3xl'>{item.label}</h1>
    )
  }

  const items = [
    {
      label: 'Layout Editor',
      template: headingTemplate
    }
  ]

  const tw = `flex m-0 duration-300 transition-all my-auto ${leftSidebarVisible && rightSidebarVisible ? 'scale-x-[.6] -translate-x-20' : leftSidebarVisible ? 'translate-x-24 scale-x-90' : rightSidebarVisible ? '-translate-x-40 scale-x-[.7]' : 'w-[100vw]'}`

  console.log(`tw: ${tw}`);

  const units = ['%', 'px', 'vw', 'vh'];

  return (
    <section className='mx-0 w-full h-full' ref={() => setPageLoaded(true)}>
      <Panel pt={{ content: { className: 'flex-col w-full p-0 relative' } }}>
        <Menubar start={start} model={items} end={end} className='w-full' pt={{ menuitem: { className: 'mx-6' } }} />
      </Panel>
      <Sidebar modal={false} dismissable={false} closeIcon='pi pi-arrow-left' pt={{ root: { className: 'w-[12rem] relative' } }} header='Block Gallery' visible={leftSidebarVisible} onHide={() => setLeftSidebarVisible(false)} >
        <Panel className='relative'>
          {pageLoaded && <ImagePlaceholder />}
        </Panel>
      </Sidebar>
      <div className={tw}>
        {children}
        <Sidebar header={selectedComponentTemplate?.displayName} position='right' visible={rightSidebarVisible} onHide={() => setRightSidebarVisible(false)} closeIcon='pi pi-arrow-right' modal={false} dismissable={false} >
          <Panel >
            {selectedComponentTemplate?.props?.style && Object.entries(selectedComponentTemplate?.props?.style as ItemProps).map(([key, value]) => {
              const keywords = key.match(/([a-z]+?(?=[A-Z]))|([A-Z].+)|^[a-z]+$/g);
              console.log(`keywords:`, keywords);
              if (keywords?.length) {
                const firstWord = keywords[0];
                if (firstWord.length > 0) {
                  const firstLetter = firstWord[0].toUpperCase();
                  console.log(`firstLetter:`, firstLetter);
                  keywords[0] = firstWord.replace(/^./, firstLetter);
                }
              }

              const displayName = keywords?.join(' ');
              console.log(`displayName:`, displayName);

              if (typeof value === 'string') {
                let length: string | null = null;
                let unit: string | null = null;
                let isLengthPercentage = false;
                if (key.match(/([wW]idth|[hH]eight|margin|padding)/)) {
                  const lengthPercentage = value.match(/(\d{1,4})|(%|px|vw|vh)/g);
                  if (lengthPercentage?.length) {
                    if (lengthPercentage.length > 1) {
                      length = lengthPercentage?.[0] as string;
                      unit = lengthPercentage?.[1] as string;
                    }
                  } else {
                    length = '0';
                    unit = '%';
                  }
                  isLengthPercentage = true;
                }

                return (

                  // <div  className='flex-col w-full m-4'>

                  <div key={key} className='grid grid-flow-dense items-center' style={{ gridTemplateColumns: `minmax(0, 2fr) minmax(0, 1fr) ${isLengthPercentage ? 'minmax(0, 2fr)' : ''}` }}>
                    <label htmlFor={key} className='m-2'>{displayName}</label>
                    <InputText id={key} value={isLengthPercentage ? length as string : value} onChange={e => {
                      const props = selectedComponentTemplate?.props;
                      const newTemplate = { ...selectedComponentTemplate, props: { ...props, style: { ...props?.style as ItemProps, [key]: isLengthPercentage ? `${e.target.value}${unit}` : e.target.value } } }
                      dispatch(setSelectedComponentTemplate(newTemplate));

                      if (selectedComponentTemplate.id === pageTemplate?.id) {
                        dispatch(setPageTemplate(newTemplate))
                      } else {
                        dispatch(updateComponentTemplate(newTemplate))
                      }

                    }} />

                    {isLengthPercentage && <Dropdown options={units} value={unit} onChange={(e) => {
                      const props = selectedComponentTemplate?.props;
                      const newTemplate = { ...selectedComponentTemplate, props: { ...props, style: { ...props?.style as ItemProps, [key]: `${length}${e.value}` } } };
                      dispatch(setSelectedComponentTemplate(newTemplate));
                      if (selectedComponentTemplate.id === pageTemplate?.id) {
                        dispatch(setPageTemplate(newTemplate))
                      } else {
                        dispatch(updateComponentTemplate(newTemplate));
                      }
                    }}
                    />}
                  </div>
                  // </div>
                )
              }
              if (typeof value === 'number') {
                <>
                  <label htmlFor={key}>{displayName}</label>
                  <InputNumber id={key} className='text-black' />
                </>
              }
            })}
          </Panel>
        </Sidebar>
      </div>
    </section>
  )
}

