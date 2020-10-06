import React from 'react';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Message } from 'semantic-ui-react';

import { clearNotify } from './globalSlice';

const Notify = ({ type, message, active }) => {
  const dispatch = useDispatch();
  const success = type === 'success';

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearNotify()), 4000);
      return () => clearTimeout(timer);
    }
  }, [type]);

  return active ? <Message positive={success} negative={!success} onDismiss={() => dispatch(clearNotify())} content={message} /> : null;
};

const mapStateToProps = (state) => {
  return { ...state.global.notify };
};

export default connect(mapStateToProps)(Notify);
