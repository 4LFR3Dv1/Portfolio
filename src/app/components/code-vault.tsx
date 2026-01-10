import React from 'react';
import { Badge } from './badge';

interface CodeVaultProps {
    title: string;
    language: string;
    code: string;
    onClose: () => void;
}

export function CodeVault({ title, language, code, onClose }: CodeVaultProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-[#0a0a0f] border border-[var(--border-default)] rounded-lg shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--surface-2)]">
                    <div className="flex items-center gap-4">
                        <h3 className="font-mono text-sm font-bold text-[var(--electric-blue)] uppercase tracking-wider">
                            {title}
                        </h3>
                        <Badge variant="default">{language.toUpperCase()}</Badge>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--terminal-muted)] hover:text-white transition-colors font-mono text-xl"
                    >
                        ×
                    </button>
                </div>

                {/* Code Content */}
                <div className="flex-1 overflow-auto p-6 bg-[#050508]">
                    <pre className="font-mono text-xs sm:text-sm leading-relaxed text-[#c9d1d9]">
                        <code>
                            {code.split('\n').map((line, i) => (
                                <div key={i} className="table-row">
                                    <span className="table-cell text-right pr-4 text-[var(--terminal-muted)] select-none opacity-50 w-8">
                                        {i + 1}
                                    </span>
                                    <span className="table-cell whitespace-pre-wrap break-all">
                                        {highlightSyntax(line, language)}
                                    </span>
                                </div>
                            ))}
                        </code>
                    </pre>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-[var(--border-default)] bg-[var(--surface-2)] flex justify-between items-center text-xs font-mono text-[var(--terminal-muted)]">
                    <span>READ-ONLY MODE</span>
                    <span>{code.length} BYTES</span>
                </div>
            </div>
        </div>
    );
}

// Simple syntax highlighting heuristic (since we don't have a full lexer)
function highlightSyntax(line: string, language: string) {
    const keywords = ['import', 'from', 'export', 'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'pragma', 'contract', 'struct', 'mapping', 'address', 'uint256', 'bool', 'public', 'view', 'returns', 'event', 'emit', 'constructor', 'def', 'async', 'await'];
    const types = ['string', 'number', 'boolean', 'void', 'Promise', 'React', 'ButtonOps', 'License', 'ERC721'];

    // Split by space but keep delimiters logic simple
    const parts = line.split(/(\s+|[(){}[\].,;])/);

    return parts.map((part, idx) => {
        if (keywords.includes(part)) {
            return <span key={idx} style={{ color: '#ff7b72' }}>{part}</span>; // Red/Pink
        }
        if (types.includes(part)) {
            return <span key={idx} style={{ color: '#79c0ff' }}>{part}</span>; // Blue
        }
        if (part.startsWith('"') || part.startsWith("'")) {
            return <span key={idx} style={{ color: '#a5d6ff' }}>{part}</span>; // Light Blue strings
        }
        if (part.startsWith('//') || part.startsWith('#')) {
            // This is a naive check, works only if comment is separate token. 
            // For real lines we'd need better parsing, but this works for basic tokens.
            return <span key={idx} style={{ color: '#8b949e' }}>{part}</span>;
        }
        return <span key={idx}>{part}</span>;
    });
}
