const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const PLM = require('passport-local-mongoose');

const userSchema = new Schema({ 
    email: { 
        type: String,
        required: true,
    },
    photoURL: {
        type: String,
        default: '/assets/avatar2.png'
    },
    age: Number,
    active: Boolean,
    role: {
        type: String,
        enum: ['GUEST', 'USER', 'ADMIN'],
        default: 'GUEST'
    }
});

userSchema.plugin(PLM, {usernameField:'email'}); 
module.exports = mongoose.model('User', userSchema);