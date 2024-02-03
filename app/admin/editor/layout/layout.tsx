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
import { Divider } from 'primereact/divider';
import { setSelectedComponentTemplate, setPageTemplate, updateComponentTemplate, setEditMode } from '@/lib/editor-layout-slice';
import type { ItemProps } from '@/lib/editor-layout-slice';
import ImagePlaceholder from '@/components/editor/primitives/image-placeholder';
import TextPlaceholder from '@/components/editor/primitives/text-placeholder';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
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
  const editMode = useAppSelector(state => state.editorLayoutSlice.editMode);
  const dispatch = useAppDispatch();

  const selectOptions = [{ label: 'Dummy', value: 'dummy' }, { label: 'Content', value: 'content' }, { label: 'Preview', value: 'preview' }]

  const start = (
    <>
      <Button className='p-button' icon='pi pi-th-large text-3xl' onClick={() => setLeftSidebarVisible(true)} />
    </>
  )

  const end = (
    <>
      <div className='space-x-4 flex'>
        <div className='flex align-baseline space-x-4' >
          <SelectButton value={editMode} allowEmpty={false} options={selectOptions} optionLabel='label' onChange={e => dispatch(setEditMode(e.value))} />
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

  const tw = `flex m-0 duration-300 transition-all my-auto ${leftSidebarVisible && rightSidebarVisible ? 'scale-[.6] -translate-x-16' : leftSidebarVisible ? 'translate-x-24 scale-90' : rightSidebarVisible ? '-translate-x-36 scale-[.7]' : 'w-[100vw]'}`

  console.log(`tw: ${tw}`);

  const units = ['%', 'px', 'vw', 'vh'];

  return (
    <section className='mx-0 w-full h-full' ref={() => setPageLoaded(true)}>
      <Panel pt={{ content: { className: 'flex-col w-full p-0 relative' } }}>
        <Menubar start={start} model={items} end={end} className='w-full' pt={{ root: { className: 'fixed z-40 top-12 left-0' }, menuitem: { className: 'mx-6' } }} />
      </Panel>
      <Sidebar modal={false} dismissable={false} closeIcon='pi pi-arrow-left' pt={{ root: { className: 'w-[12rem] relative' } }} header='Block Gallery' visible={leftSidebarVisible} onHide={() => setLeftSidebarVisible(false)} >
        <Panel className='relative space-y-4'>
          {pageLoaded && (
            <>
              <h1 className='m-4 text-center'>Layout</h1>
              <Divider pt={{ root: { className: 'border-white border-solid border-[.01px]' } }} />
              <h1 className='m-4 text-center'>Content</h1>
              <div className='!grid auto-cols-auto grid-flow-col gap-x-2'>
              <ImagePlaceholder editable={false} width='40px' height='40px' dragAction='copy' />
              <TextPlaceholder editable={false} width='40px' height='40px' dragAction='copy' selectOnMount={true} />
              </div>
            </>
          )}
        </Panel>
      </Sidebar>
      <div className={tw}>
        {children}
      </div>
      <Sidebar header={selectedComponentTemplate?.displayName} position='right' visible={rightSidebarVisible} onHide={() => setRightSidebarVisible(false)} closeIcon='pi pi-arrow-right' modal={false} dismissable={false} >
        <Panel >
          {selectedComponentTemplate?.editable && selectedComponentTemplate?.props?.style && Object.entries(selectedComponentTemplate?.props?.style as ItemProps).map(([key, value]) => {
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

                <div key={key} className='grid grid-flow-dense items-center' style={{ gridTemplateColumns: `minmax(0, 2fr) minmax(0, 1fr) ${isLengthPercentage ? 'minmax(0, 2fr)' : ''}` }}>
                  <label htmlFor={key} className='m-2'>{displayName}</label>
                  <InputText id={key} disabled={!selectedComponentTemplate.editable} value={isLengthPercentage ? length as string : value || ''} onChange={e => {
                    const props = selectedComponentTemplate?.props;
                    const newTemplate = { ...selectedComponentTemplate, selectOnMount: false, props: { ...props, style: { ...props?.style as ItemProps, [key]: isLengthPercentage ? `${e.target.value}${unit}` : e.target.value } } }
                    console.log(`newTemplate:`, newTemplate);

                    if (selectedComponentTemplate.id === pageTemplate?.id) {
                      dispatch(setPageTemplate(newTemplate))
                    } else {
                      dispatch(updateComponentTemplate(newTemplate))
                    }

                    dispatch(setSelectedComponentTemplate(newTemplate));

                  }} />

                  {isLengthPercentage && <Dropdown disabled={!selectedComponentTemplate.editable} options={units} value={unit || ''} onChange={(e) => {
                    const props = selectedComponentTemplate?.props;
                    const newTemplate = { ...selectedComponentTemplate, editable: true, selectOnMount: false, props: { ...props, style: { ...props?.style as ItemProps, [key]: `${length}${e.value}` } } };

                    dispatch(setSelectedComponentTemplate(newTemplate));

                    if (selectedComponentTemplate.id === pageTemplate?.id) {
                      dispatch(setPageTemplate(newTemplate))
                    } else {

                      dispatch(updateComponentTemplate(newTemplate));
                    }
                  }}
                  />}
                </div>
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

    </section>
  )
}

