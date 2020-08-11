const express = require("express")
const router = express.Router()
const posts = require("../data/db")



router.get('/api/posts', (req,res) => {
    posts.find()
        .then(posts => {
            res.json(posts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The posts information could not be retrieved."
            })
        })
})

router.get('/api/posts/:id', (req,res) => {
    posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                res.json(post)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The post information could not be retrieved."
            })
        })
})

router.get('/api/posts/:id/comments', (req,res) => {
    posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                return posts.findPostComments(req.params.id)
            }
        })
        .then(comments => {
            res.json(comments)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The comments information could not be retrieved."
            })
        })
})

router.post('/api/posts', (req,res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post."
        })
    } else {
        posts.insert(req.body)
            .then(post => {
                return posts.findById(post.id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "There was an error while saving the post to the database"
                })
            })
    }
})

router.post('/api/posts/:id/comments', (req,res) => {
        posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else if (!req.body.text) {
                res.status(400).json({
                    message: "Please provide text for the comment."
                })
            } else {
                return posts.insertComment({...req.body, post_id: req.query.post_id})
            }
        })
        .then(comment => {
            return posts.findCommentById(comment.id)
        })
        .then(comment => {
            res.status(201).json(comment)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error while saving the comment to the database"
            })
        })    
})

router.delete('/api/posts/:id', (req,res) => {
    posts.remove(req.params.id)
        .then(success => {
            if (!success) {
                return res.status(404).json({
                    message: "The post with the specified ID doesn't not exist."
                })
            }
            res.json({
                message: "Post deleted"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The post could not be deleted"
            })
        })
})

router.put('/api/posts/:id', (req,res) => {
    posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else if (!req.body.title || !req.body.contents) {
                res.status(400).json({
                    message: "Please provide title and contents for the post"
                })
            } else {
                return posts.update(req.params.id, req.body)
            }
        })
        .then(success => {
            console.log(success)
            return posts.findById(req.params.id)
        })
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "The post information could not be modified"
            })
        })
})

module.exports = router