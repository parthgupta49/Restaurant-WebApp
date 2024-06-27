//Import the required modules
const express = require('express');
const router = express.Router();

//Import the Controllers

//Course Controllers Import
const {
    createProduct,
    showAllProducts,
    getProductDetails
} = require('../controllers/Products');

//categories controller Import
const {
    createCategory,
    showAllCategories, 
    categoryPageDetails,
} = require('../controllers/Category');

//Sections controllers Import
// const {
//     createSection,
//     updateSection, 
//     deleteSection,
// } = require('../controllers/Section');

//Sub-sections controllers Import
// const {
//     createSubSection,
//     updateSubSection,
//     deleteSubSection,
// } = require('../controllers/Subsection');

//Rating Controllers Import
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require('../controllers/RatingAndReview');

//Importing Middlewares
const {auth, isVisitor, isAdmin} = require('../middleware/auth');

//*************************************************************************************
//                  Course Routes
//*************************************************************************************

//Courses can only be created by instructor
router.post('/createProduct', createProduct);
//Add a Section to a Course
// router.post('/addSection', auth, isInstructor, createSection);
//Update a Section
// router.post('/updateSection', auth, isInstructor, updateSection);
//Delete a Section
// router.post('/deleteSection', auth, isInstructor, deleteSection);
//Edit a Sub Section
// router.post('/updateSubSection', auth, isInstructor, updateSubSection);
//Delete a Sub Section
// router.post('/deleteSubSection', auth, isInstructor, deleteSubSection);
//Add a Sub Section to a Section
// router.post('/addSubSection', auth, isInstructor, =createSubSection);
//Get all Registered Courses
router.get('/getAllProducts',showAllProducts);
//Get Details for a Specific Courses 
router.post('/getProductDetails', getProductDetails);

//***********************************************************************
//              Category Routes (Only By Admin)
//***********************************************************************
router.post('/createCategory', createCategory);
router.get('/showAllCategories', showAllCategories);
router.post('/getCategoryPageDetails', categoryPageDetails);


//*****************************************************************************
//              Rating And Review
//*****************************************************************************
router.get('/createRating', auth, isVisitor, createRating);
router.get('/getAverageRating', getAverageRating);
router.get('/getReviews', getAllRating);


module.exports = router;

