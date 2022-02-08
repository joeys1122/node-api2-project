// implement your posts router here
const { Router } = require('express');
const Post = require('./posts-model');

const router = Router();

router.get('/', (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "The posts information could not be retrieved" });
    })
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      post ? 
      res.status(200).json(post) :
      res.status(404).json({ message: "The post with the specified ID does not exist" })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "The post information could not be retrieved" })
    })
});

router.post('/', (req, res) => {
  if(!req.body.title || !req.body.contents) {
    res.status(400).json({ message: "Please provide title and contents for the post" });
  } else {
    Post.insert(req.body)
      .then(post => {
        return Post.findById(post.id)
      })
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "There was an error while saving the post to the database" });
      })
  }
});

router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
      return;
    }

    if(!req.body.title || !req.body.contents) {
      res.status(400).json({ message: "Please provide title and contents for the post" });
      return;
    } else {
      const updatePost = await Post.update(req.params.id, req.body);
      if(updatePost) {
        const newPost = await Post.findById(req.params.id);
        res.status(200).json(newPost)
      }
    }
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "The post information could not be modified" });
  } 
});

module.exports = router;