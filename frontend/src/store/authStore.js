import {create} from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:5000/api';

export const useAuthStore = create((set) => ({
    // initial state

    user: null,
    isLoading: false,
    error: null,
    message: null,
    fetchingUser: true,

    // functions

    signup: async (username, email, password) => {
        set({ isLoading: true, message: null });

        try {
            const response = await axios.post(`${API_URL}/signup`, {
                username,
                email,
                password,
            });

            set({user: response.data.user, isLoading: false})
            
        } catch (error) {
            set({isLoading: false, 
                error: error.response.data.message || "Error Signing Up",
            });

            throw error;
        }
    },

    login: async (username, password) => {
        set({isLoading: true, message: null, error: null});

        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password,
         });

          const {user, message} = response.data;
          set({
            user,
            message,
            isLoading: false,
          });
        
          return { user, message };
        } catch (error) {
            set({isLoading: false, 
                error: error.response.data.message || "Error Loggin In",
            });

            throw error;
        }
    },

    fetchUser: async () => {
        set({fetchingUser: true, error: null});

        try {
            const response = await axios.get(`${API_URL}/fetch-user`);
            set({user: response.data.user, fetchingUser: false});
        } catch (error) {
            set({user: null, fetchingUser: false});
        }
    },

    logout: async () => {
        set({isLoading: true, 
            error: null,
            message: null})

        try {
            const response = await axios.post(`${API_URL}/logout`);
            const {message} = response.data;
            set({
                message,
                isLoading: false,
                user: null,
                error: null
            })

            return {message};
        } catch (error) {
            set({isLoading: false, 
                error: error.response.data.message || "Error Loggin Out",
            });

            throw error;
        }
    },

    updateUser: (updatedUser) => {
        set({ user: updatedUser });
    }
}));
