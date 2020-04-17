const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const register = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  }

  repositories.push(register);

  return res.status(200).json(register)
});

app.get("/repositories", (req, res) => {
  
  return res.json(repositories);
});

app.put("/repositories/:id", (req, res) => {
  const { title, url, techs } = req.body;
  const { id } = req.params;
  const indexRepo = repositories.findIndex(repo => repo.id === id);
  const dataRepo = repositories[indexRepo];

  if(indexRepo < 0) {
    return res.status(400).json({error: "Repository that does not exist"})
  }
  
  const updateRepo = {}

  updateRepo['id'] = id;
  updateRepo['title'] = title ? title : dataRepo.title;
  updateRepo['url'] = url ? url : dataRepo.url;
  updateRepo['techs'] = techs ? techs : dataRepo.techs;
  updateRepo['likes'] = dataRepo.likes;

  repositories[indexRepo] = updateRepo;

  return res.status(200).json(repositories[indexRepo]);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if(indexRepo < 0) {
    return res.status(400).json({error: "Repository that does not exist"})
  }

  const repoRemoved = repositories.splice(indexRepo, 1);
  
  return res.status(204).json(repoRemoved);

});

app.post("/repositories/:id/like", (req, res) => {
  const { like } = req.body;
  const { id } = req.params;
  const indexRepo = repositories.findIndex(repo => repo.id === id);
  const repositorie = repositories[indexRepo];

  if(indexRepo < 0) {
    return res.status(400).json({error: "Repository that does not exist"})
  }

  repositorie['likes'] += 1;
  repositories[indexRepo] = repositorie;

  return res.json(repositorie);

});

module.exports = app;
