import { Upload } from 'lucide-react';
import styles from './Upload.module.css';

interface Props {
    onFileSelect: (file: File) => void;
}

export const Dropfolder = ({ onFileSelect }: Props) => {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) onFileSelect(f);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) onFileSelect(f);
    };

    return (
        <div
            className={styles.dropzone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <Upload className={styles.dropzoneIcon} />
            <p className={styles.dropzoneText}>
                Drop your resume here, or click to browse
            </p>
            <p className={styles.dropzoneSub}>
                Supports PDF, DOC, DOCX files up to&nbsp;10 MB
            </p>

            {/* invisible full-area input */}
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleInput}
                className={styles.dropzoneInput}
            />
        </div>
    );
};
