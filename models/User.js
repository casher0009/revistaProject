const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({ 
    email: { 
        type: String,
        required: true,
    },
    photoURL: {
        type: String,
        default: 'http://lllkd.kcol'
    },
    age: Number,
    active: Boolean,
    // favBooks: [],
});

module.exports = mongoose.model('User', userSchema);