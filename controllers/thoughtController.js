const Thought = require('../models/Thought');
// const User = require('../models/User');

module.exports = {
 
   // Get all thoughts
   async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get a single thought
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new thought
  async addThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: req.body._id } },
      { new: true }
      );
      console.log(req.body)

      if (!user) {
          return res.status(404).json({
            message: 'Thought created, but found no user with that ID',
          });
        }

      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update a thought
  async updateThought(req, res) {
      try {
          const results = await Thought.updateOne({ _id: req.params.thoughtId })
      res.json(results);
      } catch (error) {
      res.status(500).json(err);
      }
  },
  // delete a thought by id
  async removeThought(req, res) {
      try {
          const results = await Thought.deleteOne({ _id: req.params.thoughtId })
      res.json(results);
      } catch (error) {
      res.status(500).json(err);
      }
  },
  // create a reaction stored in a single user's reactions array field
  async addReaction(req, res) {
      try {
          const thought = await Thought.findOneAndUpdate(
              { _id: req.params.thoughtId },
              { $addToSet: { reactions: req.body.reactionBody } },
              { new: true }
          );

          if (!thought) {
              return res.status(404).json({
                message: 'Reaction created, but found no thought with that ID',
              });
            }
      
            res.json('Created the reaction');
      } catch (err) {
          res.status(500).json(err);
      }
  },
  // delete a reaction
  async removeReaction(req, res) {
      try {
          const thought = await Thought.findOne({ _id: req.params.thoughtId })
          const reaction = await Thought.deleteOne(
              { _id: res.body.reactions },
          );

          if (!thought) {
              return res.status(404).json({
                message: 'no thought with that ID',
              });
            }
      
            res.json('Deleted the reaction');
      } catch (err) {
          res.status(500).json(err);
      }
  }
};


// module.exports = thoughtController;
