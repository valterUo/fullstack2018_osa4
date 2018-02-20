const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try { const blogs = await Blog.find({})
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
  
  blogsRouter.post('/', async (request, response) => {
    if(request.body.title === undefined) {
      return response.status(400).json({error: 'title missing'})
    }
    if(request.body.url === undefined) {
      return response.status(400).json({error: 'url missing'})
    }

    const blogi = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes === undefined ? 0 : request.body.likes
    }

    const blog = new Blog(blogi)

    const result = await blog.save()
    response.status(201).json(result)
  })

  blogsRouter.delete('/:id', async (request, response) => {
    try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
    } catch (exception) {
      console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
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