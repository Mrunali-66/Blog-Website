const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');  // Add this if missing

const app = express();
const port = 3000;

// Middleware

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// In-memory storage for blog posts
let posts = [];

// Routes
// Home page - list all posts
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// Create new post page
app.get('/create', (req, res) => {
    res.render('create');
});

// Handle post creation
app.post('/create', (req, res) => {
    const { title, content } = req.body;
    if (title && content) {
        const newPost = {
            id: posts.length + 1,
            title,
            content,
            createdAt: new Date()
        };
        posts.push(newPost);
        res.redirect('/');
    } else {
        res.render('create', { error: 'Title and content are required' });
    }
});

// Edit post page
app.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        res.render('edit', { post });
    } else {
        res.redirect('/');
    }
});

// Handle post update
app.post('/edit/:id', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex !== -1) {
        const { title, content } = req.body;
        if (title && content) {
            posts[postIndex] = {
                ...posts[postIndex],
                title,
                content
            };
            res.redirect('/');
        } else {
            res.render('edit', { 
                post: posts[postIndex], 
                error: 'Title and content are required' 
            });
        }
    } else {
        res.redirect('/');
    }
});

// Handle post deletion
app.post('/delete/:id', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
    }
    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`Blog app listening at http://localhost:${port}`);
});