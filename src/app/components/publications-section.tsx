import React from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { useLanguage } from '../context/language-context';

interface PublicationsSectionProps {
    onCaseStudy?: (project: string) => void;
}

export function PublicationsSection({ onCaseStudy }: PublicationsSectionProps) {
    const { t } = useLanguage();

    return (
        <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24" id="publications">
            {/* Section Header */}
            <div className="mb-12">
                <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
                    {t('publications.title')}
                </h2>
                <p className="text-base" style={{ color: 'var(--terminal-muted)' }}>
                    {t('publications.subtitle')}
                </p>
            </div>

            {/* Featured Publication - VERIFY SYSTEMS */}
            <div className="border border-[var(--border-default)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group mb-8">
                {/* Header with purple accent */}
                <div className="border-b border-[var(--border-default)] px-6 py-4 bg-[var(--surface-2)] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📚</span>
                            <h3 className="font-mono text-lg font-semibold" style={{ color: '#a855f7' }}>
                                VERIFY SYSTEMS
                            </h3>
                        </div>
                        <Badge variant="purple">FEATURED</Badge>
                    </div>
                    <div className="font-mono text-xs" style={{ color: 'var(--terminal-muted)' }}>
                        2024 • PDF • 84 PAGES
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="grid md:grid-cols-[2fr_1fr] gap-8">
                        {/* Left: Description */}
                        <div className="space-y-4">
                            <p className="text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
                                {t('publications.verify.description')}
                            </p>

                            {/* Key Concepts */}
                            <div className="pt-2">
                                <div className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--terminal-muted)' }}>
                                    {t('publications.verify.concepts')}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { icon: '🔗', label: 'Event Sourcing' },
                                        { icon: '⚖️', label: 'Truth Hierarchy' },
                                        { icon: '🔄', label: 'Continuous Reconciliation' },
                                        { icon: '🛡️', label: 'Operational Modes' },
                                        { icon: '📊', label: 'State Machines' },
                                        { icon: '🔐', label: "Don't Trust, Verify" },
                                    ].map((concept, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm" style={{ color: 'var(--terminal-text)' }}>
                                            <span>{concept.icon}</span>
                                            <span>{concept.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {['SYSTEMS THINKING', 'BITCOIN PRINCIPLES', 'EVENT SOURCING', 'FINTECH', 'RESILIENCE'].map((badge, idx) => (
                                    <Badge key={idx} variant="default">{badge}</Badge>
                                ))}
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-3 pt-4">
                                <Button variant="primary" onClick={() => onCaseStudy?.('verify-systems')}>
                                    CASE STUDY
                                </Button>
                                <Button variant="secondary" onClick={() => window.open('/docs/Verify_By_Renan_Melo.pdf', '_blank')}>
                                    READ PDF
                                </Button>
                            </div>
                        </div>

                        {/* Right: Origin Story */}
                        <div className="border border-[var(--border-default)] bg-[var(--surface-2)] p-5">
                            <div className="font-mono text-[10px] uppercase tracking-wider mb-4" style={{ color: '#a855f7' }}>
                                {t('publications.verify.origin')}
                            </div>
                            <div className="space-y-3">
                                {[
                                    { year: '2019', event: t('publications.verify.timeline.1') },
                                    { year: '2020', event: t('publications.verify.timeline.2') },
                                    { year: '2022', event: t('publications.verify.timeline.3') },
                                    { year: '2024', event: t('publications.verify.timeline.4') },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <span className="font-mono text-xs font-semibold flex-shrink-0 mt-0.5" style={{ color: '#a855f7' }}>
                                            {item.year}
                                        </span>
                                        <span className="text-sm leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
                                            {item.event}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Bitcoin Quote */}
                            <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
                                <blockquote className="text-sm italic" style={{ color: 'var(--terminal-muted)' }}>
                                    "Don't Trust, Verify"
                                </blockquote>
                                <p className="text-xs mt-1" style={{ color: 'var(--terminal-muted)' }}>
                                    — Bitcoin ethos
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Future Publications Placeholder */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Coming Soon: Article */}
                <div className="border border-dashed border-[var(--border-default)] bg-[var(--surface-1)] p-6 opacity-60">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg">📝</span>
                        <h4 className="font-mono text-sm font-semibold" style={{ color: 'var(--terminal-muted)' }}>
                            {t('publications.upcoming.article')}
                        </h4>
                        <Badge variant="default">COMING SOON</Badge>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--terminal-muted)' }}>
                        {t('publications.upcoming.article.desc')}
                    </p>
                </div>

                {/* Coming Soon: Talk */}
                <div className="border border-dashed border-[var(--border-default)] bg-[var(--surface-1)] p-6 opacity-60">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg">🎤</span>
                        <h4 className="font-mono text-sm font-semibold" style={{ color: 'var(--terminal-muted)' }}>
                            {t('publications.upcoming.talk')}
                        </h4>
                        <Badge variant="default">COMING SOON</Badge>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--terminal-muted)' }}>
                        {t('publications.upcoming.talk.desc')}
                    </p>
                </div>
            </div>
        </section>
    );
}
