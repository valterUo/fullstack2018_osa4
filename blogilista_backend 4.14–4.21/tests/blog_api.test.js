const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeAll(async () => {
    await helper.initializeDb()
  })

test('blogs are returned in JSON format with status 200', async () => {
    await api
       .get('/api/blogs')
       .expect(200)
       .expect('Content-Type', /application\/json/)
       })
test('there are right amount of blogs in database', async () => {
    const blogsInDatabase = await helper.blogsInDb()
       const response = await api
         .get('/api/blogs')
       expect(response.body.length).toBe(blogsInDatabase.length)
     })
     
test('the first blog title is right', async () => {
    const blogsInDatabase = await helper.blogsInDb()
       const response = await api
         .get('/api/blogs')
       expect(response.body[0].title).toBe(blogsInDatabase[0].title)
     })
  describe('checking that blog adding works', () => {
    /*beforeAll(async () => {
      const newUser = new User({
        username: "kokeilukokeilu",
        name: "N.N.",
        adult: false,
        password: "123456"
    })
    await newUser.save()
    })*/
test('blog is added succesfully', async () => {
  
  const userkokeilu = await User.find({username: "admin2"})
  console.log(userkokeilu)
    const blogsInBeginning = await helper.blogsInDb()
    const newBlog = {
        title: 'Die Verwirrungen des Zöglings Törleß',
        author: 'Robert Musil',
        url: 'https://www.gutenberg.org/files/34717/34717-h/34717-h.htm',
        likes: 147,
        userId: userkokeilu._id
      }

      await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsInBeginning.length + 1)
  })

test('if likes is empty, then likes = 0', async () => {
    const newBlogWithoutLikes = {
        title: 'Die Verwirrungen des Zöglings Törleß',
        author: 'Robert Musil',
        url: 'https://www.gutenberg.org/files/34717/34717-h/34717-h.htm'
      }

    const response =  await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    
    expect(response.body.likes === 0)
  })

  })

test('blog without title is not added', async () => {
    const newBlogWithoutTitle = {
        author: 'Robert Musil',
        url: 'https://www.gutenberg.org/files/34717/34717-h/34717-h.htm',
        likes: 7
      }

    const response =  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    
    expect(response.body === 'title missing')
  })

test('blog without url is not added', async () => {
    const newBlogWithoutTitle = {
        title: 'Die Verwirrungen des Zöglings Törleß',
        author: 'Robert Musil',
        likes: 7
      }

    const response =  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    
    expect(response.body === 'url missing')
  })

describe('deletion of a blog', async () => {
    let addedBlog
    beforeAll(async () => {
        addedBlog = new Blog({
        title: 'Die Verwirrungen des Zöglings Törleß',
        author: 'Robert Musil',
        url: 'https://www.gutenberg.org/files/34717/34717-h/34717-h.htm',
        likes: 7
      })

      await addedBlog.save()
    })
    
    test('blog is removed succesfully with right status code', async () => {

    const blogsInBeginning = await helper.blogsInDb()

    await api
    .delete(`/api/blogs/${addedBlog._id}`)
    .expect(204)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsInBeginning.length - 1)
  })
    })

describe('updating of a blog', async () => {
    let addedBlog
    beforeAll(async () => {
        addedBlog = new Blog({
        title: 'Die Verwirrungen des Zöglings Törleß',
        author: 'Robert Musil',
        url: 'https://www.gutenberg.org/files/34717/34717-h/34717-h.htm',
        likes: 7
      })
      await addedBlog.save()
    })

    test('updating likes', async () => {
        let updatedBlog = new Blog({
            title: 'Die Verwirrungen des Zöglings Törleß',
            author: 'Robert Musil',
            url: 'https://www.gutenberg.org/files/34717/34717-h/34717-h.htm',
            likes: 42
        })
       const response = await api
       .put(`/api/blogs/${addedBlog._id}`)
       .send(updatedBlog)

        expect(response.body._id).toBe(String(addedBlog._id))
        expect(response.body.likes).toBe(42)
    })

    test('updating name', async () => {
        let updatedBlog = new Blog({
            title: 'New name of the blog',
            author: 'Robert Musil',
            url: 'https://www.gutenberg.org/files/34717/34717-h/34717-h.htm',
            likes: 42
        })
       const response = await api
       .put(`/api/blogs/${addedBlog._id}`)
       .send(updatedBlog)

        expect(response.body._id).toBe(String(addedBlog._id))
        expect(response.body.title).toBe('New name of the blog')
        
    })

    })

afterAll(() => {
  server.close()
   })