const Schema = require("mongoose").Schema;

const eventSchema = new Schema(
  {
    eventName: {
      type: String,
      required: true
    },
    organizedBy: String,
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
        "https://s3.amazonaws.com/joinnus.com-tester-bucket/user/14106/act5890cc1837041.jpg"
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
    },
    date:{
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = require("mongoose").model("Event", eventSchema);