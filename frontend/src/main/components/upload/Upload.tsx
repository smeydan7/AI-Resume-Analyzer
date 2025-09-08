import { useState } from 'react';
import { Dropfolder } from './dropfolder';
import { ApiService } from '../../services/api';
import type { ResumeUploadResponse } from '../../services/api';
import type { AnalysisResult } from '../../models/AnalysisResult';
import styles from './Upload.module.css';

export const UploadResume = () => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [jobDescription, setJobDescription] = useState('');

    const handleFile = async (file: File) => {
        setFileName(file.name);
        setUploadError(null);
        setIsUploading(true);
        
        try {
            const response: ResumeUploadResponse = await ApiService.uploadResume(file, jobDescription);
            setAnalysisResult(response.analysisResult);
            console.log('Resume uploaded successfully:', response);
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Upload failed');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section className={styles.wrapper}>
            <h1 className={styles.heading}>Upload Your Resume</h1>

            <Dropfolder onFileSelect={handleFile} />
            {fileName && <p className={styles.fileName}>Selected: {fileName}</p>}
            
            {isUploading && (
                <div className={styles.uploadStatus}>
                    <p>Uploading and analyzing your resume...</p>
                </div>
            )}
            
            {uploadError && (
                <div className={styles.errorMessage}>
                    <p>Error: {uploadError}</p>
                </div>
            )}
            
            {analysisResult && (
                <div className={styles.successMessage}>
                    <h3>Analysis Complete!</h3>
                    <p>Overall Score: {analysisResult.overallScore}/100</p>
                    <p>ATS Compatibility: {analysisResult.atsCompatibility}%</p>
                    <p>Recommendations: {analysisResult.recommendations.length}</p>
                </div>
            )}

            <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>What happens next?</h2>
                <ul className={styles.infoList}>
                    <li>Your resume will be parsed and analyzed</li>
                    <li>AI will identify improvement opportunities</li>
                    <li>ATS compatibility will be checked</li>
                    <li>You’ll receive actionable recommendations</li>
                </ul>
            </div>

            <label className={styles.textLabel}>
                Job Description&nbsp;<span className="text-slate-400">(Optional)</span>
            </label>
            <textarea
                rows={4}
                placeholder="Paste the job description here to get targeted keyword recommendations…"
                className={styles.textArea}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
            />

            <div className={styles.proTips}>
                <h3 className={styles.proTitle}>Pro Tips</h3>
                <ul className={styles.proList}>
                    <li>Include job descriptions for better keyword matching</li>
                    <li>Use clear section headers (Experience, Education, Skills)</li>
                    <li>Ensure your resume is text-selectable if PDF</li>
                    <li>Remove any sensitive personal information</li>
                </ul>
            </div>
        </section>
    );
};
