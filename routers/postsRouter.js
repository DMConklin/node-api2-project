const express = require('express')
const router = express.Router()
const db = require('../data/db')

router.get('/posts', async (req,res) => {
    try {
        const posts = await db.find()
        if (posts.length < 1) {
            return res.status(404).json({
                message: 'The posts could not be found.'
            })
        }
        res.json(posts)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'The posts information cound not be retrieved.'
        })
    }
})

router.get('/posts/:id', async (req,res) => {
    try {
        const post = await db.findById(req.params.id)
        if (post.length < 1) {
            return res.status(404).json({
                message: 'The post with the specified ID does not exist.'
            })
        }
        res.json(post)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'The post information could not be retrieved.'
        })
    }
})

router.get('/posts/:id/comments', async (req,res) => {
    const post = await db.findById(req.params.id)
    if (post.length < 1) {
        return res.status(404).json({
            message: 'The post with the specified ID does not exist.'
        })
    }
    const comments = await db.findPostComments(req.params.id)
    if (comments.length < 1) {
        return res.json({
            message: 'There are no comments for this post.'
        })
    }
    res.json(comments)
})

router.post('/posts', async (req,res) => {
    try {
        if (!req.body.title || !req.body.contents) {
            return res.status(400).json({
                message: 'Please provide title and contents for the post.'
            })
        }
        const postId = await db.insert(req.body)
        const post = await db.findById(postId.id)
        res.json(post)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'There was an error while saving the post to the database'
        })
    }
})

router.post('/posts/:id/comments', async (req,res) => {
    try {
        const post = await db.findById(req.params.id)
        if (post.length < 1) {
            return res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
        if (!req.body.text) {
            return res.status(400).json({
                message: "Please provide text for the comment."
            })
        }
        const commentId = await db.insertComment({...req.body, post_id: req.params.id})
        const comment = await db.findCommentById(commentId.id)
        res.status(201).json(comment)
        res.json()
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'There was an error while saving the comment to the database'
        })
    }
})

router.put('/posts/:id', async (req,res) => {
    try {
        const post = await db.findById(req.params.id)
        if (post.length < 1) {
            return res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
        if (!req.body.title || !req.body.contents) {
            return res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        }
        const success = await db.update(req.params.id, req.body)
        if (!success) {
            return res.json({
                message: 'The post could not be updated.'
            })
        }
        const updatedPost = await db.findById(req.params.id)
        res.json(updatedPost)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'The post information could not be modified.'
        })
    }
})

router.delete('/posts/:id', async (req,res) => {
    try {
        const success = await db.remove(req.params.id)
        if (!success) {
            return res.json({
                message: 'The post could not be deleted.'
            })
        }
        res.json({
            message: 'Post deleted'
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'The post could not be deleted.'
        })
    }
})

module.exports = router