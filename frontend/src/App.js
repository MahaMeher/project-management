import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000"; // Backend URL

function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState("");
    const [error, setError] = useState("");
    const [count, setCount] = useState(0);
    const [refreshMessage, setRefreshMessage] = useState(false); // State for popup

    // Fetch all projects and count on mount
    useEffect(() => {
        fetchProjects();
        fetchProjectCount();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            const data = await response.json();
            setProjects(data.projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const fetchProjectCount = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects/count`);
            const data = await response.json();
            setCount(data.total);
        } catch (error) {
            console.error("Error fetching count:", error);
        }
    };

    const addProject = async () => {
        if (newProject.length < 3) {
            setError("Project name must be at least 3 characters");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newProject }),
            });

            const data = await response.json();

            if (data.status === "error") {
                setError(data.message);
            } else {
                setProjects([...projects, data.project]);
                setNewProject("");
                setError("");
                setCount((prevCount) => prevCount + 1);
            }
        } catch (error) {
            console.error("Failed to add project:", error);
        }
    };

    const deleteProject = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/projects/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.status === "success") {
                setProjects(projects.filter((proj) => proj.id !== id));
                setCount((prevCount) => prevCount - 1);
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const refreshProjects = async () => {
        await fetchProjects();
        await fetchProjectCount();
        await setError("");
        await setNewProject("");
        setRefreshMessage(true); // Show message

        // Hide the message after 3 seconds
        setTimeout(() => {
            setRefreshMessage(false);
        }, 3000);
    };

    return (
        <div className="app-container">
            <h1 className="title">📂 Project Manager</h1>
            <h2 className="subtitle">
                Total Projects: <span className="count">{count}</span>
            </h2>

            <div className="input-container">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Enter project name..."
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                />
                <button className="add-btn" onClick={addProject}>➕ Add</button>
                <button className="refresh-btn" onClick={refreshProjects}>🔄 Refresh</button>
            </div>

            {error && <p className="error">{error}</p>}
            {refreshMessage && <p className="refresh-message">✅ Projects Refreshed!</p>} {/* Popup message */}

            <ul className="project-list">
                {projects.map((project) => (
                    <li key={project.id} className="project-item">
                        <span className="project-name">{project.name}</span>
                        <button className="delete-btn" onClick={() => deleteProject(project.id)}>🗑️ Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
