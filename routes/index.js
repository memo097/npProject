const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var unirest = require('unirest');

// Post Models
const Post = require('../models/Post');

// Welcome Page
router.get('/', (req, res) => res.render('accueil'))
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
    name: req.user.name
}));
// Connect API
let data = ""

    var req = unirest("GET", "https://api.deezer.com/chart/0/albums");

    req.headers({
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        "x-rapidapi-key": "c6672eaa25msha1c49ebc2d68193p117e1cjsn8b720fafa464"
    });
    
    
    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        data= res.body.data
        console.log(res.body.data[0]);

    });


router.get('/album', (req, res) =>{
    res.render('album',{data:data})
})

router.get('/news', (req, res) =>{
    res.render('news')
})

router.get('/accueil', (req, res) =>{
    Post.find({},function(err,posts){
        console.log(posts)
        res.render('accueil',{posts:posts})
    })
    
})

router.post('/accueil', (req, res) =>{

    console.log(req.body.title)
    const newPost = new Post({
        title:req.body.title,
        description:req.body.description,
        img:req.body.img,  
    })
    newPost.save()
    res.redirect('accueil')
})

router.get('/concert', (req, res) =>{
    res.render('concert')
})

module.exports = router;