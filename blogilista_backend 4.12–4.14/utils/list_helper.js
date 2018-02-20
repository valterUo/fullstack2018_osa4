const dummy = (blogs) => {
  return 1
}

const format = (blog) => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    }
    return newBlog
}

const formatAuthor = (blog) =>{
  const newBlog = {
    author: blog.author,
    likes: blog.likes
  }
  return newBlog
}

const totalLikes = (blogs) => {

  if(blogs === undefined || blogs === []) {
    return 0
  }

  return blogs.reduce((total, blog) => {
        return total + blog.likes
  }, 0)

}

const favoriteBlog = (blogs) => {
  if(blogs[0] === undefined) {
    return 'There are no blogs in the database.'
  }
  const newBlogs = blogs.map(blog => format(blog))
  const favourite = newBlogs[0]
  return newBlogs.reduce((favourite, blog) => {
    if(blog.likes > favourite.likes) {
      favourite = blog
    }
    return  favourite
}, favourite)
}

const mostBlogs = (blogs) => {
  if(blogs[0] === undefined) {
    return 'There are no blogs in the database.'
  }

  const authors = new Map()
  const count = blogs.reduce((authors, blog) => {
    if(!authors.has(blog.author)) {
      authors.set(blog.author, 1)
    } else {
    let blogss = authors.get(blog.author)
    authors.set(blog.author, blogss + 1)
    }
    return authors
  } , authors)

  let max = 0
  let kirjoittaja = ''
  
  for (var [key, value] of authors) {
    if(value > max) {
      max = value
    }
  }

  for (var [key, value] of authors) {
    if(value === max) {
      kirjoittaja = key
    }
  
  }
  const author = {
    author: kirjoittaja,
    blogs: authors.get(kirjoittaja)
  }
return author 
}

const mostLikes = (blogs) => {
  if(blogs[0] === undefined) {
    return 'There are no blogs in the database.'
  }
  const newBlogs = blogs.map(blog => formatAuthor(blog))
  const authors = new Map()
  const count = newBlogs.reduce((authors, blog) => {
    if(!authors.has(blog.author)) {
      authors.set(blog.author, blog.likes)
    } else {
    let likess = authors.get(blog.author)
    authors.set(blog.author, blog.likes + likess)
    }
    return authors
  } , authors)

  let max = 0
  let kirjoittaja = ''
  
  for (var [key, value] of authors) {
    if(value > max) {
      max = value
    }
  }

  for (var [key, value] of authors) {
    if(value === max) {
      kirjoittaja = key
    }
  
  }
  const author = {
    author: kirjoittaja,
    likes: authors.get(kirjoittaja)
  }
return author 
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}