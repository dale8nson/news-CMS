'use server'; 
import ImagePlaceholder from "@/components/editor/primitives/image-placeholder"
import { ReactElement, createElement } from "react";
import type { FunctionComponentElement } from "react";
// import type { ItemProps, SelectedItemProps } from "./editor-layout-slice";
import { stringify } from "querystring";

const BlockRegistry:() => Promise<any> = async () => ({
  'ImagePlaceholder':JSON.stringify(ImagePlaceholder)
})

export default BlockRegistry;

export const getBlockUrl = async (component: string) => {
  const url = await BlockRegistry().then(reg => reg[component as string]);

  
  return url;

}

// : {[component: string]: () => ReactElement}