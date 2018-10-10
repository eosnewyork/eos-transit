import { Container } from 'unstated';
import { UALInstance } from 'eos-ual';
import { TransactionModel } from '../shared/transactions/types';
import SessionStateContainer from './SessionStateContainer';

export interface TransactionState {
  transactions: TransactionModel[];
}

export const DEFAULT_STATE = {
  transactions: []
};

export class TransactionStateContainer extends Container<TransactionState> {
  constructor(
    private ual: UALInstance,
    private sessionStateContainer: SessionStateContainer,
    private appName: string
  ) {
    super();
    this.state = DEFAULT_STATE;
  }

  runTransaction = async (transaction: TransactionModel) => {
    const { ual } = this;
    const { walletInfo } = transaction.wallet;
    if (!walletInfo) {
      return Promise.reject(
        'No wallet information has been passed with transaction'
      );
    }

    const { accountName } = walletInfo;
    try {
      const result = await this.ual.transfer(
        accountName,
        transaction.receiverName,
        transaction.amount
      );
      console.log('[txn]: Transaction successful', result);
      return result;
    } catch (error) {
      console.warn('[txn]: Transaction error', error);
      return Promise.reject(error);
    }
  };
}

export default TransactionStateContainer;
