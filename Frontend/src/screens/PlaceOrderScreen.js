import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image, Card,
  ListGroupItem
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckOutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'



const PlaceOrderScreen = () => {
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart);
  const navigate = useNavigate();


  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  // Calculate prices
  cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)).toFixed(2)


  const orderCreate = useSelector(state => state.orderCreate);
  const { order, success, error } = orderCreate;


  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`)
      dispatch({ type: USER_DETAILS_RESET })
      dispatch({ type: ORDER_CREATE_RESET })
    }

    // eslint-disable-next-line
  }, [navigate, success]);


  const placeOrderHandler = () => {
    dispatch(createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    }))
  }

  return (
    <>
      <CheckOutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>כתובת למשלוח</h2>
              <p>
                <strong>כתובת:</strong> {" "}
                {cart.shippingAddress.address},
                {cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </p>
            </ListGroupItem>


            <ListGroupItem>
              <h2>אמצעי תשלום</h2>
              <strong>סוג: </strong>
              {cart.paymentMethod}
            </ListGroupItem>



            <ListGroupItem>
              <h2>מוצרים בהזמנה</h2>
              {cart.cartItems.length === 0 ? <Message>Your cart is empty</Message> :
                (
                  <ListGroup variant='flush'>
                    {cart.cartItems.map((item, index) => (
                      <ListGroupItem key={index}>
                        <Row>
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>

                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name.length > 27
                                ? `${item.name.slice(0, 27)}...`
                                : `${item.name}`}
                            </Link>
                          </Col>

                          <Col
                            md={4}
                            className='my-auto mt-4-sm'
                            style={{ fontSize: item.price > 1000 && '0.85rem' }}
                          >
                            {item.qty} * {item.price.toLocaleString('he-IL')} ₪ ={' '}
                            {(item.qty * item.price).toLocaleString('he-IL')} ₪
                          </Col>

                        </Row>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                )}
            </ListGroupItem>

          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>סיכום ההזמנה</h2>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>סה"כ מוצרים:</Col>
                  <Col>₪{cart.itemsPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>דמי משלוח:</Col>
                  <Col>₪{cart.shippingPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>מע"מ</Col>
                  <Col>₪{cart.taxPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>סה"כ לתשלום:</Col>
                  <Col>₪{cart.totalPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroupItem>
              <ListGroupItem>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={!cart.cartItems.length}
                  onClick={placeOrderHandler}>ביצוע הזמנה</Button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>

      </Row>
    </>
  )
}

export default PlaceOrderScreen;