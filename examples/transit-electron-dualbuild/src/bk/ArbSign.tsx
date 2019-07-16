import React, { Component, FormEvent } from 'react';
import styled from 'react-emotion';
import WAL, { Wallet } from 'eos-transit';
import { TransactionButtonBlock } from './shared/transactions/TransactionButtonBlock';
import { FormElement, Input, FormActions, FieldLabel } from './shared/forms';
import { transfer } from './core/eosActions';

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
	receiverName: 'mary12345123',
	amount: 0.0002,
	inProgress: false,
	hasError: false,
	success: false
};

export class ArbSign extends Component<PaymentFormProps, PaymentFormState> {
	state: PaymentFormState = {
		...DEFAULT_STATE
	};

	handleSubmit = (wallet: Wallet) => {
		const { amount, receiverName } = this.state;
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

		return transfer(wallet, receiverName, amount)
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

	getDefaultWallet = () => {
		const activeWallets = accessContext.getActiveWallets();
		if (!activeWallets || !activeWallets.length) return void 0;
		return activeWallets[0];
	};

	async test(wallet?: Wallet) {
		console.log(wallet);
		if (wallet) {
			const signResult = await wallet.signArbitrary(
				'This is a custom message to sign',
				'A message for the user to see'
			);
			console.log(signResult);
			alert(signResult);
		}
	}

	render() {
		const { receiverName, amount, ...buttonProps } = this.state;
		const defaultWallet = this.getDefaultWallet();

		return (
			<PaymentFormRoot>
				<PaymentFormTitle>Test Options</PaymentFormTitle>

				<form noValidate={true}>
					<PaymentFormResetButton type="button" onClick={() => this.test(defaultWallet)}>
						Sign Arbitrary
					</PaymentFormResetButton>
				</form>
			</PaymentFormRoot>
		);
	}
}

export function PaymentFormConnected() {
	return <ArbSign />;
}

export default PaymentFormConnected;
