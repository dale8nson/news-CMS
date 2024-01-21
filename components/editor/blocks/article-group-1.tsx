'use client';
import Container from "../../primitives/container";
import ContainerPlaceholder from "../primitives/container-placeholder";
import { useState } from "react";
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';

const ArticleGroup1 = () => {



  return (
    <Container row columnSpan={4} className="border-dashed border-1" mode='editor' >
      <Container column columnSpan={4} className='h-full border-dashed border-1' >
        <ContainerPlaceholder />
      </Container>
      <Container column columnSpan={8} className="h-full border-dashed border-1" >
        <ContainerPlaceholder />
      </Container>
      <Container column columnSpan={4} className="h-full border-dashed border-1" >
        <ContainerPlaceholder />
      </Container>
    </Container>

  );
}

export default ArticleGroup1;