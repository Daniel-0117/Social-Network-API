const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction  } = require('../models');

const peasantCount = async () => {
    const peasantCount = await User.agregate({})
      .count('peasantCount');
    return peasantCount;
};


//Get all Users
module.exports = {
    
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        }
        );
    },
};

//grab a single user by id
module.exports = {
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No peasant found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
};

//create a new user
module.exports = {
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    }
};

//update a user by id
module.exports = {
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
    }
};