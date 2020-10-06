import React from 'react';
import { Modal, Form, Label, Button } from 'semantic-ui-react';
import { useDispatch, connect } from 'react-redux';

import { toggleShowEdit, updateAmount, updateNote, selectMonth, editEntry, deleteEntry } from './globalSlice.js';

const Edit = ({ edit, months }) => {
  const dispatch = useDispatch();
  const { showEdit, selected } = edit;

  return (
    <Modal open={showEdit} onClose={() => dispatch(toggleShowEdit())}>
      <Modal.Content>
        <Form onSubmit={() => dispatch(editEntry())}>
          <Form.Dropdown
            selection
            fluid
            name='month'
            label='Month'
            value={selected.month}
            options={months.filter((month) => month.text !== 'All')}
            onChange={(e, { value }) => dispatch(selectMonth({ month: value, page: 'edit' }))}
          />
          <Form.Input
            fluid
            name='amount'
            label='Amount'
            type='number'
            min='0'
            step='any'
            labelPosition='left'
            value={selected.amount}
            onChange={(e, { value }) => dispatch(updateAmount({ amount: value, modal: 'edit' }))}
          >
            <Label basic>£</Label>
            <input />
          </Form.Input>
          <Form.Input name='note' label='Note' value={selected.note} onChange={(e, { value }) => dispatch(updateNote({ note: value, modal: 'edit' }))} />
          <Form.Field>
            <Button type='submit' fluid positive content='Save' />
          </Form.Field>
          <Form.Field>
            <Button type='button' onClick={() => dispatch(deleteEntry())} fluid negative content='Delete' />
          </Form.Field>
          <Form.Field>
            <Button fluid content='Cancel' type='button' basic onClick={() => dispatch(toggleShowEdit())} />
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return { ...state.global };
};

export default connect(mapStateToProps)(Edit);
