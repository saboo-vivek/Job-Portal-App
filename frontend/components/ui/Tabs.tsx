import React, { createContext, useContext, useState } from 'react';
import { cn } from './utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface LegacyTabsProps {
  tabs?: TabItem[];
  activeTab?: string;
  onChange?: (id: string) => void;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
  variant?: 'pill' | 'underline';
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export const Tabs: React.FC<LegacyTabsProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  onChange,
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
  variant = 'pill',
}) => {
  const [internalTab, setInternalTab] = useState<string>(
    defaultValue || (tabs && tabs[0]?.id) || ''
  );

  const currentTab = controlledValue !== undefined
    ? controlledValue
    : controlledActiveTab !== undefined
    ? controlledActiveTab
    : internalTab;

  const handleTabChange = (val: string) => {
    if (controlledValue === undefined && controlledActiveTab === undefined) {
      setInternalTab(val);
    }
    onChange?.(val);
    onValueChange?.(val);
  };

  // If using children (Compound Tabs API)
  if (children) {
    return (
      <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab: handleTabChange }}>
        <div className={cn('w-full', className)}>{children}</div>
      </TabsContext.Provider>
    );
  }

  // Otherwise, use legacy array configuration
  if (!tabs) return null;

  return (
    <div
      className={cn(
        variant === 'pill'
          ? 'inline-flex p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 backdrop-blur-sm'
          : 'flex space-x-6 border-b border-border',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;

        if (variant === 'pill') {
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 select-none',
                isActive
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-neutral-secondary hover:text-neutral'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[11px] px-2 py-0.5 rounded-full font-bold',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-slate-200 text-slate-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 transition-all select-none',
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-secondary hover:text-neutral hover:border-slate-300'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-neutral-secondary font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const TabsList: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const isActive = context.activeTab === value;

  return (
    <button
      type="button"
      onClick={() => context.setActiveTab(value)}
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 select-none cursor-pointer',
        isActive
          ? 'bg-white text-primary shadow-sm font-bold'
          : 'text-neutral-secondary hover:text-neutral hover:bg-white/50',
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  if (context.activeTab !== value) return null;

  return <div className={cn('animate-in fade-in-50 duration-200', className)}>{children}</div>;
};
