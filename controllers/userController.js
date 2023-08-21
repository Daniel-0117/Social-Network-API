const User = require('../models/User');

//Get all Users
module.exports = {
    
    async getAllUsers(req, res) {
        try {
            const allUsers = await User.find({});
            res.json(allUsers);
        } catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    },


//grab a single user by id

  async getUserById({ params }, res) {
    try {
      const oneUser = await User.findOne({ _id: params.id })
      .select('-__v');
      if (!oneUser) {
        res.status(404).json({ message: 'No peasant found with this id!' });
        return;
      }
      res.json(oneUser);

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
        try {
            const dbUserData = await User.findOneAndDelete({ _id: params.id });
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


//add a friend

    
      async addFriend(req, res) {
        try {
          const result = await User.findOneAndUpdate(
            { _id: req.params.userId },
            {  $addToSet: { friends: req.params.friendId } }
            );
          console.log(result)
          res.status(200).json(result)
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'something went wrong' });
        }
      },
     


//delete a friend

async removeFriend(req, res) {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.userId },
      {  $pull: { friends: req.params.friendId } }
      );
      console.log(result)
    console.log('Deleted friend from friend list')
    res.status(200).json(result)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
}

};


// module.exports = userController;

