import axios from 'axios';
import { Exam } from './types/exam';

const BASE_URL = 'http://localhost:9999/api/exam';

export const examService = {
    getExamQuestion: async (id: number): Promise<Exam> => {
        try {
            console.log(`Fetching exam question with id: ${id}`);
            const response = await axios.get<Exam>(`${BASE_URL}/questions/${id}`);
            console.log('Received exam data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching exam question:', error);
            throw error;
        }
    },

    getWordTestQuestion: async (id: number): Promise<Exam> => {
        try {
            console.log(`Fetching word test question with id: ${id}`);
            const response = await axios.get<Exam>(`${BASE_URL}/word-test/${id}`);
            console.log('Received word test data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching word test question:', error);
            throw error;
        }
    },

    getStartIds: async () => {
        try {
            console.log('Fetching start IDs');
            const response = await axios.get<{
                sentenceStartId: number,
                wordStartId: number
            }>(`${BASE_URL}/start-ids`);
            console.log('Received start IDs:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching start IDs:', error);
            throw error;
        }
    },

    getAllExamQuestions: async (): Promise<Exam[]> => {
        const response = await axios.get<Exam[]>(`${BASE_URL}/questions`);
        return response.data;
    },

    getAllWordTestQuestions: async (): Promise<Exam[]> => {
        const response = await axios.get<Exam[]>(`${BASE_URL}/word-test`);
        return response.data;
    },

    getExamsByType: async (type: string): Promise<Exam[]> => {
        const response = await axios.get<Exam[]>(`${BASE_URL}/type/${type}`);
        return response.data;
    },

    getCounts: async (): Promise<{examCount: number, wordTestCount: number}> => {
        const response = await axios.get<{examCount: number, wordTestCount: number}>(`${BASE_URL}/counts`);
        return response.data;
    },

    loadInitialData: async (): Promise<string> => {
        try {
            console.log('Loading initial data...');
            const response = await axios.get(`${BASE_URL}/temp/load-initial-data`);
            console.log('Initial data loaded:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error loading initial data:', error);
            throw error;
        }
    }
};