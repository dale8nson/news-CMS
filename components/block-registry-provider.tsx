import { createContext, ReactNode, useState } from "react";
import { ContainerPlaceholder, ImagePlaceholder,  ArticleGroup1, Container, TextPlaceholder } from ".";

const id = () => crypto.randomUUID();


type BlockProps = {el: (props: any, children: ReactNode ) => ReactNode}

type Registry<T> = {[componentName: string]: T}

export const BlockRegistry = createContext<Registry<BlockProps>>({})


const BlockRegistryProvider = ({children}:{children: ReactNode}) => {
  // const ctx = useContext(BlockRegistry);
  const [ctx, setCtx ] = useState<Registry<BlockProps>>({
    "ContainerPlaceholder": {
      el(props: any, children: ReactNode | null) {
        return <ContainerPlaceholder key={id()} {...{...props, id: props.id || id() }}>{children}</ContainerPlaceholder>
      }
    },
    "ImagePlaceholder":{
      el(props: any, children: ReactNode | null) {
        return <ImagePlaceholder key={id()} {...{...props, id: props.id || id() }}>{children}</ImagePlaceholder>
      }
    },
    "TextPlaceholder":{
      el(props: any, children: ReactNode | null) {
        return <TextPlaceholder key={id()} {...{...props, id: props.id || id() }}>{children}</TextPlaceholder>
      }
    },
    "ArticleGroup1": {
      el(props: any, children: ReactNode | null) {
        return <ArticleGroup1 key={id()} {...{...props, id: props.id || id()}}>{children}</ArticleGroup1>
      }
    },
    "Container": {
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