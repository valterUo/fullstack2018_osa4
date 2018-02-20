const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogsRouter.post('/', (request, response) => {
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

    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })

  module.exports = blogsRouter