const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getSystemStatus() {
    // Retrieve the token saved during the frontend login process
    const token = localStorage.getItem('cloudops_token');

    const response = await fetch(`${API_BASE_URL}/api/status`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Attach the token here
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Handle token expiration (e.g., redirect to login page)
            window.location.href = '/login'; 
        }
        throw new Error('Failed to fetch system status');
    }

    return response.json();
}