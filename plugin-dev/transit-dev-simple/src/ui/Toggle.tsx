import React, { Component, ReactNode, Children } from 'react';
import styled from 'react-emotion';

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

export class Toggle extends React.Component<{}, { isToggleOn: boolean }> {
	constructor(props: any) {
		super(props);

		const currentValue = localStorage.getItem('DEBUG');
		if (currentValue === 'false') {
			this.state = { isToggleOn: false };
		} else {
			this.state = { isToggleOn: true };
			localStorage.setItem('DEBUG', 'true');
		}

		// This binding is necessary to make `this` work in the callback
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState((prevState) => {
			const v = !prevState.isToggleOn;
			localStorage.setItem('DEBUG', v.toString());
			return { isToggleOn: v };
		});
	}

	render() {
		return (
			<DebugButtonRoot onClick={this.handleClick}>
				{this.state.isToggleOn ? (
					'DEBUG LOGGING ENABLED (CLICK TO DISABLE DEBUG)'
				) : (
					'DEBUG LOGGING DISABLED (CLICK TO ENABLE DEBUG)'
				)}
			</DebugButtonRoot>
		);
	}
}
