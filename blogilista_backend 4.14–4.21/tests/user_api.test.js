const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

describe('user testing', async () => {
test('creating new user succeed', async () => {
    const usersInBeginning = await helper.usersInDb()
    const usernameNew = "admin" + usersInBeginning.length //creating username which probably doesn't exist in the Db
    const newUser = {
        username: usernameNew,
        name: "N.N.",
        adult: false,
        password: "123456"
    }
    await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter.length).toBe(usersInBeginning.length + 1)
    })

test('password at least 3 characters, status code 400: password must be at least 3 characters', async () => {
    const usersInBeginning = await helper.usersInDb()
    const newUser = {
        username: 'passwordtesting',
        name: "N.N.",
        adult: false,
        password: "12"
    }

    const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    
    expect(response.body === 'password must be at least 3 characters')
    const usersAfter = await helper.usersInDb()
    expect(usersAfter.length).toBe(usersInBeginning.length)
    })

test('username must be unique, status code 400', async () => {

    const newUser = {
        username: 'adminadmin',
        name: "N.N.",
        adult: false,
        password: "123456"
    }
    await api
    .post('/api/users')
    .send(newUser)

    const usersInBeginning = await helper.usersInDb()

    const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    expect(response.body === 'username must be unique')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter.length).toBe(usersInBeginning.length)
    })
    })

afterAll(() => {
    server.close()
         })

