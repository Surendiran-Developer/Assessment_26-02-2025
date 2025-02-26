import React, { useState } from 'react';
import '../TaskList.css';

const TaskList = ({ tasks = [] , setTasks, authToken }) => {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    
    const filteredTasks = tasks.filter(
        (task) =>
            task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const updateStatus = async (taskId, newStatus) => {
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': authToken,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const updatedTask = await response.json();

            setTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
            );
        } catch (error) {
            console.error('Error updating task status:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = (taskId) => {
        fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': authToken,
            },
        })
            .then((response) => {
                if (response.ok) {
                    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
                } else {
                    console.error('Error deleting task');
                }
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    return (
        <div className="task-list-container">
            <h2>Task List</h2>

            {/* ---Search Bar--- */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search tasks by title or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {tasks.length === 0 ? (
                <p className="no-tasks">No tasks available</p>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Total Task</th>
                                <th>Status</th>
                                <th>Action</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTasks.map((task) => (
                                <tr key={task._id}>
                                    <td>{task.name}</td>
                                    <td>{task.description}</td>
                                    <td>{new Date(task.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(task.endDate).toLocaleDateString()}</td>
                                    <td>{task.totalTask}</td>
                                    <td>{task.status}</td>
                                    <td>
                                        <select
                                            value={task.status}
                                            onChange={(e) => updateStatus(task._id, e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            disabled={loading}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ----Pagination Controls---- */}
                    <div className="pagination-controls">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || loading}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
TaskList.defaultProps = {
    tasks: [],
};
export default TaskList
