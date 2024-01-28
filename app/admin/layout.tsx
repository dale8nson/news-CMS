'use client';
import type { ReactNode, ReactElement } from "react";
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { Panel } from 'primereact/panel';
import { BreadCrumb } from "primereact/breadcrumb";

const Layout = ({ children }: { children: ReactNode }) => {

  const pathname = usePathname();
  console.log(`pathname:`, pathname);
  let crumbUrl = '/admin';
  let crumbs: { [key: string]: string | (() => ReactElement) | undefined }[] = [];
  crumbs.push(...pathname.split('/').splice(2).map(crumb => {

    const href = crumbUrl + `/${crumb}`;
    crumbUrl += `/${crumb}`;

    return {
      template: () => {

        return (
          <Link href={href} >{crumb}</Link>
        )
      }
    }
  }))

  const home = {
    template: () => <Link href='/' ><i className='pi pi-home' /></Link>
  }

  return (
    <section>
      <BreadCrumb home={home} model={crumbs} className='bg-[--highlight-bg] z-[100]' pt={{ root: { className: 'w-full mx-0' } }} />
      <div>
        {children}
      </div>
    </section>
  )
}

export default Layout;

// export const dynamic = 'force-dynamic';