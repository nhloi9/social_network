const express = require('express');
const postController = require('../controllers/post');
const postLikeController = require('../controllers/post_like');
const postSaveController = require('../controllers/post_save');
const router = express.Router();
// const validate = require('../validations/user');
const auth = require('../middleware/auth');

router.post('/', auth, postController.create);
router.get('/', auth, postController.getPosts);
router.put('/:id', auth, postController.update);
router.put('/:id/like', auth, postLikeController.create);
router.put('/:id/unlike', auth, postLikeController.delete);
router.post('/:id/save', auth, postSaveController.create);
router.get('/save/list', auth, postSaveController.getSavedPosts);
router.delete('/:id/unsave', auth, postSaveController.delete);
// router.put('/:id/like', auth, postLikeController.create);

router.get('/user_posts/:id', auth, postController.getUserPosts);
router.get('/:id', auth, postController.getPost);
router.get('/discover/list', auth, postController.getPostsDiscover);
router.delete('/:id', auth, postController.delete);

module.exports = router;
