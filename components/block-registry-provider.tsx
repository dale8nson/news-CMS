import { createContext, ReactNode, useState } from "react";
import { ContainerPlaceholder, ImagePlaceholder, ArticleGroup1, Container } from ".";

const id = () => crypto.randomUUID();


type BlockProps = {source: string, el: (props: any, children: ReactNode ) => ReactNode}

type Registry<T> = {[componentName: string]: T}

export const BlockRegistry = createContext<Registry<BlockProps>>({})


const BlockRegistryProvider = ({children}:{children: ReactNode}) => {
  // const ctx = useContext(BlockRegistry);
  const [ctx, setCtx ] = useState<Registry<BlockProps>>({
    "ContainerPlaceholder": {
      source: `(${ContainerPlaceholder})`,
      el(props: any, children: ReactNode | null) {
        return <ContainerPlaceholder key={id()} {...{...props, id: props.id || id() }}>{children}</ContainerPlaceholder>
      }
    },
    "ImagePlaceholder":{
      source: `(${ImagePlaceholder})`,
      el(props: any, children: ReactNode | null) {
        return <ImagePlaceholder key={id()} {...{...props, id: props.id || id() }}>{children}</ImagePlaceholder>
      }
    },
    "ArticleGroup1": {
      source: `(${ArticleGroup1.toString()})`,
      el(props: any, children: ReactNode | null) {
        return <ArticleGroup1 key={id()} {...{...props, id: props.id || id()}}>{children}</ArticleGroup1>
      }
    },
    "Container": {
      source: `(${Container.toString()})`,
      el(props: any, children: ReactNode | null) {
        return <Container key={id()} {...{...props, id: props.id || id()}}>{children}</Container>
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