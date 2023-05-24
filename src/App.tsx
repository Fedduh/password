import React, { useEffect, useState } from 'react';
import { Customer, PasswordEntry, PasswordInput } from './interfaces';

import './App.scss';
import PasswordRow from './components/passwordRow';

const copyArray = <T,>(obj: T): T => {
	return JSON.parse(JSON.stringify(obj));
}

const App = () => {
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
	const [inputs, setInputs] = useState<PasswordInput>({ title: '', customerName: '', password: '' });

	useEffect(() => {
		fetchCustomers().then(customerData => {
			setCustomers(customerData);
			setInputs(values => ({ ...values, customerName: customerData[0]?.name }))
		})
	}, []);

	useEffect(() => {
		loadPasswordsFromDatabase();
	}, [customers])

	const fetchCustomers = async (): Promise<Customer[]> => {
		// using api.allorigins now to avoid CORS issue pastebin
		const response = await fetch('https://api.allorigins.win/get?url=https://pastebin.com/raw/zSFTiVWr');
		const data = await response.json();
		const customerData = data.contents;
		return JSON.parse(customerData);
	}

	// get password list from local storage
	const loadPasswordsFromDatabase = () => {
		const passwords = localStorage.getItem('passwords');

		if (!passwords) {
			setPasswords([]);
			return;
		}

		let passwordsJson: PasswordEntry[] = JSON.parse(passwords);

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

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();

		const { title, password, customerName } = inputs;

		if (!title || !password || !customerName) {
			return;
		}

		const newPasswordList = copyArray(passwords);
		const newPassword = { title, password, customerName, display: false, customerColor: getColorForCustomer(customerName) };

		newPasswordList.push(newPassword)

		setPasswords(newPasswordList);
		localStorage.setItem('passwords', JSON.stringify(newPasswordList));
		setInputs({ title: '', customerName: customers[0]?.name, password: '' });
	}

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		const name = event.target.name;
		const value = event.target.value;

		setInputs(values => ({ ...values, [name]: value }))
	}

	const toggleDisplayPassword = (index: number): void => {
		setPasswords((current) => {
			return current.map((entry, i) => i !== index ? entry : { ...entry, display: !entry.display });
		});
	}

	return (
		<div className='root-container'>
			{/* Input new password entry */}
			<form onSubmit={handleSubmit}>
				<label htmlFor="title">Title
					<input type="text" value={inputs.title} id="title" name="title" onChange={handleOnChange} />
				</label>
				<label htmlFor="password">Password
					<input type="text" value={inputs.password} id="password" name="password" onChange={handleOnChange} />
				</label>
				<label htmlFor="customerName">Customer
					<select value={inputs.customerName} id="customerName" name="customerName" onChange={handleOnChange} >
						{customers.map(customer => {
							return (
								<option value={customer.name} key={customer.name}>{customer.name}</option>
							)
						})}
					</select>
				</label>
				<input type="submit" />
			</form>

			{/* Render passwords */}
			<div className='password-grid' data-cy="password-grid-list">
				{/* table heads */}
				<div className='header'>Title</div>
				<div className='header'>Password</div>
				<div className='header'>Customer</div>
				{/* data */}
				{passwords.map((password, index) => (
					<PasswordRow password={password} index={index} onToggleDisplay={toggleDisplayPassword} key={index} />
				))}
			</div>
		</div>
	);
}

export default App;
