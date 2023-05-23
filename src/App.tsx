import React, { useEffect, useState } from 'react';
import { Customer, PasswordEntry, PasswordInput } from './interfaces';

import './App.scss';

const App = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);

  const [inputs, setInputs] = useState<PasswordInput>({ title: '', customerName: '', password: '' });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchCustomers().then(customerData => {
      setCustomers(customerData);
      setInputs(values => ({ ...values, customerName: customerData[0]?.name }))
      loadPasswords(customerData);
    })
  }, []);

  const fetchCustomers = async (): Promise<Customer[]> => {
    // using api.allorigins now to avoid CORS issue pastebin
    const response = await fetch('https://api.allorigins.win/get?url=https://pastebin.com/raw/zSFTiVWr');
    const data = await response.json();
    const customerData = data.contents;
    return JSON.parse(customerData);
  }

  // get password list from local storage
  const loadPasswords = (customers: Customer[]) => {
    const passwords = localStorage.getItem('passwords');

    if (!passwords) {
      setPasswords([]);
      setLoaded(true);
      return;
    }

    let passwordsJson: PasswordEntry[] = JSON.parse(passwords);

    passwordsJson = passwordsJson.map(entry => {
      entry.customerColor = customers.find(c => c.name === entry.customerName)?.color;
      return entry;
    });

    setPasswords(passwordsJson);
    setLoaded(true);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const current = localStorage.getItem('passwords');
    const currentJson = JSON.parse(current || '[]');

    const { title, password, customerName } = inputs;

    if (!title || !password || !customerName) {
      return;
    }

    const newPassword = { title, password, customerName };

    currentJson.push(newPassword)

    setPasswords(currentJson);
    localStorage.setItem('passwords', JSON.stringify(currentJson));
    setInputs({ title: '', customerName: customers[0]?.name, password: '' });
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs(values => ({ ...values, [name]: value }))
  }

  // display all passwords, password itself hidden
  // match customerName with color
  // toggle to display password

  return (
    <div className='root-container'>
      {/* Input new password entry */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title
          <input type="text" value={inputs.title} name="title" onChange={handleOnChange} />
        </label>
        <label htmlFor="password">Password
          <input type="text" value={inputs.password} name="password" onChange={handleOnChange} />
        </label>
        <label htmlFor="customerName">Customer
          <select name="customerName" id="customerName" value={inputs.customerName} onChange={handleOnChange} >
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
      <div className='password-grid'>
        {/* table heads */}
        <div className='header'>Title</div>
        <div className='header'>Password</div>
        <div className='header'>Customer</div>
        {/* data */}
        {passwords.map(password => (
          <React.Fragment key={password.title}>
            <div>{password.title}</div>
            <div>{password.password}</div>
            <div>{password.customerName}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default App;
