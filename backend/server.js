const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let projects = [];

app.get('/', (req, res) => {
    res.send("Welcome to the Project Management API!");
});

// Get total number of projects
app.get('/api/projects/count', (req, res) => {
    res.json({ total: projects.length });
});

// Get all projects
app.get('/api/projects', (req, res) => {
    res.json({ status: "success", projects });
});

// Add a new project with validation
app.post('/api/projects', (req, res) => {
    const { name } = req.body;

    if (!name || name.length < 3) {
        return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters" });
    }

    if (projects.some(proj => proj.name.toLowerCase() === name.toLowerCase())) {
        return res.status(400).json({ status: "error", message: "Project name must be unique" });
    }

    const newProject = { id: projects.length + 1, name };
    projects.push(newProject);
    res.status(201).json({ status: "success", project: newProject });
});

// Delete a project and return deleted details
app.delete('/api/projects/:id', (req, res) => {
    const projectId = parseInt(req.params.id);
    const index = projects.findIndex(proj => proj.id === projectId);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "Project not found" });
    }

    const deletedProject = projects.splice(index, 1)[0];
    res.json({ status: "success", deletedProject });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
