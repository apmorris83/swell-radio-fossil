import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { login } from './authSlice.js';

const Auth = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const onSubmit = () => {
    let { from } = location.state || { from: { pathname: '/' } };
    dispatch(login());
    history.replace(from);
  };
  const onChange = (e, { name, value }) => setForm({ ...form, [name]: value });
  return (
    <Form onSubmit={onSubmit}>
      <Form.Input
        name='email'
        label='Email'
        value={form.email}
        onChange={onChange}
      />
      <Form.Input
        name='password'
        label='Password'
        value={form.password}
        onChange={onChange}
      />
      <Form.Field>
        <Button type='submit' fluid positive content='Login' />
      </Form.Field>
    </Form>
  );
};

export default Auth;
