import React from 'react';
import { TiThSmall } from 'react-icons/ti';
import { NoContent } from './shared/NoContent';
import TransactionButtonBlock from './shared/transactions/TransactionButtonBlock';

export function HomeScreen() {
  return (
    <div>
      <TransactionButtonBlock />
      <br />
      <br />
      <br />

      <NoContent
        message="Some app content will be here soon"
        note="Under construction, hang tight!"
        icon={TiThSmall}
      />
    </div>
  );
}

export default HomeScreen;
