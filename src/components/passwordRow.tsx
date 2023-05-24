import React from 'react';
import { PasswordEntry } from './../interfaces';

interface PasswordRowProps {
	password: PasswordEntry;
	index: number;
	onToggleDisplay: (index: number) => void;
}

const PasswordRow = ({ password, index, onToggleDisplay }: PasswordRowProps) => {
	return (
		<React.Fragment>
			<div>{password.title}</div>
			<div>
				<button className='toggle-password-button' onClick={() => onToggleDisplay(index)}>{password.display ? 'Hide' : 'Show'}</button>
				<span>{password.display ? password.password : '●●●●●●'}</span>
			</div>
			<div className='customer' style={{ borderBottomColor: password.customerColor || 'white' }}>{password.customerName}</div>
		</React.Fragment>
	)
}

export default PasswordRow;
