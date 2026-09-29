import axios from "axios";

const API_URL = "http://localhost:8080/api/patients";

export const getAllPatients = () => {
    return axios.get(API_URL);
};

export const addPatient = (patient) => {
    return axios.post(API_URL, patient);
};

export const updatePatient = (id, patient) => {
    return axios.put(`${API_URL}/${id}`, patient);
};

export const deletePatient = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};