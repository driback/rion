import type { ReactNode } from 'react';

type SettingsBlockProps = {
  title: string;
  children: ReactNode;
};

const SettingsBlock = ({ title, children }: SettingsBlockProps) => (
  <div className="flex flex-col">
    <h2 className="font-semibold">{title}</h2>
    {children}
  </div>
);

export default SettingsBlock;
