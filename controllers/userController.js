const { User, Thought } = require('../models/User');

//Get all Users
module.exports = {
    
    async getAllUsers(req, res) {
        try {
            const dbUserData = await User.find()
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v');
            res.json(dbUserData);
        } catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    },


//grab a single user by id

  async getUserById({ params }, res) {
    try {
      const dbUserData = await User.findOne({ _id: params.id })
      .populate({
          path: 'thoughts',
          select: '-__v'
      })
      .populate({
          path: 'friends',
          select: '-__v'
      })
      .select('-__v');
      if (!dbUserData) {
        res.status(404).json({ message: 'No peasant found with this id!' });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },


//create a new user

   async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
},

//update a user by id
async updateUser({ params, body }, res) {
  try {
    const dbUserData = await User.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true, runValidators: true }
    );
    if (!dbUserData) {
      res.status(404).json({ message: 'No peasant found with this id!' });
      return;
    }
    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
},

//delete a user

    async deleteUser({ params }, res) {
        const peasantCount = await peasantCount();
        if (peasantCount <= 1) {
            return res.status(400).json({ message: 'You cannot delete the last peasant!' });
        }
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No peasant found with this id!' });
                return;
            }
            return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
        })
        .then(() => {
            res.json({ message: 'Peasant has been removed from the kingdom!' });
        })
        .catch(err => res.json(err));
    },


//add a friend

    async addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No peasant found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    }, 


//delete a friend

  async removeFriend({ params }, res) {
    User.findOneAndUpdate(
        { _id: params.id },
        { $pull: { friends: params.friendId } },
        { new: true }
    )
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No peasant found with this id!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
}

};


// module.exports = userController;

