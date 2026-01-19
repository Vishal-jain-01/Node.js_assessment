const modules = [
  {
    title: "Leads & Sales",
    description: "Automate lead capture, track deals, and forecast revenue in real time.",
    tag: "Pipeline"
  },
  {
    title: "Attendance",
    description: "Geo-enabled clock-ins, shift tracking, and team attendance dashboards.",
    tag: "People"
  },
  {
    title: "WhatsApp Connect",
    description: "Send broadcasts, manage templates, and view delivery analytics.",
    tag: "Messaging"
  },
  {
    title: "Customer 360",
    description: "Unified timelines, notes, and conversations for every client.",
    tag: "Insights"
  },
  {
    title: "Automation",
    description: "Trigger workflows, auto-assign leads, and reduce manual work.",
    tag: "Smart"
  },
  {
    title: "Reports",
    description: "Prebuilt KPI dashboards with export-ready charts.",
    tag: "Analytics"
  }
];

const highlights = [
  { label: "Active Pipelines", value: "42" },
  { label: "Deals Closed", value: "₹18.4M" },
  { label: "Avg. Response", value: "32 min" },
  { label: "Team Attendance", value: "96%" }
];

const features = [
  "Lead capture & assignment",
  "Sales pipeline stages",
  "Attendance management",
  "WhatsApp messaging",
  "Task & activity planner",
  "Revenue forecasting",
  "Workflow automation",
  "Custom dashboards",
  "Role-based access",
  "Mobile-ready UI",
  "AI insights (optional)",
  "Customer satisfaction tracking"
];

const insights = [
  {
    title: "Realtime Sales Pulse",
    metric: "+24%",
    detail: "Sales velocity improved over the last 30 days."
  },
  {
    title: "Attendance Integrity",
    metric: "98%",
    detail: "Geo-verified clock-ins across 12 teams."
  },
  {
    title: "WhatsApp Reach",
    metric: "91%",
    detail: "Template delivery success with smart retry rules."
  }
];

function App() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="logo">
          <span className="logo-mark">N</span>
          <div>
            <p className="logo-title">NovaCRM</p>
            <p className="logo-sub">Next-gen customer intelligence</p>
          </div>
        </div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#modules">Modules</a>
          <a href="#insights">Insights</a>
          <a href="#cta">Launch</a>
        </nav>
        <button className="primary">Request Demo</button>
      </header>

      <section className="hero">
        <div className="hero-text">
          <span className="pill">Custom CRM • Sales • Attendance • WhatsApp</span>
          <h1>
            A beautiful CRM designed to convert leads and energize your teams.
          </h1>
          <p>
            Give your business a premium command center: sales pipelines, attendance
            tracking, WhatsApp engagement, and 10+ modules stitched into one
            high-performance platform.
          </p>
          <div className="hero-actions">
            <button className="primary">Build My CRM</button>
            <button className="ghost">Watch Overview</button>
          </div>
          <div className="hero-stats">
            {highlights.map((item) => (
              <div key={item.label} className="stat-card">
                <p className="stat-value">{item.value}</p>
                <p className="stat-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-card">
            <div className="card-header">
              <p>Sales Pipeline</p>
              <span className="status">Live</span>
            </div>
            <div className="pipeline">
              <div>
                <p className="pipeline-title">Inbound</p>
                <p className="pipeline-value">38 Leads</p>
                <div className="progress">
                  <span style={{ width: "72%" }} />
                </div>
              </div>
              <div>
                <p className="pipeline-title">Qualified</p>
                <p className="pipeline-value">21 Leads</p>
                <div className="progress">
                  <span style={{ width: "54%" }} />
                </div>
              </div>
              <div>
                <p className="pipeline-title">Closed</p>
                <p className="pipeline-value">12 Deals</p>
                <div className="progress">
                  <span style={{ width: "38%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card">
            <div className="card-header">
              <p>Attendance</p>
              <span className="status warning">On-site</span>
            </div>
            <div className="attendance">
              <div>
                <p>Checked In</p>
                <h3>84 People</h3>
              </div>
              <div>
                <p>Late Arrivals</p>
                <h3>6 People</h3>
              </div>
              <div>
                <p>Remote Teams</p>
                <h3>18 People</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-grid" id="features">
        <div>
          <h2>10+ CRM features in one premium experience</h2>
          <p>
            Deliver a rich, customer-first journey with analytics, automation, and
            secure collaboration tools.
          </p>
        </div>
        <div className="feature-list">
          {features.map((feature) => (
            <div key={feature} className="feature-item">
              <span className="check">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="modules" id="modules">
        <div className="section-header">
          <h2>Core modules built for scale</h2>
          <p>
            Everything your team needs to engage customers, manage people, and
            close revenue faster.
          </p>
        </div>
        <div className="module-grid">
          {modules.map((module) => (
            <div key={module.title} className="module-card">
              <span className="tag">{module.tag}</span>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <button className="ghost">Explore</button>
            </div>
          ))}
        </div>
      </section>

      <section className="insights" id="insights">
        <div>
          <h2>Live business insights that inspire action</h2>
          <p>
            Your leadership team gets a clear view of revenue, productivity, and
            customer engagement.
          </p>
        </div>
        <div className="insight-cards">
          {insights.map((insight) => (
            <div key={insight.title} className="insight-card">
              <p className="insight-title">{insight.title}</p>
              <p className="insight-metric">{insight.metric}</p>
              <p className="insight-detail">{insight.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta" id="cta">
        <div>
          <h2>Launch your CRM in weeks, not months.</h2>
          <p>
            Customize every workflow, brand touchpoint, and channel to match your
            exact business needs.
          </p>
        </div>
        <button className="primary">Schedule a Strategy Call</button>
      </section>

      <footer className="footer">
        <div>
          <p className="logo-title">NovaCRM</p>
          <p className="logo-sub">Designed to attract, built to convert.</p>
        </div>
        <div className="footer-links">
          <a href="#">Security</a>
          <a href="#">Integrations</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
