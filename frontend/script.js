const API_URL = "https://mini-workspace-app.onrender.com";
//users
async function loadUsers() {
  const res = await fetch(API_URL + "/users");
  const users = await res.json();
  const ul = document.getElementById("userList");
  ul.innerHTML = "";
  users.forEach(u => {
    const li = document.createElement("li");
    li.innerText = `${u.id} - ${u.name}`;
    ul.appendChild(li);
  });
}

async function createUser() {
  const name = document.getElementById("userName").value;
  if (!name) return alert("Enter user name");
  await fetch(API_URL + "/users", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({name})
  });
  document.getElementById("userName").value = "";
  loadUsers();
  loadSummary();
}
//workplace
async function loadWorkspaces() {
  const res = await fetch(API_URL + "/workspaces");
  const workspaces = await res.json();
  //list
  const ul = document.getElementById("workspaceList");
  ul.innerHTML = "";
  workspaces.forEach(w => {
    const li = document.createElement("li");
    li.innerText = `${w.id} - ${w.name}`;
    ul.appendChild(li);
  });
  const select = document.getElementById("taskWorkspace");
  select.innerHTML = "";
  workspaces.forEach(w => {
    const option = document.createElement("option");
    option.value = w.id;
    option.innerText = w.name;
    select.appendChild(option);
  });
}

async function createWorkspace() {
  const name = document.getElementById("workspaceName").value;
  if (!name) return alert("Enter workspace name");
  await fetch(API_URL + "/workspaces", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({name})
  });
  document.getElementById("workspaceName").value = "";
  loadWorkspaces();
  loadSummary();
}

//Tasks
async function loadTasks() {
  const workspaceId = document.getElementById("taskWorkspace").value;

  if (!workspaceId) return;
  const workspaces = await fetch(API_URL + "/workspaces").then(r => r.json());
  const res = await fetch(`${API_URL}/tasks?workspaceId=${workspaceId}`);
  const tasks = await res.json();
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";
  if (tasks.length === 0) {
    ul.innerHTML = "<li>No tasks found in database</li>";
    return;
  }
  tasks.forEach(t => {
    const ws = workspaces.find(w => w.id == t.workspaceId);
    const li = document.createElement("li");
    li.innerText = `${t.title} (${ws ? ws.name : "N/A"}) - ${t.completed ? "✅" : "❌"}`;
    const btn = document.createElement("button");
    btn.innerText = "Complete";
    btn.onclick = () => markComplete(t.id);
    li.appendChild(btn);
    const del = document.createElement("button");
del.innerText = "Delete";
del.onclick = () => deleteTask(t.id);
li.appendChild(del);
    ul.appendChild(li);
  });
}
document.getElementById("taskWorkspace").onchange = loadTasks;
async function createTask() {
  const title = document.getElementById("taskTitle").value;
  const workspaceId = document.getElementById("taskWorkspace").value;
  if (!title) return alert("Enter task title");
  await fetch(API_URL + "/tasks", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      title,
      workspaceId: Number(workspaceId)
    })
  });
  document.getElementById("taskTitle").value = "";
  loadTasks();
  loadSummary();
}
async function markComplete(id) {
  await fetch(`${API_URL}/tasks/${id}`, { method: "PATCH" });
  loadTasks();
  loadSummary();
}
async function deleteTask(id) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE"
  });

  loadTasks();
  loadSummary();
}

//summary
async function loadSummary() {
  const res = await fetch(API_URL + "/summary");
  const data = await res.json();

  document.getElementById("summary").innerText = `
Completed: ${data.completed}
Pending: ${data.pending}
`;

  document.getElementById("usersCount").innerText = `Users: ${data.users}`;
  document.getElementById("workspaceCount").innerText = `Workspaces: ${data.workspaces}`;
  document.getElementById("taskCount").innerText = `Tasks: ${data.tasks}`;
}
//initial load
loadUsers();
loadWorkspaces();
loadTasks();
loadSummary();

