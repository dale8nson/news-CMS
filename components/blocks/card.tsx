import Container from "../primitives/container";

const Card = ({ image = false, imageSrc, imagePosition, topic, headline, byline, lede, date = new Date(), columns = 1 }: { image?: boolean, imageSrc?: string | URL, imagePosition?: string, topic?: string, headline: string, byline: string, lede?: string, date?: Date, columns?: number }) => {
  return (
    <Container column={imagePosition === 'top'} row={imagePosition === 'side'} columnSpan={columns} >
      <Container column columnSpan={1}>
        {!!topic && <h2>{topic}</h2>}
        <h2>{headline}</h2>
        <h3>{lede}</h3>
      </Container>
    </Container>
  )
}

export default Card;