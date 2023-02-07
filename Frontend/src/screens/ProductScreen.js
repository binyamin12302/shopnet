import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  ListGroupItem,
  FormGroup,
  FormLabel,
  FormControl
} from 'react-bootstrap';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProductDetails, createProductReview } from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import Meta from '../components/Meta';


const ProductScreen = () => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector(state => state.productReviewCreate)
  const { success: successProductReview, error: errorProductReview } = productReviewCreate

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (successProductReview) {
      alert('התגובה נרשמה בהצלחה!')
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductDetails(params.id))
  }, [dispatch, params, successProductReview]);


  const addToCartHandler = () => {
    navigate(`/cart/${params.id}?qty=${qty}`)
  }


  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(params.id, {
      rating,
      comment
    }))
  }

  return (
    <>
      <Link className='btn btn-light my-3 border border-dark' to='/'>
        חזרה
      </Link>
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6} className='product-page-section'>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3} className='product-page-section'>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} ביקורות`} />
                </ListGroup.Item>

                <ListGroup.Item>
                  <span className='text-dark h6'>מחיר:</span> ₪{Number(product.price).toLocaleString('he-IL')}
                </ListGroup.Item>

                <ListGroup.Item>
                  <span className='text-dark h6'>תיאור:</span> {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3} className='product-page-section'>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        מחיר:
                      </Col>
                      <Col>
                        <strong>₪{Number(product.price).toLocaleString('he-IL')}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        סטטוס:
                      </Col>
                      <Col>
                        {product.countInStock > 0 ? 'קיים במלאי' : 'אזל המלאי'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col className='product-page-section'>כמות</Col >
                        <Col className='product-page-section'>
                          <Form.Control as='select' value={qty} onChange={(e) =>
                            setQty(e.target.value)}>

                            {[...Array(product.countInStock).keys()].map(x => (
                              <option key={x + 1} value={x + 1}>{x + 1}</option>
                            ))}

                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}>
                      הוסף לעגלה
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>ביקורות</h2>
              {product.reviews.length === 0 && <Message>אין ביקורות למוצר זה</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map(review => (
                  <ListGroupItem key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroupItem>
                ))}
                <ListGroupItem>
                  <h2>כתיבת ביקורת לקוח</h2>
                  {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <FormGroup controlId='rating'>
                        <FormLabel>דירוג</FormLabel>
                        <FormControl as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                          <option value=''>ציון...</option>
                          <option value='1'>1 - גרוע</option>
                          <option value='2'>2 - סביר</option>
                          <option value='3'>3 - טוב</option>
                          <option value='4'>4 - טוב מאוד</option>
                          <option value='5'>5 - מצויין</option>
                        </FormControl>
                      </FormGroup>
                      <FormGroup controlId='comment'>
                        <FormLabel>
                          תגובה
                        </FormLabel>
                        <FormControl as='textarea' row='3' value={comment}
                          onChange={(e) => setComment(e.target.value)}>
                        </FormControl>
                        <Button type='submit' variant='primary' className='mt-2'>
                          הוספה
                        </Button>
                      </FormGroup>
                    </Form>
                  ) : <Message> <Link to='/login'>
                    התחבר</Link> כדי להוסיף ביקורת</Message>}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      }

    </>
  )
}

export default ProductScreen;
