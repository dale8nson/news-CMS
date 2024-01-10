import Container from "@/components/primitives/container";

const Page = ({params}:{params:{section:string, otherParams:Array<string | number> }}) => {

  let category, year, month, date, slug: string | number | null = null;

  switch(params.otherParams.length) {
    case 1:
      [category] = params.otherParams;
      break;
    case 4:
      [year, month, date, slug] = params.otherParams;
      break;
    default:
      break;
  }

  return (
    <Container columnSpan={12}>
      {!!params.section && <h1 className='text-black'>{params.section}</h1>}
      <br />
      {!!category && <h2 className='text-black'>{category}</h2>}
      <br />
      <h3 className='text-black'>{date && date} {month && month}, {year && year}</h3>
      <br />
    </Container>
  );
}

export default Page;

// export const dynamic = 'force-dynamic';