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

module.exports = router