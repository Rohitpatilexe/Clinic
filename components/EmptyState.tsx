import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    title,
    description,
    icon: Icon,
    actionLabel,
    onAction
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {Icon && (
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
            )}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                {description}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
