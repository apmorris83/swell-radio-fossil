import React from 'react';
import { Table, Header } from 'semantic-ui-react';

const Total = ({ total, average, page }) => (
  <Table unstackable compact basic>
    <Table.Header size-='small'>
      <Table.Row>
        {page === 'spends' ? <Table.HeaderCell width={1}></Table.HeaderCell> : null}
        <Table.HeaderCell>Total</Table.HeaderCell>
        <Table.HeaderCell textAlign='right' width={2}>
          {total}
        </Table.HeaderCell>
        {average ? (
          <Table.HeaderCell textAlign='right' width={2}>
            {average}
          </Table.HeaderCell>
        ) : null}
        {/* {page === 'history' ? <Table.HeaderCell textAlign='right' width={2}></Table.HeaderCell> : null} */}
      </Table.Row>
    </Table.Header>
  </Table>
);

export default Total;
