import React, { useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import { useDispatch, connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { authenticateUser } from './authSlice.js';

const Auth = ({ error }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const onSubmit = () => {
    let { from } = location.state || { from: { pathname: '/spends' } };
    dispatch(authenticateUser(form.email, form.password)).then(() => {
      history.replace(from);
    });
  };
  const onChange = (e, { name, value }) => setForm({ ...form, [name]: value });
  return (
    <Form onSubmit={onSubmit} error={!!error}>
      <Form.Input name='email' label='Email' type='email' value={form.email} onChange={onChange} />
      <Form.Input name='password' label='Password' type='password' value={form.password} onChange={onChange} />
      <Message error header='Error' content={error} />
      <Form.Field>
        <Button type='submit' fluid positive content='Login' />
      </Form.Field>
    </Form>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.auth,
  };
};

export default connect(mapStateToProps)(Auth);
