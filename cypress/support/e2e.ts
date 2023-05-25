// Import commands.js using ES2015 syntax:
import './commands'

beforeEach(() => {
	// for now to avoid issues with cors / rate limit api.allorigins. Mock data customers
	cy.intercept('https://api.allorigins.win/get?url=https://pastebin.com/raw/zSFTiVWr',

		{
			"contents": "[\r\n  {\r\n    \"name\": \"Payroll Select\",\r\n    \"color\": \"#0000FF\"\r\n  },\r\n  {\r\n    \"name\": \"Benu Direct\",\r\n    \"color\": \"#259617\"\r\n  },\r\n  {\r\n    \"name\": \"Schotpoort Connect\",\r\n    \"color\": \"#e3c922\"\r\n  },\r\n  {\r\n    \"name\": \"KNHB\",\r\n    \"color\": \"#e39c22\"\r\n  }\r\n]",
			"status": {
				"url": "https://pastebin.com/raw/zSFTiVWr",
				"content_type": "text/plain; charset=utf-8",
				"http_code": 200,
				"response_time": 37,
				"content_length": 258
			}
		}
	);
});
