export const loginUser = async ({ email, password }) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Login failed');
    }
};

export const registerUser = async ({ name, email, mobile, password, country, city, state, gender }) => {
    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, mobile, password, country, city, state, gender }),
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Registration failed');
    }
};

export const fetchTasks = async (authToken) => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1));
        const response = await fetch('http://localhost:5000/api/tasks', {
            method: 'GET',
            headers: {
                'x-auth-token': authToken,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
};
