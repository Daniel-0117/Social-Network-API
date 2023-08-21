const router = require('express').Router();

const {
    getThoughts,
    getThoughtById,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(addThought);
router.route('/:id')
.get(getThoughtById)
.put(updateThought)
.delete(removeThought);

router.route('/:thoughtId/reactions')
.post(addReaction)
.delete(removeReaction);


module.exports = router;