export interface Resume {
    id: string;
    name: string;
    uploadDate: string;
    status: 'processing' | 'completed' | 'error';
    atsScore?: number;
    suggestions?: number;
    fileSize?: number;
    fileType?: string;
}

export interface ResumeStats {
    total: number;
    completed: number;
    processing: number;
    avgScore: number;
}