import express from 'express'
import jwt from 'jsonwebtoken'
import { createPool } from 'mariadb'

const ACCESS_TOKEN_SECRET = "kjhkyfgdbwygcvdsfsdfs"
const MAX_BOOK_TITLE_LENGTH = 50
const MIN_BOOK_TITLE_LENGTH = 1
const MIN_CATEGORY_LENGTH = 2
const MIN_DESCRIPTION_LENGTH = 10
const MAX_DESCRIPTION_LENGTH = 150

const MAX_NAME_LENGTH = 20
const MIN_NAME_LENGTH = 1

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

app.get('/allusers', async function(request, response){
    const connection = await pool.getConnection()

    try {
        const query = 'SELECT * FROM accounts ORDER BY name'

        const accounts = await connection.query(query)

        response.status(200).json(accounts)
    } catch(error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

app.get('/allusers/:id', async function(request, response){
    const connection = await pool.getConnection()

    try {
        const query =  `SELECT accounts.id AS id, accounts.username AS username, books.id AS bookID, books.name AS bookTitle, reviews.id AS reviewID, reviews.review AS reviewDescription FROM accounts JOIN books ON accounts.id = books.accountID JOIN reviews ON accounts.id = reviews.accountID WHERE accounts.id = ?`
        
        const value = [request.params.id]
				
        const selectedAccount = await connection.query(query, value)
				console.log("------------------------- " + selectedAccount)
				console.log("------------------------- " + selectedAccount.length)
				if (selectedAccount.length < 1) {
					const accountOnlyQuery = 'SELECT accounts.id AS id, accounts.username AS username FROM accounts WHERE accounts.id = ?'
					const selectedOnlyAccount = await connection.query(accountOnlyQuery, value)
					console.log("this is the only accounts response: ", selectedAccount)
					response.status(200).json(selectedOnlyAccount)
				} else {
					console.log("this is the accounts response: ", selectedAccount)
					response.status(200).json(selectedAccount)
				}
    } catch (error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

app.get('/allbooks', async function(request, response){
    const connection = await pool.getConnection()
		console.log("all books")
    try {
        const query = 'SELECT * FROM books ORDER BY name'

        const books = await connection.query(query)
				console.log("inside all books")
        response.status(200).json(books)
    } catch(error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

app.get('/allbooks/:id', async function(request, response){
    const connection = await pool.getConnection()
    try {
        const query = 'SELECT * FROM books WHERE id = ?'

        const value = [request.params.id]

        const selectedBook = await connection.query(query, value)
				console.log(selectedBook)
        response.status(200).json(selectedBook)
    } catch (error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

/*app.get('/allbooks/:id/review', async function(request, response){
    const connection = await pool.getConnection()

    try {

    } catch (error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})*/

app.post('/allbooks/:id/review', async function(request, response){
    const connection = await pool.getConnection()

    try {
				const queryGetBookID = 'SELECT * FROM books WHERE id = ?'

				const bookValue = [request.params.id]

				const book = await connection.query(queryGetBookID, bookValue)

				const stringBookObject = JSON.stringify(book)

				const parsedBookObject = JSON.parse(stringBookObject)

        const query = 'INSERT INTO reviews(review, rating, accountID) VALUES (?, ?, ?)'

				console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA " + request.body.review)
				console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB " + request.body.rating)
				console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC " + parsedBookObject[0].accountID)

        const values = [request.body.review, request.body.rating, parsedBookObject[0].accountID]
				
        const review = await connection.query(query, values)

        response.status(200).json(review)
    } catch (error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

app.post('/sellbook', async function(request, response){
	const authorizationHeaderValue = request.get("Authorization")
	const accessToken = authorizationHeaderValue.substring(7)

	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async function(error, payload){
		if(error){
			response.status(401).end()
		} else {
			const sale = request.body
			const errorMessages = []

			if(typeof sale?.name != "string"){
				errorMessages.push("titleIsMissing")
			} else if(sale.name.length > MAX_BOOK_TITLE_LENGTH){
				errorMessages.push("titleIsTooLong")
			} else if(sale.name.length < MIN_BOOK_TITLE_LENGTH){
				errorMessages.push("titleIsTooShort")
			}

			if(typeof sale?.price != "number"){
				errorMessages.push("priceIsMissing")
			}

			if(typeof sale?.category != "string"){
				errorMessages.push("categoryIsMissing")
			}

			if(typeof sale?.description != "string"){
				errorMessages.push("descriptionIsMissing")
			} else if(sale.description.length > MAX_DESCRIPTION_LENGTH){
				errorMessages.push("descriptionIsTooLong")
			} else if(sale.description.length < MIN_DESCRIPTION_LENGTH){
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
					console.log(error)
					response.status(500).end("Internal server error.")
			} finally {
					connection.release()
			}
		}
	})

})

/*app.get('/:id', async function(request, response){
    const connection = await pool.getConnection()

    try {
        const id = request.params.id

        const query = 'SELECT * FROM accounts WHERE id = ?'

        const account = await connection.query(query, [id])

        response.status(200).json(account)
    } catch(error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }

})*/

app.post('/signup', async function(request, response){
    const connection = await pool.getConnection()
		console.log("signup post request")
    try {
        const query = 'INSERT INTO accounts(username, password, name, surname) VALUES (?, ?, ?, ?)'
				
        const values = [request.body.username, request.body.password, request.body.name, request.body.surname]

        const signUpAccount = await connection.query(query, values)

        response.status(200).end()
				console.log("------------------------ after status code 200 is sent as response")
    } catch (error) {
        console.log("-------------------------_", error)
        response.status(500).end("Internal server error")
    } finally {
        connection.release()
    }

})

app.post('/signin', async function(request, response){
	const grantType = request.body.grant_type
	const username = request.body.username
	const password = request.body.password

	if(grantType != "password"){
		response.status(400).json({error: "unsupporter_grant_type"})
		return
	} 
	
	const connection = await pool.getConnection()
	
	try {
		const query = 'SELECT * FROM accounts WHERE username = ? AND password = ?'

		const values = [request.body.username, request.body.password]

		const signInAccount = await connection.query(query, values)
		
		if(signInAccount[0].username == username && signInAccount[0].password == password){
			
			const payload = {
				sub: signInAccount[0].id,
				isLoggedIn: true,
			}
			console.log("---------------This is the payload: ", payload) //Console log
			
			jwt.sign(payload, ACCESS_TOKEN_SECRET, async function(error, accessToken){
				if(error){
					response.status(500).end()
				} else {
					response.status(200).json({
						access_token: accessToken,
						type: "bearer",
						accountID: signInAccount[0].id
					})
				}
			})
		} else {
			response.status(400).json({error: "invalid_grant"})
		}
	} catch (error) {
		response.status(400).json({error: "no_account"})
	} finally {
		connection.release()
	}
})

/*app.get('/accounts', async function(request, response){
    const connection = await pool.getConnection()
		console.log("accounts post request")
    try {
        const query = 'SELECT * FROM accounts ORDER BY name'

        const accounts = await connection.query(query)
				console.log(accounts)
        response.status(200).json(accounts)
    } catch(error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

app.get('/', function(request, response){
    console.log("Hola!")
    response.send('It works!')
})

console.log("listening on 80808")*/

app.listen(8080)