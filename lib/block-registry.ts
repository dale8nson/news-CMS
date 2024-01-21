'use server'; 
import ImagePlaceholder from "@/components/editor/primitives/image-placeholder"
import { ReactElement, createElement } from "react";
import type { FunctionComponentElement } from "react";
import type { ItemProps, ComponentTemplate } from "./editor-layout-slice";
import { stringify } from "querystring";

const BlockRegistry:() => Promise<any> = async () => ({
  'ImagePlaceholder':"@/components/editor/primitives/image-placeholder.tsx"
})

export default BlockRegistry;

export const getBlockUrl = async (component: string) => {
  const url = await BlockRegistry().then(reg => reg[component as string]);

  
  return url;

}

// : {[component: string]: () => ReactElement}