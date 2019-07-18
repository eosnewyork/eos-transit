import React, { Component, FormEvent } from 'react';
import styled from 'react-emotion';
import WAL, { Wallet } from 'eos-transit';
import { TransactionButtonBlock } from './shared/transactions/TransactionButtonBlock';
import { FormElement, Input, FormActions, FieldLabel } from './shared/forms';
import { transfer, claim, vote, stake } from './core/eosActions';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const { accessContext } = WAL;

// Visual components

const PaymentFormRoot = styled('div')({
	marginBottom: 20,
	padding: 30
});

const PaymentFormActions = styled(FormActions)({
	paddingTop: 20
});

const PaymentFormTitle = styled('h1')({
	margin: 0,
	marginBottom: 30,
	fontSize: 20,
	fontWeight: 600,
	textTransform: 'uppercase',
	color: 'white'
});

const TestLinkTitle = styled('h1')({
	margin: 0,
	marginBottom: 30,
	fontSize: 20,
	fontWeight: 600,
	textTransform: 'uppercase',
	color: 'white'
});

const PaymentFormResetButton = styled('button')({
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minWidth: 200,
	margin: '30px auto',
	padding: '10px 15px',
	color: 'white',
	fontSize: 12,
	fontWeight: 300,
	backgroundColor: '#2e3542',
	border: 'none',
	outline: 'none',
	// textTransform: 'uppercase',
	borderRadius: 1,
	boxShadow: '0 7px 15px -4px rgba(0, 0, 0, 0.4)',
	transition: 'all 0.2s, transform 0.1s',

	'& strong': {
		fontWeight: 600
	},

	'&:hover': {
		backgroundColor: '#40495a',
		cursor: 'pointer'
	},

	'&:active': {
		backgroundColor: '#485163',
		boxShadow: '0 4px 15px -7px rgba(0, 0, 0, 0.8)',
		transform: 'translateY(1px) scale(1)'
	}
});

// Form component

// tslint:disable-next-line:no-empty-interface
interface PaymentFormProps {
	// TODO: Pass the WAL stuff via props instead
}

interface PaymentFormState {
	receiverName: string;
	amount: number;
	txnCount: number;
	inProgress?: boolean;
	progressMessage?: string;
	hasError?: boolean;
	errorMessage?: string;
	success?: boolean;
	successMessage?: string;
}

const defaultProgressMessage = 'Transaction in progress, please stand by';
const defaultSuccessMessage = 'Transaction completed. See console for details';
const defaultErrorMessage = 'Transaction failed. See console for details';

const DEFAULT_STATE = {
	receiverName: 'wozzawozza55',
	amount: 0.0001,
	txnCount: 1,
	inProgress: false,
	hasError: false,
	success: false
};

export class PaymentForm extends Component<PaymentFormProps, PaymentFormState> {
	state: PaymentFormState = {
		...DEFAULT_STATE
	};

	handleAmountChange = (event: FormEvent<HTMLInputElement>) => {
		this.setState({ amount: Number(event.currentTarget.value) });
	};

	handleTxnCountChange = (event: FormEvent<HTMLInputElement>) => {
		this.setState({ txnCount: Number(event.currentTarget.value) });
	};	

	handleSubmit = (wallet: Wallet) => {
		const { amount, receiverName, txnCount } = this.state;
		if (!wallet) {
			this.setState({ hasError: true, errorMessage: defaultErrorMessage });
			return;
		}

		this.setState({
			inProgress: true,
			hasError: false,
			success: false,
			progressMessage: defaultProgressMessage
		});

		// return stake(wallet)
		// 	.then((result: any) => {
		// 		this.setState({
		// 			inProgress: false,
		// 			hasError: false,
		// 			success: true,
		// 			successMessage: defaultSuccessMessage
		// 		});
		// 	})
		// 	.catch((error: any) => {
		// 		console.error('[txn] Error', error);

		// 		this.setState({
		// 			inProgress: false,
		// 			hasError: true,
		// 			success: false,
		// 			errorMessage: error && error.message ? error.message : defaultErrorMessage
		// 		});
		// 	});		

		return transfer(wallet, receiverName, amount, "",txnCount)
			.then((result: any) => {
				this.setState({
					inProgress: false,
					hasError: false,
					success: true,
					successMessage: defaultSuccessMessage
				});
			})
			.catch((error: any) => {
				console.error('[txn] Error', error);

				this.setState({
					inProgress: false,
					hasError: true,
					success: false,
					errorMessage: error && error.message ? error.message : defaultErrorMessage
				});
			});
	};

	resetForm = () => {
		this.setState({ ...DEFAULT_STATE });
	};

	getDefaultWallet = () => {
		const activeWallets = accessContext.getActiveWallets();
		if (!activeWallets || !activeWallets.length) return void 0;
		return activeWallets[0];
	};

	test() {
		alert('ssss');
		// history.push('/my-new-location')
	}

	render() {
		const { getDefaultWallet, handleAmountChange, handleTxnCountChange, handleSubmit, resetForm } = this;
		const { receiverName, amount, txnCount, ...buttonProps } = this.state;
		const defaultWallet = getDefaultWallet();

		return (
			<PaymentFormRoot>
				<Link to="/test">test</Link>

				<PaymentFormTitle>Transfer</PaymentFormTitle>

				<form noValidate={true}>
					<FormElement>
						<FieldLabel>Receiver</FieldLabel>
						<Input type="text" value={receiverName} disabled={true} readOnly={true} />
					</FormElement>

					<FormElement>
						<FieldLabel>Amount (EOS)</FieldLabel>
						<Input type="number" value={amount} onChange={handleAmountChange} />
					</FormElement>

					<FormElement>
						<FieldLabel>Test multiple Actions (Repeat this transfer Action X times in a single transaction)</FieldLabel>
						<Input type="number" value={txnCount} onChange={handleTxnCountChange} />
					</FormElement>					

					<PaymentFormActions>
						<TransactionButtonBlock
							onTransactionRequested={handleSubmit}
							defaultWallet={defaultWallet}
							{...buttonProps}
						/>

						{buttonProps.success && (
							<PaymentFormResetButton type="button" onClick={resetForm}>
								Start over
							</PaymentFormResetButton>
						)}
					</PaymentFormActions>
				</form>
			</PaymentFormRoot>
		);
	}
}

export function PaymentFormConnected() {
	return <PaymentForm />;
}

export default PaymentFormConnected;
