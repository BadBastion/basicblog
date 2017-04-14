const express = require('express'),
      router = express.Router(),
      Posts = require('../models/posts.js'),
      Moment = require('moment'),
      Lazy = require('../other_modules/lazy.js');


/* html pages */

router.get('/', function(req, res) {
  res.render(
    'index',
    { title: 'My-Blog' , message: 'THE BLOG!'},
    function(err, html){
      res.send(html);
    }
  )
});

router.get('/posts/new', function(req, res) {
  res.render(
    'form',
    { title: 'My-Blog : New' ,
      form_target: '/api/posts/create',
      form_title: 'A TITLE!',
      form_content: '...',
      form_id:-1,
      message: 'You are creating a new post! '},
    function(err, html){
      res.send(html);
    }
  )
});


router.get('/posts/edit/:id', function(req, res) {
  const post = Posts.get(req.params.id);
  res.render(
    'form',
    { title: 'My-Blog : Edit' ,
      form_target: '/api/posts/update',
      form_title: post.title,
      form_content: post.content,
      form_id: post.id,
      message: 'You are editting a post number '+post.id+'!'
    },
    function(err, html){
      res.send(html);
    }
  )
});

/* JSON api */

router.get('/api/posts/', function(req, res) {
  const posts = Posts.recent();
  res.json(posts);
});

router.get('/api/posts/search/:term', function(req, res) {
  const term = req.params.term.toLowerCase();
  const posts = (
    Lazy(Posts.recent())
      .filter( post => {
        post = post.title.replace(/[^a-z0-9]/gmi, " ");// slightly defensive programing, also fixes silly json match ' ' issue
        return post.toLowerCase().includes(term)
      })
      .toArray()
  );
  res.json(posts);
});

router.get('/api/posts/remove/:id', function(req, res) {
  res.send("newpost");
});

router.post('/api/posts/create', function(req, res) {
  const title = req.body.title;
  const content = req.body.content;
  const dateTime = Moment().format('llll');

  Posts.add({
    title: title,
    content: content,
    created: dateTime,
    modified: dateTime
  });
  res.send("it worked!");
});

router.post('/api/posts/update', function(req, res) {
  const id = req.body.id;
  const title = req.body.title;
  const content = req.body.content;
  const dateTime = Moment().format('llll');
  Posts.edit({id: parseInt(id),
      title: title,
      content: content,
      modified: dateTime
    });
  res.send("it worked!");
});




module.exports = router;
