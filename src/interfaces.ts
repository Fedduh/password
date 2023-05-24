export interface Customer {
	name: string;
	color: string;
}

export interface PasswordEntry {
	title: string;
	password: string;
	customerName: string;
	customerColor: string;
	display: boolean;
}

export interface PasswordInput {
	title: string;
	password: string;
	customerName: string;
}
