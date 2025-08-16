import axios from "axios";

export const axiosInstanse = axios.create({baseURL: "https://edc5e6159aa86010.mokky.dev"});

let token = localStorage.getItem("token") || ""; 

export function setToken(newToken: string){
    localStorage.setItem("token", newToken);
    token = newToken;
}

axiosInstanse.interceptors.request.use((config) => {
    if(!config.headers.Authorization && token) {
        config.headers.Authorization = `Bearer ${token}`
    } return config
})