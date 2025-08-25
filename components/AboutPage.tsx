

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import InfoBadge from './InfoBadge';

interface InfoItem {
    label: string;
    value: string;
    icon: keyof typeof Icons;
    url?: string;
}

interface AboutPageProps {
    id?: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({ id }) => {
    const { t } = useI18n();
    const pageData = t.aboutPage;

    const [videoState, setVideoState] = useState<'ambient' | 'intro'>('ambient');
    const videoRef = useRef<HTMLVideoElement>(null);

    const AMBIENT_VIDEO_URL = 'https://cdn.scena.ai/project/8606/95727de5df7ead1b58f6438ffcd683078804d9f125467ad97c7ae3c6a581512e.mp4';
    const INTRO_VIDEO_URL = 'https://cdn.scena.ai/project/8606/54e8f7386c175893a440c1d598e50113bb91339989db46acb47be100fbad23ff.mp4';

    const handleIntroPlay = () => {
        setVideoState('intro');
    };

    const handleIntroStop = useCallback(() => {
        setVideoState('ambient');
    }, []);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        let newSrc = '';
        if (videoState === 'intro') {
            newSrc = INTRO_VIDEO_URL;
            videoElement.muted = false;
            videoElement.loop = false;
        } else { // ambient
            newSrc = AMBIENT_VIDEO_URL;
            videoElement.muted = true;
            videoElement.loop = true;
        }

        if (videoElement.currentSrc !== newSrc) {
            videoElement.src = newSrc;
        }
        
        videoElement.play().catch(e => console.error("Video play failed:", e));

    }, [videoState]);


    return (
        <PageLayout id={id}>
            <div className="info-card">
                <div className="about-header">
                    <InfoBadge
                        icon={<Icons.UserIcon />}
                        text={pageData.bioBadge}
                        tooltipTitle={pageData.tooltipTitle}
                        tooltipText={pageData.tooltipText}
                    />
                </div>
                <div className="about-page-content-wrapper no-scrollbar">
                    {/* Bio Section */}
                    <div className="bio-section">
                        <div className="left-bio-column">
                            <div className={`bio-video-wrapper ${videoState === 'intro' ? 'is-playing-intro' : ''}`}>
                                <video
                                    ref={videoRef}
                                    playsInline
                                    autoPlay
                                    muted
                                    loop
                                    onEnded={videoState === 'intro' ? handleIntroStop : undefined}
                                    className="bio-video-element"
                                    src={AMBIENT_VIDEO_URL}
                                />
                                {videoState === 'ambient' ? (
                                    <button className="btn btn-primary bio-video-button" onClick={handleIntroPlay}>
                                        <Icons.PlayIcon />
                                        <span>Giới thiệu</span>
                                    </button>
                                ) : (
                                    <button className="btn btn-secondary bio-video-button" onClick={handleIntroStop}>
                                        <Icons.PauseIcon />
                                        <span>Dừng lại</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="right-bio-column">
                            <h3>{pageData.bioTitle}</h3>
                            {pageData.bioParagraphs.map((p: string, index: number) => {
                                if (p.startsWith('>')) {
                                    return <p key={index} className="core-values">{p.substring(1).trim()}</p>;
                                }
                                return <p key={index}>{p}</p>;
                            })}
                        </div>
                    </div>
                    {/* Personal Info Section */}
                    <div className="personal-info-section">
                        <h3>{pageData.infoTitle}</h3>
                        <div className="about-info-grid">
                            {(pageData.infoItems as InfoItem[]).map((item: InfoItem) => {
                                const Icon = Icons[item.icon] || Icons.UserIcon;
                                const ValueComponent = item.url 
                                    ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="value">{item.value}</a>
                                    : <span className="value">{item.value}</span>;
                                
                                return (
                                    <div key={item.label} className="about-info-item">
                                        <div className="about-info-item-icon"><Icon /></div>
                                        <div className="about-info-item-text-wrapper">
                                            <div className="label">{item.label}</div>
                                            {ValueComponent}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};