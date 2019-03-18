import React, { Component, ReactNode, Children } from 'react';
import styled from 'react-emotion';

// Visual components
// TODO: Extract to `shared`

const DebugButtonRoot = styled('button')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minWidth: 200,
	padding: '10px 15px',
	color: 'white',
	fontSize: 12,
	fontWeight: 300,
	backgroundColor: '#2e3542',
	border: 'none',
	outline: 'none',
	textTransform: 'uppercase',
	borderRadius: 1,
	boxShadow: '0 7px 25px -4px rgba(0, 0, 0, 0.4)',
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
		boxShadow: '0 3px 15px -4px rgba(0, 0, 0, 0.8)',
		transform: 'translateY(1px) scale(0.99)'
	}
});

const DebugButtonIcon = styled('div')({
	width: 24,
	height: 24
});

const DebugButtonText = styled('div')({
	flex: 1,
	padding: '0, 10px',
	textAlign: 'center'
});

const DebugButtonAddon = styled('div')(
	{
		// TODO
	}
);

// Exported component

export interface DebugButtonProps {
	children?: ReactNode;
	onClick?: (event: any) => void;
}

export class DebugButton extends Component<DebugButtonProps> {
	constructor(props: any) {
		super(props);
		const currentState = localStorage.getItem('DEBUG');
		if (!currentState) {
			localStorage.setItem('DEBUG', 'false');
			this.setState({ DEBUG: false });
		}
	}

	setDebug() {
		const currentState = localStorage.getItem('DEBUG');
		let newState;
		if (currentState === 'true') {
			newState = false;
			localStorage.setItem('DEBUG', 'false');
		} else {
			newState = true;
			localStorage.setItem('DEBUG', 'true');
		}
		this.setState({ DEBUG: newState });
	}

	render() {
		const { onClick } = this.props;

		return (
			<DebugButtonRoot onClick={() => this.setDebug()}>
				<DebugButtonText>XXX</DebugButtonText>
			</DebugButtonRoot>
		);
	}
}

export default DebugButton;
