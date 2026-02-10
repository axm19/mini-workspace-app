const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


function readData() {
  return JSON.parse(fs.readFileSync("data.json"));
}

function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

app.post("/users", (req, res) => {
  const data = readData();
  const newUser = {
    id: Date.now(),
    name: req.body.name
  };

  data.users.push(newUser);
  writeData(data);

  res.json(newUser);
});

app.get("/users", (req, res) => {
  const data = readData();
  res.json(data.users);
});


app.post("/workspaces", (req, res) => {
  const data = readData();

  const workspace = {
    id: Date.now(),
    name: req.body.name,
    users: []
  };

  data.workspaces.push(workspace);
  writeData(data);

  res.json(workspace);
});
app.get("/workspaces", (req, res) => {
  const data = readData();
  res.json(data.workspaces);
});
app.post("/workspaces/:id/users", (req, res) => {
  const data = readData();

  const workspace = data.workspaces.find(w => w.id == req.params.id);
  if (!workspace) return res.status(404).send("Workspace not found");

  workspace.users.push(req.body.userId);
  writeData(data);

  res.json(workspace);
});
app.post("/tasks", (req, res) => {
  const data = readData();

  const task = {
    id: Date.now(),
    title: req.body.title,
    workspaceId: req.body.workspaceId,
    completed: false
  };

  data.tasks.push(task);
  writeData(data);

  res.json(task);
});
app.get("/tasks", (req, res) => {
  const data = readData();
  const tasks = data.tasks.filter(t => t.workspaceId == req.query.workspaceId);
  res.json(tasks);
});
app.patch("/tasks/:id", (req, res) => {
  const data = readData();

  const task = data.tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).send("Task not found");

  task.completed = true;
  writeData(data);

  res.json(task);
});
app.delete("/tasks/:id", (req, res) => {
  const data = readData();
  const id = Number(req.params.id);

  data.tasks = data.tasks.filter(t => t.id !== id);

  writeData(data);

  res.json({ message: "Task deleted" });
});


app.get("/summary", (req, res) => {
  const data = readData();

  const completed = data.tasks.filter(t => t.completed).length;

  res.json({
    users: data.users.length,
    workspaces: data.workspaces.length,
    tasks: data.tasks.length,
    completed,
    pending: data.tasks.length - completed
  });
});
const port = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

