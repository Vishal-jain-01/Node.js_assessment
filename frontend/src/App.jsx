import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import {
  fetchAttendance,
  fetchCrmDashboard,
  fetchCrmLeads,
  fetchCrmPipeline,
  sendWhatsAppMessage,
} from './api/client.js';
import './styles.css';

const defaultKpis = [
  { label: 'Qualified Leads', value: '128', delta: '+12%' },
  { label: 'Pipeline Value', value: '$2.4M', delta: '+8.3%' },
  { label: 'Win Rate', value: '38%', delta: '+4.1%' },
  { label: 'Team Attendance', value: '96%', delta: '+1.2%' },
];

const pipelineColumns = [
  {
    title: 'Discovery',
    value: '$420K',
    deals: [
      { name: 'Aurora Health', owner: 'Mia', value: '$110K' },
      { name: 'Nimbus AI', owner: 'Sam', value: '$85K' },
    ],
  },
  {
    title: 'Proposal',
    value: '$860K',
    deals: [
      { name: 'Vector Labs', owner: 'Lee', value: '$240K' },
      { name: 'Brightline Co', owner: 'Alex', value: '$175K' },
    ],
  },
  {
    title: 'Negotiation',
    value: '$690K',
    deals: [
      { name: 'Nova Freight', owner: 'Jules', value: '$320K' },
      { name: 'Atlas Retail', owner: 'Priya', value: '$140K' },
    ],
  },
  {
    title: 'Closed Won',
    value: '$430K',
    deals: [
      { name: 'Pulse Energy', owner: 'Ari', value: '$190K' },
      { name: 'Zenith Media', owner: 'Quinn', value: '$105K' },
    ],
  },
];

const leads = [
  { name: 'Sienna Brooks', company: 'HelioTech', stage: 'Demo booked' },
  { name: 'Marcus Allen', company: 'Ridgeview Finance', stage: 'Discovery' },
  { name: 'Elena Moss', company: 'Harbor Logistics', stage: 'Proposal' },
  { name: 'Drew Patel', company: 'Verse Labs', stage: 'Qualification' },
];

const attendanceSnapshot = [
  { team: 'Sales', status: 'All present', coverage: '100%' },
  { team: 'Customer Success', status: '1 PTO', coverage: '92%' },
  { team: 'SDR', status: '2 remote', coverage: '95%' },
];

const messages = [
  {
    name: 'Kim Alvarez',
    message: 'The proposal looks great. Can we include onboarding support?'
  },
  {
    name: 'Ops Channel',
    message: 'Reminder: pipeline review at 4 PM with updated forecasts.'
  },
];

const App = () => {
  const [kpis, setKpis] = useState(defaultKpis);
  const [pipeline, setPipeline] = useState(pipelineColumns);
  const [attendance, setAttendance] = useState(attendanceSnapshot);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboard, leadsResponse, pipelineResponse, attendanceResponse] =
          await Promise.all([
            fetchCrmDashboard(),
            fetchCrmLeads(),
            fetchCrmPipeline(),
            fetchAttendance(),
          ]);

        if (dashboard?.kpis) {
          setKpis(dashboard.kpis);
        }

        if (pipelineResponse?.stages) {
          setPipeline(pipelineResponse.stages);
        }

        if (attendanceResponse?.teams) {
          setAttendance(attendanceResponse.teams);
        }

        if (leadsResponse?.recentLead) {
          sendWhatsAppMessage({
            to: leadsResponse.recentLead.phone,
            message: 'Thanks for connecting! Your demo is confirmed.'
          });
        }
      } catch (error) {
        console.warn('API data unavailable, using fallback UI data.', error);
      }
    };

    load();
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <header className="topbar">
          <div>
            <h2>Sales & Operations Dashboard</h2>
            <p>Monitor CRM momentum, attendance, and engagement in real time.</p>
          </div>
          <div className="topbar__actions">
            <button type="button" className="ghost">Export</button>
            <button type="button" className="primary">New Deal</button>
          </div>
        </header>

        <section id="dashboard" className="section">
          <div className="section__header">
            <h3>Executive KPIs</h3>
            <span>Updated 5 minutes ago</span>
          </div>
          <div className="kpi-grid">
            {kpis.map((item) => (
              <div key={item.label} className="kpi-card">
                <p>{item.label}</p>
                <h3>{item.value}</h3>
                <span>{item.delta}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="deals" className="section">
          <div className="section__header">
            <h3>Deals Pipeline</h3>
            <span>Live board by stage</span>
          </div>
          <div className="pipeline">
            {pipeline.map((column) => (
              <div key={column.title} className="pipeline__column">
                <div className="pipeline__header">
                  <h4>{column.title}</h4>
                  <span>{column.value}</span>
                </div>
                <div className="pipeline__cards">
                  {column.deals.map((deal) => (
                    <article key={deal.name} className="deal-card">
                      <h5>{deal.name}</h5>
                      <p>{deal.owner}</p>
                      <strong>{deal.value}</strong>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="leads" className="section split">
          <div>
            <div className="section__header">
              <h3>Leads</h3>
              <span>Highest priority outreach</span>
            </div>
            <div className="list-card">
              {leads.map((lead) => (
                <div key={lead.name} className="list-row">
                  <div>
                    <h4>{lead.name}</h4>
                    <p>{lead.company}</p>
                  </div>
                  <span>{lead.stage}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="section__header">
              <h3>Messages</h3>
              <span>WhatsApp + internal</span>
            </div>
            <div id="messages" className="list-card">
              {messages.map((item) => (
                <div key={item.name} className="message-row">
                  <h4>{item.name}</h4>
                  <p>{item.message}</p>
                </div>
              ))}
              <button type="button" className="primary full">Send Broadcast</button>
            </div>
          </div>
        </section>

        <section id="attendance" className="section">
          <div className="section__header">
            <h3>Attendance</h3>
            <span>Coverage across revenue teams</span>
          </div>
          <div className="attendance-grid">
            {attendance.map((item) => (
              <div key={item.team} className="attendance-card">
                <h4>{item.team}</h4>
                <p>{item.status}</p>
                <strong>{item.coverage}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
