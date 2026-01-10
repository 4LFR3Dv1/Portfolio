import React, { useState } from 'react';
import { Button } from './button';

interface PDFViewerProps {
    title: string;
    pdfUrl: string;
    onClose: () => void;
}

export function PDFViewer({ title, pdfUrl, onClose }: PDFViewerProps) {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            {/* Modal Container */}
            <div className="relative w-full h-full max-w-6xl max-h-[95vh] bg-[#0a0a0f] border border-[var(--border-default)] rounded-lg shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--surface-2)]">
                    <div className="flex items-center gap-4">
                        <h3 className="font-mono text-sm font-bold text-[var(--electric-blue)] uppercase tracking-wider">
                            {title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href={pdfUrl}
                            download
                            className="font-mono text-xs text-[var(--terminal-muted)] hover:text-[var(--electric-blue)] transition-colors uppercase tracking-wider"
                        >
                            ↓ DOWNLOAD
                        </a>
                        <button
                            onClick={onClose}
                            className="text-[var(--terminal-muted)] hover:text-white transition-colors font-mono text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* PDF Content */}
                <div className="flex-1 overflow-hidden bg-[#1a1a24] relative">
                    <iframe
                        src={`${pdfUrl}#page=${currentPage}`}
                        className="w-full h-full border-0"
                        title={title}
                    />
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-3 border-t border-[var(--border-default)] bg-[var(--surface-2)] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        >
                            ← PREV
                        </Button>
                        <span className="font-mono text-xs text-[var(--terminal-muted)]">
                            PAGE {currentPage}
                        </span>
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            NEXT →
                        </Button>
                    </div>

                    <div className="font-mono text-xs text-[var(--terminal-muted)]">
                        PDF VIEWER v1.0
                    </div>
                </div>
            </div>
        </div>
    );
}
