import React, { useEffect, useState, Fragment } from 'react';
import { Segment, Form, Grid, Loader, Table, Header, Icon } from 'semantic-ui-react';
import { useDispatch, connect } from 'react-redux';

import { loadSpends, selectMonth, selectYear, selectSection } from './globalSlice.js';
import Total from './Total.js';

const Spends = ({ years, months, sections, spends }) => {
  const { selected } = spends;
  const dispatch = useDispatch();
  const [showSpendRows, setShowSpendRows] = useState([]);

  useEffect(() => {
    dispatch(loadSpends(selected));
  }, [selected]);

  const toggleShowRows = (sectionName) => {
    const updatedState = showSpendRows.indexOf(sectionName) > -1 ? showSpendRows.filter((name) => name !== sectionName) : showSpendRows.concat(sectionName);
    setShowSpendRows(updatedState);
  };

  const showAverage = () => selected.month === 'all';

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
                <Form.Dropdown selection fluid name='year' label='Year' value={selected.year} options={years} onChange={(e, { value }) => dispatch(selectYear({ year: value, page: 'spends' }))} />
              </Grid.Column>
              <Grid.Column>
                <Form.Dropdown
                  selection
                  fluid
                  name='month'
                  label='Month'
                  value={selected.month}
                  options={months}
                  onChange={(e, { value }) => dispatch(selectMonth({ month: value, page: 'spends' }))}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Dropdown
                  selection
                  fluid
                  multiple
                  name='sections'
                  label='Sections'
                  placeholder='Choose some sections'
                  value={selected.sections}
                  options={sections}
                  onChange={(e, { value }) => dispatch(selectSection({ section: value, page: 'spends' }))}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
      {/* {fetchingSpends ? <Loader active inline='centered' /> : null}
      {data ? <h1>got some data</h1> : null} */}

      {spends.entries.map((ent, i) => (
        <Table unstackable compact basic key={i}>
          <Table.Header size-='small'>
            <Table.Row>
              <Table.HeaderCell width={1}></Table.HeaderCell>
              <Table.HeaderCell>Section</Table.HeaderCell>
              <Table.HeaderCell textAlign='right' width={2}>
                Total
              </Table.HeaderCell>
              {showAverage() ? (
                <Table.HeaderCell textAlign='right' width={2}>
                  Average
                </Table.HeaderCell>
              ) : null}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row onClick={() => toggleShowRows(ent.text)}>
              <Table.HeaderCell width={1}>
                <Icon size='small' name={`angle ${showSpendRows.indexOf(ent.text) > -1 ? 'down' : 'right'}`} />
              </Table.HeaderCell>
              <Table.Cell>
                <Header as='h4'>{ent.text}</Header>
              </Table.Cell>
              <Table.Cell textAlign='right' width={2}>
                <Header as='h4' content={renderAmount(ent.total)} />
              </Table.Cell>
              {showAverage() ? (
                <Table.Cell textAlign='right' width={2}>
                  <Header as='h4' content={renderAmount(ent.average)} />
                </Table.Cell>
              ) : null}
            </Table.Row>
            {showSpendRows.indexOf(ent.text) > -1 ? (
              <Fragment>
                {ent.rows.map((row, i) => (
                  <Table.Row key={i}>
                    <Table.Cell width={1}></Table.Cell>
                    <Table.Cell>{row.text}</Table.Cell>
                    <Table.Cell textAlign='right' width={2}>
                      {renderAmount(row.total)}
                    </Table.Cell>
                    {showAverage() ? (
                      <Table.Cell textAlign='right' width={2}>
                        {renderAmount(row.average)}
                      </Table.Cell>
                    ) : null}
                  </Table.Row>
                ))}
              </Fragment>
            ) : null}
          </Table.Body>
        </Table>
      ))}
      <Total page={'spends'} total={renderAmount(spends.pageTotal)} average={showAverage() ? renderAmount(spends.pageAverage) : null} />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.global,
  };
};

export default connect(mapStateToProps)(Spends);
