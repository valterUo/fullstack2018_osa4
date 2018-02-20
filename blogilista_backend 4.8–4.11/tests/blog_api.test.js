const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
      },
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
      },
      {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
      },
      {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
      },
      {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
      }
]

beforeAll(async () => {
    await Blog.remove({})
  
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

test('blogs are returned', async () => {
 await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    })
test('there are 6 blogs in database', async () => {
    const response = await api
      .get('/api/blogs')
    expect(response.body.length).toBe(6)
  })
  
test('the first blog title is React patterns', async () => {
    const response = await api
      .get('/api/blogs')
    expect(response.body[0].title).toBe('React patterns')
  })

test('blog is added succesfully', async () => {
    const newBlog = {
        title: 'Die Verwirrungen des Zöglings Törleß',
        author: 'Robert Musil',
        url: 'https://www.gutenberg.org/files/34717/34717-h/34717-h.htm',
        likes: 147
      }

      await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api
    .get('/api/blogs')

    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain('Die Verwirrungen des Zöglings Törleß')

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

afterAll(() => {
  server.close()
    })