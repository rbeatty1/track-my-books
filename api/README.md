## Overview
This is a web API to support the application that is built using Flask. Interfaces with a PostgreSQL database.

### Database Schema

**Table Name:** books

**Description:** Table to store all information pertaining to books that I have read or am in the process of reading.
| Column Name | Data Type | Description |
| ----------- | --------- | ----------- |
| id | Integer (PK) | Unique identifier of book record |
| title | String | Title of book |
| author | String | Author of book |
| genre | String | Genre of book |
| pages | Integer | Number of pages in book |
| start_dt | Datetime | Date that book was started |
| end_dt | Datetime | Date that book was finished |
| format | Integer (FK) | Format that book was consumed in. Keys to book_formats table |
| rating | Integer | Personal rating of book from 1 - 5. |

**Table Name:** book_formats

**Description:** Reference table. Coded values for type of format that I consuming the book with.
| Column Name | Data Type | Description |
| ----------- | --------- | ----------- |
| id | Integer (PK) (FK) | Unique identifier of book format type. |
| desc | String | Friendly description of book format |

**Table Name:** dict

**Description:** Table to store dictionary information for words I've encountered that were unfamiliar to me.
| Column Name | Data Type | Description |
| ----------- | --------- | ----------- |
| id | Integer (PK) | Unique identifier of dictionary record|
| word_id | Integer (FK) | Key of record in words table that dictionary record relates to |
| type | String | Word type |
| definition | String | Dictionary definition per Webster's Dictionary API |
| example | String | Example usage of word per Webster's Dictionary API |

**Table:** users

**Description:** Table to store authentication information. Currently just used to determine whether CRUD operations should be enabled in the UI.
| Column Name | Data Type | Description |
| ----------- | --------- | ----------- |
| id | Integer (PK) | Unique username |
| pass_hash | String | Encrypted password string |

**Table Name:** words

**Description:** Table to store information about the encounter of a word that I was unfamiliar with.
| Column Name | Data Type | Description |
| ----------- | --------- | ----------- |
| id | Integer (PK) | Unique identifier of word record |
| word | String | Vocabulary word|
| book_id | Integer (FK) | Key of book that word was encountered in |
| timestamp | Integer | Milliseconds since epoch to represent point in time that word was encountered |
| context | String | Sentence in which the word was used in the book |

## Endpoints

### Books
`https://api.beattyre.app/books/api/v1/books`

| Parameter | Data Type | Descripton | Usage |
| ----------- | --------- | --------- | ---- |
| book_id | Integer  | Unique identifier of desired book record | https://api.beattyre.app/books/api/v1/books?book_id=377 |
| title | String | Retrieves all book records with matching title| https://api.beattyre.app/books/api/v1/books?title=Fellow%20Travellers |
| author | String | Retrieves all book records with matching author|https://api.beattyre.app/books/api/v1/books?author=Terry%20Pratchett|
| genre | String | Retrieves all book records with matching genre|https://api.beattyre.app/books/api/v1/books?genre=Fantasy|

### Words
`https://api.beattyre.app/books/api/v1/vocab`

*Description to come*