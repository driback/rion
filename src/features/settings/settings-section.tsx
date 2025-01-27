import type { ReactNode } from 'react';

type SettingsSectionProps = {
  title: string;
  subtitle: string;
  rightContent: ReactNode;
};

const SettingsSection = ({
  title,
  subtitle,
  rightContent,
}: SettingsSectionProps) => (
  <section className="flex items-center justify-between gap-4 py-4">
    <div className="flex flex-col">
      <h2 className="font-semibold text-sm">{title}</h2>
      <p className="text-[.8rem] text-muted-foreground">{subtitle}</p>
    </div>
    {rightContent}
  </section>
);

export default SettingsSection;
