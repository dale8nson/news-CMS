import { createContext, ReactNode, useContext, useState } from "react";
import { ContainerPlaceholder, ImagePlaceholder, ArticleGroup1, Container } from ".";
import { createElement } from "react";

const id = () => crypto.randomUUID();


type BlockProps = {id: string, source: string, el: (props: any, children: ReactNode ) => ReactNode}

type Registry<T> = {[componentName: string]: T}

export const BlockRegistry = createContext<Registry<BlockProps>>({})


const BlockRegistryProvider = ({children}:{children: ReactNode}) => {
  // const ctx = useContext(BlockRegistry);
  const [ctx, setCtx ] = useState<Registry<BlockProps>>({
    "ContainerPlaceholder": {
      id: id(), 
      source: `(${ContainerPlaceholder})`,
      el(props: any, children: ReactNode | null) {
        return <ContainerPlaceholder key={id()} {...{...props, }}>{children}</ContainerPlaceholder>
      }
    },
    "ImagePlaceholder":{
      id: id(),
      source: `(${ImagePlaceholder})`,
      el(props: any, children: ReactNode | null) {
        return <ImagePlaceholder key={id()} {...{...props, }}>{children}</ImagePlaceholder>
      }
    },
    "ArticleGroup1": {
      id: id(),
      source: `(${ArticleGroup1.toString()})`,
      el(props: any, children: ReactNode | null) {
        return <ArticleGroup1 key={id()} {...{...props}}>{children}</ArticleGroup1>
      }
    },
    "Container": {
      id: id(),
      source: `(${Container.toString()})`,
      el(props: any, children: ReactNode | null) {
        return <Container key={id()} {...{...props}}>{children}</Container>
      }
    }
  });

  return (
  <BlockRegistry.Provider value={ctx}>
    { children }
  </BlockRegistry.Provider>
  )
}

export default BlockRegistryProvider;