import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies, cookie } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import '../auth.css';
import Cookies from 'universal-cookie';

function Login() {
  const [cookies] = useCookies([]);
  const cookies_ = new Cookies();
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      navigate('/');
    }
  }, [cookies, navigate]);

  const [values, setValues] = useState({ email: '', password: '' });
  const generateError = (error) =>
    toast.error(error, {
      position: 'bottom-right',
    });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        'https://backendapicinema.azurewebsites.net/api/v1/auth/login',
        {
          ...values,
        },
        { withCredentials: true }
      );
      console.log(data);
      if (data) {
        cookies_.set('jwt=' + data.token, true, { path: '/' });
        if (data.status === 'fail') {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          navigate('/');
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="authbody">
        <div className="container card">
          <div className="">
            <h2>Login to your Account</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              </div>
              <button type="submit">Submit</button>
              <span>
                Don't have an account ?<Link to="/register"> Register </Link>
              </span>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
