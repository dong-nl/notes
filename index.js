const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.end("<h1>Hello js</h1>");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);

  if (note) res.json(note);
  else {
    res.statusMessage = `Can not find note ${id}`;
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);

  res.status(204).end();
});

const generateId = () => {
  let maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    res.status(400).end({
      error: "missing content",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  res.json(note);
});

const notExist = (req, res) => {
  res.status(400).send({ error: "not exist" });
};

app.use(notExist);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
