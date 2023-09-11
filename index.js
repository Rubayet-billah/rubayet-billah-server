const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhwsqpg.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const blogsCollection = await client.db("portfolioDB").collection("blogs");

    // ==== BLOG ROUTES ==== //

    // Create a new blog
    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      res.send({ data: result });
    });

    // Get all blogs
    app.get("/blogs", async (req, res) => {
      const blogs = await blogsCollection.find({}).toArray();
      res.send({ data: blogs });
    });

    // Get a specific blog by ID
    app.get("/blogs/:id", async (req, res) => {
      const { id } = req.params;
      const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
      res.send({ data: blog });
    });

    // Update a blog by ID
    app.patch("/blogs/:id", async (req, res) => {
      const { id } = req.params;
      const updatedBlog = req.body;
      const result = await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedBlog }
      );
      res.send({ data: result });
    });

    // Delete a blog by ID
    app.delete("/blogs/:id", async (req, res) => {
      const { id } = req.params;
      const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send({ data: result });
    });

    // ==== PROJECTS ROUTES ==== //

    // Create a new project
    app.post("/projects", async (req, res) => {
      const project = req.body;
      const result = await projectsCollection.insertOne(project);
      res.send({ data: result });
    });

    // Get all projects
    app.get("/projects", async (req, res) => {
      const projects = await projectsCollection.find({}).toArray();
      res.send({ data: projects });
    });

    // Get a specific project by ID
    app.get("/projects/:id", async (req, res) => {
      const { id } = req.params;
      const project = await projectsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send({ data: project });
    });

    // Update a project by ID
    app.patch("/projects/:id", async (req, res) => {
      const { id } = req.params;
      const updatedProject = req.body;
      const result = await projectsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedProject }
      );
      res.send({ data: result });
    });

    // Delete a project by ID
    app.delete("/projects/:id", async (req, res) => {
      const { id } = req.params;
      const result = await projectsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send({ data: result });
    });

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();
