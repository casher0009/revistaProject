// const mongoose = require ('mongoose');
// const Schema = mongoose.Schema;
// const PLM = require('passport-local-mongoose');

// const userSchema = new Schema({ 
//     email: { 
//         type: String,
//         required: true,
//     },
//     photoURL: {
//         type: String,
//         default: 'http://lllkd.kcol'
//     },
//     age: Number,
//     active: Boolean,
//     // favBooks: [],
// });

// userSchema.plugin(PLM, {usernameField:'email'}); 
// module.exports = mongoose.model('User', userSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    photoURL: {
      type: String,
      default:
        "https://png.pngtree.com/element_origin_min_pic/16/09/07/1157cf862f9bbea.jpg"
    },
    places: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place"
      }
    ],
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place"
      }
    ],
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
