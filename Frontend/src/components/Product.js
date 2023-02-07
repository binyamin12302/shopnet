import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';


const Product = ({ product }) => {
  return (
    <Card className='my-3  p-2 rounded mh-500'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body className='m-4'>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>
              {product.name.length > 37
                ? `${product.name.slice(0, 37)}...`
                : `${product.name}`}
            </strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} ביקורות`}
          />
        </Card.Text>

        <Card.Text as='h4'>
          ₪{product.price.toLocaleString('he-IL')}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product;
