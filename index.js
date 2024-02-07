const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Note = require("./models/note");

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.end("<h1>Hello js</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;

  Note.findById(id)
    .then((note) => {
      if (note) res.json(note);
      else res.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updateNote) => res.json(updateNote))
    .catch((error) => next(error));
});

const notExist = (req, res) => {
  res.status(400).send({ error: "not exist" });
};

app.use(notExist);

const errorHandle = (error, req, res, next) => {
  console.log(error.message);

  if (error.name == "CastError") {
    return res.status(400).send({ error: "malformed id" });
  } else if (error.name == "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandle);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
