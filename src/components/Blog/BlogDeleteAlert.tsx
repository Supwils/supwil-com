'use client';

import React, { useEffect, useId, useRef } from 'react';

type BlogDeleteAlertProps = {
    open: boolean;
    blogTitle?: string;
    isLoading?: boolean;
    error?: string | null;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function BlogDeleteAlert({
    open,
    blogTitle,
    isLoading = false,
    error,
    onCancel,
    onConfirm
}: BlogDeleteAlertProps) {
    const titleId = useId();
    const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
    const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!open) return;

        previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        cancelButtonRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onCancel();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            previouslyFocusedElementRef.current?.focus?.();
            previouslyFocusedElementRef.current = null;
        };
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onCancel();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--background)] shadow-2xl">
                <div className="p-6 sm:p-7">
                    <h3 id={titleId} className="text-xl sm:text-2xl font-semibold text-[var(--text-color)]">
                        Delete blog post
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-[var(--text-color)]/80">
                        Are you sure you want to delete {blogTitle ? `"${blogTitle}"` : 'this blog post'}? This action cannot be undone.
                    </p>

                    {!!error && (
                        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            ref={cancelButtonRef}
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text-color)] transition-colors hover:bg-[var(--text-color)]/5 disabled:opacity-60 sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60 sm:w-auto"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Deleting…
                                </span>
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
