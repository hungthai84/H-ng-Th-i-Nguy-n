

import React, { useEffect, useRef } from 'react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import InfoBadge from './InfoBadge';

interface Achievement {
    id: string;
    title: string;
    branch: string;
    rate: number;
    category: string;
    hashtag: string;
    icon: keyof typeof Icons;
    color: string;
}

const AchievementCard: React.FC<{ achievement: Achievement, index: number }> = ({ achievement, index }) => {
    const Icon = Icons[achievement.icon] || Icons.TrophyIcon;
    const cardRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const element = cardRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    element.classList.add('is-visible');
                    observer.unobserve(element);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(element);
        return () => {
            if (element) {
                observer.disconnect();
            }
        };
    }, []);
    
    return (
        <div 
            ref={cardRef}
            className="achievement-card fade-in-up-on-scroll" 
            style={{ 
                '--item-color': achievement.color,
                transitionDelay: `${index * 50}ms`
            } as React.CSSProperties}
        >
            <div className="achievement-card-header">
                <div className="achievement-card-main-content">
                    <div className="achievement-card-title-group">
                        <Icon />
                        <h4>{achievement.title}</h4>
                    </div>
                </div>
                <div className="achievement-card-rate">
                    {achievement.rate}
                    <span className="achievement-card-percent-sign">%</span>
                </div>
            </div>

            <div className="achievement-card-progress-container">
                 <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{
                            '--level': `${achievement.rate}%`,
                            backgroundColor: achievement.color,
                        } as React.CSSProperties}
                    />
                </div>
            </div>

            <div className="achievement-card-tags">
                <span>{achievement.category}</span>
                <span className="hashtag-tag">{achievement.hashtag}</span>
            </div>
        </div>
    );
};


export const AchievementsPage: React.FC<{ id?: string }> = ({ id }) => {
    const { t } = useI18n();
    const pageData = t.achievementsPage;
    const achievements = pageData.achievements as Achievement[];

    return (
        <PageLayout id={id}>
            <div className="info-card">
                <div className="about-header">
                    <InfoBadge
                        icon={<Icons.TrophyIcon />}
                        text={pageData.badge}
                        tooltipTitle={pageData.tooltipTitle}
                        tooltipText={pageData.tooltipText}
                    />
                </div>
                <div className="achievements-page-grid no-scrollbar">
                    {achievements.length > 0 ? (
                        achievements.map((item, index) => (
                           <AchievementCard key={item.id} achievement={item} index={index} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-brand-text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gridColumn: '1 / -1' }}>
                            <Icons.TrophyIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }}/>
                            <p>Achievement data is being updated. <br/>Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};