const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction  } = require('../models/Thought');

module.exports = {
 
    // get all thoughts
    async getAllThoughts(req, res) {
        try {
            const dbThoughtData = await Thought.find()
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v');
            res.json(dbThoughtData);
        } catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    },

//get a single thought by its _id
async getThoughtById({ params }, res) {
  try {
    const dbThoughtData = await Thought.findOne({ _id: params.id })
    .populate({
        path: 'reactions',
        select: '-__v'
    })
    .select('-__v');
    if (!dbThoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(dbThoughtData);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
},


// add thought to user
async addThought ({ params, body }, res) {
    try {
        const dbThoughtData = await Thought.create(body);
        const dbUserData = await User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: dbThoughtData._id } },
            { new: true }
        );
        if (!dbUserData) {
            res.status(404).json({ message: 'No peasant found with this id!' });
            return;
        }
        res.json(dbUserData);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }  
},

// update thought by its _id
async updateThought ({ params, body }, res) {
    try {
        const dbThoughtData = await Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        );
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
},

// remove thought
async removeThought({ params }, res) {
    try {
        const dbThoughtData = await Thought.findOneAndDelete({ _id: params.id });
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
},

// add reaction
async addReaction ({ params, body }, res) {
    try {
        const dbThoughtData = await Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        );
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
},

// remove reaction
async removeReaction ({ params }, res) {
   try {
       const dbThoughtData = await Thought.findOneAndUpdate(
           { _id: params.thoughtId },
           { $pull: { reactions: { reactionId: params.reactionId } } },
           { new: true }
       );
       if (!dbThoughtData) {
           res.status(404).json({ message: 'No thought found with this id!' });
           return;
       }
       res.json({ message: 'Reaction has been deleted!' });
   
} catch (err) {
    console.log(err);
    res.sendStatus(400);
}

}};


// module.exports = thoughtController;
