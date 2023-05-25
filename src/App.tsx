import React, { useEffect, useState } from 'react';
import { Customer, PasswordEntry, PasswordInput } from './interfaces';

import './App.scss';
import { copyArray } from './util';

import PasswordRow from './components/passwordRow';
import PasswordForm from './components/passwordForm';


const App = () => {
	const [loaded, setLoaded] = useState<boolean>(false);

	const [customers, setCustomers] = useState<Customer[]>([]);
	const [passwords, setPasswords] = useState<PasswordEntry[]>([]);

	useEffect(() => {
		fetchCustomers().then(customerData => {
			setCustomers(customerData);
			setLoaded(true);
		})
	}, []);

	useEffect(() => {
		if (loaded) {
			loadPasswordsFromDatabase();
		}
	}, [loaded]);

	const fetchCustomers = async (): Promise<Customer[]> => {
		// using api.allorigins now to avoid CORS issue pastebin
		const response = await fetch('https://api.allorigins.win/get?url=https://pastebin.com/raw/zSFTiVWr');
		const data = await response.json();
		const customerData = data.contents;

		try {
			const json = JSON.parse(customerData);
			if (json) {
				return json;
			}
		} catch (e) { }

		return [];
	}

	// get password list from local storage
	const loadPasswordsFromDatabase = () => {
		const passwords = localStorage.getItem('passwords');

		if (!passwords) {
			setPasswords([]);
			return;
		}

		let passwordsJson: PasswordEntry[] = [];

		try {
			passwordsJson = JSON.parse(passwords);
		} catch (e) { }

		passwordsJson = passwordsJson.map(entry => {
			entry.customerColor = getColorForCustomer(entry.customerName);
			entry.display = false;
			return entry;
		});

		setPasswords(passwordsJson);
	}

	const getColorForCustomer = (customer: string): string => {
		return customers.find(c => c.name === customer)?.color || 'white';
	}

	const addPassword = (input: PasswordInput): void => {
		const { title, password, customerName } = input;

		const newPasswordList = copyArray(passwords);
		const newPassword = { title, password, customerName, display: false, customerColor: getColorForCustomer(customerName) };

		newPasswordList.push(newPassword)

		setPasswords(newPasswordList);
		localStorage.setItem('passwords', JSON.stringify(newPasswordList));
	}


	const toggleDisplayPassword = (index: number): void => {
		setPasswords((current) => {
			return current.map((entry, i) => i !== index ? entry : { ...entry, display: !entry.display });
		});
	}

	return (
		!loaded
			? <div>{/* @todo some loading screen */}</div>
			: <div className='root-container'>
				<PasswordForm customers={customers} onSubmit={addPassword} />

				<div className='password-grid' data-cy="password-grid-list">
					{/* table heads */}
					<div className='header'>Title</div>
					<div className='header'>Password</div>
					<div className='header'>Customer</div>
					{/* rows */}
					{passwords.map((password, index) => (
						<PasswordRow password={password} index={index} onToggleDisplay={toggleDisplayPassword} key={index} />
					))}
				</div>
			</div>
	);
}

export default App;
