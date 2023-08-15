const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
            trim: true
        },
       thoughts: [
              { 
                type: Schema.Types.ObjectId,
                ref: 'Thought'
                },
            ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
        ],
    },
    {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
    }

);

const User = model('User', userSchema);

module.exports = User;
