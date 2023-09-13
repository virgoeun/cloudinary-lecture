// routes/movie.routes.js

const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie.model');
const fileUploader = require('../config/cloudinary.config')

// GET route to display the form to create a new movie
router.get('/movies/create', (req, res) => res.render('movie-views/movie-create'));

// routes/movie.routes.js

// ... all imports and routes stay untouched

// POST route for saving a new movie in the database
// This route has the image upload example 
router.post('/movies/create', fileUploader.single('movie-cover-image'), (req, res) => {
    const { title, description } = req.body;
  
    Movie.create({ title, description, imageUrl: req.file.path })
      .then(newlyCreatedMovieFromDB => {
        console.log(newlyCreatedMovieFromDB);
        res.redirect('/movies');
      })
      .catch(error => console.log(`Error while creating a new movie: ${error}`));
  });
  
// routes/movie.routes.js

// ... all imports and routes stay untouched

// GET route to display all the movies
router.get('/movies', (req, res) => {
    Movie.find()
      .then(moviesFromDB => {
        // console.log(moviesFromDB);
        res.render('movie-views/movies-list.hbs', { movies: moviesFromDB });
      })
      .catch(err => console.log(`Error while getting the movies from the DB: ${err}`));
  });
  
 // routes/movie.routes.js

// ... all imports and routes stay untouched

// GET route for querying a specific movie from the database
// and pre-filling the edit form
router.get('/movies/:id/edit', (req, res) => {
    const { id } = req.params;
  
    Movie.findById(id)
      .then(movieToEdit => res.render('movie-views/movie-edit', movieToEdit))
      .catch(error => console.log(`Error while getting a single movie for edit: ${error}`));
  });
  router.post('/movies/:id/edit', fileUploader.single('movie-cover-image'), (req, res) => {
    const { id } = req.params;
    const { title, description, existingImage } = req.body;
   
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = existingImage;
    }
   
    Movie.findByIdAndUpdate(id, { title, description, imageUrl }, { new: true })
      .then(() => res.redirect(`/movies`))
      .catch(error => console.log(`Error while updating a single movie: ${error}`));
  });


module.exports = router;
