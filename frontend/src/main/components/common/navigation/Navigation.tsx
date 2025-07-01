import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Home, Upload, BarChart3, Settings } from 'lucide-react';
import styles from './Navigation.module.css';

const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/analysis', label: 'Analysis', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings }
];

export const Navigation: React.FC = () => {
    return (
        <nav className={styles.navigation}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <FileText className="h-8 w-8 text-blue-600" />
                    <span className={styles.logoText}>ResumeAI</span>
                </div>

                <div className={styles.navItems}>
                    {navItems.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.active : ''}`
                            }
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};