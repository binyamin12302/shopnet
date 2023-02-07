import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


const CheckOutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/login'>
            <Nav.Link>התחבר</Nav.Link>
          </LinkContainer>
        ) : <Nav.Link disabled>התחבר</Nav.Link>}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link>כתובת למשלוח</Nav.Link>
          </LinkContainer>
        ) : <Nav.Link disabled>כתובת למשלוח</Nav.Link>}
      </Nav.Item>



      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link>תשלום</Nav.Link>
          </LinkContainer>
        ) : <Nav.Link disabled>תשלום</Nav.Link>}
      </Nav.Item>




      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link>ביצוע הזמנה</Nav.Link>
          </LinkContainer>
        ) : <Nav.Link disabled>ביצוע הזמנה</Nav.Link>}
      </Nav.Item>
    </Nav>
  )
}
export default CheckOutSteps;