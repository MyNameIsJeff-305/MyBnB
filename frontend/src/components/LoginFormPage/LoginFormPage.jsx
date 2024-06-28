// frontend/src/components/LoginForm.js

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import { Navigate } from 'react-router-dom';

import './LoginForm.css';

const LoginFormPage = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  if (sessionUser) return <Navigate to='/' replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setValidationErrors(data.errors);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <ul>
        {validationErrors.errors ? <p>{validationErrors.errors}</p> : ''}
      </ul>
      <div className='login-items'>

        <label id='userName-field'>
          Username or Email
          <input
            type="text"
            className='login-box'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
      </div>
      <div className='login-items'>
        <label id='password-field'>
          Password
          <input
            type="password"
            className='login-box'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <div className='login-items'>
        <button type="submit" id='login-button'>Log In</button>
      </div>
    </form>
  );
}

export default LoginFormPage;