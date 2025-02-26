import React, { useState } from 'react';
import '../TaskForm.css';

const TaskForm = ({ authToken, setTasks, task = null }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalTask, setTotalTask] = useState('');
    const [status, setStatus] = useState('Pending');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const taskData = {
            name,
            description,
            startDate,
            endDate,
            totalTask,
            status,
        };

        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': authToken,
                },
                body: JSON.stringify(taskData),
            });

            const newTask = await response.json();

            setTasks((prevTasks) => {
                if (Array.isArray(prevTasks)) {
                    return [...prevTasks, newTask];
                } else {
                    return [newTask];
                }
            });
            setName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setTotalTask('');
            setStatus('Pending');
        } catch (err) {
            console.error('Error creating task:', err);
        }
    };

    return (
        <div className="task-form-container">
            <h2>Create a New Task</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Task Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="totalTask">Total Tasks:</label>
                    <input
                        type="number"
                        id="totalTask"
                        value={totalTask}
                        onChange={(e) => setTotalTask(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <button type="submit">Create Task</button>
            </form>
        </div>
    );
}

export default TaskForm
