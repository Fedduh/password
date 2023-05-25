import { passwordList } from "../fixtures/testData";

describe('Add new passwords', () => {
	const rowCells = 3;
	const headerCells = 3;

	it('can add new passwords', () => {
		cy.visit('');
		cy.get('[data-cy=form-add-password] input#title').type('MySQL');
		cy.get('[data-cy=form-add-password] input#password').type('My p@assw0rd');
		cy.get('[data-cy=form-add-password] input[type=submit]').click();

		cy.get('[data-cy=password-grid-list]>*').should('have.length', 1 * rowCells + headerCells);

		cy.get('[data-cy=form-add-password] input#title').type('GitHub');
		cy.get('[data-cy=form-add-password] input#password').type('My p@assw0rd');
		cy.get('[data-cy=form-add-password] input[type=submit]').click();

		cy.get('[data-cy=password-grid-list]>*').should('have.length', 2 * rowCells + headerCells);
	});
})

describe('Load previously saved passwords', () => {
	const rowCells = 3;
	const headerCells = 3;

	it('can load previously saved passwords from local storage', () => {
		localStorage.setItem('passwords', JSON.stringify(passwordList));
		cy.visit('');

		cy.get('[data-cy=password-grid-list]>*').should('have.length', passwordList.length * rowCells + headerCells);
	});

	it('will start with empty list if no localStorage values', () => {
		cy.visit('');

		cy.get('[data-cy=password-grid-list]>*').should('have.length', headerCells);
	});
});

describe('Display passwords', () => {
	beforeEach(() => {
		localStorage.setItem('passwords', JSON.stringify(passwordList));
		cy.visit('');
	});

	it('by default hides each password', () => {

		cy.get('[data-cy=password-grid-list] [data-cy=password-grid-password-cell]')
			.should('have.length', passwordList.length)
			.each(input => {
				cy.wrap(input).should('contain', '●')
			});
	});

	it('can hide/show a password', () => {
		const textIndex = 1;
		const passwordIsHidden = () => cy.get('[data-cy=password-grid-list] [data-cy=password-grid-password-cell]').eq(textIndex).should('contain', '●');
		const togglePassword = () => cy.get('[data-cy=password-grid-list] [data-cy=password-grid-password-toggle]').eq(textIndex).click();

		passwordIsHidden();
		togglePassword();
		cy.get('[data-cy=password-grid-list] [data-cy=password-grid-password-cell]').eq(textIndex).should('have.text', passwordList[textIndex].password);

		togglePassword();
		passwordIsHidden();
	});
});
