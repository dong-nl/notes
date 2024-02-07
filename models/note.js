const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URL;

console.log("connecting to url", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to mongodb");
  })
  .catch((error) => {
    console.log("Failed connected to mongodb", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnResult) => {
    returnResult.id = returnResult._id.toString();
    delete returnResult._id;
    delete returnResult.__v;
  },
});

module.exports = new mongoose.model("Note", noteSchema);
