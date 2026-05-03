import React, { useState, useEffect } from 'react';
import { 
  MoreHorizontal, Plus, ChevronRight, 
  TrendingUp, ArrowUpRight,
  Filter, SortAsc, Layout, List, Calendar as CalendarIcon,
  ClipboardList, Users as UsersIcon
} from 'lucide-react';
import api from '../services/api';
import AppointmentModal from '../components/AppointmentModal';

const AppointmentCard = ({ name, time, date, status, desc }) => (
  <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '10px', textAlign: 'center', minWidth: '60px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{date}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{time}</div>
        </div>
        <div>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px' }}>{desc}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
        <MoreHorizontal size={18} color="var(--text-muted)" />
        <span style={{ 
          background: status === 'Confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
          color: status === 'Confirmed' ? '#22C55E' : '#EAB308',
          padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600'
        }}>{status}</span>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, change, icon: Icon, offset }) => (
  <div className="glass-panel animate-float" style={{ 
    padding: '1.5rem', width: '220px', position: 'absolute', right: offset.right, top: offset.top,
    zIndex: offset.zIndex, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color="var(--text-muted)" />
      </div>
      <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowUpRight size={14} color="white" />
      </div>
    </div>
    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{title}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{value}</div>
      <div style={{ 
        background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', 
        fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px'
      }}>
        <ArrowUpRight size={10} /> {change}%
      </div>
    </div>
    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>vs last month</div>
  </div>
);

const TaskCard = ({ date, title, desc, priority, tags, avatar }) => (
  <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <CalendarIcon size={14} /> {date}
      </div>
      <MoreHorizontal size={16} color="var(--text-muted)" />
    </div>
    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{title}</div>
    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{desc}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <img src={avatar} style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt="" />
        <span style={{ 
          background: priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : priority === 'Medium' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)',
          color: priority === 'High' ? '#EF4444' : priority === 'Medium' ? '#F97316' : '#22C55E',
          fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold'
        }}>{priority}</span>
      </div>
      <div style={{ color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
        <span style={{ fontSize: '0.75rem' }}># {tags[0]}</span>
        <span style={{ fontSize: '0.75rem' }}># {tags[1]}</span>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 240px', gap: '2rem', minHeight: '450px' }}>
        {/* Appointments Column */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Appointments overview</h2>
            <button 
              onClick={() => {
                console.log("Opening Appointment Modal...");
                setIsModalOpen(true);
              }}
              style={{ width: '32px', height: '32px', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1, maxHeight: '350px', paddingRight: '0.5rem' }}>
            {appointments.map(apt => (
              <AppointmentCard 
                key={apt.id}
                name={apt.name} 
                time={apt.time} 
                date={apt.date} 
                status={apt.status} 
                desc={apt.description} 
              />
            ))}
            {appointments.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                No appointments yet.
              </div>
            )}
          </div>

          <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '1rem' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}>
              See all appointments <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Performance Column */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Performance metrics</h2>
            <button style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', color: 'white', fontSize: '0.85rem' }}>
              Create a report
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--text-main)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={14} /> Task completion rate
            </button>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Team performance
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              180 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Completed tasks</span>
            </div>
          </div>

          {/* Performance Graph Mockup */}
          <div style={{ height: '200px', width: '100%', position: 'relative', marginTop: '2rem' }}>
             <svg width="100%" height="100%" viewBox="0 0 400 150">
                <path d="M0,140 Q50,140 80,60 T160,100 T240,40 T320,80 T400,20" fill="none" stroke="#97E432" strokeWidth="3" />
                <path d="M0,140 Q50,140 80,60 T160,100 T240,40 T320,80 T400,20 L400,150 L0,150 Z" fill="url(#dashboardGradient)" opacity="0.1" />
                <defs>
                  <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#97E432" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="80" r="4" fill="#97E432" />
             </svg>
          </div>
        </div>

        {/* Stats Column (Right Side Floating) */}
        <div style={{ position: 'relative' }}>
          <StatCard title="Appointments" value={appointments.length} change="4" icon={CalendarIcon} offset={{ top: '0px', right: '0px', zIndex: 3 }} />
          <StatCard title="Tasks" value="235" change="12" icon={ClipboardList} offset={{ top: '160px', right: '-20px', zIndex: 2 }} />
          <StatCard title="Patients" value="78" change="3" icon={UsersIcon} offset={{ top: '320px', right: '0px', zIndex: 1 }} />
        </div>
      </div>

      {/* Tasks Overview Section */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Tasks overview</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '4px', display: 'flex' }}>
                <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', padding: '6px 12px', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                  <Layout size={14} /> Board
                </button>
                <button style={{ background: 'transparent', border: 'none', padding: '6px 12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                  <List size={14} /> List
                </button>
             </div>
             <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
               <Filter size={14} /> Filter
             </button>
             <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
               <SortAsc size={14} /> Sort
             </button>
             <button style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '0.5rem', color: 'white' }}>
               <Plus size={18} />
             </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '600' }}>Upcoming</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>5</span>
              </div>
              <TaskCard date="Sa, 11 Jan" title="Update Patient Records" desc="Review and update profiles by tomorrow." priority="Low" tags={['6', '3']} avatar="https://i.pravatar.cc/100?u=1" />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '600' }}>In progress</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>12</span>
              </div>
              <TaskCard date="Tu, 14 Jan" title="Schedule Team Meeting" desc="Confirm slots with the staff today." priority="Medium" tags={['5', '1']} avatar="https://i.pravatar.cc/100?u=2" />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '600' }}>Completed</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>6</span>
              </div>
              <TaskCard date="Mo, 13 Jan" title="Submit Monthly Report" desc="All data sent to management." priority="High" tags={['3', '3']} avatar="https://i.pravatar.cc/100?u=3" />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '600' }}>Attention required</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>12</span>
              </div>
              <TaskCard date="Th, 9 Jan" title="Reschedule Appointment" desc="Patient requested a new time." priority="Medium" tags={['5', '2']} avatar="https://i.pravatar.cc/100?u=4" />
           </div>
        </div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={fetchAppointments} 
      />
    </div>
  );
}
