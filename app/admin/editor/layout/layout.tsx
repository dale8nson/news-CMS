'use client';
import { useEffect, useState } from 'react';
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
import { BreadCrumb } from 'primereact/breadcrumb';
import { setSelectedComponentTemplate, setPageTemplate } from '@/lib/editor-layout-slice';
import type { ItemProps } from '@/lib/editor-layout-slice';
import ImagePlaceholder from '@/components/editor/primitives/image-placeholder';

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
      <Button className='p-button' icon='pi pi-sliders-h text-3xl' onClick={() => setRightSidebarVisible(true)} />
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
    <section className='mx-0 w-full h-full'>
      <Panel pt={{ content: { className: 'flex-col w-full p-0 relative' } }}>
        {/* <BreadCrumb model={crumbs} className='bg-[--highlight-bg]' pt={{root:{className:'w-full mx-0'}}} /> */}
        <Menubar start={start} model={items} end={end} className='w-full' pt={{ menuitem: { className: 'mx-6' } }} />
      </Panel>
      <Sidebar modal={false} dismissable={false} closeIcon='pi pi-arrow-left' pt={{ root: { className: 'w-[12rem] relative' } }} header='Block Gallery' visible={leftSidebarVisible} onHide={() => setLeftSidebarVisible(false)} >
        <Panel className='relative'>
          <ImagePlaceholder />
        </Panel>
      </Sidebar>
      <div className={tw}>
        {children}
        <Sidebar header={selectedComponentTemplate?.displayName} position='right' visible={rightSidebarVisible} onHide={() => setRightSidebarVisible(false)} closeIcon='pi pi-arrow-right' modal={false} dismissable={false} >
          <Panel >
            {selectedComponentTemplate && Object.entries(selectedComponentTemplate?.props as ItemProps).map(([key, value]) => {
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
                  const lengthPercentage = value.match(/(\d{1,3})|(%|px|vw|vh)/g);
                  length = lengthPercentage?.[0] as string;
                  unit = lengthPercentage?.[1] as string;
                  isLengthPercentage = true;
                }

                return (

                  // <div  className='flex-col w-full m-4'>

                  <div key={key} className='grid grid-flow-dense items-center' style={{gridTemplateColumns:'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)'}}>
                    <label htmlFor={key} className='m-2'>{displayName}</label>
                    <InputText id={key} value={isLengthPercentage ? length as string : value} className='text-white border-solid text-center border-white border-b-2 p-2' onChange={(e) => { 
                      const props = pageTemplate?.props;
                      dispatch(setSelectedComponentTemplate({...pageTemplate, props: {...props, [key]: `${e.target.value}${unit}`}}))}} />

                    {isLengthPercentage && <Dropdown options={units} value={unit} onChange={(e) => { 
                      const props = pageTemplate?.props;
                      dispatch(setSelectedComponentTemplate({...pageTemplate, props: {...props, [key]: `${length}${e.value}`}}));
                      // dispatch(setSelectedComponentTemplate(pageTemplate));
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

