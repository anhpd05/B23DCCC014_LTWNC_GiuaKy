interface PageHeaderProps {
  crumb: string;
  title: string;
  sub?: string;
}

export function PageHeader({ crumb, title, sub }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{crumb}</span>
        <h1>{title}</h1>
      </div>
      {sub && <span className="page-header__sub">{sub}</span>}
    </header>
  );
}
