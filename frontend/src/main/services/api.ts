import type { AnalysisResult } from '../models/AnalysisResult';
import type { Resume } from '../models/Resume';

const API_BASE_URL = 'http://localhost:8080/api';

export interface ResumeUploadResponse {
  resume: Resume;
  analysisResult: AnalysisResult;
}

export class ApiService {
  static async uploadResume(file: File, jobDescription?: string): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    return response.json();
  }

  static async getResume(id: string): Promise<Resume> {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch resume');
    }

    return response.json();
  }

  static async getAnalysis(id: string): Promise<AnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}/analysis`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch analysis');
    }

    return response.json();
  }
}
