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
                message: "There was an error fetching posts"
            })
        })
})

router.get('/api/posts/:id', (req,res) => {
    posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "Post not found"
                })
            } else {
                res.json(post)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error while fetching post"
            })
        })
})

router.get('api/posts/:id/comments', (req,res) => {
    findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "Post not found"
                })
            } else {
                return findPostComments(req.params.id)
            }
        })
        .then(comments => {
            res.json(comments)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error fetching comments for this post"
            })
        })
})

router.post('/api/posts', (req,res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            message: "Posts must contain a title and contents"
        })
    }

    posts.insert(req.body)
        .then(() => {
            res.status(201).json({
                message: "Posted successfully"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error posting your post"
            })
        })
})

module.exports = router