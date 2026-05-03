import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, Globe } from 'lucide-react';
import api from '../services/api';

const timezones = [
  { name: "Andorra", zone: "Europe/Andorra" },
  { name: "United Arab Emirates", zone: "Asia/Dubai" },
  { name: "Afghanistan", zone: "Asia/Kabul" },
  { name: "Antigua & Barbuda", zone: "America/Antigua" },
  { name: "Anguilla", zone: "America/Anguilla" },
  { name: "Albania", zone: "Europe/Tirane" },
  { name: "Armenia", zone: "Asia/Yerevan" },
  { name: "Angola", zone: "Africa/Luanda" },
  { name: "Antarctica", zone: "Antarctica/Casey" },
  { name: "Argentina", zone: "America/Argentina/Buenos_Aires" },
  { name: "American Samoa", zone: "Pacific/Pago_Pago" },
  { name: "Austria", zone: "Europe/Vienna" },
  { name: "Australia", zone: "Australia/Sydney" },
  { name: "Aruba", zone: "America/Aruba" },
  { name: "Azerbaijan", zone: "Asia/Baku" },
  { name: "Bosnia & Herzegovina", zone: "Europe/Sarajevo" },
  { name: "Barbados", zone: "America/Barbados" },
  { name: "Bangladesh", zone: "Asia/Dhaka" },
  { name: "Belgium", zone: "Europe/Brussels" },
  { name: "Burkina Faso", zone: "Africa/Ouagadougou" },
  { name: "Bulgaria", zone: "Europe/Sofia" },
  { name: "Bahrain", zone: "Asia/Bahrain" },
  { name: "Burundi", zone: "Africa/Bujumbura" },
  { name: "Benin", zone: "Africa/Porto-Novo" },
  { name: "Bermuda", zone: "Atlantic/Bermuda" },
  { name: "Brunei", zone: "Asia/Brunei" },
  { name: "Bolivia", zone: "America/La_Paz" },
  { name: "Brazil", zone: "America/Sao_Paulo" },
  { name: "Bahamas", zone: "America/Nassau" },
  { name: "Bhutan", zone: "Asia/Thimphu" },
  { name: "Botswana", zone: "Africa/Gaborone" },
  { name: "Belarus", zone: "Europe/Minsk" },
  { name: "Belize", zone: "America/Belize" },
  { name: "Canada", zone: "America/Toronto" },
  { name: "Congo - Kinshasa", zone: "Africa/Kinshasa" },
  { name: "Switzerland", zone: "Europe/Zurich" },
  { name: "Chile", zone: "America/Santiago" },
  { name: "Cameroon", zone: "Africa/Douala" },
  { name: "China", zone: "Asia/Shanghai" },
  { name: "Colombia", zone: "America/Bogota" },
  { name: "Costa Rica", zone: "America/Costa_Rica" },
  { name: "Cuba", zone: "America/Havana" },
  { name: "Cyprus", zone: "Asia/Nicosia" },
  { name: "Czechia", zone: "Europe/Prague" },
  { name: "Germany", zone: "Europe/Berlin" },
  { name: "Denmark", zone: "Europe/Copenhagen" },
  { name: "Dominican Republic", zone: "America/Santo_Domingo" },
  { name: "Algeria", zone: "Africa/Algiers" },
  { name: "Ecuador", zone: "America/Guayaquil" },
  { name: "Estonia", zone: "Europe/Tallinn" },
  { name: "Egypt", zone: "Africa/Cairo" },
  { name: "Spain", zone: "Europe/Madrid" },
  { name: "Ethiopia", zone: "Africa/Addis_Ababa" },
  { name: "Finland", zone: "Europe/Helsinki" },
  { name: "Fiji", zone: "Pacific/Fiji" },
  { name: "France", zone: "Europe/Paris" },
  { name: "Gabon", zone: "Africa/Libreville" },
  { name: "United Kingdom", zone: "Europe/London" },
  { name: "Grenada", zone: "America/Grenada" },
  { name: "Georgia", zone: "Asia/Tbilisi" },
  { name: "Ghana", zone: "Africa/Accra" },
  { name: "Greenland", zone: "America/Nuuk" },
  { name: "Gambia", zone: "Africa/Banjul" },
  { name: "Greece", zone: "Europe/Athens" },
  { name: "Guatemala", zone: "America/Guatemala" },
  { name: "Guyana", zone: "America/Guyana" },
  { name: "Hong Kong", zone: "Asia/Hong_Kong" },
  { name: "Honduras", zone: "America/Tegucigalpa" },
  { name: "Croatia", zone: "Europe/Zagreb" },
  { name: "Haiti", zone: "America/Port-au-Prince" },
  { name: "Hungary", zone: "Europe/Budapest" },
  { name: "Indonesia", zone: "Asia/Jakarta" },
  { name: "Ireland", zone: "Europe/Dublin" },
  { name: "Israel", zone: "Asia/Jerusalem" },
  { name: "Isle of Man", zone: "Europe/Isle_of_Man" },
  { name: "India", zone: "Asia/Kolkata" },
  { name: "Iraq", zone: "Asia/Baghdad" },
  { name: "Iran", zone: "Asia/Tehran" },
  { name: "Iceland", zone: "Atlantic/Reykjavik" },
  { name: "Italy", zone: "Europe/Rome" },
  { name: "Jamaica", zone: "America/Jamaica" },
  { name: "Jordan", zone: "Asia/Amman" },
  { name: "Japan", zone: "Asia/Tokyo" },
  { name: "Kenya", zone: "Africa/Nairobi" },
  { name: "Kyrgyzstan", zone: "Asia/Bishkek" },
  { name: "Cambodia", zone: "Asia/Phnom_Penh" },
  { name: "Kiribati", zone: "Pacific/Tarawa" },
  { name: "Comoros", zone: "Africa/Comoro" },
  { name: "South Korea", zone: "Asia/Seoul" },
  { name: "Kuwait", zone: "Asia/Kuwait" },
  { name: "Kazakhstan", zone: "Asia/Almaty" },
  { name: "Laos", zone: "Asia/Vientiane" },
  { name: "Lebanon", zone: "Asia/Beirut" },
  { name: "Sri Lanka", zone: "Asia/Colombo" },
  { name: "Liberia", zone: "Africa/Monrovia" },
  { name: "Lesotho", zone: "Africa/Maseru" },
  { name: "Lithuania", zone: "Europe/Vilnius" },
  { name: "Luxembourg", zone: "Europe/Luxembourg" },
  { name: "Latvia", zone: "Europe/Riga" },
  { name: "Libya", zone: "Africa/Tripoli" },
  { name: "Morocco", zone: "Africa/Casablanca" },
  { name: "Monaco", zone: "Europe/Monaco" },
  { name: "Moldova", zone: "Europe/Chisinau" },
  { name: "Montenegro", zone: "Europe/Podgorica" },
  { name: "Madagascar", zone: "Africa/Antananarivo" },
  { name: "Mexico", zone: "America/Mexico_City" },
  { name: "Malaysia", zone: "Asia/Kuala_Lumpur" },
  { name: "Nigeria", zone: "Africa/Lagos" },
  { name: "Netherlands", zone: "Europe/Amsterdam" },
  { name: "Norway", zone: "Europe/Oslo" },
  { name: "Nepal", zone: "Asia/Kathmandu" },
  { name: "New Zealand", zone: "Pacific/Auckland" },
  { name: "Oman", zone: "Asia/Muscat" },
  { name: "Panama", zone: "America/Panama" },
  { name: "Peru", zone: "America/Lima" },
  { name: "Philippines", zone: "Asia/Manila" },
  { name: "Pakistan", zone: "Asia/Karachi" },
  { name: "Poland", zone: "Europe/Warsaw" },
  { name: "Portugal", zone: "Europe/Lisbon" },
  { name: "Paraguay", zone: "America/Asuncion" },
  { name: "Qatar", zone: "Asia/Qatar" },
  { name: "Romania", zone: "Europe/Bucharest" },
  { name: "Serbia", zone: "Europe/Belgrade" },
  { name: "Russia", zone: "Europe/Moscow" },
  { name: "Saudi Arabia", zone: "Asia/Riyadh" },
  { name: "Sweden", zone: "Europe/Stockholm" },
  { name: "Singapore", zone: "Asia/Singapore" },
  { name: "Thailand", zone: "Asia/Bangkok" },
  { name: "Turkey", zone: "Europe/Istanbul" },
  { name: "Taiwan", zone: "Asia/Taipei" },
  { name: "Ukraine", zone: "Europe/Kyiv" },
  { name: "United States", zone: "America/New_York" },
  { name: "Uruguay", zone: "America/Montevideo" },
  { name: "Uzbekistan", zone: "Asia/Tashkent" },
  { name: "Venezuela", zone: "America/Caracas" },
  { name: "Vietnam", zone: "Asia/Ho_Chi_Minh" },
  { name: "South Africa", zone: "Africa/Johannesburg" },
  { name: "Zimbabwe", zone: "Africa/Harare" }
];

export default function AppointmentModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    description: '',
    status: 'Confirmed'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Format the data to match what the backend expects or store the full timezone info
      const submissionData = {
        ...formData,
        // We can combine time and timezone or send separately
        time: `${formData.time} (${formData.timezone})`
      };
      await api.post('/appointments', submissionData);
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create appointment.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>New Appointment</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Patient Name" 
              className="glass-input" 
              style={{ paddingLeft: '2.75rem' }}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="date" 
                className="glass-input" 
                style={{ paddingLeft: '2.75rem', colorScheme: 'dark' }}
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required 
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="time" 
                className="glass-input" 
                style={{ paddingLeft: '2.75rem', colorScheme: 'dark' }}
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                required 
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Globe size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <select 
              className="glass-input" 
              style={{ paddingLeft: '2.75rem', appearance: 'none', background: 'rgba(0,0,0,0.4)' }}
              value={formData.timezone}
              onChange={e => setFormData({ ...formData, timezone: e.target.value })}
              required
            >
              {timezones.map((tz, i) => (
                <option key={i} value={tz.zone} style={{ background: '#1a1d23', color: 'white' }}>
                  {tz.name} ({tz.zone})
                </option>
              ))}
            </select>
          </div>

          <div style={{ position: 'relative' }}>
            <FileText size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
            <textarea 
              placeholder="Description" 
              className="glass-input" 
              style={{ paddingLeft: '2.75rem', minHeight: '100px', resize: 'none' }}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required 
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Confirmed' })}
              style={{ 
                flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--glass-border)',
                background: formData.status === 'Confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                color: formData.status === 'Confirmed' ? '#22C55E' : 'var(--text-muted)',
                fontWeight: '600', cursor: 'pointer'
              }}
            >Confirmed</button>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Pending' })}
              style={{ 
                flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--glass-border)',
                background: formData.status === 'Pending' ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
                color: formData.status === 'Pending' ? '#EAB308' : 'var(--text-muted)',
                fontWeight: '600', cursor: 'pointer'
              }}
            >Pending</button>
          </div>

          <button type="submit" className="glass-btn" style={{ height: '50px', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
