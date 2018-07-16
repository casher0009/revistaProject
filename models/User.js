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
        default: 'http://lllkd.kcol'
    },
    age: Number,
    active: Boolean,
    // favBooks: [],
});

userSchema.plugin(PLM, {usernameField:'email'}); 
module.exports = mongoose.model('User', userSchema);

// places: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Place"
//     }
//   ],
//   books: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Place"
//     }
//   ],
//   events: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Event"
//     }
//   ]
// },
// {
//   timestamps: {
//     createdAt: "created_at",
//     updatedAt: "updated_at"
//   }
// }
// );