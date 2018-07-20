const Schema = require("mongoose").Schema;

const placeSchema = new Schema(
  {
    placeName: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        default: "Point"
      },
      address: String,
      coordinates: [Number]
    },
    description: {
      type: String
    },
    photoURL: {
      type: String,
      default:
        "http://backgroundcheckall.com/wp-content/uploads/2017/12/background-kids-color.jpg"
    },
    aportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      childPath: "places"
    },
    cost: {
      type: String,
      enum: ["desconocido", "gratis", "menor a $100", "mayor a $100"],
      default: "desconocido"
    },
    recomendedAge: {
      type: String,
      enum: [
        "todas las edades",
        "menos de 3 años",
        "entre 3 y 11 años",
        "mas de 11 años"
      ],
      default: "todas las edades"
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = require("mongoose").model("Place", placeSchema);
