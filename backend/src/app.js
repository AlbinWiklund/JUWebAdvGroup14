import express from 'express'
import { createPool } from 'mariadb'

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
        const query = 'SELECT * FROM accounts WHERE id = ?'
        
        const value = [request.params.id]

        const selectedAccount = await connection.query(query, value)

        response.status(200).json(selectedAccount)
    } catch (error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

app.get('/allbooks', async function(request, response){
    const connection = await pool.getConnection()

    try {
        const query = 'SELECT * FROM books ORDER BY name'

        const books = await connection.query(query)

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
        const query = 'SELECT * FROM book WHERE id = ?'

        const value = [request.params.id]

        const selectedBook = await connection.query(query, value)

        response.status(200).json(selectedBook)
    } catch (error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

app.post('/sellbook', async function(request, response){
    const connection = await pool.getConnection()

    try {
        const query = 'INSERT INTO books(name, price, description, tag, accountID) VALUES (?, ?, ?, ?, ?)'

        const values = [request.body.name, request.body.price, request.body.description, request.body.tag, request.body.id]

        const sellBook = await connection.query(query, values)

        response.status(200).json(sellBook)
    } catch (error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

app.get('/:id', async function(request, response){
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

})

app.post('/signup', async function(request, response){
    const connection = await pool.getConnection()

    try {
        const query = 'INSERT INTO accounts(username, password, name, surname) VALUES (?, ?, ?, ?)'

        const values = [request.body.username, request.body.password, request.body.name, request.body.surname]

        const signUpAccount = await connection.query(query, values)

        response.status(200).json(signUpAccount)
    } catch (error) {
        console.log(error)
        response.status(500).end("Internal server error")
    } finally {
        connection.release()
    }

})

app.post('/signin', async function(request, response){
    const connection = await pool.getConnection()

    try {
        const query = 'SELECT * FROM accounts WHERE username = ? AND password = ?'

        const values = [request.body.username, request.body.password]

        const signInAccount = await connection.query(query, values)

        response.status(200).json(signInAccount,)
    } catch (error) {
        console.log(error)
        response.status(500).end("Internal server error.")
    } finally {
        connection.release()
    }
})

app.get('/accounts', async function(request, response){
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

app.get('/', function(request, response){
    console.log("Hola!")
    response.send('It works!')
})

console.log("listening on 80808")

app.listen(8080)