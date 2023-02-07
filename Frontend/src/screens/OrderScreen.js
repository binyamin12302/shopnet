import { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, ListGroupItem, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';


const OrderScreen = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()
  const orderId = params.id

  const [sdkReady, setSdkReady] = useState(false)


  const orderDetails = useSelector(state => state.orderDetails);
  const { order, loading, error } = orderDetails;


  const orderPay = useSelector(state => state.orderPay);
  const { success: successPay, loading: loadingPay } = orderPay;


  const orderDeliver = useSelector(state => state.orderDeliver);
  const { success: successDeliver, loading: loadingDeliver } = orderDeliver;


  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {

    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {

    if (!userInfo) {
      navigate('/login')
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }


    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }


  }, [dispatch, orderId, order, successPay, successDeliver, navigate, userInfo]);


  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }


  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
    <>
      <h1> הזמנה: {order._id} </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>פרטי לקוח</h2>
              <p>
                <strong>שם: </strong> {order.user.name}
              </p>
              <p>
                <strong>אימייל: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>כתובת:</strong>
                {order.shippingAddress.address},
                {order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? <Message variant='success'>נשלח ב- {order.deliveredAt}</Message> :
                <Message variant='danger'>טרם נשלח</Message>}
            </ListGroupItem>


            <ListGroupItem>
              <h2>אמצעי תשלום</h2>
              <p>
                <strong>סוג: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? <Message variant='success'>שולם ב- {order.paidAt}</Message> :
                <Message variant='danger'>טרם שולם</Message>}
            </ListGroupItem>



            <ListGroupItem>
              <h2>מוצרים בהזמנה</h2>
              {order.orderItems.length === 0 ? <Message>Order is empty</Message> :
                (
                  <ListGroup variant='flush'>
                    {order.orderItems.map((item, index) => (
                      <ListGroupItem key={index}>
                        <Row>
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>

                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>

                          <Col md={4}>
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

        <Col md={4} >
          <Card >
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>סיכום הזמנה</h2>
                <Message variant='warning' >
                  <i class="fa-solid fa-circle-exclamation"> האתר הינו אתר דמו והוא אינו חנות אמיתית </i>
                  <br />
                  ניתן לבצע תשלום מזוייף באמצעות הפרטים למטה
                  <br />

                  דואל-sb-qgn0b24930732@personal.example.com

                  סיסמה- :6Y8Gs/*

                </Message>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>פריטים</Col>
                  <Col>₪{Number(order.itemsPrice).toLocaleString('he-IL')}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>משלוח</Col>
                  <Col>₪{order.shippingPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>מע"מ</Col>
                  <Col>₪{order.taxPrice.toLocaleString('he-IL')}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>סכום סופי</Col>
                  <Col>₪{order.totalPrice.toLocaleString('he-IL')}</Col>
                </Row>
              </ListGroupItem>
              {!order.isPaid && (
                <ListGroupItem>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroupItem>
              )}

              {loadingDeliver && <Loader />}

              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered &&
                (
                  <ListGroup.Item>
                    <Button type='button' className='btn btn-block' onClick={deliverHandler}
                    >
                      אישור שליחת ההזמנה
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>

      </Row>
    </>
}

export default OrderScreen;