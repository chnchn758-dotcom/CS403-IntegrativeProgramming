const express = require("express");
const port = 3000;

let nextId = 1;
const students = [
  { id: nextId++, name: "Alice", course: "BSCS" },
  { id: nextId++, name: "Bob", course: "BSIT" },
  { id: nextId++, name: "Cara", course: "BSCS" },
];

const app = express();

app.use(express.json());

app.post("/students", (request, response) => {
  const newName = request.body.name;
  const newCourse = request.body.course;

  const newStudent = { id: nextID++, name: newName, course: newCourse };

  students.push(newStudent);

  response.send(newStudent);
});

app.get("/students", (request, response) => {
  const newName = request.body.name;
  const newCourse = request.body.course;

  const newStudent = { id: nextID++, name: newName, course: newCourse };

  students.push(newStudent);

  response.send(newStudent);
});

app.put("/students", (request, response) => {
  const newName = request.body.name;
  const newCourse = request.body.course;

  const newStudent = { id: nextID++, name: newName, course: newCourse };

  students.push(newStudent);

  response.send(newStudent);
});

app.delete("/students", (request, response) => {
  const newName = request.body.name;
  const newCourse = request.body.course;

  const newStudent = { id: nextID++, name: newName, course: newCourse };

  students.push(newStudent);

  response.send(newStudent);
});

app.listen(3000, () => {
  console.log("App is listening to port 3000");
});
