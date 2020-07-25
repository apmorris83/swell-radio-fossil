import React, { Fragment, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Segment, Form, Grid, Table, Loader } from 'semantic-ui-react';

import { loadHistory, selectMonth, selectYear, selectingSection, selectRow } from './globalSlice.js';
import Total from './Total.js';

const History = ({ years, months, sections, history, loading }) => {
  const { selected, entries } = history;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadHistory(selected));
  }, [selected]);

  const renderDate = (month) => {
    return months[month + 1].text; // account for 'All' option at 0
  };

  const renderAmount = (amount) => {
    return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Fragment>
      <Segment>
        <Form>
          <Grid columns='equal'>
            <Grid.Row>
              <Grid.Column>
                <Form.Dropdown selection fluid name='year' label='Year' value={selected.year} options={years} onChange={(e, { value }) => dispatch(selectYear({ year: value, page: 'history' }))} />
              </Grid.Column>
              <Grid.Column>
                <Form.Dropdown
                  selection
                  fluid
                  name='month'
                  label='Month'
                  value={selected.month}
                  options={months}
                  onChange={(e, { value }) => dispatch(selectMonth({ month: value, page: 'history' }))}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Dropdown
                  selection
                  fluid
                  name='sections'
                  label='Sections'
                  placeholder='Choose a section'
                  value={selected.section}
                  options={sections}
                  onChange={(e, { value }) => dispatch(selectingSection({ section: value, page: 'history' }))}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Dropdown
                  selection
                  fluid
                  name='rows'
                  label='Rows'
                  placeholder='Choose a row'
                  value={selected.row}
                  options={selected.rows}
                  onChange={(e, { value }) => dispatch(selectRow({ row: value, page: 'history' }))}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
      {/* {loading ? <Loader active inline='centered' /> : null} */}
      {entries.length ? (
        <Fragment>
          <Table unstackable compact basic>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Note</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' width={2}>
                  Month
                </Table.HeaderCell>
                <Table.HeaderCell textAlign='right' width={2}>
                  Amount
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {entries.map((ent, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{ent.note}</Table.Cell>
                  <Table.Cell textAlign='right' width={2}>
                    {renderDate(ent.month)}
                  </Table.Cell>
                  <Table.Cell textAlign='right' width={2}>
                    {renderAmount(ent.amount)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Total page={'history'} total={renderAmount(history.pageTotal)} />
        </Fragment>
      ) : (
        <Loader active={loading} inline='centered' />
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.global,
  };
};

export default connect(mapStateToProps)(History);
