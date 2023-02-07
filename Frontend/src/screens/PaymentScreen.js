import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckOutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';


const PaymentScreen = () => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();


  if (!shippingAddress) {
    navigate('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }


  return (
    <FormContainer>
      <CheckOutSteps step1 step2 step3 />
      <h1>אמצעי תשלום</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>
            בחר אמצעי תשלום
          </Form.Label>

          <Col>
            <Form.Check type='radio' label='PayPal או כרטיס אשראי'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)} >
            </Form.Check>
          </Col>

        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          המשך
        </Button>

      </Form>
    </FormContainer>
  )
}
export default PaymentScreen;