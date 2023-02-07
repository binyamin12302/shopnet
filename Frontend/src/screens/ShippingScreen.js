import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../actions/cartActions';
import CheckOutSteps from '../components/CheckoutSteps';


const ShippingScreen = () => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);


  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    navigate('/payment')
  }

  const navigate = useNavigate();

  return (
    <FormContainer>
      <CheckOutSteps step1 step2 />
      
      <h1>כתובת למשלוח</h1>
      <Form onSubmit={submitHandler}>

        <Form.Group controlId='address'>
          <Form.Label> רחוב, מספר בית ודירה</Form.Label>
          <Form.Control
            type='text'
            placeholder='רחוב, מספר בית ודירה'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label> עיר</Form.Label>
          <Form.Control
            type='text'
            placeholder='עיר'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}>
          </Form.Control>
        </Form.Group>



        <Form.Group controlId='postalCode'>
          <Form.Label>מיקוד</Form.Label>
          <Form.Control
            type='text'
            placeholder='מיקוד'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}>
          </Form.Control>
        </Form.Group>


        <Form.Group controlId='country'>
          <Form.Label>מדינה</Form.Label>
          <Form.Control
            type='text'
            placeholder='מדינה'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Button className='mt-2' type='submit' variant='primary'>
          המשך
        </Button>

      </Form>
    </FormContainer>
  )
}
export default ShippingScreen;