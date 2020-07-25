import React, { useEffect } from 'react';
import { Modal, Form, Label, Button } from 'semantic-ui-react';
import { useDispatch, connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { loadAdd, toggleShowAdd, selectMonth, selectingSection, selectRow, updateAmount, updateNote, addSpend } from './globalSlice.js';

const Add = ({ showAdd, authenticated, form, months, sections, rows, add }) => {
  const { selected } = add;
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(loadAdd(selected));
  }, [selected]);

  return authenticated ? (
    <div style={{ position: 'fixed', width: '100%', left: 0, bottom: 0 }}>
      <Button onClick={() => dispatch(toggleShowAdd())} content='Add' fluid positive size='big' />
      <Modal open={showAdd} onClose={() => dispatch(toggleShowAdd())}>
        <Modal.Content>
          <Form onSubmit={() => dispatch(addSpend(location.pathname))}>
            <Form.Dropdown
              selection
              fluid
              name='month'
              label='Month'
              value={selected.month}
              options={months.filter((month) => month.text !== 'All')}
              onChange={(e, { value }) => dispatch(selectMonth({ month: value, page: 'add' }))}
            />
            <Form.Dropdown
              selection
              fluid
              name='section'
              label='Section'
              value={selected.section}
              options={sections}
              onChange={(e, { value }) => dispatch(selectingSection({ section: value, page: 'add' }))}
            />
            <Form.Dropdown selection fluid name='row' label='Row' value={selected.row} options={selected.rows} onChange={(e, { value }) => dispatch(selectRow({ row: value, page: 'add' }))} />
            <Form.Input fluid name='amount' label='Amount' type='text' labelPosition='left' value={selected.amount} onChange={(e, { value }) => dispatch(updateAmount(value))}>
              <Label basic>£</Label>
              <input />
            </Form.Input>
            <Form.Input name='note' label='Note' value={selected.note} onChange={(e, { value }) => dispatch(updateNote(value))} />
            <Form.Field>
              <Button type='submit' fluid positive content='Submit' />
            </Form.Field>
            <Form.Field>
              <Button fluid content='Cancel' type='button' basic onClick={() => dispatch(toggleShowAdd())} />
            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    ...state.global,
    authenticated: state.auth.authenticated,
  };
};

export default connect(mapStateToProps)(Add);
