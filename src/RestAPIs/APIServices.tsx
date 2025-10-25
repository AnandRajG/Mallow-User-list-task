import axios from "axios";
import type { RootState } from "../Redux/store";
import { store } from "../Redux/store"; // import your store directly

const baseURL = 'https://reqres.in/api/';

class APIServices {
    private getToken() {
        // Get token dynamically from redux store
        const state: RootState = store.getState();
        return state.auth.token || 'reqres-free-v1';
    }

    get = async (url: string) => {
        const token = this.getToken();
        const response = await axios.get(`${baseURL}${url}`, {
            headers: {
                "Content-Type": "application/json",
                'x-api-key': 'reqres-free-v1',
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }

    post = async (url: string, data: any) => {
        const token = this.getToken();
        const response = await axios.post(`${baseURL}${url}`, data, {
            headers: {
                "Content-Type": "application/json",
                'x-api-key': 'reqres-free-v1',
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }

    update = async (url: string, data?: any) => {
        const token = this.getToken();
        const response = await axios.put(`${baseURL}${url}`, data, {
            headers: {
                'x-api-key': 'reqres-free-v1',
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    }

    delete = async (url: string) => {
        const token = this.getToken();
        const response = await axios.delete(`${baseURL}${url}`, {
            headers: {
                'x-api-key': 'reqres-free-v1',
                'Authorization': `Token ${token}`
            }
        });
        return response;
    }
}

export default new APIServices();
