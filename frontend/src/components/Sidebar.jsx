const navItems = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Leads', href: '#leads' },
  { label: 'Deals', href: '#deals' },
  { label: 'Attendance', href: '#attendance' },
  { label: 'Messages', href: '#messages' },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar__brand">
      <span className="brand__dot" />
      <div>
        <h1>CRM Command</h1>
        <p>Revenue Operations</p>
      </div>
    </div>
    <nav className="sidebar__nav">
      {navItems.map((item) => (
        <a key={item.label} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
    <div className="sidebar__footer">
      <div>
        <h4>Today</h4>
        <p>October 18 · Tue</p>
      </div>
      <button type="button">Sync Reports</button>
    </div>
  </aside>
);

export default Sidebar;
