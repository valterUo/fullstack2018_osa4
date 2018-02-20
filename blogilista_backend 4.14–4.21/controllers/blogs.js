const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  try { const blogs = await Blog
      .find({})
      .populate('user', { username:1, name: 1 })
      
       if(blogs) { 
         response.json(blogs)
       } else {
        response.status(404).end()
       }
      } catch (exception) {
        console.log(exception)
        response.status(400).end()
      }
  })

  const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }
  
  blogsRouter.post('/', async (request, response) => {

    try {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, 'process.env.SECRET')

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if(request.body.title === undefined) {
      return response.status(400).json({error: 'title missing'})
    }
    if(request.body.url === undefined) {
      return response.status(400).json({error: 'url missing'})
    }

    const theuser = await User.findById(decodedToken.id)

    if(theuser) {
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes === undefined ? 0 : request.body.likes,
      user: theuser._id
    })

    const savedBlog = await blog.save()
    theuser.blogs = theuser.blogs.concat(savedBlog._id)
    await theuser.save()
    response.status(201).json(Blog.format(savedBlog))
  } else {

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes === undefined ? 0 : request.body.likes
    })
    const savedBlog = await blog.save()
    response.status(201).json(Blog.format(savedBlog))
  } } catch (exception){
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  } 
  })

  blogsRouter.delete('/:id', async (request, response) => {
    try {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, 'process.env.SECRET')

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(401).json({error: 'unauthorized user'})
    }
    
    } catch (exception) {
      if (exception.name === 'JsonWebTokenError' ) {
        response.status(401).json({ error: exception.message })
      } else {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
      }
      
    }
  })

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const updatedBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
  response.json(result)
  })

  module.exports = blogsRouter