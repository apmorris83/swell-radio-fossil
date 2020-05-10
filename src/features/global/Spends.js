import React, { useEffect, Fragment } from 'react';
import { Segment, Form, Grid, Loader } from 'semantic-ui-react';
import { useDispatch, connect } from 'react-redux';

import { loadSpends, selectMonth, selectYear, selectSection } from './globalSlice.js';

const Spends = ({ years, months, sections, spends }) => {
  const { selected } = spends;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSpends(selected));
  }, [selected]);

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
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.global,
  };
};

export default connect(mapStateToProps)(Spends);
