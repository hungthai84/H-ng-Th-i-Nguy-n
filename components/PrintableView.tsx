
import React from 'react';
import { useI18n } from '../contexts/i18n';

// Import components that can be used directly
import MainContent from './MainContent';
import CoverLetter from './CoverLetter';
import { AboutPage } from './AboutPage';
import EducationPage from './EducationPage';
import ServicesPage from './ServicesPage';
import { AchievementsPage } from './AchievementsPage';

// Redefine interfaces for use in this component
interface Job {
    key: string;
    date: string;
    company: string;
    logoUrl: string;
    color: string;
    title: string;
    teamSize: string;
    responsibilities: string[];
    achievements: { label: string; value: number }[];
}

interface Skill {
    name: string;
    level: number;
}

interface SkillCategory {
    key: string;
    title: string;
    skills: Skill[];
    color?: string;
}

interface Project {
    id: string;
    title: string;
    description: string;
    group: string;
    stage: string;
    hashtags: string[];
    imageUrl: string;
}

// --- Sub-component for rendering a single job ---
const PrintJob: React.FC<{ job: Job }> = ({ job }) => {
    const { t } = useI18n();
    const pageData = t.workExperiencePage;
    const hasAchievements = job.achievements && job.achievements.length > 0;

    return (
        <div className="print-page print-job-page">
            <div className="job-card" style={{ border: `1px solid ${job.color}`, padding: '1rem', height: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                    <img src={job.logoUrl} alt={`${job.company} Logo`} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'contain', background: 'white', padding: '5px' }} />
                    <div>
                        <h2 style={{ margin: '0', fontSize: '16pt', color: job.color }}>{job.company}</h2>
                    </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '0.5rem 0', marginBottom: '1rem', fontSize: '9pt' }}>
                    <div><strong>{pageData.durationTitle}:</strong> {job.date}</div>
                    <div><strong>{pageData.positionTitle}:</strong> {job.title}</div>
                    <div><strong>{pageData.managedTitle}:</strong> {job.teamSize}</div>
                </div>
                
                <div className="job-card-details-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <h4 style={{fontSize: '11pt', marginTop: 0}}>{pageData.descriptionTitle}</h4>
                        <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '9pt' }}>
                            {job.responsibilities.map((item, index) => <li key={index} style={{marginBottom: '0.25rem'}}>{item}</li>)}
                        </ul>
                    </div>
                    {hasAchievements && (
                        <div>
                            <h4 style={{fontSize: '11pt', marginTop: 0}}>{pageData.achievementsTitle}</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {job.achievements.map((ach, index) => (
                                    <div key={index} style={{fontSize: '9pt'}}>
                                        <span>{ach.label}: {ach.value}%</span>
                                        <div style={{ background: '#eee', borderRadius: '3px', height: '6px', overflow: 'hidden' }}>
                                            <div style={{ background: job.color, width: `${ach.value}%`, height: '100%' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Sub-component for rendering a subset of skills ---
const PrintSkills: React.FC<{ categories: SkillCategory[], pageTitle: string }> = ({ categories, pageTitle }) => {
    return (
        <div className="print-page print-skills-page">
             <h2 style={{ fontSize: '16pt', marginBottom: '1rem' }}>{pageTitle}</h2>
            <div className="skills-categories-wrapper" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '100%' }}>
                {categories.map((category) => (
                    <div key={category.key} className="resume-item-card" style={{ padding: '1rem', border: '1px solid #eee' }}>
                        <h3 className="category-title" style={{ color: category.color, fontSize: '12pt', marginTop: 0 }}>{category.title}</h3>
                        <div className="skills-grid-v2" style={{ gap: '1rem' }}>
                            {category.skills.map((skill, skillIndex) => (
                                <div key={skillIndex} className="skill-item-v2">
                                    <div className="skill-info" style={{fontSize: '9pt', marginBottom: '0.25rem'}}>
                                        <h4>{skill.name}</h4>
                                        <span>{skill.level}%</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                '--level': `${skill.level}%`,
                                                backgroundColor: category.color,
                                            } as React.CSSProperties}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Sub-component for rendering a subset of projects ---
const PrintProjects: React.FC<{ projects: Project[], pageTitle: string }> = ({ projects, pageTitle }) => {
    const columns = projects.length >= 3 ? '1fr 1fr 1fr' : '1fr 1fr';
    return (
        <div className="print-page print-projects-page">
            <h2 style={{ fontSize: '16pt', marginBottom: '1rem' }}>{pageTitle}</h2>
            <div className="projects-grid" style={{ gridTemplateColumns: columns, gap: '1rem' }}>
                {projects.map((project) => (
                    <div key={project.id} className="project-card-new" style={{ border: '1px solid #eee', breakInside: 'avoid' }}>
                        <div className="project-card-new-image">
                            <img src={project.imageUrl} alt={project.title} />
                        </div>
                        <div className="project-card-new-content" style={{ padding: '0.5rem' }}>
                            <h4 className="project-card-new-title" style={{fontSize: '10pt', marginBottom: '0.25rem'}}>
                                {project.id}. {project.title}
                            </h4>
                            <p className="project-card-new-description" style={{ fontSize: '8pt', height: 'auto', WebkitLineClamp: 'unset', margin: '0 0 0.5rem 0' }}>{project.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Printable View Component ---
const PrintableView: React.FC = () => {
    const { t } = useI18n();
    const jobs = t.workExperiencePage.jobs;
    const skillCategories = t.skillsPage.categories;
    const projects = t.projectsPage.projects;

    // Split skills for 2 pages
    const skillsPage1 = skillCategories.slice(0, 3);
    const skillsPage2 = skillCategories.slice(3);

    // Split projects for 6 pages (3, 3, 3, 2, 2, 2)
    const projectChunks = [
        projects.slice(0, 3),
        projects.slice(3, 6),
        projects.slice(6, 9),
        projects.slice(9, 11),
        projects.slice(11, 13),
        projects.slice(13, 15)
    ].filter(chunk => chunk.length > 0);

    return (
        <div id="printable-content">
            <div className="print-page"><MainContent /></div>
            <div className="print-page"><CoverLetter /></div>
            <div className="print-page"><AboutPage /></div>
            
            {jobs.map(job => <PrintJob key={job.key} job={job} />)}
            
            <div className="print-page"><EducationPage /></div>
            <div className="print-page"><ServicesPage /></div>
            
            {skillsPage1.length > 0 && <PrintSkills categories={skillsPage1} pageTitle={`${t.skillsPage.title} (Trang 1/2)`} />}
            {skillsPage2.length > 0 && <PrintSkills categories={skillsPage2} pageTitle={`${t.skillsPage.title} (Trang 2/2)`} />}
            
            {projectChunks.map((chunk, index) => (
                <PrintProjects key={index} projects={chunk} pageTitle={`${t.projectsPage.badge} (Trang ${index + 1}/${projectChunks.length})`} />
            ))}
            
            <div className="print-page"><AchievementsPage /></div>
        </div>
    );
};

export default PrintableView;
