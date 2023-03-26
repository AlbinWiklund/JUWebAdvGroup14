import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createPool } from 'mariadb'

const saltRounds = 10

const ACCESS_TOKEN_SECRET = "kjhkyfgdbwygcvdsfsdfs"
const MAX_BOOK_TITLE_LENGTH = 50
const MIN_BOOK_TITLE_LENGTH = 1
const MIN_DESCRIPTION_LENGTH = 10
const MAX_DESCRIPTION_LENGTH = 150
const MAX_NAME_LENGTH = 20
const MIN_NAME_LENGTH = 1
const MIN_PASSWORD_LENGTH = 3
const MAX_PASSWORD_LENGTH = 28
const MAX_REVIEW_LENGTH = 150
const MIN_REVIEW_LENGTH = 1

const pool = createPool({
    host:'database',
    port: 3306,
    user: 'root',
    password: 'abc123',
    database: 'abc',
})

pool.on('error', function(error){
    console.log('Error from pool', error)
})

const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use(function(request, response, next){
	response.set("Access-Control-Allow-Origin", "*")
	response.set("Access-Control-Allow-Methods", "*")
	response.set("Access-Control-Allow-Headers", "*")
	response.set("Access-Control-Expose-Headers", "*")

	next()
})

app.get('/accounts', async function(request, response){
    const connection = await pool.getConnection()

    try {
        const query = 'SELECT * FROM accounts ORDER BY name'

        const accounts = await connection.query(query)

        response.status(200).json(accounts)
    } catch(error) {
        response.status(500).json({error: "Internal server error."})
    } finally {
        connection.release()
    }
})

app.get('/accounts/:id', async function(request, response){
    const connection = await pool.getConnection()

    try {
				const accountQuery = `SELECT accounts.id AS id, accounts.username AS username FROM accounts WHERE accounts.id = ?`

				const booksQuery = `SELECT books.id as bookID, books.name AS bookTitle FROM books WHERE books.accountID = ?`

				const reviewsQuery = `SELECT reviews.id AS reviewID, reviews.review AS reviewDescription, reviews.reviewerID as reviewerID, reviews.rating 
				FROM reviews WHERE reviews.accountID = ?`
        
				const avgRatingQuery = `SELECT ROUND(AVG(reviews.rating), 1) as accRating FROM reviews WHERE reviews.accountID = ?`

        const values = [request.params.id]
				
        const account = await connection.query(accountQuery, values)
        const books = await connection.query(booksQuery, values)
        const reviews = await connection.query(reviewsQuery, values)
				const avgAccRating = await connection.query(avgRatingQuery, values)

				const accountInformation = [account, books, reviews, avgAccRating]

				response.status(200).json(accountInformation)
    } catch (error) {
        response.status(500).json({error: "Internal server error."})
    } finally {
        connection.release()
    }
})

app.get('/account/:id', async function(request, response){
	const connection = await pool.getConnection()

    try {
			const query = "SELECT * FROM accounts WHERE id = ?"

			const values = [request.params.id]

			const account = await connection.query(query, values)

			response.status(200).json(account)
		} catch(error) {
			response.status(500).json({error: "Could not recieve account"})
		} finally {
			connection.release()
		}
})

app.get('/books/bycategory', async function(request, response){
	const connection = await pool.getConnection()
	try {
		let books = []
		if(request.query.category == "all"){
			const query = 'SELECT * FROM books'

			books = await connection.query(query)
		} else {
			const query = 'SELECT * FROM books WHERE category = ?'

			const value = [request.query.category]

		 	books = await connection.query(query, value)
		}

		response.status(200).json(books)
	} catch (error) {
		response.status(500).json({error: "Internal server error."})
	} finally {
		connection.release()
	}
})

app.get('/books', async function(request, response){
    const connection = await pool.getConnection()

    try {
        const query = 'SELECT * FROM books ORDER BY name'

        const books = await connection.query(query)

        response.status(200).json(books)
    } catch(error) {
        response.status(500).json({error: "Internal server error"})
    } finally {
        connection.release()
    }
})

app.get('/books/:id', async function(request, response){
    const connection = await pool.getConnection()
    try {
        const query = 'SELECT * FROM books WHERE id = ?'

        const value = [request.params.id]

        const selectedBook = await connection.query(query, value)

        response.status(200).json(selectedBook)
    } catch (error) {
        response.status(500).json({error: "Internal server error."})
    } finally {
        connection.release()
    }
})

app.get('/review/:id', async function(request, response){
	const connection = await pool.getConnection()

    try {
        const query = 'SELECT * FROM reviews WHERE id = ?'

        const value = [request.params.id]

        const selectedReview = await connection.query(query, value)
        response.status(200).json(selectedReview)
    } catch (error) {
        response.status(500).json({error: "Internal server error."})
    } finally {
        connection.release()
    }
})

app.post('/signup', async function(request, response){
	const account = request.body
	const errorMessages = []

	if(typeof account?.username != "string"){
		errorMessages.push("usernameIsMissing")
	}	else if(account.username.length > MAX_NAME_LENGTH){
		errorMessages.push("usernameTooLong")
	} else if(account.username.length < MIN_NAME_LENGTH){
		errorMessages.push("usernameTooShort")
	}
	
	if(typeof account?.name != "string"){
		errorMessages.push("nameIsMissing")
	}	else if(account.name.length > MAX_NAME_LENGTH){
		errorMessages.push("nameTooLong")
	} else if(account.name.length < MIN_NAME_LENGTH){
		errorMessages.push("nameTooShort")
	}
	
	if(typeof account?.surname != "string"){
		errorMessages.push("surnameIsMissing")
	}	else if(account.surname.length > MAX_NAME_LENGTH){
		errorMessages.push("surnameTooLong")
	} else if(account.surname.length < MIN_NAME_LENGTH){
		errorMessages.push("surnameTooShort")
	}
	
	if(typeof account?.password != "string"){
		errorMessages.push("password missing")
	} else if(account.password.length > MAX_PASSWORD_LENGTH){
		errorMessages.push("passwordTooLong")
	} else if(account.password.length < MIN_PASSWORD_LENGTH){
		errorMessages.push("passwordTooShort")
	}
	
	if(errorMessages.length > 0){
		response.status(400).json(errorMessages)
		return
	}
	
	bcrypt.hash(account.password, saltRounds, async function(err, hash) {
		const connection = await pool.getConnection()

		const usernameQuery = 'SELECT accounts.username AS username from accounts WHERE username = ?'
		
		const usernameValues = [account.username]
		
		const accountUsername = await connection.query(usernameQuery, usernameValues)
		
		if(accountUsername[0] != undefined){
			response.status(400).json(["usernameAlreadyExists"])
			return
		}
		try {
			const query = 'INSERT INTO accounts(username, password, name, surname) VALUES (?, ?, ?, ?)'
			
			const values = [account.username, hash, account.name, account.surname]
	
			const signUpAccount = await connection.query(query, values)
	
			response.status(201).end()
		} catch (error) {
			response.status(500).json({error: "Internal server error."})
		} finally {
			connection.release()
		}
  })
})

app.post('/signin', async function(request, response){
	const grantType = request.body.grant_type
	const username = request.body.username
	const password = request.body.password

	if(grantType != "password"){
		response.status(400).json(["unsupporter_grant_type"])
		return
	} 
	
	const connection = await pool.getConnection()
	
	try {
		const query = 'SELECT * FROM accounts WHERE username = ?'

		const values = [username, password]

		const signInAccount = await connection.query(query, values)

		const passwordResult = await bcrypt.compare(password, signInAccount[0].password)

		if(signInAccount[0].username == username && passwordResult){
			const accessTokenPayload = {
				sub: signInAccount[0].id,
				isLoggedIn: true,
			}
			
			jwt.sign(accessTokenPayload, ACCESS_TOKEN_SECRET, async function(error, accessToken){
				if(error){
					response.status(500).end()
				} else {
					const idTokenPayload = {
						iss: "http://localhost:8080",
						sub: signInAccount[0].id,
						aud: "Kunskapsmagazinet",
						exp: Math.floor(Date.now() / 1000)+600,
						username: signInAccount[0].username
					}
					jwt.sign(idTokenPayload, ACCESS_TOKEN_SECRET, async function(error, idToken){
						if(error){
							response.status(500).end()
						} else {
							response.status(200).json({
								access_token: accessToken,
								type: "bearer",
								id_token: idToken,
							})
						}
					})
				}
			})
		} else {
			response.status(400).json(["invalid_grant"])
		}
	} catch (error) {
		response.status(400).json(["No account matching username"])
	} finally {
		connection.release()
	}
})

app.post('/book/sell', async function(request, response){
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if(error){
			response.status(401).end()
		} else {
			const book = request.body
			const errorMessages = []

			if(typeof book?.name != "string"){
				errorMessages.push("titleIsMissing")
			} else if(book.name.length > MAX_BOOK_TITLE_LENGTH){
				errorMessages.push("titleIsTooLong")
			} else if(book.name.length < MIN_BOOK_TITLE_LENGTH){
				errorMessages.push("titleIsTooShort")
			}

			if(typeof book?.price != "number"){
				errorMessages.push("priceIsMissing")
			}

			if(typeof book?.category != "string"){
				errorMessages.push("categoryIsMissing")
			}

			if(typeof book?.description != "string"){
				errorMessages.push("descriptionIsMissing")
			} else if(book.description.length > MAX_DESCRIPTION_LENGTH){
				errorMessages.push("descriptionIsTooLong")
			} else if(book.description.length < MIN_DESCRIPTION_LENGTH){
				errorMessages.push("descriptionIsTooShort")
			}

			if(errorMessages.length > 0){
				response.status(400).json(errorMessages)
				return
			}

			const connection = await pool.getConnection()
		
			try {
					const query = 'INSERT INTO books(name, price, description, category, accountID) VALUES (?, ?, ?, ?, ?)'
		
					const values = [request.body.name, request.body.price, request.body.description, request.body.category, payload.sub]
		
					const sellBook = await connection.query(query, values)
		
					response.status(201).end()
			} catch (error) {
					response.status(500).json({error: "Internal server error."})
			} finally {
					connection.release()
			}
		}
	})

})

app.post('/book/:id/review', async function(request, response){

	const review = request.body

	const errorMessages = []

	if(typeof review?.review != "string"){
		errorMessages.push("missingReview")
	} else if(review.review.length > MAX_REVIEW_LENGTH){
		errorMessages.push("reviewTooLong")
	} else if(review.review.length < MIN_REVIEW_LENGTH){
		errorMessages.push("reviewTooShort")
	}

	if(typeof review?.rating != "string"){
		errorMessages.push("missingRating")
	}

	if(errorMessages.length > 0){
		response.status(400).json(errorMessages)
		return
	}

	const connection = await pool.getConnection()

	try {
			const getBookIdQuery = 'SELECT * FROM books WHERE id = ?'

			const bookValue = [request.params.id]

			const book = await connection.query(getBookIdQuery, bookValue)

			const stringBookObject = JSON.stringify(book)

			const parsedBookObject = JSON.parse(stringBookObject)

			const query = 'INSERT INTO reviews(review, rating, accountID, reviewerID) VALUES (?, ?, ?, ?)'

			const values = [review.review, review.rating, parsedBookObject[0].accountID, review.reviewerId]
			
			const reviewResult = await connection.query(query, values)

			const deleteQuery = 'DELETE FROM books WHERE id = ?'

			await connection.query(deleteQuery, bookValue)

			response.status(201).end()
    } catch (error) {
        response.status(500).json({error: "Internal server error."})
    } finally {
        connection.release()
    }
})

app.put('/account/:id/update', async function(request, response){
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	const account = request.body

	const errorMessages = []

	if(typeof account?.username != "string"){
		errorMessages.push("usernameIsMissing")
	}	else if(account.username.length > MAX_NAME_LENGTH){
		errorMessages.push("usernameTooLong")
	} else if(account.username.length < MIN_NAME_LENGTH){
		errorMessages.push("usernameTooShort")
	}

	if(typeof account?.name != "string"){
		errorMessages.push("nameIsMissing")
	}	else if(account.name.length > MAX_NAME_LENGTH){
		errorMessages.push("nameTooLong")
	} else if(account.name.length < MIN_NAME_LENGTH){
		errorMessages.push("nameTooShort")
	}

	if(typeof account?.surname != "string"){
		errorMessages.push("surnameIsMissing")
	}	else if(account.surname.length > MAX_NAME_LENGTH){
		errorMessages.push("surnameTooLong")
	} else if(account.surname.length < MIN_NAME_LENGTH){
		errorMessages.push("surnameTooShort")
	}

	if(typeof account?.password != "string"){
		errorMessages.push("password missing")
	} else if(account.password.length > MAX_PASSWORD_LENGTH){
		errorMessages.push("passwordTooLong")
	} else if(account.password.length < MIN_PASSWORD_LENGTH){
		errorMessages.push("passwordTooShort")
	}

	if(errorMessages.length > 0){
		response.status(400).json(errorMessages)
		return
	}

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if(error){
			response.status(401).end()
		} else {
			const connection = await pool.getConnection()

			try {
				const query = "UPDATE accounts SET username = ?, name = ?, surname = ?, password = ? WHERE id = ?"

				const values = [account.username, account.name, account.surname, account.password, account.accountId]

				const updatedAccount = await connection.query(query, values)

				response.status(200).end()
			} catch(error) {
				response.status(500).json({error: "serverError"})
			} finally {
				connection.release()
			}
		}
	})
})

app.put('/book/:id/update', async function(request, response){
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	const book = request.body
	const errorMessages = []

	if(typeof book?.name != "string"){
		errorMessages.push("titleIsMissing")
	} else if(book.name.length > MAX_BOOK_TITLE_LENGTH){
		errorMessages.push("titleIsTooLong")
	} else if(book.name.length < MIN_BOOK_TITLE_LENGTH){
		errorMessages.push("titleIsTooShort")
	}

	if(typeof book?.price != "number"){
		errorMessages.push("priceIsMissing")
	}

	if(typeof book?.category != "string"){
		errorMessages.push("categoryIsMissing")
	}

	if(typeof book?.description != "string"){
		errorMessages.push("descriptionIsMissing")
	} else if(book.description.length > MAX_DESCRIPTION_LENGTH){
		errorMessages.push("descriptionIsTooLong")
	} else if(book.description.length < MIN_DESCRIPTION_LENGTH){
		errorMessages.push("descriptionIsTooShort")
	}

	if(errorMessages.length > 0){
		response.status(400).json(errorMessages)
		return
	}

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if(error){
			response.status(401).end()
		} else {
			const connection = await pool.getConnection()

			try {
				const query = 'UPDATE books SET name = ?, price = ?, category = ?, description = ?, accountId = ? WHERE id = ?'
				const values = [book.name, book.price, book.category, book.description, book.accountId, request.params.id]
			
				const updateBook = await connection.query(query, values)

				response.status(200).end()
			} catch (error) {
				response.status(500).json({error: "serverError"})
			} finally {
				connection.release()
			}
		}
	})
})

app.put('/review/:id/update', async function(request, response){
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	
	const review = request.body

	const errorMessages = []

	if(typeof review?.review != "string"){
		errorMessages.push("missingReview")
	} else if(review.review.length > MAX_REVIEW_LENGTH){
		errorMessages.push("reviewTooLong")
	} else if(review.review.length < MIN_REVIEW_LENGTH){
		errorMessages.push("reviewTooShort")
	}

	if(typeof review?.rating != "string"){
		errorMessages.push("missingRating")
	}

	if(errorMessages.length > 0){
		response.status(400).json(errorMessages)
		return
	}

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if(error){
			response.status(401).end()
		} else {
			const connection = await pool.getConnection()

			try {
				const query = "UPDATE reviews SET review = ?, rating = ? WHERE id = ?"

				const values = [review.review, review.rating, request.params.id]

				const updatedAccount = await connection.query(query, values)

				response.status(200).end()
			} catch(error) {
				response.status(500).json({error: "serverError"})
			} finally {
				connection.release()
			}
		}
	})
})

app.delete('/account/:id/delete', async function(request, response){
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	
	
	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if(error){
			response.status(401).end()
		} else {
			const connection = await pool.getConnection()
	
			try {
				const query = "DELETE FROM accounts WHERE id = ?"

				const values = [request.params.id]

				const deletedAccount = connection.query(query, values)

				response.status(200).json({accountDeleted: "true"})
			} catch(error) {
				response.status(400).json({error: "deleteFailed"})
			} finally {
				connection.release()
			}
		}
	})
})



app.delete('/book/:id/delete', async function(request, response){
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	
	
	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if(error){
			response.status(401).end()
		} else {
			const connection = await pool.getConnection()
	
			try {
				const query = "DELETE FROM books WHERE id = ?"

				const values = [request.params.id]

				const deletedAccount = connection.query(query, values)

				response.status(200).json({bookDeleted: "true"})
			} catch(error) {
				response.status(500).json({error: "deleteFailed"})
			} finally {
				connection.release()
			}
		}
	})
})

app.delete('/review/:id/delete', async function(request, response){
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)
	
	
	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if(error){
			response.status(401).end()
		} else {
			const connection = await pool.getConnection()
	
			try {
				const query = "DELETE FROM reviews WHERE id = ?"

				const values = [request.params.id]

				const deletedAccount = connection.query(query, values)

				response.status(200).json({reviewDeleted: "true"})
			} catch(error) {
				response.status(500).json({error: "deleteFailed"})
			} finally {
				connection.release()
			}
		}
	})
})

app.listen(8080)