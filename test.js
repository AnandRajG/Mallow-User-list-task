import axios from "axios";

const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`https://reqres.in/api/users/${id}`, {
            headers: {
                'x-api-key': 'reqres-free-v1',
            },
        });

        if (response.status === 204) {
            console.log(`User ${id} deleted successfully`);
            alert(`User ${id} deleted successfully`);
        } else {
            console.log('Unexpected response:', response.status);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

// Example usage
deleteUser(2); // DELETE https://reqres.in/api/users/2
