import { passwordList } from "../fixtures/testData";

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
})

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
		cy.get('[data-cy=password-grid-list] [data-cy=password-grid-password-cell]').eq(1).should('contain', '●');
		cy.get('[data-cy=password-grid-list] [data-cy=password-grid-password-toggle]').eq(1).click();
		cy.get('[data-cy=password-grid-list] [data-cy=password-grid-password-cell]').eq(1).should('have.text', passwordList[1].password);

		cy.get('[data-cy=password-grid-list] [data-cy=password-grid-password-toggle]').eq(1).click();
		cy.get('[data-cy=password-grid-list] [data-cy=password-grid-password-cell]').eq(1).should('contain', '●');
	});
})
