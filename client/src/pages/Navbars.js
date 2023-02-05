import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function Navbars() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const logOut = () => {
    removeCookie('jwt');
    navigate('/login');
  };
  return (
    <>
      <Navbar bg="dark" variant="dark" className="px-5">
        <div
          className="d-flex align-items-center justify-content-between px-4"
          style={{ width: '100%' }}
        >
          <img style={{ width: '90px' }} src="/assets/images/azure.png" />
          <Navbar.Brand
            className="ms-2"
            style={{ fontSize: '36px' }}
            href="#home"
          >
            AZURE CINEMA
          </Navbar.Brand>
          <Nav className="ml-auto" style={{ fontSize: '20px' }}>
            <Nav.Link>Profile</Nav.Link>
            <Nav.Link onClick={logOut}>Logout</Nav.Link>
          </Nav>
        </div>
      </Navbar>
    </>
  );
}

export default Navbars;
