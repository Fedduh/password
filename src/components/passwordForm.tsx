import React, { useEffect, useState } from 'react';
import { Customer, PasswordInput } from './../interfaces';

interface PasswordFormProps {
	customers: Customer[];
	onSubmit: (input: PasswordInput) => void;
}

const PasswordForm = ({ customers, onSubmit }: PasswordFormProps) => {
	const [inputs, setInputs] = useState<PasswordInput>({ title: '', customerName: '', password: '' });

	useEffect(() => {
		if (customers?.length) {
			setInputs(values => ({ ...values, customerName: customers[0].name }))
		}
	}, [customers])

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();

		const { title, password, customerName } = inputs;

		if (!title || !password) {
			return;
		}

		onSubmit({ title, password, customerName });

		setInputs({ title: '', customerName: customers[0]?.name, password: '' });
	}

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		const name = event.target.name;
		const value = event.target.value;

		setInputs(values => ({ ...values, [name]: value }))
	}

	return (
		<form onSubmit={handleSubmit} data-cy="form-add-password">
			<label htmlFor="title">Title
				<input type="text" required value={inputs.title} id="title" name="title" onChange={handleOnChange} />
			</label>
			<label htmlFor="password">Password
				<input type="text" required value={inputs.password} id="password" name="password" onChange={handleOnChange} />
			</label>
			{customers.length > 0 && <label htmlFor="customerName">Customer
				<select value={inputs.customerName} id="customerName" name="customerName" onChange={handleOnChange} >
					{customers.map(customer => {
						return (
							<option value={customer.name} key={customer.name}>{customer.name}</option>
						)
					})}
				</select>
			</label>}
			<input type="submit" />
		</form>
	)
}

export default PasswordForm;
