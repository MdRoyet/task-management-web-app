import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, ArrowRight } from 'lucide-react';

const Avatar = ({ name, pos, color, img }) => (
  <div className="hero-avatar" style={{ position: 'absolute', ...pos, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10 }}>
    <div style={{ position: 'relative' }}>
      <div style={{ 
        width: '60px', height: '60px', borderRadius: '50%', border: '3px solid white', overflow: 'hidden',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)', background: color
      }}>
        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', top: '-10px', right: '-40px', background: '#5B6AD0', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
        {name}
      </div>
    </div>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F9F8F3', color: '#000', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav className="navbar-container" style={{ padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <div style={{ width: '32px', height: '32px', background: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hexagon size={20} color="white" fill="white" />
          </div>
          TaskBoard
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ background: '#000', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '50px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ position: 'relative', height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem' }}>
        
        {/* Floating Avatars */}
        <Avatar name="Ellyse" pos={{ top: '10%', left: '15%' }} color="#FFD700" img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
        <Avatar name="Sarah" pos={{ top: '10%', right: '15%' }} color="#87CEEB" img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" />
        <Avatar name="Stokes" pos={{ top: '35%', left: '25%' }} color="#FFA07A" img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" />
        <Avatar name="Starc" pos={{ top: '35%', right: '25%' }} color="#98FB98" img="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
        <Avatar name="Alyssa" pos={{ bottom: '20%', left: '15%' }} color="#DDA0DD" img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" />
        <Avatar name="Conway" pos={{ bottom: '20%', right: '15%' }} color="#F0E68C" img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />

        <div className="animate-fade-in" style={{ maxWidth: '900px', zIndex: 5 }}>
          <h1 className="hero-title" style={{ fontSize: '5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '2rem' }}>
            Collaborate <span style={{ color: '#97E432' }}>▶</span> Track <br />
            and Succeed with <br />
            <span style={{ background: '#FFE4E1', padding: '0 20px', borderRadius: '10px' }}>TaskBoard</span>
            <span style={{ background: '#FF7F50', color: 'white', fontSize: '1rem', padding: '4px 12px', borderRadius: '8px', verticalAlign: 'middle', marginLeft: '10px' }}>Software</span>
          </h1>
          <p className="hero-subtitle" style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Track, Analyze, and Improve Your Performance with Our Comprehensive Project Records Platform.
          </p>

          <div style={{ 
            background: 'white', padding: '8px', borderRadius: '100px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', 
            width: '100%', maxWidth: '500px', margin: '0 auto' 
          }}>
            <input 
              type="text" 
              placeholder="name@company.com" 
              style={{ flex: 1, border: 'none', padding: '0 2rem', outline: 'none', fontSize: '1rem' }} 
            />
            <button 
              onClick={() => navigate('/register')}
              style={{ background: '#1A1A1A', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '100px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              Get Started <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Wavy Divider */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100px', overflow: 'hidden', lineHeight: 0 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,0 C150,100 350,0 500,100 C650,200 850,100 1000,100 C1150,100 1200,0 1200,0 L1200,120 L0,120 Z" fill="#fff"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'white', padding: '8rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="stats-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <h2 className="hero-title" style={{ fontSize: '4rem', fontWeight: '800', maxWidth: '500px', lineHeight: '1.1' }}>
              Unlock Efficiency in Every Project
            </h2>
            <p className="hero-subtitle" style={{ color: '#666', fontSize: '1.1rem', maxWidth: '400px' }}>
              Track, Analyze, and Improve Your Performance with Our Comprehensive Project Records Platform. Transform the way you plan, execute, and deliver projects.
            </p>
          </div>

          <div className="stats-grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ background: '#4F46E5', color: 'white', padding: '3rem 2rem', borderRadius: '40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '4rem', fontWeight: '800' }}>50+</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Integrated Tools & Software</div>
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
              </div>
              <div style={{ background: '#FF7F50', color: 'white', padding: '3rem 2rem', borderRadius: '40px' }}>
                <div style={{ fontSize: '4rem', fontWeight: '800' }}>10K+</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Last Month Registered Users</div>
              </div>
            </div>

            <div style={{ borderRadius: '40px', overflow: 'hidden', height: '100%' }}>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" alt="Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ background: '#6EE7B7', color: '#064E3B', padding: '3rem 2rem', borderRadius: '40px' }}>
                <div style={{ fontSize: '4rem', fontWeight: '800' }}>97%</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Our Satisfied Users</div>
              </div>
              <div style={{ background: '#FCD34D', color: '#78350F', padding: '3rem 2rem', borderRadius: '40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '4rem', fontWeight: '800' }}>20+</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Office in Countries</div>
                <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'white', padding: '4rem', borderTop: '1px solid #EEE', textAlign: 'center' }}>
        <div style={{ color: '#999', fontSize: '0.9rem' }}>© 2026 TaskBoard. Reimagining Productivity.</div>
      </footer>
    </div>
  );
}
