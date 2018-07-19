const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  author: String,
  description: String,
  photoURL: {
    type: String,
    required: true,
    default: "http://lllkd.kcol"
  }
});

module.exports = mongoose.model("Book", bookSchema);
