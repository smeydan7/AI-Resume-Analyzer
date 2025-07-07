import { useState } from 'react';
import { Dropfolder } from './dropfolder';
import styles from './Upload.module.css';

export const UploadResume = () => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFile = (file: File) => {
        setFileName(file.name);
        // TODO: POST file to /api/resumes here
    };

    return (
        <section className={styles.wrapper}>
            <h1 className={styles.heading}>Upload Your Resume</h1>

            <Dropfolder onFileSelect={handleFile} />
            {fileName && <p className={styles.fileName}>Selected: {fileName}</p>}

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
