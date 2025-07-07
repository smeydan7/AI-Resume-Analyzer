import { NavLink } from 'react-router-dom';
import {
    FileText,
    Home,
    Upload,
    BarChart3,
    Settings,
} from 'lucide-react';

import styles from './Navigation.module.css';

interface Item {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const items: Item[] = [
    { path: '/',         label: 'Dashboard',     icon: Home },
    { path: '/upload',   label: 'Upload Resume', icon: Upload },
    { path: '/analysis', label: 'Analysis',      icon: BarChart3 },
    { path: '/settings', label: 'Settings',      icon: Settings },
];

export const Navigation = () => (
    <header className={styles.nav}>
        <div className={styles.inner}>
            <div className={styles.brand}>
                <FileText className={styles.brandIcon} />
                <span className={styles.brandText}>ResumeAI</span>
            </div>

            <nav className={styles.links}>
                {items.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.active : ''}`
                        }
                    >
                        <Icon className={styles.linkIcon} />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </div>
    </header>
);
