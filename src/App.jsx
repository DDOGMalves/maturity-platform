import React, { useState, useCallback, memo, useEffect, useMemo, useRef } from 'react';
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line, ScatterChart, Scatter } from 'recharts';

// Datadog Logo (Bits) - embedded as base64 for portability
const DATADOG_LOGO_BASE64 = "data:image/png;base64,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";


// =====================================================
// HOME BUTTON - Shared component for navigation
// =====================================================
function HomeButton({ onBack, color = '#632CA6' }) {
  if (!onBack) return null;
  
  return (
    <button 
      onClick={onBack}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 10000,
        padding: '0.75rem 1.25rem',
        background: `linear-gradient(135deg, ${color}, #9560ca)`,
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(99, 44, 166, 0.4)',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 44, 166, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 44, 166, 0.4)';
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Home
    </button>
  );
}

// =====================================================
// LANDING PAGE COMPONENT
// =====================================================

const LAUNCHER_TRANSLATIONS = {
  pt: {
    platform: 'Plataforma de Maturidade',
    subtitle: 'Avalie e gerencie a maturidade em observabilidade',
    newAssessment: 'Novo Assessment',
    newAssessmentDesc: 'Inicie uma nova avaliação de maturidade para um time, área ou serviço',
    adminConsole: 'Console Admin',
    adminConsoleDesc: 'Visualize e gerencie todos os assessments do seu portfólio',
    startAssessment: 'Iniciar Assessment',
    openConsole: 'Abrir Console',
    features: {
      assessment: [
        'Framework oficial Datadog',
        '5 dimensões de maturidade',
        'Recomendações personalizadas',
        'Histórico e tendências'
      ],
      admin: [
        'Dashboard consolidado',
        'Análise comparativa',
        'Benchmarks de indústria',
        'Gestão de portfólio'
      ]
    },
    stats: {
      customers: 'Clientes',
      assessments: 'Assessments',
      avgScore: 'Score Médio',
      atRisk: 'Em Risco',
      noData: 'Sem dados ainda',
      noDataDesc: 'Comece fazendo seu primeiro assessment'
    },
    footer: 'Datadog Maturity Assessment Platform © 2026'
  },
  en: {
    platform: 'Maturity Platform',
    subtitle: 'Assess and manage observability maturity',
    newAssessment: 'New Assessment',
    newAssessmentDesc: 'Start a new maturity assessment for a team, area, or service',
    adminConsole: 'Admin Console',
    adminConsoleDesc: 'View and manage all assessments in your portfolio',
    startAssessment: 'Start Assessment',
    openConsole: 'Open Console',
    features: {
      assessment: [
        'Official Datadog framework',
        '5 maturity dimensions',
        'Personalized recommendations',
        'History and trends'
      ],
      admin: [
        'Consolidated dashboard',
        'Comparative analysis',
        'Industry benchmarks',
        'Portfolio management'
      ]
    },
    stats: {
      customers: 'Customers',
      assessments: 'Assessments',
      avgScore: 'Avg. Score',
      atRisk: 'At Risk',
      noData: 'No data yet',
      noDataDesc: 'Start by running your first assessment'
    },
    footer: 'Datadog Maturity Assessment Platform © 2026'
  }
};

// Stat Card Component - displays portfolio metrics
function StatCard({ label, value, color, icon }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered 
          ? `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`
          : 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isHovered ? color + '66' : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 10px 30px ${color}33` : '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: `${color}22`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.25rem'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#fff',
          lineHeight: '1.1'
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function DatadogPlatformLauncher({ onNavigate, language, setLanguage }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState(null);
  
  const t = LAUNCHER_TRANSLATIONS[language];

  // Load portfolio stats from localStorage
  useEffect(() => {
    const assessments = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('datadog-assessments-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const accountId = key.replace('datadog-assessments-', '');
          data.forEach(assessment => {
            assessments.push({
              ...assessment,
              accountId,
              customerId: accountId.split('-')[0] || accountId
            });
          });
        } catch (e) {
          console.error('Failed to load:', key, e);
        }
      }
    }

    if (assessments.length === 0) {
      setStats({ hasData: false });
      return;
    }

    // Group by customer for trend calculation
    const customerGroups = {};
    assessments.forEach(a => {
      if (!customerGroups[a.customerId]) {
        customerGroups[a.customerId] = [];
      }
      customerGroups[a.customerId].push(a);
    });

    // Calculate trends
    let atRisk = 0;
    Object.values(customerGroups).forEach(group => {
      const sorted = group.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (sorted.length > 1) {
        const trend = sorted[0].rawScore - sorted[1].rawScore;
        if (trend < -0.1) atRisk++;
      }
    });

    const avgScore = assessments.reduce((sum, a) => sum + a.rawScore, 0) / assessments.length;

    setStats({
      hasData: true,
      customers: Object.keys(customerGroups).length,
      assessments: assessments.length,
      avgScore: avgScore.toFixed(2),
      atRisk
    });
  }, []);

  const handleLaunch = (type) => {
    localStorage.setItem('datadog-platform-language', language);
    onNavigate(type);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0a2e 0%, #3a1a5e 50%, #632CA6 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        opacity: 0.04,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(99, 44, 166, 0.6) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(174, 123, 220, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)
        `,
        animation: 'pulse 15s ease-in-out infinite'
      }} />

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(174, 123, 220, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(174, 123, 220, 0.04) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: 0.4
      }} />

      {/* Language selector */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '0.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <button
            onClick={() => setLanguage('en')}
            style={{
              padding: '0.5rem 1rem',
              background: language === 'en' ? 'linear-gradient(135deg, #632CA6 0%, #9560ca 100%)' : 'transparent',
              color: language === 'en' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: language === 'en' ? '600' : '400',
              fontSize: '0.875rem',
              transition: 'all 0.3s ease'
            }}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('pt')}
            style={{
              padding: '0.5rem 1rem',
              background: language === 'pt' ? 'linear-gradient(135deg, #632CA6 0%, #9560ca 100%)' : 'transparent',
              color: language === 'pt' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: language === 'pt' ? '600' : '400',
              fontSize: '0.875rem',
              transition: 'all 0.3s ease'
            }}
          >
            Português
          </button>
        </div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          animation: 'fadeInDown 0.8s ease-out'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            background: 'linear-gradient(135deg, #632CA6 0%, #9560ca 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(99, 44, 166, 0.5)',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <img 
              src={DATADOG_LOGO_BASE64} 
              alt="Datadog"
              style={{
                width: '56px',
                height: '56px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
            />
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            {t.platform}
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: '400'
          }}>
            {t.subtitle}
          </p>
        </div>

        {/* Portfolio Stats Bar */}
        {stats && stats.hasData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: '1200px',
            width: '100%',
            marginBottom: '3rem',
            animation: 'fadeInUp 0.8s ease-out 0.15s backwards'
          }}>
            <StatCard 
              label={t.stats.customers}
              value={stats.customers}
              color="#ae7bdc"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
            <StatCard 
              label={t.stats.assessments}
              value={stats.assessments}
              color="#9560ca"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 15L11 17L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
            <StatCard 
              label={t.stats.avgScore}
              value={stats.avgScore}
              color="#667eea"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
            <StatCard 
              label={t.stats.atRisk}
              value={stats.atRisk}
              color={stats.atRisk > 0 ? '#ef4444' : '#10b981'}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55198 18.9945C1.551 19.3437 1.64149 19.6871 1.81442 19.9905C1.98736 20.2939 2.23672 20.5467 2.53773 20.7239C2.83875 20.9012 3.18058 20.9967 3.53 21H20.47C20.8194 20.9967 21.1613 20.9012 21.4623 20.7239C21.7633 20.5467 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3438 2.89725 12 2.89725C11.6562 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
          </div>
        )}

        {stats && !stats.hasData && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            marginBottom: '3rem',
            maxWidth: '1200px',
            width: '100%',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            animation: 'fadeInUp 0.8s ease-out 0.15s backwards'
          }}>
            <div style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.95rem',
              fontWeight: '500',
              marginBottom: '0.25rem'
            }}>
              ✨ {t.stats.noData}
            </div>
            <div style={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.825rem'
            }}>
              {t.stats.noDataDesc}
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          width: '100%',
          animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
        }}>
          {/* Assessment Card */}
          <div
            onMouseEnter={() => setHoveredCard('assessment')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleLaunch('assessment')}
            style={{
              background: hoveredCard === 'assessment' 
                ? 'linear-gradient(135deg, rgba(99, 44, 166, 0.25) 0%, rgba(149, 96, 202, 0.2) 100%)'
                : 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(20px)',
              border: hoveredCard === 'assessment'
                ? '2px solid rgba(149, 96, 202, 0.6)'
                : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '2.5rem',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredCard === 'assessment' ? 'translateY(-8px)' : 'translateY(0)',
              boxShadow: hoveredCard === 'assessment'
                ? '0 30px 60px rgba(99, 44, 166, 0.4)'
                : '0 10px 30px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #632CA6 0%, #9560ca 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 30px rgba(99, 44, 166, 0.5)',
                transform: hoveredCard === 'assessment' ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                transition: 'transform 0.4s ease'
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11L12 14L22 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '0.75rem'
              }}>
                {t.newAssessment}
              </h2>

              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                {t.newAssessmentDesc}
              </p>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '1.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {t.features.assessment.map((feature, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #632CA6 0%, #9560ca 100%)',
                      flexShrink: 0
                    }} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div style={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ae7bdc',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                <span>{t.startAssessment}</span>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  style={{
                    transform: hoveredCard === 'assessment' ? 'translateX(5px)' : 'translateX(0)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Admin Console Card */}
          <div
            onMouseEnter={() => setHoveredCard('admin')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleLaunch('admin')}
            style={{
              background: hoveredCard === 'admin' 
                ? 'linear-gradient(135deg, rgba(149, 96, 202, 0.25) 0%, rgba(102, 126, 234, 0.2) 100%)'
                : 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(20px)',
              border: hoveredCard === 'admin'
                ? '2px solid rgba(174, 123, 220, 0.6)'
                : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '2.5rem',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredCard === 'admin' ? 'translateY(-8px)' : 'translateY(0)',
              boxShadow: hoveredCard === 'admin'
                ? '0 30px 60px rgba(149, 96, 202, 0.4)'
                : '0 10px 30px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #9560ca 0%, #667eea 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 30px rgba(149, 96, 202, 0.5)',
                transform: hoveredCard === 'admin' ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
                transition: 'transform 0.4s ease'
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3H10V10H3V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 3H21V10H14V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14H21V21H14V14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 14H10V21H3V14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '0.75rem'
              }}>
                {t.adminConsole}
              </h2>

              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                {t.adminConsoleDesc}
              </p>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '1.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {t.features.admin.map((feature, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #9560ca 0%, #667eea 100%)',
                      flexShrink: 0
                    }} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div style={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#667eea',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                <span>{t.openConsole}</span>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  style={{
                    transform: hoveredCard === 'admin' ? 'translateX(5px)' : 'translateX(0)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '4rem',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: '0.875rem'
        }}>
          {t.footer}
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
      `}</style>
    </div>
  );
}

// =====================================================
// ASSESSMENT TOOL COMPONENT
// =====================================================


// Language translations
const TRANSLATIONS = {
  pt: {
    title: 'Avaliação de Maturidade em Observabilidade',
    subtitle: 'Framework Oficial Datadog',
    selectLanguage: 'Selecione o Idioma da Avaliação',
    serviceInfo: 'Informações do Serviço',
    serviceName: 'Nome do Serviço',
    accountId: 'Account ID',
    businessOwner: 'Business Owner',
    technicalOwner: 'Technical Owner',
    teamName: 'Nome do Time/Área/Serviço',
    calculate: 'Calcular Maturidade',
    maturityLevel: 'Nível de Maturidade',
    strengths: 'Principais Forças',
    risks: 'Riscos Operacionais',
    recommendations: 'Recomendações Prioritárias',
    quickWins: 'Quick Wins',
    quickWinsSubtitle: 'Próximos 30 dias — Ações táticas de alto impacto',
    strategicInitiatives: 'Iniciativas Estratégicas',
    strategicInitiativesSubtitle: 'Acima de 30 dias — Mudanças estruturais que destravam o próximo nível',
    noQuickWins: 'Nenhuma ação tática urgente identificada',
    noStrategic: 'Nenhuma iniciativa estratégica identificada',
    dimensions: 'Análise por Dimensão',
    executiveSummary: 'Resumo Executivo',
    operationalPlan: 'Plano de Ação Operacional',
    exportReport: 'Exportar Relatório',
    newAssessment: 'Nova Avaliação',
    maturityRationale: 'Justificativa da Maturidade',
    whatIncreased: 'O que elevou o score',
    whatPrevented: 'O que impediu score mais alto',
    roadmapToNext: 'Roadmap para o Próximo Nível',
    currentLevel: 'Nível Atual',
    nextTarget: 'Próximo Objetivo',
    mainBlockers: 'Principais Bloqueadores',
    milestones: 'Marcos para Avanço',
    phase: 'Fase',
    evolutionHistory: 'Evolução da Maturidade',
    historicalAssessments: 'Assessments Históricos',
    saveAssessment: 'Salvar Assessment',
    viewHistory: 'Ver Histórico',
    exportToDrive: 'Exportar para Drive',
    exportAllToDrive: 'Exportar Todos',
    importFromDrive: 'Importar do Drive',
    exportSuccess: 'Arquivo baixado! Suba para a pasta compartilhada do Drive.',
    importSuccess: 'Importado com sucesso',
    importError: 'Erro ao importar arquivo',
    unsyncedChanges: 'Mudanças não-sincronizadas',
    driveHelpTitle: 'Como compartilhar com a equipe',
    driveHelpStep1: 'Clique em "Exportar para Drive" para baixar o arquivo',
    driveHelpStep2: 'Arraste o arquivo para a pasta compartilhada da equipe no Google Drive',
    driveHelpStep3: 'Outros CSMs podem clicar em "Importar do Drive" para carregar o assessment',
    evolutionTrend: 'Tendência de Evolução',
    noHistory: 'Nenhum assessment anterior encontrado',
    compareWith: 'Comparar com',
    evolutionSince: 'Evolução desde',
    trainingRecommendations: 'Recomendações de Treinamento',
    trainingIntro: 'Baseado nos gaps identificados, os seguintes treinamentos podem acelerar a evolução de maturidade',
    learnMore: 'Saiba mais',
    allCourses: 'Ver todos os cursos',
    learningPaths: 'Learning Paths',
    dimension: {
      adoption: 'Adoção de Plataforma',
      governance: 'Governança Operacional',
      quality: 'Qualidade de Telemetria',
      alerting: 'Confiabilidade de Alertas',
      cost: 'Governança de Custo e Uso'
    }
  },
  en: {
    title: 'Observability Maturity Assessment',
    subtitle: 'Official Datadog Framework',
    selectLanguage: 'Select Assessment Language',
    serviceInfo: 'Service Information',
    serviceName: 'Service Name',
    accountId: 'Account ID',
    businessOwner: 'Business Owner',
    technicalOwner: 'Technical Owner',
    teamName: 'Team/Area/Service Name',
    calculate: 'Calculate Maturity',
    maturityLevel: 'Maturity Level',
    strengths: 'Key Strengths',
    risks: 'Operational Risks',
    recommendations: 'Prioritized Recommendations',
    quickWins: 'Quick Wins',
    quickWinsSubtitle: 'Next 30 days — Tactical high-impact actions',
    strategicInitiatives: 'Strategic Initiatives',
    strategicInitiativesSubtitle: '30+ days — Structural changes that unlock the next level',
    noQuickWins: 'No urgent tactical actions identified',
    noStrategic: 'No strategic initiatives identified',
    dimensions: 'Dimension Analysis',
    executiveSummary: 'Executive Summary',
    operationalPlan: 'Operational Action Plan',
    exportReport: 'Export Report',
    newAssessment: 'New Assessment',
    maturityRationale: 'Maturity Rationale',
    whatIncreased: 'What increased the score',
    whatPrevented: 'What prevented a higher score',
    roadmapToNext: 'Roadmap to the Next Level',
    currentLevel: 'Current Level',
    nextTarget: 'Next Target',
    mainBlockers: 'Main Blockers',
    milestones: 'Milestones for Advancement',
    phase: 'Phase',
    evolutionHistory: 'Maturity Evolution',
    historicalAssessments: 'Historical Assessments',
    saveAssessment: 'Save Assessment',
    viewHistory: 'View History',
    exportToDrive: 'Export to Drive',
    exportAllToDrive: 'Export All',
    importFromDrive: 'Import from Drive',
    exportSuccess: 'File downloaded! Upload it to the team shared Drive folder.',
    importSuccess: 'Imported successfully',
    importError: 'Error importing file',
    unsyncedChanges: 'Unsynced changes',
    driveHelpTitle: 'How to share with the team',
    driveHelpStep1: 'Click "Export to Drive" to download the file',
    driveHelpStep2: 'Drag the file to the team shared folder in Google Drive',
    driveHelpStep3: 'Other CSMs can click "Import from Drive" to load the assessment',
    evolutionTrend: 'Evolution Trend',
    noHistory: 'No previous assessments found',
    compareWith: 'Compare with',
    evolutionSince: 'Evolution since',
    trainingRecommendations: 'Training Recommendations',
    trainingIntro: 'Based on identified gaps, the following trainings can accelerate maturity evolution',
    learnMore: 'Learn more',
    allCourses: 'View all courses',
    learningPaths: 'Learning Paths',
    dimension: {
      adoption: 'Platform Adoption',
      governance: 'Operational Governance',
      quality: 'Telemetry Quality',
      alerting: 'Alerting Reliability',
      cost: 'Cost and Usage Governance'
    }
  }
};

// Maturity Level Definitions
const MATURITY_LEVELS = {
  0: {
    label: { pt: '0 - AdHoc / Monitoramento Desconhecido', en: '0 - AdHoc / Unknown Monitoring' },
    color: '#94a3b8',
    description: {
      pt: 'Pouco ou nenhum monitoramento estruturado. Dependência de checks manuais ou relatos de usuários.',
      en: 'Little to no structured monitoring. Reliance on manual checks or user reports.'
    }
  },
  1: {
    label: { pt: '1 - Monitoramento Reativo', en: '1 - Reactive Monitoring' },
    color: '#3b82f6',
    description: {
      pt: 'Monitoramento básico implementado. Resposta mais rápida a incidentes mas ainda reativo.',
      en: 'Basic monitoring implemented. Faster incident response but still reactive.'
    }
  },
  2: {
    label: { pt: '2 - Monitoramento Proativo', en: '2 - Proactive Monitoring' },
    color: '#8b5cf6',
    description: {
      pt: 'Monitoramento abrangente de infraestrutura e aplicações. Abordagem proativa ao gerenciamento de incidentes.',
      en: 'Comprehensive infrastructure and application monitoring. Proactive incident management approach.'
    }
  },
  3: {
    label: { pt: '3 - Observabilidade Avançada', en: '3 - Advanced Observability' },
    color: '#a855f7',
    description: {
      pt: 'Integração end-to-end significativa entre metrics, logs e traces. Root cause analysis com dados correlacionados.',
      en: 'Meaningful end-to-end integration across metrics, logs, and traces. Root cause analysis with correlated data.'
    }
  },
  4: {
    label: { pt: '4 - Análise Preditiva', en: '4 - Predictive Analytics' },
    color: '#ec4899',
    description: {
      pt: 'Capacidade preditiva ou preventiva com anomaly detection, forecasting ou assistência AI/ML.',
      en: 'Predictive or preventive capability with anomaly detection, forecasting, or AI/ML assistance.'
    }
  },
  5: {
    label: { pt: '5 - Operações Autônomas', en: '5 - Autonomous Operations' },
    color: '#f97316',
    description: {
      pt: 'Operações altamente confiáveis com baixa dependência manual. Observabilidade incorporada aos processos operacionais.',
      en: 'Highly reliable operations with low manual dependency. Observability embedded into operational processes.'
    }
  }
};

// Datadog Training Recommendations
const DATADOG_TRAINING = {
  governance: {
    pt: {
      title: 'Governança e Monitor Management',
      courses: [
        {
          name: 'Datadog Fundamentals',
          url: 'https://learn.datadoghq.com/bundles/datadog-fundamentals-certification-learning-path',
          description: 'Fundamentos de governança e organização da plataforma',
          duration: '2-3 horas'
        },
        {
          name: 'Monitor Best Practices',
          url: 'https://learn.datadoghq.com/courses/getting-started-monitors',
          description: 'Criação e gerenciamento eficaz de monitores',
          duration: '1-2 horas'
        },
        {
          name: 'Tagging Best Practices',
          url: 'https://learn.datadoghq.com/courses/tagging-best-practices',
          description: 'Unified tagging e organização',
          duration: '1 hora'
        }
      ]
    },
    en: {
      title: 'Governance and Monitor Management',
      courses: [
        {
          name: 'Datadog Fundamentals',
          url: 'https://learn.datadoghq.com/bundles/datadog-fundamentals-certification-learning-path',
          description: 'Platform governance and organization fundamentals',
          duration: '2-3 hours'
        },
        {
          name: 'Monitor Best Practices',
          url: 'https://learn.datadoghq.com/courses/getting-started-monitors',
          description: 'Effective monitor creation and management',
          duration: '1-2 hours'
        },
        {
          name: 'Tagging Best Practices',
          url: 'https://learn.datadoghq.com/courses/tagging-best-practices',
          description: 'Unified tagging and organization',
          duration: '1 hour'
        }
      ]
    }
  },
  quality: {
    pt: {
      title: 'Qualidade de Telemetria e Correlação',
      courses: [
        {
          name: 'APM Deep Dive',
          url: 'https://learn.datadoghq.com/courses/getting-started-apm',
          description: 'Distributed tracing e correlação logs-APM',
          duration: '3-4 horas'
        },
        {
          name: 'Log Management',
          url: 'https://learn.datadoghq.com/courses/log-explorer',
          description: 'Pipelines, parsing e correlação de logs',
          duration: '2-3 horas'
        },
        {
          name: 'RUM Fundamentals',
          url: 'https://learn.datadoghq.com/courses/intro-to-rum',
          description: 'Real User Monitoring e user tracking',
          duration: '2 horas'
        }
      ]
    },
    en: {
      title: 'Telemetry Quality and Correlation',
      courses: [
        {
          name: 'APM Deep Dive',
          url: 'https://learn.datadoghq.com/courses/getting-started-apm',
          description: 'Distributed tracing and logs-APM correlation',
          duration: '3-4 hours'
        },
        {
          name: 'Log Management',
          url: 'https://learn.datadoghq.com/courses/log-explorer',
          description: 'Pipelines, parsing, and log correlation',
          duration: '2-3 hours'
        },
        {
          name: 'RUM Fundamentals',
          url: 'https://learn.datadoghq.com/courses/intro-to-rum',
          description: 'Real User Monitoring and user tracking',
          duration: '2 hours'
        }
      ]
    }
  },
  alerting: {
    pt: {
      title: 'Confiabilidade de Alertas e Incident Management',
      courses: [
        {
          name: 'Alerting Best Practices',
          url: 'https://learn.datadoghq.com/courses/getting-started-monitors',
          description: 'Reduzir alert fatigue e melhorar precisão',
          duration: '1-2 horas'
        },
        {
          name: 'Incident Management',
          url: 'https://learn.datadoghq.com/courses/getting-started-incident-management',
          description: 'Resposta estruturada a incidentes',
          duration: '2 horas'
        },
        {
          name: 'Synthetic Monitoring',
          url: 'https://learn.datadoghq.com/courses/getting-started-with-synthetic-browser-testing',
          description: 'Monitoramento proativo com Synthetics',
          duration: '1-2 horas'
        }
      ]
    },
    en: {
      title: 'Alerting Reliability and Incident Management',
      courses: [
        {
          name: 'Alerting Best Practices',
          url: 'https://learn.datadoghq.com/courses/getting-started-monitors',
          description: 'Reduce alert fatigue and improve precision',
          duration: '1-2 hours'
        },
        {
          name: 'Incident Management',
          url: 'https://learn.datadoghq.com/courses/getting-started-incident-management',
          description: 'Structured incident response',
          duration: '2 hours'
        },
        {
          name: 'Synthetic Monitoring',
          url: 'https://learn.datadoghq.com/courses/getting-started-with-synthetic-browser-testing',
          description: 'Proactive monitoring with Synthetics',
          duration: '1-2 hours'
        }
      ]
    }
  },
  cost: {
    pt: {
      title: 'Governança de Custo e Otimização',
      courses: [
        {
          name: 'Log Optimization',
          url: 'https://learn.datadoghq.com/courses/log-explorer',
          description: 'Exclusion filters e otimização de ingestão',
          duration: '1 hora'
        },
        {
          name: 'Usage and Cost Management',
          url: 'https://learn.datadoghq.com/collections',
          description: 'Monitoramento e atribuição de uso',
          duration: '1-2 horas'
        }
      ]
    },
    en: {
      title: 'Cost Governance and Optimization',
      courses: [
        {
          name: 'Log Optimization',
          url: 'https://learn.datadoghq.com/courses/log-explorer',
          description: 'Exclusion filters and ingestion optimization',
          duration: '1 hour'
        },
        {
          name: 'Usage and Cost Management',
          url: 'https://learn.datadoghq.com/collections',
          description: 'Usage monitoring and attribution',
          duration: '1-2 hours'
        }
      ]
    }
  }
};

// Datadog Documentation Links
const DATADOG_DOCS = {
  adoption: {
    pt: {
      title: 'Documentação Datadog - Adoção de Plataforma',
      links: [
        { label: 'Introdução à Plataforma Datadog', url: 'https://docs.datadoghq.com/getting_started/' },
        { label: 'Integrações Disponíveis', url: 'https://docs.datadoghq.com/integrations/' },
        { label: 'Service Catalog', url: 'https://docs.datadoghq.com/service_catalog/' }
      ]
    },
    en: {
      title: 'Datadog Documentation - Platform Adoption',
      links: [
        { label: 'Getting Started with Datadog', url: 'https://docs.datadoghq.com/getting_started/' },
        { label: 'Available Integrations', url: 'https://docs.datadoghq.com/integrations/' },
        { label: 'Service Catalog', url: 'https://docs.datadoghq.com/service_catalog/' }
      ]
    }
  },
  governance: {
    pt: {
      title: 'Documentação Datadog - Governança Operacional',
      links: [
        { label: 'Gerenciamento de Monitores', url: 'https://docs.datadoghq.com/monitors/manage/' },
        { label: 'Notificações de Monitor', url: 'https://docs.datadoghq.com/monitors/notify/' },
        { label: 'Unified Tagging', url: 'https://docs.datadoghq.com/getting_started/tagging/unified_service_tagging/' },
        { label: 'Teams e Ownership', url: 'https://docs.datadoghq.com/account_management/teams/' },
        { label: 'Audit Trail', url: 'https://docs.datadoghq.com/account_management/audit_trail/' }
      ]
    },
    en: {
      title: 'Datadog Documentation - Operational Governance',
      links: [
        { label: 'Monitor Management', url: 'https://docs.datadoghq.com/monitors/manage/' },
        { label: 'Monitor Notifications', url: 'https://docs.datadoghq.com/monitors/notify/' },
        { label: 'Unified Tagging', url: 'https://docs.datadoghq.com/getting_started/tagging/unified_service_tagging/' },
        { label: 'Teams and Ownership', url: 'https://docs.datadoghq.com/account_management/teams/' },
        { label: 'Audit Trail', url: 'https://docs.datadoghq.com/account_management/audit_trail/' }
      ]
    }
  },
  quality: {
    pt: {
      title: 'Documentação Datadog - Qualidade de Telemetria',
      links: [
        { label: 'Correlação de Logs com APM', url: 'https://docs.datadoghq.com/tracing/other_telemetry/connect_logs_and_traces/' },
        { label: 'Log Pipelines', url: 'https://docs.datadoghq.com/logs/log_configuration/pipelines/' },
        { label: 'RUM - Real User Monitoring', url: 'https://docs.datadoghq.com/real_user_monitoring/' },
        { label: 'APM - Distributed Tracing', url: 'https://docs.datadoghq.com/tracing/' },
        { label: 'Trace Search & Analytics', url: 'https://docs.datadoghq.com/tracing/trace_explorer/trace_queries/' }
      ]
    },
    en: {
      title: 'Datadog Documentation - Telemetry Quality',
      links: [
        { label: 'Correlate Logs with APM', url: 'https://docs.datadoghq.com/tracing/other_telemetry/connect_logs_and_traces/' },
        { label: 'Log Pipelines', url: 'https://docs.datadoghq.com/logs/log_configuration/pipelines/' },
        { label: 'RUM - Real User Monitoring', url: 'https://docs.datadoghq.com/real_user_monitoring/' },
        { label: 'APM - Distributed Tracing', url: 'https://docs.datadoghq.com/tracing/' },
        { label: 'Trace Search & Analytics', url: 'https://docs.datadoghq.com/tracing/trace_explorer/trace_queries/' }
      ]
    }
  },
  alerting: {
    pt: {
      title: 'Documentação Datadog - Confiabilidade de Alertas',
      links: [
        { label: 'Tipos de Monitor', url: 'https://docs.datadoghq.com/monitors/types/' },
        { label: 'Configuração de Alertas', url: 'https://docs.datadoghq.com/monitors/configuration/' },
        { label: 'Downtime e Silenciamento', url: 'https://docs.datadoghq.com/monitors/downtimes/' },
        { label: 'Synthetic Monitoring', url: 'https://docs.datadoghq.com/synthetics/' },
        { label: 'Incident Management', url: 'https://docs.datadoghq.com/service_management/incident_management/' }
      ]
    },
    en: {
      title: 'Datadog Documentation - Alerting Reliability',
      links: [
        { label: 'Monitor Types', url: 'https://docs.datadoghq.com/monitors/types/' },
        { label: 'Alert Configuration', url: 'https://docs.datadoghq.com/monitors/configuration/' },
        { label: 'Downtime and Muting', url: 'https://docs.datadoghq.com/monitors/downtimes/' },
        { label: 'Synthetic Monitoring', url: 'https://docs.datadoghq.com/synthetics/' },
        { label: 'Incident Management', url: 'https://docs.datadoghq.com/service_management/incident_management/' }
      ]
    }
  },
  cost: {
    pt: {
      title: 'Documentação Datadog - Governança de Custo',
      links: [
        { label: 'Exclusion Filters para Logs', url: 'https://docs.datadoghq.com/logs/log_configuration/indexes/#exclusion-filters' },
        { label: 'Usage Attribution', url: 'https://docs.datadoghq.com/account_management/billing/usage_attribution/' },
        { label: 'Estimated Usage Metrics', url: 'https://docs.datadoghq.com/account_management/billing/usage_metrics/' },
        { label: 'Data Streams Monitoring', url: 'https://docs.datadoghq.com/data_streams/' },
        { label: 'Cost Optimization', url: 'https://docs.datadoghq.com/account_management/billing/usage_control_apm/' }
      ]
    },
    en: {
      title: 'Datadog Documentation - Cost Governance',
      links: [
        { label: 'Log Exclusion Filters', url: 'https://docs.datadoghq.com/logs/log_configuration/indexes/#exclusion-filters' },
        { label: 'Usage Attribution', url: 'https://docs.datadoghq.com/account_management/billing/usage_attribution/' },
        { label: 'Estimated Usage Metrics', url: 'https://docs.datadoghq.com/account_management/billing/usage_metrics/' },
        { label: 'Data Streams Monitoring', url: 'https://docs.datadoghq.com/data_streams/' },
        { label: 'Cost Optimization', url: 'https://docs.datadoghq.com/account_management/billing/usage_control_apm/' }
      ]
    }
  }
};
const MemoizedInput = memo(({ value, onChange, placeholder, label }) => (
  <div>
    <label style={{
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      color: '#374151'
    }}>
      {label}
    </label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        background: 'white',
        color: '#1f2937'
      }}
    />
  </div>
));

const DatadogLogo = () => (
  <div style={{
    padding: '0.25rem 0.75rem',
    background: '#632CA6',
    color: 'white',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600'
  }}>
    DATADOG
  </div>
);

// ============================================================================
// Manual Metrics Form Component
// ============================================================================
// Allows the CSM to manually enter metrics that are only available as images
// in the Datadog PDFs (Health Check Lite, Monitor Quality, Platform Utilization).
// MRR data is parsed automatically from the uploaded PDF.
// ============================================================================

// IMPORTANT: ManualFieldInput is defined OUTSIDE ManualMetricsForm so it doesn't
// get recreated on every parent re-render (which would cause input focus loss on every keystroke).
const ManualFieldInput = memo(({ field, label, help, value, onChange, onShowInPDF, hasPdfSource }) => {
  const handleInputChange = useCallback((e) => {
    onChange(field, e.target.value);
  }, [field, onChange]);
  
  const handleFocus = useCallback((e) => {
    e.target.style.borderColor = '#632CA6';
  }, []);
  
  const handleBlur = useCallback((e) => {
    e.target.style.borderColor = '#d1d5db';
  }, []);
  
  const handleShowClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShowInPDF) onShowInPDF(field);
  }, [field, onShowInPDF]);
  
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '0.375rem',
        minHeight: '20px'
      }}>
        <label style={{ 
          fontSize: '0.8125rem', 
          fontWeight: '500', 
          color: '#374151'
        }}>
          {label}
        </label>
        {hasPdfSource && (
          <button
            type="button"
            onClick={handleShowClick}
            style={{
              background: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              fontSize: '0.6875rem',
              fontWeight: '600',
              padding: '0.125rem 0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              lineHeight: 1,
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dbeafe';
              e.currentTarget.style.borderColor = '#60a5fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.borderColor = '#bfdbfe';
            }}
          >
            <span style={{ pointerEvents: 'none' }}>👁️</span>
            <span style={{ pointerEvents: 'none' }}>PDF</span>
          </button>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={help}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '0.875rem',
          transition: 'border-color 0.15s',
          outline: 'none',
          boxSizing: 'border-box'
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
});

// ============================================================================
// FIELD_PDF_MAP — Maps each manual field to its PDF source, page, and
// approximate vertical region where the value is shown.
// ============================================================================
// - sourceKey: which uploaded file to open ('healthCheck', 'monitorQuality', 'platformUtilization')
// - page: 1-indexed page number
// - yPercent: approximate vertical position (0-100%) where the field value appears
//             (used to scroll-to; -1 means scroll to top of page)
// - locator: text description of what the CSM should look for
// ============================================================================
const FIELD_PDF_MAP = {
  // Health Check Lite - 5 pages
  infraHostsAvg: { sourceKey: 'healthCheck', page: 1, yPercent: 30, locator: { pt: 'Tabela "Infra and APM Hosts last month" → coluna AVG', en: 'Table "Infra and APM Hosts last month" → AVG column' } },
  apmHostsAvg: { sourceKey: 'healthCheck', page: 1, yPercent: 30, locator: { pt: 'Tabela "Infra and APM Hosts last month" → linha APM, coluna AVG', en: 'Table "Infra and APM Hosts last month" → APM row, AVG column' } },
  agentImplementationRate: { sourceKey: 'healthCheck', page: 1, yPercent: 60, locator: { pt: 'Bloco verde "Agent instrumentation ratio last month" → número gigante', en: 'Green block "Agent instrumentation ratio last month" → big number' } },
  hostsWithEnvTag: { sourceKey: 'healthCheck', page: 1, yPercent: 78, locator: { pt: 'Bloco verde "Host agents with env tag" → número gigante', en: 'Green block "Host agents with env tag" → big number' } },
  percentageLogsCorrelated: { sourceKey: 'healthCheck', page: 2, yPercent: 90, locator: { pt: 'Bloco laranja "Percentage of Logs Correlated with APM Services" → número gigante', en: 'Orange block "Percentage of Logs Correlated with APM Services" → big number' } },
  ingestedLogsProcessedByPipeline: { sourceKey: 'healthCheck', page: 3, yPercent: 15, locator: { pt: 'Bloco verde "Ingested logs processed by pipeline" → número gigante', en: 'Green block "Ingested logs processed by pipeline" → big number' } },
  logsExcludedByExclusion: { sourceKey: 'healthCheck', page: 3, yPercent: 60, locator: { pt: 'Bloco verde "Log events excluded by exclusion filters" → número gigante', en: 'Green block "Log events excluded by exclusion filters" → big number' } },
  rumAsyncRequestEvents: { sourceKey: 'healthCheck', page: 4, yPercent: 20, locator: { pt: 'Bloco "RUM async request events with APM traces" (pode estar vazio)', en: 'Block "RUM async request events with APM traces" (may be empty)' } },
  rumSessionsWithUserID: { sourceKey: 'healthCheck', page: 4, yPercent: 35, locator: { pt: 'Bloco "RUM sessions with User ID" (pode estar vazio)', en: 'Block "RUM sessions with User ID" (may be empty)' } },
  
  // Monitor Quality - 2 pages
  healthyMonitors: { sourceKey: 'monitorQuality', page: 1, yPercent: 12, locator: { pt: 'Canto superior esquerdo: "N Healthy monitors"', en: 'Top-left: "N Healthy monitors"' } },
  monitorsToImprove: { sourceKey: 'monitorQuality', page: 1, yPercent: 12, locator: { pt: 'Canto superior direito: "N Monitors to improve"', en: 'Top-right: "N Monitors to improve"' } },
  monitorsWithHighAlerts: { sourceKey: 'monitorQuality', page: 1, yPercent: 22, locator: { pt: 'Seção "N monitors are generating a high volume of alerts"', en: 'Section "N monitors are generating a high volume of alerts"' } },
  monitorsMissingRecipients: { sourceKey: 'monitorQuality', page: 1, yPercent: 45, locator: { pt: 'Seção "N monitors have missing recipients"', en: 'Section "N monitors have missing recipients"' } },
  monitorsMissingDelay: { sourceKey: 'monitorQuality', page: 1, yPercent: 68, locator: { pt: 'Seção "N monitors are missing a delay"', en: 'Section "N monitors are missing a delay"' } },
  monitorsMuted60Days: { sourceKey: 'monitorQuality', page: 1, yPercent: 88, locator: { pt: 'Seção "N monitors have been muted for more than 60 days"', en: 'Section "N monitors have been muted for more than 60 days"' } },
  monitorsMisconfiguredChannels: { sourceKey: 'monitorQuality', page: 2, yPercent: 10, locator: { pt: 'Seção "N monitors have misconfigured notification channels"', en: 'Section "N monitors have misconfigured notification channels"' } },
  monitorsInAlertOver7Days: { sourceKey: 'monitorQuality', page: 2, yPercent: 45, locator: { pt: 'Seção "N monitors have been in alert for more than 7 days"', en: 'Section "N monitors have been in alert for more than 7 days"' } },
  
  // Platform Utilization - 1 page
  timeSpentDays: { sourceKey: 'platformUtilization', page: 1, yPercent: 10, locator: { pt: 'Primeiro bloco grande: "Time Spent In Platform" → N days', en: 'First big block: "Time Spent In Platform" → N days' } },
  totalActiveUsers: { sourceKey: 'platformUtilization', page: 1, yPercent: 10, locator: { pt: 'Segundo bloco grande: "Total & Concurrent Active Users" → número gigante', en: 'Second big block: "Total & Concurrent Active Users" → big number' } },
  avgUsagePerUser: { sourceKey: 'platformUtilization', page: 1, yPercent: 10, locator: { pt: 'Quarto bloco: "AVG Usage / user" → N hr', en: 'Fourth block: "AVG Usage / user" → N hr' } }
};

// ============================================================================
// PDFPreviewModal — Renders a PDF page as image and highlights the region
// where the field's value should be found. Uses pdfjs-dist (already loaded).
// ============================================================================
function PDFPreviewModal({ open, file, page, yPercent, fieldLabel, locator, onClose, language }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!open || !file) return;
    
    let cancelled = false;
    setLoading(true);
    setError(null);
    
    const renderPdf = async () => {
      try {
        // Load pdfjs-dist from CDN if not already loaded
        if (typeof window.pdfjsLib === 'undefined') {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
              resolve();
            };
            script.onerror = () => reject(new Error('Failed to load PDF library'));
            document.head.appendChild(script);
          });
        }
        
        if (cancelled) return;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        if (cancelled) return;
        if (page > pdf.numPages) {
          throw new Error(`Page ${page} not found (PDF has ${pdf.numPages} pages)`);
        }
        
        const pdfPage = await pdf.getPage(page);
        const viewport = pdfPage.getViewport({ scale: 1.5 });
        
        if (cancelled) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const context = canvas.getContext('2d');
        await pdfPage.render({ canvasContext: context, viewport }).promise;
        
        if (cancelled) return;
        setLoading(false);
        
        // Scroll to the Y region after render
        setTimeout(() => {
          if (cancelled) return;
          const container = canvas.parentElement;
          if (container && yPercent >= 0) {
            const targetY = (canvas.height * yPercent / 100) - (container.clientHeight / 3);
            container.scrollTop = Math.max(0, targetY);
          }
        }, 100);
      } catch (err) {
        if (!cancelled) {
          console.error('PDF render error:', err);
          setError(err.message);
          setLoading(false);
        }
      }
    };
    
    renderPdf();
    return () => { cancelled = true; };
  }, [open, file, page, yPercent]);
  
  if (!open) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        zIndex: 1500
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          width: '720px',
          maxWidth: '90vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #632CA6 0%, #8b5cf6 100%)',
          color: 'white',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              {language === 'pt' ? `Página ${page}` : `Page ${page}`}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              {fieldLabel}
            </div>
            <div style={{ fontSize: '0.8125rem', opacity: 0.95, background: 'rgba(255, 255, 255, 0.15)', padding: '0.5rem 0.75rem', borderRadius: '6px', lineHeight: '1.4' }}>
              📍 {locator}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            title={language === 'pt' ? 'Fechar' : 'Close'}
          >
            ×
          </button>
        </div>
        
        {/* PDF Canvas Container */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          background: '#f3f4f6',
          padding: '1rem',
          position: 'relative'
        }}>
          {loading && (
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              {language === 'pt' ? '⏳ Carregando PDF...' : '⏳ Loading PDF...'}
            </div>
          )}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '1rem',
              color: '#991b1b',
              fontSize: '0.875rem'
            }}>
              ⚠️ {error}
            </div>
          )}
          {!error && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <canvas 
                ref={canvasRef} 
                style={{ 
                  display: 'block',
                  maxWidth: '100%',
                  height: 'auto',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              {/* Highlight overlay at yPercent position */}
              {!loading && yPercent >= 0 && canvasRef.current && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${yPercent}%`,
                  height: '80px',
                  transform: 'translateY(-40px)',
                  border: '3px solid #fbbf24',
                  background: 'rgba(251, 191, 36, 0.15)',
                  pointerEvents: 'none',
                  borderRadius: '4px',
                  boxShadow: '0 0 0 4px rgba(251, 191, 36, 0.3)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-28px',
                    left: '0',
                    background: '#fbbf24',
                    color: '#78350f',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '4px 4px 0 0',
                    letterSpacing: '0.05em'
                  }}>
                    {language === 'pt' ? '👉 PROCURE AQUI' : '👉 LOOK HERE'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ManualMetricsForm = memo(({ manualData, setManualData, language, uploadedFiles, monitorQualityParseStatus, platformUtilizationParseStatus, healthCheckParseStatus }) => {
  // Stable callback: updates specific field without recreating on every render.
  // useCallback with [setManualData] dependency ensures this function reference
  // is stable across renders, so ManualFieldInput (memoized) doesn't re-render
  // unnecessarily, preserving input focus during typing.
  const handleFieldChange = useCallback((field, value) => {
    setManualData(prev => ({ ...prev, [field]: value }));
  }, [setManualData]);
  
  // State for the PDF preview modal
  const [pdfPreview, setPdfPreview] = useState(null); // { field, file, page, yPercent, locator, label }
  
  // Map field -> opens PDF preview with scroll to correct region
  const handleShowInPDF = useCallback((field) => {
    const mapping = FIELD_PDF_MAP[field];
    if (!mapping) return;
    
    const file = uploadedFiles?.[mapping.sourceKey];
    if (!file) {
      // File not uploaded yet — we'll show a notification-style banner in the form
      setPdfPreview({
        field,
        missingFile: true,
        sourceLabel: mapping.sourceKey,
        label: field
      });
      return;
    }
    
    setPdfPreview({
      field,
      file,
      page: mapping.page,
      yPercent: mapping.yPercent,
      locator: mapping.locator[language] || mapping.locator.en,
      label: field // label will come from t[field] at render
    });
  }, [uploadedFiles, language]);
  
  const t = language === 'pt' ? {
    title: 'Métricas Manuais dos PDFs',
    subtitle: 'Os 3 PDFs abaixo contêm dados em formato de imagem. Abra cada PDF e preencha os números abaixo. O MRR é analisado automaticamente.',
    section1: '🏥 Health Check Lite',
    section2: '📋 Monitor Quality',
    section3: '👥 Platform Utilization',
    fillAll: 'Preencha os campos com os valores dos PDFs (deixe em branco se não houver dado)',
    // Health Check fields
    infraHostsAvg: 'Infra Hosts (AVG)',
    infraHostsAvgHelp: 'Ex: 73, 975, 26100',
    apmHostsAvg: 'APM Hosts (AVG)',
    apmHostsAvgHelp: 'Ex: 161, 592, 9130',
    agentImplementationRate: 'Agent Instrumentation Ratio (%)',
    agentImplementationRateHelp: 'Ex: 304.89',
    hostsWithEnvTag: 'Hosts with "env" tag (%)',
    hostsWithEnvTagHelp: 'Ex: 97.59',
    percentageLogsCorrelated: '% Logs Correlated with APM',
    percentageLogsCorrelatedHelp: 'Ex: 75.77',
    ingestedLogsProcessedByPipeline: 'Ingested logs processed (%)',
    ingestedLogsProcessedByPipelineHelp: 'Ex: 99.77',
    logsExcludedByExclusion: 'Logs excluded by exclusion (%)',
    logsExcludedByExclusionHelp: 'Ex: 32.24',
    rumAsyncRequestEvents: 'RUM async request events (%)',
    rumAsyncRequestEventsHelp: 'Ex: 2.25 (deixe 0 se não usar RUM)',
    rumSessionsWithUserID: "RUM sessions with User ID's (%)",
    rumSessionsWithUserIDHelp: 'Ex: 46.13 (deixe 0 se não usar RUM)',
    // Monitor Quality fields
    healthyMonitors: 'Healthy monitors (total)',
    healthyMonitorsHelp: 'Ex: 467, 1463, 38190',
    monitorsToImprove: 'Monitors to improve (total)',
    monitorsToImproveHelp: 'Ex: 201, 641, 13556',
    monitorsWithHighAlerts: 'High volume of alerts',
    monitorsWithHighAlertsHelp: 'Ex: 5, 45, 211',
    monitorsMissingRecipients: 'Missing recipients',
    monitorsMissingRecipientsHelp: 'Ex: 45, 356, 699',
    monitorsMissingDelay: 'Missing delay',
    monitorsMissingDelayHelp: 'Ex: 18, 107, 11760',
    monitorsMuted60Days: 'Muted >60 days',
    monitorsMuted60DaysHelp: 'Ex: 21, 114, 241',
    monitorsMisconfiguredChannels: 'Misconfigured channels',
    monitorsMisconfiguredChannelsHelp: 'Ex: 44, 54, 1078',
    monitorsInAlertOver7Days: 'In alert >7 days',
    monitorsInAlertOver7DaysHelp: 'Ex: 88, 97, 313',
    // Platform Utilization fields
    timeSpentDays: 'Time spent in platform (days)',
    timeSpentDaysHelp: 'Ex: 86, 999, 31',
    totalActiveUsers: 'Total active users',
    totalActiveUsersHelp: 'Ex: 124, 711, 317',
    avgUsagePerUser: 'AVG usage per user (hours)',
    avgUsagePerUserHelp: 'Ex: 17, 34, 2',
  } : {
    title: 'Manual Metrics from PDFs',
    subtitle: 'The 3 PDFs below contain data in image format. Open each PDF and fill in the numbers. MRR is parsed automatically.',
    section1: '🏥 Health Check Lite',
    section2: '📋 Monitor Quality',
    section3: '👥 Platform Utilization',
    fillAll: 'Fill in values from the PDFs (leave blank if no data)',
    // Health Check fields
    infraHostsAvg: 'Infra Hosts (AVG)',
    infraHostsAvgHelp: 'Ex: 73, 975, 26100',
    apmHostsAvg: 'APM Hosts (AVG)',
    apmHostsAvgHelp: 'Ex: 161, 592, 9130',
    agentImplementationRate: 'Agent Instrumentation Ratio (%)',
    agentImplementationRateHelp: 'Ex: 304.89',
    hostsWithEnvTag: 'Hosts with "env" tag (%)',
    hostsWithEnvTagHelp: 'Ex: 97.59',
    percentageLogsCorrelated: '% Logs Correlated with APM',
    percentageLogsCorrelatedHelp: 'Ex: 75.77',
    ingestedLogsProcessedByPipeline: 'Ingested logs processed (%)',
    ingestedLogsProcessedByPipelineHelp: 'Ex: 99.77',
    logsExcludedByExclusion: 'Logs excluded by exclusion (%)',
    logsExcludedByExclusionHelp: 'Ex: 32.24',
    rumAsyncRequestEvents: 'RUM async request events (%)',
    rumAsyncRequestEventsHelp: 'Ex: 2.25 (leave 0 if no RUM)',
    rumSessionsWithUserID: "RUM sessions with User ID's (%)",
    rumSessionsWithUserIDHelp: 'Ex: 46.13 (leave 0 if no RUM)',
    // Monitor Quality fields
    healthyMonitors: 'Healthy monitors (total)',
    healthyMonitorsHelp: 'Ex: 467, 1463, 38190',
    monitorsToImprove: 'Monitors to improve (total)',
    monitorsToImproveHelp: 'Ex: 201, 641, 13556',
    monitorsWithHighAlerts: 'High volume of alerts',
    monitorsWithHighAlertsHelp: 'Ex: 5, 45, 211',
    monitorsMissingRecipients: 'Missing recipients',
    monitorsMissingRecipientsHelp: 'Ex: 45, 356, 699',
    monitorsMissingDelay: 'Missing delay',
    monitorsMissingDelayHelp: 'Ex: 18, 107, 11760',
    monitorsMuted60Days: 'Muted >60 days',
    monitorsMuted60DaysHelp: 'Ex: 21, 114, 241',
    monitorsMisconfiguredChannels: 'Misconfigured channels',
    monitorsMisconfiguredChannelsHelp: 'Ex: 44, 54, 1078',
    monitorsInAlertOver7Days: 'In alert >7 days',
    monitorsInAlertOver7DaysHelp: 'Ex: 88, 97, 313',
    // Platform Utilization fields
    timeSpentDays: 'Time spent in platform (days)',
    timeSpentDaysHelp: 'Ex: 86, 999, 31',
    totalActiveUsers: 'Total active users',
    totalActiveUsersHelp: 'Ex: 124, 711, 317',
    avgUsagePerUser: 'AVG usage per user (hours)',
    avgUsagePerUserHelp: 'Ex: 17, 34, 2',
  };
  
  const sectionStyle = {
    marginBottom: '1.5rem',
    padding: '1.5rem',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px'
  };
  
  const sectionTitleStyle = {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #f3f4f6'
  };
  
  // Helper: check which PDFs are present for the info banner
  const pdfsPresent = {
    healthCheck: !!uploadedFiles?.healthCheck,
    monitorQuality: !!uploadedFiles?.monitorQuality,
    platformUtilization: !!uploadedFiles?.platformUtilization
  };
  const missingPdfs = [];
  if (!pdfsPresent.healthCheck) missingPdfs.push('Health Check');
  if (!pdfsPresent.monitorQuality) missingPdfs.push('Monitor Quality');
  if (!pdfsPresent.platformUtilization) missingPdfs.push('Platform Utilization');
  
  // Helper: renders the 3-state parse banner (parsing / success / error).
  // Used for each of the 3 auto-parseable PDFs (Health Check, Monitor Quality, Platform Utilization).
  // Returns null if no PDF uploaded yet for that type.
  const renderParseBanner = (status, fileUploaded, totalFields, sectionLabel) => {
    if (!status || !fileUploaded) return null;
    
    if (status.parsing) {
      return (
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.8125rem',
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⏳</span>
          <span>{language === 'pt' ? `Tentando extrair métricas automaticamente do ${sectionLabel}...` : `Attempting to extract ${sectionLabel} metrics automatically...`}</span>
        </div>
      );
    }
    
    if (status.success) {
      return (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #6ee7b7',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.8125rem',
          color: '#065f46',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>✨</span>
          <div>
            <strong>
              {language === 'pt'
                ? `Extração automática: ${status.extractedCount}/${totalFields} campos preenchidos`
                : `Auto-extracted: ${status.extractedCount}/${totalFields} fields filled`}
            </strong>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#047857' }}>
              {language === 'pt'
                ? 'Os valores foram lidos diretamente do PDF. Confira abaixo e ajuste se necessário.'
                : 'Values were read directly from the PDF. Review below and adjust if needed.'}
            </div>
          </div>
        </div>
      );
    }
    
    if (status.error) {
      return (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.8125rem',
          color: '#92400e',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>ℹ️</span>
          <div>
            <strong>
              {language === 'pt' ? 'Extração automática não disponível' : 'Auto-extraction not available'}
            </strong>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {language === 'pt'
                ? 'Este PDF parece ter sido exportado como imagem. Use o botão 👁️ PDF ao lado de cada campo para localizar os valores manualmente.'
                : 'This PDF appears to be image-based. Use the 👁️ PDF button next to each field to locate values manually.'}
              <br/>
              <span style={{ color: '#78350f', fontStyle: 'italic' }}>
                {language === 'pt'
                  ? 'Dica: exportar o PDF via Print → Save as PDF (Chrome/Safari) permite extração automática.'
                  : 'Tip: exporting the PDF via Print → Save as PDF (Chrome/Safari) enables auto-extraction.'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div style={{
      background: '#f9fafb',
      padding: '2rem',
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#1f2937' }}>
        {t.title}
      </h2>
      <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
        {t.subtitle}
      </p>
      
      {/* PDF Preview guidance banner */}
      <div style={{
        background: missingPdfs.length === 0 ? '#eff6ff' : '#fef3c7',
        border: `1px solid ${missingPdfs.length === 0 ? '#bfdbfe' : '#fbbf24'}`,
        borderRadius: '8px',
        padding: '0.875rem 1rem',
        marginBottom: '1.5rem',
        fontSize: '0.8125rem',
        color: missingPdfs.length === 0 ? '#1e40af' : '#92400e',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem'
      }}>
        <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>
          {missingPdfs.length === 0 ? '💡' : '⚠️'}
        </span>
        <div>
          {missingPdfs.length === 0 ? (
            <>
              <strong>{language === 'pt' ? 'Dica:' : 'Tip:'}</strong>{' '}
              {language === 'pt' 
                ? 'Clique no botão 👁️ PDF ao lado de cada campo para abrir o PDF na região exata onde o valor está.'
                : 'Click the 👁️ PDF button next to each field to open the PDF at the exact region where the value is shown.'}
            </>
          ) : (
            <>
              <strong>{language === 'pt' ? 'Atenção:' : 'Notice:'}</strong>{' '}
              {language === 'pt'
                ? `Faça upload dos PDFs (${missingPdfs.join(', ')}) para habilitar o botão 👁️ que mostra onde cada valor está.`
                : `Upload the PDFs (${missingPdfs.join(', ')}) to enable the 👁️ button that shows where each value is located.`}
            </>
          )}
        </div>
      </div>
      
      {/* Section 1: Health Check Lite */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>{t.section1}</h3>
        
        {renderParseBanner(healthCheckParseStatus, pdfsPresent.healthCheck, 9, 'Health Check')}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <ManualFieldInput field="infraHostsAvg" label={t.infraHostsAvg} help={t.infraHostsAvgHelp} value={manualData.infraHostsAvg} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.healthCheck} />
          <ManualFieldInput field="apmHostsAvg" label={t.apmHostsAvg} help={t.apmHostsAvgHelp} value={manualData.apmHostsAvg} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.healthCheck} />
          <ManualFieldInput field="agentImplementationRate" label={t.agentImplementationRate} help={t.agentImplementationRateHelp} value={manualData.agentImplementationRate} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.healthCheck} />
          <ManualFieldInput field="hostsWithEnvTag" label={t.hostsWithEnvTag} help={t.hostsWithEnvTagHelp} value={manualData.hostsWithEnvTag} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.healthCheck} />
          <ManualFieldInput field="percentageLogsCorrelated" label={t.percentageLogsCorrelated} help={t.percentageLogsCorrelatedHelp} value={manualData.percentageLogsCorrelated} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.healthCheck} />
          <ManualFieldInput field="ingestedLogsProcessedByPipeline" label={t.ingestedLogsProcessedByPipeline} help={t.ingestedLogsProcessedByPipelineHelp} value={manualData.ingestedLogsProcessedByPipeline} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.healthCheck} />
          <ManualFieldInput field="logsExcludedByExclusion" label={t.logsExcludedByExclusion} help={t.logsExcludedByExclusionHelp} value={manualData.logsExcludedByExclusion} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.healthCheck} />
          <ManualFieldInput field="rumAsyncRequestEvents" label={t.rumAsyncRequestEvents} help={t.rumAsyncRequestEventsHelp} value={manualData.rumAsyncRequestEvents} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.healthCheck} />
          <ManualFieldInput field="rumSessionsWithUserID" label={t.rumSessionsWithUserID} help={t.rumSessionsWithUserIDHelp} value={manualData.rumSessionsWithUserID} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.healthCheck} />
        </div>
      </div>
      
      {/* Section 2: Monitor Quality */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>{t.section2}</h3>
        
        {renderParseBanner(monitorQualityParseStatus, pdfsPresent.monitorQuality, 8, 'Monitor Quality')}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <ManualFieldInput field="healthyMonitors" label={t.healthyMonitors} help={t.healthyMonitorsHelp} value={manualData.healthyMonitors} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.monitorQuality} />
          <ManualFieldInput field="monitorsToImprove" label={t.monitorsToImprove} help={t.monitorsToImproveHelp} value={manualData.monitorsToImprove} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.monitorQuality} />
          <ManualFieldInput field="monitorsWithHighAlerts" label={t.monitorsWithHighAlerts} help={t.monitorsWithHighAlertsHelp} value={manualData.monitorsWithHighAlerts} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.monitorQuality} />
          <ManualFieldInput field="monitorsMissingRecipients" label={t.monitorsMissingRecipients} help={t.monitorsMissingRecipientsHelp} value={manualData.monitorsMissingRecipients} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.monitorQuality} />
          <ManualFieldInput field="monitorsMissingDelay" label={t.monitorsMissingDelay} help={t.monitorsMissingDelayHelp} value={manualData.monitorsMissingDelay} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.monitorQuality} />
          <ManualFieldInput field="monitorsMuted60Days" label={t.monitorsMuted60Days} help={t.monitorsMuted60DaysHelp} value={manualData.monitorsMuted60Days} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.monitorQuality} />
          <ManualFieldInput field="monitorsMisconfiguredChannels" label={t.monitorsMisconfiguredChannels} help={t.monitorsMisconfiguredChannelsHelp} value={manualData.monitorsMisconfiguredChannels} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.monitorQuality} />
          <ManualFieldInput field="monitorsInAlertOver7Days" label={t.monitorsInAlertOver7Days} help={t.monitorsInAlertOver7DaysHelp} value={manualData.monitorsInAlertOver7Days} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.monitorQuality} />
        </div>
      </div>
      
      {/* Section 3: Platform Utilization */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>{t.section3}</h3>
        
        {renderParseBanner(platformUtilizationParseStatus, pdfsPresent.platformUtilization, 3, 'Platform Utilization')}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <ManualFieldInput field="timeSpentDays" label={t.timeSpentDays} help={t.timeSpentDaysHelp} value={manualData.timeSpentDays} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.platformUtilization} />
          <ManualFieldInput field="totalActiveUsers" label={t.totalActiveUsers} help={t.totalActiveUsersHelp} value={manualData.totalActiveUsers} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.platformUtilization} />
          <ManualFieldInput field="avgUsagePerUser" label={t.avgUsagePerUser} help={t.avgUsagePerUserHelp} value={manualData.avgUsagePerUser} onChange={handleFieldChange} onShowInPDF={handleShowInPDF} hasPdfSource={pdfsPresent.platformUtilization} />
        </div>
      </div>
      
      {/* PDF Preview Modal */}
      {pdfPreview && !pdfPreview.missingFile && (
        <PDFPreviewModal
          open={true}
          file={pdfPreview.file}
          page={pdfPreview.page}
          yPercent={pdfPreview.yPercent}
          fieldLabel={t[pdfPreview.field] || pdfPreview.field}
          locator={pdfPreview.locator}
          onClose={() => setPdfPreview(null)}
          language={language}
        />
      )}
    </div>
  );
});

// Multi-File Upload Zone Component
const MultiFileUploadZone = memo(({ uploadedFiles, onFilesSelect, onDrop, onDragOver, onDragLeave, isDragging, language }) => {
  const fileTypes = {
    healthCheck: language === 'pt' ? 'Health Check Lite' : 'Health Check Lite',
    historicalMRR: language === 'pt' ? 'Historical MRR' : 'Historical MRR',
    monitorQuality: language === 'pt' ? 'Monitor Quality' : 'Monitor Quality',
    platformUtilization: language === 'pt' ? 'Platform Utilization' : 'Platform Utilization'
  };
  
  const allFilesPresent = uploadedFiles.healthCheck && 
                          uploadedFiles.historicalMRR && 
                          uploadedFiles.monitorQuality &&
                          uploadedFiles.platformUtilization;
  
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        border: `3px dashed ${isDragging ? '#632CA6' : allFilesPresent ? '#19b372' : '#d1d5db'}`,
        borderRadius: '12px',
        padding: '3rem',
        textAlign: 'center',
        background: isDragging ? '#f3f4f6' : allFilesPresent ? '#f0fdf4' : '#f9fafb',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={() => document.getElementById('multi-file-input').click()}
    >
      <input
        id="multi-file-input"
        type="file"
        accept=".pdf"
        multiple
        onChange={onFilesSelect}
        style={{ display: 'none' }}
      />
      
      <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>
        {allFilesPresent ? '✓' : '•'}
      </div>
      
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
        {allFilesPresent 
          ? (language === 'pt' ? 'Todos os arquivos carregados' : 'All files uploaded')
          : (language === 'pt' ? 'Arraste os 4 arquivos PDF aqui' : 'Drag 4 PDF files here')}
      </h3>
      
      <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
        {allFilesPresent
          ? (language === 'pt' ? 'Clique para substituir' : 'Click to replace')
          : (language === 'pt' ? 'ou clique para selecionar os arquivos' : 'or click to select files')}
      </p>
      
      {/* File Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', width: '100%', maxWidth: '800px' }}>
        {Object.entries(fileTypes).map(([key, label]) => (
          <div key={key} style={{
            background: uploadedFiles[key] ? '#d1fae5' : '#fff',
            border: `1px solid ${uploadedFiles[key] ? '#10b981' : '#e5e7eb'}`,
            borderRadius: '6px',
            padding: '0.75rem',
            fontSize: '0.875rem'
          }}>
            <div style={{ 
              fontWeight: '600', 
              color: uploadedFiles[key] ? '#059669' : '#9ca3af',
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              {uploadedFiles[key] ? '✓' : '○'} {label}
            </div>
            {uploadedFiles[key] && (
              <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
                {(uploadedFiles[key].size / 1024).toFixed(0)} KB
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

// File Upload Zone Component
const FileUploadZone = memo(({ label, fileType, file, onDrop, onDragOver, onDragLeave, onFileSelect, isDragging, language }) => {
  const t = TRANSLATIONS[language];
  
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        marginBottom: '0.5rem',
        color: '#374151'
      }}>
        {label}
      </label>
      <div
        onDrop={(e) => onDrop(e, fileType)}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          border: `2px dashed ${isDragging ? '#667eea' : file ? '#10b981' : '#d1d5db'}`,
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center',
          background: isDragging ? '#eff6ff' : file ? '#f0fdf4' : '#f9fafb',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
        onClick={() => document.getElementById(`file-input-${fileType}`).click()}
      >
        <input
          id={`file-input-${fileType}`}
          type="file"
          accept=".pdf"
          onChange={(e) => onFileSelect(e, fileType)}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {file ? '✓' : '•'}
        </div>
        {file ? (
          <>
            <div style={{ fontWeight: '600', color: '#059669', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              {file.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {(file.size / 1024).toFixed(1)} KB
            </div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: '600', color: '#4b5563', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              {language === 'pt' ? 'Arraste o PDF aqui' : 'Drag PDF here'}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {language === 'pt' ? 'ou clique para selecionar' : 'or click to select'}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

// Gauge Chart Component
const GaugeChart = ({ score, maxScore, color }) => {
  const percentage = (score / maxScore) * 100;
  const angle = (percentage / 100) * 180; // 0 to 180 degrees
  
  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: '60%' }}>
      <svg viewBox="0 0 200 120" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {/* Background arc */}
        <path
          d="M 30 100 A 70 70 0 0 1 170 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d="M 30 100 A 70 70 0 0 1 170 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${(percentage / 100) * 220} 220`}
        />
        {/* Center text */}
        <text x="100" y="90" textAnchor="middle" fontSize="32" fontWeight="700" fill={color}>
          {score.toFixed(1)}
        </text>
        <text x="100" y="110" textAnchor="middle" fontSize="12" fill="#6b7280">
          / {maxScore}
        </text>
      </svg>
    </div>
  );
};

// Helper functions for chart data
function getPriorityData(recommendations, lang) {
  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };
  
  recommendations.forEach(rec => {
    const priority = (rec.priority || '').toLowerCase();
    if (priority.includes('crít') || priority.includes('crit')) counts.critical++;
    else if (priority.includes('alta') || priority.includes('high')) counts.high++;
    else if (priority.includes('méd') || priority.includes('med')) counts.medium++;
    else counts.low++;
  });
  
  return [
    { 
      name: lang === 'pt' ? 'Crítica' : 'Critical', 
      value: counts.critical, 
      color: '#dc2626' 
    },
    { 
      name: lang === 'pt' ? 'Alta' : 'High', 
      value: counts.high, 
      color: '#f59e0b' 
    },
    { 
      name: lang === 'pt' ? 'Média' : 'Medium', 
      value: counts.medium, 
      color: '#3b82f6' 
    },
    { 
      name: lang === 'pt' ? 'Baixa' : 'Low', 
      value: counts.low, 
      color: '#10b981' 
    }
  ].filter(item => item.value > 0);
}

function getStrengthsVsGapsData(dimensions, lang) {
  const dimensionNames = {
    adoption: lang === 'pt' ? 'Adoção' : 'Adoption',
    governance: lang === 'pt' ? 'Governança' : 'Governance',
    quality: lang === 'pt' ? 'Qualidade' : 'Quality',
    alerting: lang === 'pt' ? 'Alertas' : 'Alerting',
    cost: lang === 'pt' ? 'Custo' : 'Cost'
  };
  
  return Object.entries(dimensions).map(([key, dim]) => ({
    name: dimensionNames[key],
    strengths: dim.signals ? dim.signals.length : 0,
    gaps: dim.issues ? dim.issues.length : 0
  }));
}

function getRadarData(dimensions, lang) {
  const dimensionNames = {
    adoption: lang === 'pt' ? 'Adoção' : 'Adoption',
    governance: lang === 'pt' ? 'Governança' : 'Governance',
    quality: lang === 'pt' ? 'Qualidade' : 'Quality',
    alerting: lang === 'pt' ? 'Alertas' : 'Alerting',
    cost: lang === 'pt' ? 'Custo' : 'Cost'
  };
  
  return Object.entries(dimensions).map(([key, dim]) => ({
    dimension: dimensionNames[key],
    score: dim.score,
    fullMark: 5
  }));
}

function getBarChartData(dimensions, lang) {
  const dimensionNames = {
    adoption: lang === 'pt' ? 'Adoção' : 'Adoption',
    governance: lang === 'pt' ? 'Governança' : 'Governance',
    quality: lang === 'pt' ? 'Qualidade' : 'Quality',
    alerting: lang === 'pt' ? 'Alertas' : 'Alerting',
    cost: lang === 'pt' ? 'Custo' : 'Cost'
  };
  
  return Object.entries(dimensions).map(([key, dim]) => ({
    name: dimensionNames[key],
    level: dim.level,
    score: dim.score
  }));
}

// Data from PDFs
const PDF_DATA = {
  healthCheck: {
    infraHostsAvg: 570.5,
    apmHostsAvg: 932,
    agentImplementationRate: 165.63,
    hostsWithEnvTag: 67.87,
    percentageLogsCorrelated: 41.25,
    ingestedLogsProcessedByPipeline: 99.35,
    logsExcludedByExclusion: 61.59,
    rumAsyncRequestEvents: 2.25,
    rumSessionsWithUserID: 46.13,
    customMetricsCardinality: 'High',
    monitorsWithHighAlerts: 45,
    monitorsMissingRecipients: 356,
    monitorsMissingDelay: 107,
    monitorsMuted60Days: 114,
    monitorsMisconfiguredChannels: 54,
    totalMonitors: 2104
  },
  historicalMRR: {
    products: {
      apm_host_pro: true,
      apm_trace_search: true,
      infra_host: true,
      logs_indexed_7day: true,
      logs_ingested: true,
      custom_event: true,
      rum_lite: true,
      rum_replay: true,
      synthetics_api_tests: true,
      synthetics_browser_checks: true,
      dbm_host: true,
      network_device: true,
      ci_pipeline: true,
      incident_management: true,
      application_security_host: true,
      data_stream_monitoring: true,
      data_jobs_monitoring: true,
      llm_observability: true
    },
    productCount: 18,
    avgMonthlySpend: 376946.66
  },
  monitorQuality: {
    healthyMonitors: 1463,
    monitorsToImprove: 641,
    qualityScore: 69.5
  },
  platformUtilization: {
    timeSpentDays: 999,
    totalActiveUsers: 711,
    concurrentActiveSessionsHours: 34,
    avgUsagePerUser: 16620, // From chart
    customDashboardsRatio: 0.63, // 173.6k / (173.6k + 103.8k)
    topDashboardsTimeSpent: {
      kubernetes: 18.57,
      logsOverview: 16.79,
      apmLandingPage: 14.74
    },
    mostInteractedProducts: [
      'dashboard:viewed:910',
      'security:viewed:2028k',
      'logs',
      'apm:viewed',
      'apm:home',
      'synthetics'
    ],
    newApmUsers: 34,
    activeUsersByTime: 'distributed', // From chart showing global distribution
    ootbIntegrations: 'multiple' // Various integrations visible
  }
};

// Scoring Engine
function assessMaturity(data, lang, customerName = null) {
  // 1. Platform Adoption
  const adoption = assessPlatformAdoption(data, lang);
  
  // 2. Operational Governance
  const governance = assessOperationalGovernance(data, lang);
  
  // 3. Telemetry Quality
  const quality = assessTelemetryQuality(data, lang);
  
  // 4. Alerting Reliability
  const alerting = assessAlertingReliability(data, lang);
  
  // 5. Cost and Usage Governance
  const cost = assessCostGovernance(data, lang);
  
  // Calculate base maturity
  const dimensions = { adoption, governance, quality, alerting, cost };
  const scores = [adoption.score, governance.score, quality.score, alerting.score, cost.score];
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Apply gating rules - now also adjusts rawScore
  const { finalLevel, qualifier, gatings, adjustedRawScore } = applyGatingRules(avgScore, dimensions, data, lang);
  
  // Use adjusted score if available (from rebalanced gating), else fall back to avg
  const finalRawScore = adjustedRawScore !== undefined ? adjustedRawScore : avgScore;
  
  // Generate insights
  const insights = generateInsights(dimensions, data, lang);
  
  // Generate recommendations
  const recommendations = generateRecommendations(dimensions, data, insights, lang);
  
  // v35: Escalate priority for recommendations impacting critical dimensions (≤1)
  const escalatedRecommendations = escalateRecommendations(recommendations, dimensions, lang);
  
  // v30: Classify into Quick Wins (≤30d) and Strategic (>30d), with hard limits
  // v35: Pass dimensions for dynamic limit expansion when there's a critical dimension
  const classifiedRecommendations = classifyRecommendations(escalatedRecommendations, lang, dimensions);
  
  // Generate maturity rationale
  const rationale = generateMaturityRationale(finalRawScore, finalLevel, dimensions, gatings, lang);
  
  // v32: Generate executive summary (Principal CSM tone, 3 paragraphs)
  const executiveSummary = generateExecutiveSummary(data, dimensions, finalLevel, finalRawScore, customerName, lang);
  
  // Generate roadmap to next level
  const roadmap = generateRoadmapToNextLevel(finalLevel, dimensions, data, lang);
  
  // Generate training recommendations
  const trainings = generateTrainingRecommendations(dimensions, lang);
  
  return {
    finalLevel,
    qualifier,
    gatings,
    dimensions,
    insights,
    recommendations: escalatedRecommendations, // v35: escalated by dimension severity
    classifiedRecommendations, // NEW v30: { quickWins, strategic, strategicLimit, quickWinsLimit }
    rationale,
    executiveSummary, // NEW v32: { paragraphs[], profile }
    roadmap,
    trainings,
    rawScore: finalRawScore
  };
}

function generateMaturityRationale(rawScore, finalLevel, dimensions, gatings, lang) {
  const increased = [];
  const prevented = [];
  
  // What increased the score
  if (dimensions.adoption.score >= 3) {
    increased.push(lang === 'pt'
      ? 'Adoção ampla de plataforma com boa cobertura de produtos'
      : 'Broad platform adoption with good product coverage');
  }
  
  if (dimensions.quality.score >= 3) {
    increased.push(lang === 'pt'
      ? 'Base sólida de qualidade de telemetria'
      : 'Solid telemetry quality foundation');
  }
  
  if (dimensions.alerting.score >= 3) {
    increased.push(lang === 'pt'
      ? 'Confiabilidade básica de alertas estabelecida'
      : 'Basic alerting reliability established');
  }
  
  // What prevented higher score
  if (dimensions.governance.score < 3) {
    prevented.push(lang === 'pt'
      ? 'Lacunas de governança operacional limitam maturidade'
      : 'Operational governance gaps limit maturity');
  }
  
  if (dimensions.quality.score < 3.5) {
    prevented.push(lang === 'pt'
      ? 'Correlação de telemetria incompleta impede troubleshooting mais eficaz'
      : 'Incomplete telemetry correlation prevents more effective troubleshooting');
  }
  
  if (dimensions.alerting.score < 3) {
    prevented.push(lang === 'pt'
      ? 'Confiabilidade de alertas com gaps críticos'
      : 'Alerting reliability with critical gaps');
  }
  
  // Applied caps
  const appliedCaps = gatings.length > 0 ? gatings : [];
  
  // Build summary
  let summary = '';
  if (lang === 'pt') {
    summary = `Maturidade final avaliada em Nível ${finalLevel} devido a ${increased.join(' e ')}.`;
    if (prevented.length > 0) {
      summary += ` Score limitado por: ${prevented.join(', ')}.`;
    }
  } else {
    summary = `Final maturity rated at Level ${finalLevel} due to ${increased.join(' and ')}.`;
    if (prevented.length > 0) {
      summary += ` Score limited by: ${prevented.join(', ')}.`;
    }
  }
  
  return {
    summary,
    increased,
    prevented,
    appliedCaps
  };
}

/**
 * v32: Generate an Executive Summary (Principal CSM tone)
 * 3-4 paragraphs, customized per customer:
 *   1. Positioning: where the customer stands (level + profile based on σ + dim mix)
 *   2. Scale + investment context with main gaps
 *   3. Path forward (direct/cirurgical/structural based on profile)
 * 
 * Uses real data only — no invented numbers.
 * Adapts tone to maturity level (rescue / evolution / excellence).
 */
function generateExecutiveSummary(data, dimensions, finalLevel, rawScore, customerName, lang) {
  const isPt = lang === 'pt';
  
  // Helper: format number with locale
  const fmtNum = (n) => {
    if (typeof n !== 'number' || isNaN(n)) return '—';
    return n.toLocaleString(isPt ? 'pt-BR' : 'en-US');
  };
  
  // Helper: format currency
  const fmtCurrency = (n) => {
    if (typeof n !== 'number' || isNaN(n)) return '—';
    return '$' + n.toLocaleString(isPt ? 'pt-BR' : 'en-US', { maximumFractionDigits: 0 });
  };
  
  // === Calculate profile signals ===
  const dimScores = [
    dimensions.adoption.score,
    dimensions.governance.score,
    dimensions.quality.score,
    dimensions.alerting.score,
    dimensions.cost.score
  ];
  const validScores = dimScores.filter(s => typeof s === 'number' && !isNaN(s));
  const avgScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : rawScore;
  const variance = validScores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / validScores.length;
  const stdev = Math.sqrt(variance);
  const isUnbalanced = stdev >= 1.2;
  const isBalanced = stdev < 0.6;
  
  // Identify strongest and weakest dimensions
  const dimLabels = isPt
    ? { adoption: 'adoção', governance: 'governança', quality: 'qualidade de telemetria', alerting: 'confiabilidade de alertas', cost: 'governança de custo' }
    : { adoption: 'adoption', governance: 'governance', quality: 'telemetry quality', alerting: 'alerting reliability', cost: 'cost governance' };
  
  const dimEntries = [
    { key: 'adoption', score: dimensions.adoption.score, label: dimLabels.adoption },
    { key: 'governance', score: dimensions.governance.score, label: dimLabels.governance },
    { key: 'quality', score: dimensions.quality.score, label: dimLabels.quality },
    { key: 'alerting', score: dimensions.alerting.score, label: dimLabels.alerting },
    { key: 'cost', score: dimensions.cost.score, label: dimLabels.cost }
  ].filter(d => typeof d.score === 'number' && !isNaN(d.score));
  
  const sortedDims = [...dimEntries].sort((a, b) => b.score - a.score);
  const topDim = sortedDims[0];
  const bottomDim = sortedDims[sortedDims.length - 1];
  
  // === Profile classification ===
  let profileDescription;
  if (isUnbalanced) {
    if (topDim && bottomDim && (topDim.score - bottomDim.score) >= 2.5) {
      profileDescription = isPt
        ? `cliente de perfil contrastante: forte ${topDim.label} (${topDim.score.toFixed(1)}) ofuscada por ${bottomDim.label} crítica (${bottomDim.score.toFixed(1)})`
        : `customer with contrasting profile: strong ${topDim.label} (${topDim.score.toFixed(1)}) overshadowed by critical ${bottomDim.label} (${bottomDim.score.toFixed(1)})`;
    } else {
      profileDescription = isPt
        ? `cliente desbalanceado, com forças e fraquezas díspares entre dimensões`
        : `unbalanced customer with disparate strengths and weaknesses across dimensions`;
    }
  } else if (isBalanced) {
    if (avgScore >= 3.5) {
      profileDescription = isPt
        ? `cliente equilibrado de maturidade avançada, consistente em todas as dimensões`
        : `balanced advanced-maturity customer, consistent across all dimensions`;
    } else if (avgScore >= 2.5) {
      profileDescription = isPt
        ? `cliente equilibrado em jornada estruturada de evolução`
        : `balanced customer in structured evolution journey`;
    } else {
      profileDescription = isPt
        ? `cliente em estágio inicial, com desenvolvimento uniforme em todas as dimensões`
        : `early-stage customer with uniform development across all dimensions`;
    }
  } else {
    // Moderate
    if (dimensions.adoption.score >= 3.5 && dimensions.governance.score < 3) {
      profileDescription = isPt
        ? `cliente de adoção ampla mas governança em transição`
        : `broad-adoption customer in governance transition`;
    } else if (dimensions.adoption.score < 2.5) {
      profileDescription = isPt
        ? `cliente em fase de expansão de uso da plataforma`
        : `customer in platform usage expansion phase`;
    } else {
      profileDescription = isPt
        ? `cliente em evolução constante de maturidade`
        : `customer in steady maturity evolution`;
    }
  }
  
  // === Scale context ===
  const totalHosts = (data.healthCheck.infraHostsAvg || 0);
  const apmHosts = (data.healthCheck.apmHostsAvg || 0);
  const productCount = (data.historicalMRR?.productCount || 0);
  const monthlySpend = (data.historicalMRR?.avgMonthlySpend || 0);
  const totalMonitors = (data.healthCheck.totalMonitors || 0);
  
  // Scale qualifier
  let scaleQualifier;
  if (totalHosts > 10000) {
    scaleQualifier = isPt ? 'enterprise' : 'enterprise-scale';
  } else if (totalHosts > 2000) {
    scaleQualifier = isPt ? 'mid-market' : 'mid-market';
  } else if (totalHosts > 500) {
    scaleQualifier = isPt ? 'crescimento' : 'growth';
  } else {
    scaleQualifier = isPt ? 'inicial' : 'early-stage';
  }
  
  // === Identify top 1-2 specific gaps from real data ===
  const realGaps = [];
  
  if (data.healthCheck.percentageLogsCorrelated !== undefined && data.healthCheck.percentageLogsCorrelated < 60) {
    realGaps.push(isPt
      ? `correlação de telemetria (${data.healthCheck.percentageLogsCorrelated.toFixed(0)}% logs-APM)`
      : `telemetry correlation (${data.healthCheck.percentageLogsCorrelated.toFixed(0)}% logs-APM)`);
  }
  
  if (data.healthCheck.monitorsMissingRecipients !== undefined && data.healthCheck.monitorsMissingRecipients > 100) {
    realGaps.push(isPt
      ? `${fmtNum(data.healthCheck.monitorsMissingRecipients)} monitores sem destinatário`
      : `${fmtNum(data.healthCheck.monitorsMissingRecipients)} monitors without recipient`);
  }
  
  if (data.healthCheck.monitorsMissingDelay !== undefined && data.healthCheck.monitorsMissingDelay > 1000) {
    realGaps.push(isPt
      ? `${fmtNum(data.healthCheck.monitorsMissingDelay)} monitores sem delay configurado`
      : `${fmtNum(data.healthCheck.monitorsMissingDelay)} monitors without configured delay`);
  }
  
  if (data.healthCheck.hostsWithEnvTag !== undefined && data.healthCheck.hostsWithEnvTag < 70) {
    realGaps.push(isPt
      ? `tagging precário (${data.healthCheck.hostsWithEnvTag.toFixed(0)}% hosts com env tag)`
      : `weak tagging (${data.healthCheck.hostsWithEnvTag.toFixed(0)}% hosts with env tag)`);
  }
  
  if (data.healthCheck.rumSessionsWithUserID !== undefined && data.healthCheck.rumSessionsWithUserID < 30) {
    realGaps.push(isPt
      ? `RUM sem identificação de usuário (${data.healthCheck.rumSessionsWithUserID.toFixed(0)}%)`
      : `RUM without user identification (${data.healthCheck.rumSessionsWithUserID.toFixed(0)}%)`);
  }
  
  // Top 2 gaps for the summary
  const topGaps = realGaps.slice(0, 2);
  
  // === Determine path forward tone ===
  let pathTone;
  if (finalLevel === 0 || finalLevel === 1) {
    pathTone = isPt ? 'rescue' : 'rescue';
  } else if (finalLevel === 2 || finalLevel === 3) {
    pathTone = isPt ? 'evolution' : 'evolution';
  } else {
    pathTone = isPt ? 'excellence' : 'excellence';
  }
  
  // === Build the 3 paragraphs ===
  const customer = customerName || (isPt ? 'O cliente' : 'The customer');
  
  // Maturity level name (in target language)
  const levelName = MATURITY_LEVELS[finalLevel]?.label?.[lang] || `Level ${finalLevel}`;
  
  // Paragraph 1: Positioning
  let p1;
  if (isPt) {
    p1 = `${customer} opera hoje em ${levelName} com score ${rawScore.toFixed(2)}, posicionando-se como ${profileDescription}.`;
  } else {
    p1 = `${customer} currently operates at ${levelName} with a score of ${rawScore.toFixed(2)}, positioning itself as a ${profileDescription}.`;
  }
  
  // Paragraph 2: Scale + investment + gaps
  const scaleParts = [];
  if (totalHosts > 0) {
    scaleParts.push(isPt ? `${fmtNum(totalHosts)} hosts` : `${fmtNum(totalHosts)} hosts`);
  }
  if (productCount > 0) {
    scaleParts.push(isPt ? `${productCount} produtos Datadog` : `${productCount} Datadog products`);
  }
  
  let p2 = '';
  if (scaleParts.length > 0) {
    if (isPt) {
      p2 = `Com ${scaleParts.join(' e ')} ativos`;
      if (monthlySpend > 0) {
        p2 += ` e investimento atual de ${fmtCurrency(monthlySpend)}/mês`;
      }
      p2 += `, a base técnica é ${scaleQualifier === 'enterprise' ? 'robusta' : scaleQualifier === 'mid-market' ? 'consolidada' : 'em formação'}`;
    } else {
      p2 = `With ${scaleParts.join(' and ')} active`;
      if (monthlySpend > 0) {
        p2 += ` and current investment of ${fmtCurrency(monthlySpend)}/month`;
      }
      p2 += `, the technical foundation is ${scaleQualifier === 'enterprise-scale' ? 'robust' : scaleQualifier === 'mid-market' ? 'consolidated' : 'forming'}`;
    }
    
    // Add the gaps
    if (topGaps.length > 0) {
      if (isPt) {
        p2 += ` — entretanto, gaps específicos em ${topGaps.join(' e ')} limitam o aproveitamento pleno do investimento atual.`;
      } else {
        p2 += ` — however, specific gaps in ${topGaps.join(' and ')} limit full value capture from the current investment.`;
      }
    } else {
      p2 += isPt ? '.' : '.';
    }
  }
  
  // Paragraph 3: Path forward (varies by maturity level)
  let p3 = '';
  const nextLevel = Math.min(finalLevel + 1, 5);
  const nextLevelName = MATURITY_LEVELS[nextLevel]?.label?.[lang] || `Level ${nextLevel}`;
  
  if (pathTone === 'rescue') {
    if (isPt) {
      p3 = `Recuperação para ${nextLevelName} exige resgate operacional cirúrgico nos próximos 60 dias. ${isUnbalanced ? 'O perfil contrastante indica que ' + (bottomDim ? bottomDim.label : 'as fraquezas') + ' precisa ser endereçada antes de qualquer expansão de capability.' : 'A higiene operacional vem antes de evolução estrutural.'}`;
    } else {
      p3 = `Recovery to ${nextLevelName} requires surgical operational rescue in the next 60 days. ${isUnbalanced ? 'The contrasting profile indicates ' + (bottomDim ? bottomDim.label : 'the weaknesses') + ' must be addressed before any capability expansion.' : 'Operational hygiene comes before structural evolution.'}`;
    }
  } else if (pathTone === 'evolution') {
    if (isPt) {
      const directness = isUnbalanced ? 'cirúrgico' : 'direto';
      p3 = `O caminho para ${nextLevelName} é ${directness}: estabilizar fundamentos operacionais nos próximos 60 dias antes de avançar para correlação completa. Esses gaps são governança, não capacidade da plataforma — endereçáveis sem reestruturação.`;
    } else {
      const directness = isUnbalanced ? 'surgical' : 'direct';
      p3 = `The path to ${nextLevelName} is ${directness}: stabilize operational fundamentals in the next 60 days before pushing for complete correlation. These gaps are governance issues, not platform capability issues — addressable without restructuring.`;
    }
  } else {
    // Excellence
    if (isPt) {
      p3 = `O cliente tem maturidade técnica para liderar adoção de features avançadas. Próxima fronteira: capabilities preditivas via Watchdog/anomaly detection e SLO baseado em RUM. Foco da próxima conversa: expansão de uso, não correção de gaps.`;
    } else {
      p3 = `The customer has the technical maturity to lead advanced feature adoption. Next frontier: predictive capabilities via Watchdog/anomaly detection and RUM-based SLOs. Next conversation focus: usage expansion, not gap remediation.`;
    }
  }
  
  return {
    paragraphs: [p1, p2, p3].filter(p => p && p.length > 0),
    profile: {
      isUnbalanced,
      isBalanced,
      stdev,
      topDim,
      bottomDim,
      scale: scaleQualifier,
      pathTone
    }
  };
}

function generateRoadmapToNextLevel(currentLevel, dimensions, data, lang) {
  const isPt = lang === 'pt';
  const nextLevel = Math.min(currentLevel + 1, 5);
  const blockers = [];
  const milestones = [];
  
  // ==========================================================================
  // v37: Calculate σ and profile signals to determine roadmap strategy
  // ==========================================================================
  const dimScores = {
    adoption: dimensions.adoption.score,
    governance: dimensions.governance.score,
    quality: dimensions.quality.score,
    alerting: dimensions.alerting.score,
    cost: dimensions.cost.score
  };
  const validScores = Object.values(dimScores).filter(s => typeof s === 'number' && !isNaN(s));
  const avgScore = validScores.length > 0 
    ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
    : 2;
  const variance = validScores.length > 0
    ? validScores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / validScores.length
    : 0;
  const stdev = Math.sqrt(variance);
  
  // Sort dims by score
  const sortedDims = Object.entries(dimScores)
    .filter(([, s]) => typeof s === 'number' && !isNaN(s))
    .sort((a, b) => a[1] - b[1]);
  const weakest = sortedDims[0]; // [key, score]
  const strongest = sortedDims[sortedDims.length - 1];
  const delta = strongest[1] - weakest[0];
  
  // Strong dimensions: don't recommend strengthening these
  const strongDims = new Set(sortedDims.filter(([, s]) => s >= 3.5).map(([k]) => k));
  // Critical dimensions: prioritize roadmap on these
  const criticalDims = new Set(sortedDims.filter(([, s]) => s < 1.5).map(([k]) => k));
  
  // Dimension labels for headers and messages
  const dimLabels = {
    adoption: isPt ? 'Adoção' : 'Adoption',
    governance: isPt ? 'Governança Operacional' : 'Operational Governance',
    quality: isPt ? 'Qualidade de Telemetria' : 'Telemetry Quality',
    alerting: isPt ? 'Confiabilidade de Alertas' : 'Alerting Reliability',
    cost: isPt ? 'Governança de Custo' : 'Cost Governance'
  };
  
  // ==========================================================================
  // v37: Determine strategic approach based on σ + delta
  // ==========================================================================
  let strategyType, strategyMessage;
  if (stdev >= 1.2 && delta >= 2.5) {
    // SURGICAL: contrasting customer with critical weakness in 1-2 dims
    strategyType = 'surgical';
    if (isPt) {
      strategyMessage = `Esta é uma jornada **cirúrgica**. O perfil contrastante (forte em ${dimLabels[strongest[0]]} ${strongest[1].toFixed(1)}, crítico em ${dimLabels[weakest[0]]} ${weakest[1].toFixed(1)}) exige foco quase total em ${dimLabels[weakest[0]]} antes de qualquer expansão. Não desperdice ciclos onde já há excelência — preserve a força e endereçe a fragilidade.`;
    } else {
      strategyMessage = `This is a **surgical** journey. The contrasting profile (strong in ${dimLabels[strongest[0]]} ${strongest[1].toFixed(1)}, critical in ${dimLabels[weakest[0]]} ${weakest[1].toFixed(1)}) demands near-total focus on ${dimLabels[weakest[0]]} before any expansion. Don't waste cycles where excellence already exists — preserve the strength and address the fragility.`;
    }
  } else if (stdev >= 0.6) {
    // CALIBRATION: moderate spread, work the weak points without losing pace
    strategyType = 'calibration';
    if (isPt) {
      strategyMessage = `Esta é uma jornada de **calibração**. O cliente tem perfil misto — fraquezas identificáveis em ${dimLabels[weakest[0]]} (${weakest[1].toFixed(1)}) sem ser uma crise sistêmica. Priorize os pontos fracos preservando o ritmo geral de evolução.`;
    } else {
      strategyMessage = `This is a **calibration** journey. The customer has a mixed profile — identifiable weaknesses in ${dimLabels[weakest[0]]} (${weakest[1].toFixed(1)}) without being a systemic crisis. Prioritize the weak points while preserving overall evolution pace.`;
    }
  } else {
    // ELEVATION: balanced customer, lift the whole average
    strategyType = 'elevation';
    if (isPt) {
      strategyMessage = `Esta é uma jornada de **elevação geral**. O cliente apresenta perfil equilibrado (todas as dimensões em score próximo, σ=${stdev.toFixed(2)}). A evolução deve ocorrer em paralelo, sem fixação cirúrgica em uma única dimensão — o objetivo é elevar a média do conjunto.`;
    } else {
      strategyMessage = `This is a **general elevation** journey. The customer shows a balanced profile (all dimensions at similar scores, σ=${stdev.toFixed(2)}). Evolution should happen in parallel, without surgical fixation on a single dimension — the goal is to raise the overall average.`;
    }
  }
  
  // ==========================================================================
  // Identify blockers (filtered by what actually applies)
  // ==========================================================================
  if (dimensions.governance.score < 3.5) {
    blockers.push(isPt
      ? 'Governança operacional inconsistente'
      : 'Inconsistent operational governance');
  }
  if (dimensions.alerting.score < 3.5) {
    blockers.push(isPt
      ? 'Confiabilidade de alertas insuficiente'
      : 'Insufficient alerting reliability');
  }
  if (dimensions.quality.score < 3.5) {
    blockers.push(isPt
      ? 'Correlação de telemetria ainda limitada'
      : 'Telemetry correlation still limited');
  }
  if (data.healthCheck.rumSessionsWithUserID < 80) {
    blockers.push(isPt
      ? 'Rastreamento de usuário incompleto'
      : 'Incomplete user tracking');
  }
  
  // ==========================================================================
  // v37: Phase definitions (each phase has applicabilityCheck)
  // Each phase tagged with `dimensionFocus` for reordering logic
  // ==========================================================================
  const allPhases = [];
  
  // PHASE: Stabilize operational foundation (alerting/governance)
  if (dimensions.alerting.score < 3.5 || dimensions.governance.score < 3.5) {
    const actions = [];
    // Filter: only push actions that actually apply
    if (data.healthCheck.monitorsMissingRecipients > 50) {
      actions.push(isPt
        ? 'Configurar recipients nos monitores críticos'
        : 'Configure recipients on critical monitors');
    }
    if (data.healthCheck.monitorsMuted60Days > 100) {
      actions.push(isPt
        ? 'Revisar monitores silenciados há mais de 60 dias'
        : 'Review monitors muted for 60+ days');
    }
    if (data.healthCheck.monitorsMissingDelay > 1000) {
      actions.push(isPt
        ? 'Reduzir alert fatigue e ajustar recommended delay'
        : 'Reduce alert fatigue and adjust recommended delay');
    }
    if (dimensions.governance.score < 3) {
      actions.push(isPt
        ? 'Estabelecer ownership claro por monitor/domínio'
        : 'Establish clear ownership per monitor/domain');
    }
    
    if (actions.length > 0) {
      allPhases.push({
        dimensionFocus: 'alerting+governance',
        title: isPt 
          ? 'Estabilizar fundação operacional'
          : 'Stabilize operational foundation',
        actions,
        outcome: isPt
          ? 'Base de alertas mais confiável e governável'
          : 'More reliable and governable alert base',
        why: isPt
          ? 'Sem higiene operacional, não existe maturidade preditiva sustentável'
          : 'Without operational hygiene, sustainable predictive maturity cannot exist'
      });
    }
  }
  
  // PHASE: Improve correlation quality (quality dimension)
  if (dimensions.quality.score < 3.5) {
    const actions = [];
    if (data.healthCheck.percentageLogsCorrelated < 70) {
      actions.push(isPt
        ? 'Aumentar correlação logs-APM para 70%+'
        : 'Increase logs-APM correlation to 70%+');
    }
    if (data.healthCheck.hostsWithEnvTag < 95) {
      actions.push(isPt
        ? 'Implementar unified tagging em escala'
        : 'Implement unified tagging at scale');
    }
    if (data.healthCheck.rumSessionsWithUserID < 80) {
      actions.push(isPt
        ? 'Melhorar cobertura de user tracking em RUM'
        : 'Improve RUM user tracking coverage');
    }
    
    if (actions.length > 0) {
      allPhases.push({
        dimensionFocus: 'quality',
        title: isPt
          ? 'Melhorar qualidade de correlação'
          : 'Improve correlation quality',
        actions,
        outcome: isPt
          ? 'RCA mais rápida e melhor visibilidade de impacto real'
          : 'Faster RCA and better real impact visibility',
        why: isPt
          ? 'Sem dados correlacionáveis, troubleshooting depende de inferência manual'
          : 'Without correlatable data, troubleshooting depends on manual inference'
      });
    }
  }
  
  // PHASE: Expand adoption (adoption dimension) — only if low
  if (dimensions.adoption.score < 3.0 && !strongDims.has('adoption')) {
    const actions = [];
    actions.push(isPt
      ? 'Aumentar engajamento de usuários ativos na plataforma'
      : 'Increase active user engagement on the platform');
    actions.push(isPt
      ? 'Capacitar times com Datadog Fundamentals + APM Deep Dive'
      : 'Train teams with Datadog Fundamentals + APM Deep Dive');
    if (dimensions.adoption.score < 2.0) {
      actions.push(isPt
        ? 'Estabelecer champions internos para evangelização da plataforma'
        : 'Establish internal champions for platform evangelism');
    }
    
    allPhases.push({
      dimensionFocus: 'adoption',
      title: isPt
        ? 'Expandir adoção da plataforma'
        : 'Expand platform adoption',
      actions,
      outcome: isPt
        ? 'Maior cobertura de uso e diversidade de perfis usando a plataforma'
        : 'Greater usage coverage and diversity of personas using the platform',
      why: isPt
        ? 'Adoção rasa limita o ROI do investimento em observabilidade'
        : 'Shallow adoption limits ROI of observability investment'
    });
  }
  
  // PHASE: Cost governance (cost dimension) — only if low
  if (dimensions.cost.score < 3.0 && !strongDims.has('cost')) {
    const actions = [];
    if (data.healthCheck.logsExcludedByExclusion < 65) {
      actions.push(isPt
        ? 'Implementar exclusion filters para reduzir volume de logs'
        : 'Implement exclusion filters to reduce log volume');
    }
    actions.push(isPt
      ? 'Configurar usage attribution para visibilidade de custo por equipe'
      : 'Configure usage attribution for per-team cost visibility');
    actions.push(isPt
      ? 'Definir budgets e alertas de consumo por produto'
      : 'Define budgets and consumption alerts per product');
    
    allPhases.push({
      dimensionFocus: 'cost',
      title: isPt
        ? 'Estabelecer governança de custo'
        : 'Establish cost governance',
      actions,
      outcome: isPt
        ? 'Custos previsíveis e atribuíveis por unidade de negócio'
        : 'Predictable and attributable costs per business unit',
      why: isPt
        ? 'Sem visibilidade de custo, otimização vira reativa em vez de planejada'
        : 'Without cost visibility, optimization becomes reactive instead of planned'
    });
  }
  
  // PHASE: Predictive capability (only if nextLevel >= 4 AND no critical dims)
  if (nextLevel >= 4 && criticalDims.size === 0) {
    allPhases.push({
      dimensionFocus: 'predictive',
      title: isPt
        ? 'Construir capacidade preditiva'
        : 'Build predictive capability',
      actions: [
        isPt
          ? 'Consolidar sinais de tendência e anomalia nas jornadas críticas'
          : 'Consolidate trend and anomaly signals in critical journeys',
        isPt
          ? 'Priorizar monitores e dashboards para antecipação de falhas'
          : 'Prioritize monitors and dashboards for failure anticipation',
        isPt
          ? 'Expandir uso de Watchdog e anomaly detection onde houver evidência de valor'
          : 'Expand use of Watchdog and anomaly detection where value is evident'
      ],
      outcome: isPt
        ? 'Operação menos reativa e maior capacidade de prevenção'
        : 'Less reactive operation and greater prevention capability',
      why: isPt
        ? 'Isso aproxima de fato do nível 4 do framework'
        : 'This actually moves toward framework Level 4'
    });
  }
  
  // ==========================================================================
  // v37: Reorder phases to put critical dimensions FIRST
  // ==========================================================================
  const phaseOrder = (phase) => {
    // If phase focus is on a CRITICAL dim (≤1.5), priority 0 (top)
    if (phase.dimensionFocus === 'quality' && criticalDims.has('quality')) return 0;
    if (phase.dimensionFocus === 'cost' && criticalDims.has('cost')) return 0;
    if (phase.dimensionFocus === 'adoption' && criticalDims.has('adoption')) return 0;
    if (phase.dimensionFocus === 'alerting+governance' && (criticalDims.has('alerting') || criticalDims.has('governance'))) return 0;
    
    // If phase focus is on the WEAKEST dim, priority 1
    if (phase.dimensionFocus === weakest[0]) return 1;
    if (phase.dimensionFocus === 'alerting+governance' && (weakest[0] === 'alerting' || weakest[0] === 'governance')) return 1;
    
    // Default order: alerting/governance first, then quality, then cost/adoption, then predictive
    const defaultOrder = {
      'alerting+governance': 2,
      'quality': 3,
      'cost': 4,
      'adoption': 5,
      'predictive': 6
    };
    return defaultOrder[phase.dimensionFocus] || 7;
  };
  
  const orderedPhases = [...allPhases].sort((a, b) => phaseOrder(a) - phaseOrder(b));
  
  // Re-number sequentially
  const phases = orderedPhases.map((phase, idx) => ({
    number: idx + 1,
    title: phase.title,
    actions: phase.actions,
    outcome: phase.outcome,
    why: phase.why
  }));
  
  // ==========================================================================
  // Generate milestones (unchanged)
  // ==========================================================================
  const recipientRate = ((data.healthCheck.totalMonitors - data.healthCheck.monitorsMissingRecipients) / data.healthCheck.totalMonitors) * 100;
  if (recipientRate < 95) {
    milestones.push({
      metric: isPt ? 'Cobertura de recipients' : 'Recipient coverage',
      current: `${recipientRate.toFixed(1)}%`,
      target: '95%+',
      critical: recipientRate < 85
    });
  }
  
  const mutedRate = (data.healthCheck.monitorsMuted60Days / data.healthCheck.totalMonitors) * 100;
  if (mutedRate > 3) {
    milestones.push({
      metric: isPt ? 'Monitores silenciados 60+ dias' : 'Monitors muted 60+ days',
      current: `${data.healthCheck.monitorsMuted60Days} (${mutedRate.toFixed(1)}%)`,
      target: isPt ? '<3% do total' : '<3% of total',
      critical: mutedRate > 5
    });
  }
  
  if (data.monitorQuality.qualityScore < 80) {
    milestones.push({
      metric: isPt ? 'Monitor health score' : 'Monitor health score',
      current: `${data.monitorQuality.qualityScore.toFixed(1)}%`,
      target: '80%+',
      critical: data.monitorQuality.qualityScore < 70
    });
  }
  
  if (data.healthCheck.percentageLogsCorrelated < 70) {
    milestones.push({
      metric: isPt ? 'Correlação logs-APM' : 'Logs-APM correlation',
      current: `${data.healthCheck.percentageLogsCorrelated.toFixed(1)}%`,
      target: '70%+',
      critical: data.healthCheck.percentageLogsCorrelated < 50
    });
  }
  
  if (data.healthCheck.hostsWithEnvTag < 95) {
    milestones.push({
      metric: isPt ? 'Unified tagging (env tag)' : 'Unified tagging (env tag)',
      current: `${data.healthCheck.hostsWithEnvTag.toFixed(1)}%`,
      target: '95%+',
      critical: data.healthCheck.hostsWithEnvTag < 70
    });
  }
  
  if (data.healthCheck.rumSessionsWithUserID < 80) {
    milestones.push({
      metric: isPt ? 'RUM user tracking' : 'RUM user tracking',
      current: `${data.healthCheck.rumSessionsWithUserID.toFixed(1)}%`,
      target: '80%+',
      critical: data.healthCheck.rumSessionsWithUserID < 50
    });
  }
  
  return {
    currentLevel,
    nextLevel,
    blockers,
    phases,
    milestones,
    // v37: NEW — strategy guidance
    strategy: {
      type: strategyType, // 'surgical' | 'calibration' | 'elevation'
      message: strategyMessage,
      stdev: stdev,
      weakest: { key: weakest[0], score: weakest[0], label: dimLabels[weakest[0]] },
      strongest: { key: strongest[0], score: strongest[1], label: dimLabels[strongest[0]] }
    }
  };
}

function assessPlatformAdoption(data, lang) {
  // Rebalanced v5 (V3-Suave 2026-04-27): reduces "size bonus" bias and adds
  // soft penalties for low-engagement signals.
  // 
  // Key changes from v4:
  //   - productCount weight: 1.5 → 1.0 (was 30% of total, now 20%)
  //   - infra/apm scale bonuses: 0.5 → 0.35 (less reward for raw size)
  //   - Advanced features bonuses: 0.5 → 0.35 (having ≠ using well)
  //   - NEW penalty: users < 50 (-0.25)
  //   - NEW penalty: tsd < 50 days (-0.25)
  //   - NEW penalty: customDashboards < 30% (-0.25)
  //
  // Rationale: previous version inflated scores for enterprise customers with
  // many products and large fleets, regardless of how they USED Datadog.
  // V3 pulls the average down ~0.4-0.7 points and improves discrimination
  // between "big customer" and "mature customer".
  let score = 0.5;
  const signals = [];
  const issues = [];
  
  // Helper: linear interpolation between thresholds
  const linearScore = (value, minVal, maxVal, maxPoints) => {
    if (value <= minVal) return 0;
    if (value >= maxVal) return maxPoints;
    return ((value - minVal) / (maxVal - minVal)) * maxPoints;
  };
  
  // Product breadth - linear scoring (V3: max reduced from 1.5 to 1.0)
  const productCount = data.historicalMRR.productCount;
  const pcScore = linearScore(productCount, 5, 25, 1.0);
  score += pcScore;
  if (productCount >= 20) {
    signals.push(lang === 'pt' 
      ? `Amplo portfolio Datadog (${productCount} produtos) +${pcScore.toFixed(2)}`
      : `Broad Datadog portfolio (${productCount} products) +${pcScore.toFixed(2)}`);
  } else if (productCount >= 10) {
    signals.push(lang === 'pt'
      ? `Portfolio moderado (${productCount} produtos) +${pcScore.toFixed(2)}`
      : `Moderate portfolio (${productCount} products) +${pcScore.toFixed(2)}`);
  } else if (productCount < 8) {
    issues.push(lang === 'pt'
      ? `Portfolio limitado (${productCount} produtos)`
      : `Limited portfolio (${productCount} products)`);
  }
  
  // Platform engagement - QUALITY over quantity
  if (data.platformUtilization) {
    const users = data.platformUtilization.totalActiveUsers || 0;
    const avgHr = data.platformUtilization.avgUsagePerUser || 0;
    const cd = data.platformUtilization.customDashboardsRatio || 0;
    const tsd = data.platformUtilization.timeSpentDays || 0;
    
    // Users - linear 50 to 800 (V3: NEW penalty for users < 50)
    const userScore = linearScore(users, 50, 800, 0.75);
    score += userScore;
    if (userScore > 0.4) {
      signals.push(lang === 'pt'
        ? `Base de usuários ativa (${users}) +${userScore.toFixed(2)}`
        : `Active user base (${users}) +${userScore.toFixed(2)}`);
    } else if (users > 0 && users < 50) {
      score -= 0.25;
      issues.push(lang === 'pt'
        ? `Poucos usuários ativos (${users}) -0.25`
        : `Few active users (${users}) -0.25`);
    }
    
    // Hours per user - CRITICAL for real adoption
    if (avgHr >= 20) {
      score += 0.75;
      signals.push(lang === 'pt'
        ? `Uso profundo (${avgHr}h/usuário) +0.75`
        : `Deep usage (${avgHr}h/user) +0.75`);
    } else if (avgHr >= 10) {
      score += 0.25;
      signals.push(lang === 'pt'
        ? `Uso moderado (${avgHr}h/usuário) +0.25`
        : `Moderate usage (${avgHr}h/user) +0.25`);
    } else if (avgHr < 5 && avgHr > 0) {
      score -= 0.25;
      issues.push(lang === 'pt'
        ? `Uso superficial (apenas ${avgHr}h/usuário) -0.25`
        : `Shallow usage (only ${avgHr}h/user) -0.25`);
    }
    
    // Custom dashboards (V3: NEW penalty for cd < 30%)
    if (cd >= 0.7) {
      score += 0.5;
      signals.push(lang === 'pt'
        ? `Forte customização (${(cd*100).toFixed(0)}% dashboards custom) +0.5`
        : `Strong customization (${(cd*100).toFixed(0)}% custom dashboards) +0.5`);
    } else if (cd >= 0.5) {
      score += 0.25;
    } else if (cd > 0 && cd < 0.3) {
      score -= 0.25;
      issues.push(lang === 'pt'
        ? `Baixa customização (${(cd*100).toFixed(0)}% dashboards custom) -0.25`
        : `Low customization (${(cd*100).toFixed(0)}% custom dashboards) -0.25`);
    }
    
    // Time on platform (V3: NEW penalty for tsd < 50)
    if (tsd > 500) {
      score += 0.5;
      signals.push(lang === 'pt'
        ? `Alta dependência operacional (${tsd} dias) +0.5`
        : `High operational reliance (${tsd} days) +0.5`);
    } else if (tsd > 200) {
      score += 0.25;
    } else if (tsd > 0 && tsd < 50) {
      score -= 0.25;
      issues.push(lang === 'pt'
        ? `Uso esporádico da plataforma (${tsd} dias) -0.25`
        : `Sporadic platform usage (${tsd} days) -0.25`);
    }
  }
  
  // Infrastructure scale (V3: top tier reduced from 0.5 to 0.35)
  const infra = data.healthCheck.infraHostsAvg;
  if (infra > 5000) {
    score += 0.35;
    signals.push(lang === 'pt'
      ? `Escala enterprise (${infra.toFixed(0)} hosts) +0.35`
      : `Enterprise scale (${infra.toFixed(0)} hosts) +0.35`);
  } else if (infra > 500) {
    score += 0.20;
  }
  
  // APM coverage (V3: top tier reduced from 0.5 to 0.35)
  const apm = data.healthCheck.apmHostsAvg;
  if (apm > 2000) {
    score += 0.35;
    signals.push(lang === 'pt'
      ? `APM em larga escala (${apm.toFixed(0)} hosts) +0.35`
      : `APM at scale (${apm.toFixed(0)} hosts) +0.35`);
  } else if (apm > 300) {
    score += 0.20;
  }
  
  // Advanced features (V3: bonuses reduced from 0.5 to 0.35 — having ≠ using)
  const products = data.historicalMRR.products || {};
  if (products.llm_observability && products.application_security_host) {
    score += 0.35;
    signals.push(lang === 'pt'
      ? 'Features modernas (LLM + AppSec) +0.35'
      : 'Modern features (LLM + AppSec) +0.35');
  }
  
  if (products.rum_replay && products.synthetics_browser_checks && products.synthetics_mobile) {
    score += 0.35;
    signals.push(lang === 'pt'
      ? 'Monitoramento digital completo +0.35'
      : 'Complete digital monitoring +0.35');
  } else if (products.rum_replay || products.synthetics_browser_checks) {
    score += 0.15;
  }
  
  const finalScore = Math.max(0, Math.min(score, 5));
  return {
    score: finalScore,
    signals,
    issues,
    level: Math.max(0, Math.min(Math.round(finalScore), 5)),
    rationale: lang === 'pt'
      ? `Adoption v5 (V3-Suave): baseline 0.5 + produtos (${productCount}) + qualidade de uso + escala balanceada + features (com penalidades suaves para baixo engajamento)`
      : `Adoption v5 (V3-Soft): baseline 0.5 + products (${productCount}) + quality usage + balanced scale + features (with soft penalties for low engagement)`
  };
}

function assessOperationalGovernance(data, lang) {
  // Rebalanced v4: baseline 2.0 (was 2.5), percentage-based penalties,
  // new misconfigured channels check, new missing_delay penalty.
  let score = 2.0;
  const signals = [];
  const issues = [];
  
  const total = data.healthCheck.totalMonitors;
  const missingRecip = data.healthCheck.monitorsMissingRecipients || 0;
  const muted = data.healthCheck.monitorsMuted60Days || 0;
  const highAlerts = data.healthCheck.monitorsWithHighAlerts || 0;
  const missingDelay = data.healthCheck.monitorsMissingDelay || 0;
  const misconfigured = data.healthCheck.monitorsMisconfiguredChannels || 0;
  
  // Recipient coverage - tiered % based
  const rcov = total ? ((total - missingRecip) / total) * 100 : 0;
  if (rcov >= 98) {
    score += 1.0;
    signals.push(lang === 'pt'
      ? `Cobertura excelente de destinatários (${rcov.toFixed(1)}%) +1.0`
      : `Excellent recipient coverage (${rcov.toFixed(1)}%) +1.0`);
  } else if (rcov >= 95) {
    score += 0.6;
    signals.push(lang === 'pt'
      ? `Cobertura muito boa (${rcov.toFixed(1)}%) +0.6`
      : `Very good coverage (${rcov.toFixed(1)}%) +0.6`);
  } else if (rcov >= 90) {
    score += 0.2;
  } else if (rcov >= 85) {
    // neutral
  } else if (rcov >= 75) {
    score -= 0.4;
    issues.push(lang === 'pt'
      ? `Gap de cobertura (${rcov.toFixed(1)}% - ${missingRecip} sem destinatário) -0.4`
      : `Coverage gap (${rcov.toFixed(1)}% - ${missingRecip} missing recipients) -0.4`);
  } else {
    score -= 0.8;
    issues.push(lang === 'pt'
      ? `Gap crítico (${rcov.toFixed(1)}% - ${missingRecip} alertas órfãos) -0.8`
      : `Critical gap (${rcov.toFixed(1)}% - ${missingRecip} orphan alerts) -0.8`);
  }
  
  // Misconfigured channels - % based (key fix for ECSM case)
  const miscRate = total ? (misconfigured / total) * 100 : 0;
  if (miscRate > 5) {
    score -= 0.5;
    issues.push(lang === 'pt'
      ? `${misconfigured} canais mal configurados (${miscRate.toFixed(1)}%) - alertas podem não chegar -0.5`
      : `${misconfigured} misconfigured channels (${miscRate.toFixed(1)}%) - alerts may not be delivered -0.5`);
  } else if (miscRate > 3) {
    score -= 0.25;
    issues.push(lang === 'pt'
      ? `${misconfigured} canais mal configurados -0.25`
      : `${misconfigured} misconfigured channels -0.25`);
  } else if (miscRate > 1) {
    score -= 0.1;
  } else if (miscRate <= 0.5 && total >= 50) {
    score += 0.2;
    signals.push(lang === 'pt' ? 'Canais bem configurados +0.2' : 'Channels well configured +0.2');
  }
  
  // Muted monitors - % based
  const mutedRate = total ? (muted / total) * 100 : 0;
  if (mutedRate > 10) {
    score -= 0.4;
    issues.push(lang === 'pt'
      ? `${muted} monitores silenciados (${mutedRate.toFixed(1)}%) - drift de configuração -0.4`
      : `${muted} muted monitors (${mutedRate.toFixed(1)}%) - configuration drift -0.4`);
  } else if (mutedRate > 5) {
    score -= 0.15;
  } else if (mutedRate < 2 && muted > 0) {
    score += 0.3;
    signals.push(lang === 'pt'
      ? `Higiene mantida (${mutedRate.toFixed(1)}% silenciados) +0.3`
      : `Hygiene maintained (${mutedRate.toFixed(1)}% muted) +0.3`);
  }
  
  // Missing delays - % based (NEW penalty)
  const delayRate = total ? (missingDelay / total) * 100 : 0;
  if (delayRate > 20) {
    score -= 0.4;
    issues.push(lang === 'pt'
      ? `${missingDelay} monitores sem delay (${delayRate.toFixed(1)}%) - falsos positivos prováveis -0.4`
      : `${missingDelay} monitors missing delay (${delayRate.toFixed(1)}%) - false positives likely -0.4`);
  } else if (delayRate > 10) {
    score -= 0.15;
  }
  
  // Tag governance
  const tag = data.healthCheck.hostsWithEnvTag || 0;
  if (tag >= 95) {
    score += 0.75;
    signals.push(lang === 'pt'
      ? `Tags excelentes (${tag.toFixed(1)}% com env tag) +0.75`
      : `Excellent tags (${tag.toFixed(1)}% with env tag) +0.75`);
  } else if (tag >= 85) {
    score += 0.4;
    signals.push(lang === 'pt'
      ? `Boa governança de tags (${tag.toFixed(1)}%) +0.4`
      : `Good tag governance (${tag.toFixed(1)}%) +0.4`);
  } else if (tag >= 70) {
    score += 0.1;
  } else if (tag < 50) {
    score -= 0.4;
    issues.push(lang === 'pt'
      ? `Tags mal implementadas (${tag.toFixed(1)}% com env) -0.4`
      : `Poor tag implementation (${tag.toFixed(1)}% with env) -0.4`);
  } else {
    score -= 0.2;
  }
  
  // Monitor quality score
  const q = data.monitorQuality.qualityScore || 0;
  if (q > 85) {
    score += 0.5;
    signals.push(lang === 'pt'
      ? `Alta qualidade de monitores (${q.toFixed(1)}%) +0.5`
      : `High monitor quality (${q.toFixed(1)}%) +0.5`);
  } else if (q > 75) {
    score += 0.25;
  } else if (q < 60) {
    score -= 0.15;
  }
  
  // High alerts - % based
  const haRate = total ? (highAlerts / total) * 100 : 0;
  if (haRate > 2) {
    score -= 0.3;
    issues.push(lang === 'pt'
      ? `${highAlerts} monitores alto volume (${haRate.toFixed(1)}%) -0.3`
      : `${highAlerts} monitors with high alert volume (${haRate.toFixed(1)}%) -0.3`);
  } else if (haRate > 1) {
    score -= 0.1;
  } else if (haRate < 0.3 && total >= 50) {
    score += 0.15;
  }
  
  // Platform governance (dashboards + users)
  if (data.platformUtilization) {
    const cd = data.platformUtilization.customDashboardsRatio || 0;
    const users = data.platformUtilization.totalActiveUsers || 0;
    if (cd >= 0.6 && users >= 300) {
      score += 0.25;
      signals.push(lang === 'pt'
        ? 'Ownership distribuído (dashboards + users) +0.25'
        : 'Distributed ownership (dashboards + users) +0.25');
    }
    
    // Agent fleet hygiene (NEW v27 - bonus field)
    // Datadog target is ≤4 distinct agent versions in fleet.
    // More versions = harder to maintain, troubleshoot, and standardize.
    const versions = data.platformUtilization.agentVersionsCount;
    if (versions !== undefined && versions !== null && !isNaN(versions)) {
      if (versions <= 4) {
        score += 0.25;
        signals.push(lang === 'pt'
          ? `Frota de agents padronizada (${versions} versões) +0.25`
          : `Standardized agent fleet (${versions} versions) +0.25`);
      } else if (versions > 8) {
        score -= 0.25;
        issues.push(lang === 'pt'
          ? `Frota desorganizada (${versions} versões de agent, target ≤4) -0.25`
          : `Fragmented fleet (${versions} agent versions, target ≤4) -0.25`);
      }
    }
  }
  
  const finalScore = Math.max(0, Math.min(score, 5));
  return {
    score: finalScore,
    signals,
    issues,
    level: Math.max(0, Math.min(Math.round(finalScore), 5)),
    rationale: lang === 'pt'
      ? `Governance rebalanceada: baseline 2.0 + cobertura (${rcov.toFixed(1)}%) + canais config + tags (${tag.toFixed(0)}%) + higiene`
      : `Rebalanced governance: baseline 2.0 + coverage (${rcov.toFixed(1)}%) + channel config + tags (${tag.toFixed(0)}%) + hygiene`
  };
}

function assessTelemetryQuality(data, lang) {
  // Rebalanced v4: baseline 1.5 (was 2.0), strong penalty for <30% log correlation,
  // RUM metrics only evaluated if customer has RUM.
  let score = 1.5;
  const signals = [];
  const issues = [];
  
  // Log correlation with APM - CRITICAL, tiered with strong penalties
  const lc = data.healthCheck.percentageLogsCorrelated || 0;
  if (lc >= 80) {
    score += 1.5;
    signals.push(lang === 'pt'
      ? `Correlação logs-APM excelente (${lc.toFixed(1)}%) +1.5`
      : `Excellent logs-APM correlation (${lc.toFixed(1)}%) +1.5`);
  } else if (lc >= 70) {
    score += 1.0;
    signals.push(lang === 'pt'
      ? `Correlação logs-APM forte (${lc.toFixed(1)}%) +1.0`
      : `Strong logs-APM correlation (${lc.toFixed(1)}%) +1.0`);
  } else if (lc >= 50) {
    score += 0.5;
    signals.push(lang === 'pt'
      ? `Correlação parcial (${lc.toFixed(1)}%) +0.5`
      : `Partial correlation (${lc.toFixed(1)}%) +0.5`);
  } else if (lc >= 30) {
    score -= 0.25;
    issues.push(lang === 'pt'
      ? `Correlação logs-APM baixa (${lc.toFixed(1)}%) - troubleshooting limitado -0.25`
      : `Low logs-APM correlation (${lc.toFixed(1)}%) - limited troubleshooting -0.25`);
  } else if (lc >= 15) {
    score -= 0.75;
    issues.push(lang === 'pt'
      ? `Correlação muito baixa (${lc.toFixed(1)}%) - troubleshooting comprometido -0.75`
      : `Very low correlation (${lc.toFixed(1)}%) - troubleshooting compromised -0.75`);
  } else {
    score -= 1.25;
    issues.push(lang === 'pt'
      ? `Correlação crítica (${lc.toFixed(1)}%) - impossível correlacionar logs-APM efetivamente -1.25`
      : `Critical correlation (${lc.toFixed(1)}%) - cannot effectively correlate logs-APM -1.25`);
  }
  
  // Log pipeline coverage
  const ilp = data.healthCheck.ingestedLogsProcessedByPipeline || 0;
  if (ilp >= 98) {
    score += 0.75;
    signals.push(lang === 'pt'
      ? `Pipeline de logs excelente (${ilp.toFixed(1)}%) +0.75`
      : `Excellent log pipeline (${ilp.toFixed(1)}%) +0.75`);
  } else if (ilp >= 90) {
    score += 0.4;
  } else if (ilp < 80 && ilp > 0) {
    score -= 0.25;
    issues.push(lang === 'pt'
      ? `Pipeline de logs com gaps (${ilp.toFixed(1)}%) -0.25`
      : `Log pipeline has gaps (${ilp.toFixed(1)}%) -0.25`);
  }
  
  // RUM metrics - ONLY if customer has RUM
  const products = data.historicalMRR.products || {};
  const hasRum = products.rum_lite || products.rum_replay;
  const rui = data.healthCheck.rumSessionsWithUserID || 0;
  const ruaa = data.healthCheck.rumAsyncRequestEvents || 0;
  
  if (hasRum) {
    if (rui >= 80) {
      score += 0.75;
      signals.push(lang === 'pt'
        ? `User tracking forte (${rui.toFixed(1)}%) +0.75`
        : `Strong user tracking (${rui.toFixed(1)}%) +0.75`);
    } else if (rui >= 50) {
      score += 0.25;
      signals.push(lang === 'pt'
        ? `User tracking parcial (${rui.toFixed(1)}%) +0.25`
        : `Partial user tracking (${rui.toFixed(1)}%) +0.25`);
    } else if (rui < 20) {
      score -= 0.25;
      issues.push(lang === 'pt'
        ? `RUM sem User ID (${rui.toFixed(1)}%) - visibilidade de impacto limitada -0.25`
        : `RUM without User ID (${rui.toFixed(1)}%) - limited impact visibility -0.25`);
    }
    
    // RUM async - full-stack correlation
    if (ruaa >= 30) {
      score += 0.5;
      signals.push(lang === 'pt'
        ? `RUM correlacionado com APM (${ruaa.toFixed(1)}%) +0.5`
        : `RUM correlated with APM (${ruaa.toFixed(1)}%) +0.5`);
    } else if (ruaa < 5) {
      issues.push(lang === 'pt'
        ? `RUM desconectado do backend (${ruaa.toFixed(1)}% async com traces)`
        : `RUM disconnected from backend (${ruaa.toFixed(1)}% async with traces)`);
    }
  }
  
  // Trace Search
  if (products.apm_trace_search) {
    score += 0.25;
    signals.push(lang === 'pt'
      ? 'Trace Search habilitado +0.25'
      : 'Trace Search enabled +0.25');
  }
  
  // Env tagging as quality signal
  const tag = data.healthCheck.hostsWithEnvTag || 0;
  if (tag >= 95) {
    score += 0.25;
    signals.push(lang === 'pt'
      ? `Telemetria bem estruturada (env tag ${tag.toFixed(1)}%) +0.25`
      : `Well-structured telemetry (env tag ${tag.toFixed(1)}%) +0.25`);
  }
  
  // K8s tagging quality (NEW v27 - bonus field)
  // Catches the silent gap where hosts are well-tagged but K8s containers aren't.
  // Penalty is suave (-0.25) following V3-Suave style.
  const k8s = data.healthCheck.k8sWithFullTags;
  if (k8s !== undefined && k8s !== null && !isNaN(k8s)) {
    if (k8s >= 70) {
      score += 0.25;
      signals.push(lang === 'pt'
        ? `K8s bem instrumentado (${k8s.toFixed(1)}% tagged) +0.25`
        : `K8s well-instrumented (${k8s.toFixed(1)}% tagged) +0.25`);
    } else if (k8s < 50) {
      score -= 0.25;
      issues.push(lang === 'pt'
        ? `Gap K8s: apenas ${k8s.toFixed(1)}% containers com env+service+version -0.25`
        : `K8s gap: only ${k8s.toFixed(1)}% containers with env+service+version -0.25`);
    }
  }
  
  const finalScore = Math.max(0, Math.min(score, 5));
  return {
    score: finalScore,
    signals,
    issues,
    level: Math.max(0, Math.min(Math.round(finalScore), 5)),
    rationale: lang === 'pt'
      ? `Quality rebalanceada: baseline 1.5 + logs-APM correlation (${lc.toFixed(1)}%) + pipeline + RUM (se aplicável) + tags`
      : `Rebalanced quality: baseline 1.5 + logs-APM correlation (${lc.toFixed(1)}%) + pipeline + RUM (if applicable) + tags`
  };
}

function assessAlertingReliability(data, lang) {
  // Rebalanced v4: baseline 2.0 (was 3.0 - BIGGEST CHANGE),
  // linear healthy rate, % based penalties, synthetics pair, incident mgmt signal.
  let score = 2.0;
  const signals = [];
  const issues = [];
  
  const total = data.healthCheck.totalMonitors;
  const healthy = data.monitorQuality.healthyMonitors || 0;
  const missingRecip = data.healthCheck.monitorsMissingRecipients || 0;
  const missingDelay = data.healthCheck.monitorsMissingDelay || 0;
  const muted = data.healthCheck.monitorsMuted60Days || 0;
  const highAlerts = data.healthCheck.monitorsWithHighAlerts || 0;
  const misconfigured = data.healthCheck.monitorsMisconfiguredChannels || 0;
  
  // Healthy rate - tiered
  const hRate = total ? (healthy / total) * 100 : 0;
  if (hRate >= 80) {
    score += 1.0;
    signals.push(lang === 'pt'
      ? `Monitores saudáveis: ${hRate.toFixed(1)}% +1.0`
      : `Healthy monitors: ${hRate.toFixed(1)}% +1.0`);
  } else if (hRate >= 70) {
    score += 0.6;
    signals.push(lang === 'pt'
      ? `Monitores saudáveis: ${hRate.toFixed(1)}% +0.6`
      : `Healthy monitors: ${hRate.toFixed(1)}% +0.6`);
  } else if (hRate >= 60) {
    score += 0.2;
  } else if (hRate < 50) {
    score -= 0.3;
    issues.push(lang === 'pt'
      ? `Apenas ${hRate.toFixed(1)}% dos monitores saudáveis -0.3`
      : `Only ${hRate.toFixed(1)}% healthy monitors -0.3`);
  }
  
  // Recipient coverage - CRITICAL
  const rcov = total ? ((total - missingRecip) / total) * 100 : 0;
  if (rcov >= 98) {
    score += 0.6;
    signals.push(lang === 'pt'
      ? `Cobertura de destinatários excelente (${rcov.toFixed(1)}%) +0.6`
      : `Excellent recipient coverage (${rcov.toFixed(1)}%) +0.6`);
  } else if (rcov >= 95) {
    score += 0.3;
  } else if (rcov >= 85) {
    score -= 0.5;
    issues.push(lang === 'pt'
      ? `${missingRecip} monitores órfãos -0.5`
      : `${missingRecip} orphan monitors -0.5`);
  } else {
    score -= 1.0;
    issues.push(lang === 'pt'
      ? `RISCO CRÍTICO: ${missingRecip} alertas podem não alcançar equipes (${rcov.toFixed(1)}%) -1.0`
      : `CRITICAL RISK: ${missingRecip} alerts may not reach teams (${rcov.toFixed(1)}%) -1.0`);
  }
  
  // Missing delay - % based
  const delayRate = total ? (missingDelay / total) * 100 : 0;
  if (delayRate > 20) {
    score -= 0.5;
    issues.push(lang === 'pt'
      ? `${missingDelay} monitores sem delay (${delayRate.toFixed(1)}%) - falsos positivos prováveis -0.5`
      : `${missingDelay} monitors without delay (${delayRate.toFixed(1)}%) - false positives likely -0.5`);
  } else if (delayRate > 10) {
    score -= 0.2;
  } else if (delayRate < 1 && total >= 50) {
    score += 0.3;
    signals.push(lang === 'pt' ? 'Delays bem configurados +0.3' : 'Delays well configured +0.3');
  }
  
  // Misconfigured channels - % based
  const miscRate = total ? (misconfigured / total) * 100 : 0;
  if (miscRate > 5) {
    score -= 0.4;
    issues.push(lang === 'pt'
      ? `${misconfigured} canais mal configurados (${miscRate.toFixed(1)}%) -0.4`
      : `${misconfigured} misconfigured channels (${miscRate.toFixed(1)}%) -0.4`);
  } else if (miscRate > 2) {
    score -= 0.2;
  } else if (miscRate <= 0.5 && total >= 50) {
    score += 0.25;
    signals.push(lang === 'pt' ? 'Canais bem configurados +0.25' : 'Channels well configured +0.25');
  }
  
  // High alerts - % based
  const haRate = total ? (highAlerts / total) * 100 : 0;
  if (haRate > 2) {
    score -= 0.3;
    issues.push(lang === 'pt'
      ? `${highAlerts} monitores alto volume (${haRate.toFixed(1)}%) - fadiga -0.3`
      : `${highAlerts} high-volume monitors (${haRate.toFixed(1)}%) - fatigue -0.3`);
  } else if (haRate > 1) {
    score -= 0.15;
  } else if (haRate < 0.3 && total >= 50) {
    score += 0.2;
    signals.push(lang === 'pt' ? 'Poucos monitores ruidosos +0.2' : 'Few noisy monitors +0.2');
  }
  
  // Muted - drift
  const mutedRate = total ? (muted / total) * 100 : 0;
  if (mutedRate > 10) {
    score -= 0.25;
  } else if (mutedRate > 5) {
    score -= 0.1;
  }
  
  // Synthetics for proactive monitoring
  const products = data.historicalMRR.products || {};
  if (products.synthetics_api_tests && products.synthetics_browser_checks) {
    score += 0.5;
    signals.push(lang === 'pt'
      ? 'Monitoramento proativo completo (Synthetics API + Browser) +0.5'
      : 'Complete proactive monitoring (Synthetics API + Browser) +0.5');
  } else if (products.synthetics_api_tests || products.synthetics_browser_checks) {
    score += 0.25;
  }
  
  // Incident management
  if (products.incident_management || products.on_call) {
    score += 0.25;
    signals.push(lang === 'pt'
      ? 'Gestão de incidentes integrada +0.25'
      : 'Integrated incident management +0.25');
  }
  
  const finalScore = Math.max(0, Math.min(score, 5));
  return {
    score: finalScore,
    signals,
    issues,
    level: Math.max(0, Math.min(Math.round(finalScore), 5)),
    rationale: lang === 'pt'
      ? `Alerting rebalanceada: baseline 2.0 (era 3.0) + healthy (${hRate.toFixed(1)}%) + cobertura + delays + canais + features`
      : `Rebalanced alerting: baseline 2.0 (was 3.0) + healthy (${hRate.toFixed(1)}%) + coverage + delays + channels + features`
  };
}

function assessCostGovernance(data, lang) {
  // Rebalanced v4: baseline 1.0 (was 1.5), obs pipelines signal,
  // sensitive_data_scanner, hard cap 3.0 without explicit governance.
  let score = 1.0;
  const signals = [];
  const issues = [];
  
  // Log exclusion optimization - linear
  const le = data.healthCheck.logsExcludedByExclusion || 0;
  if (le >= 80) {
    score += 1.25;
    signals.push(lang === 'pt'
      ? `Otimização agressiva de logs (${le.toFixed(1)}% excluídos) +1.25`
      : `Aggressive log optimization (${le.toFixed(1)}% excluded) +1.25`);
  } else if (le >= 65) {
    score += 0.75;
    signals.push(lang === 'pt'
      ? `Otimização moderada (${le.toFixed(1)}% excluídos) +0.75`
      : `Moderate optimization (${le.toFixed(1)}% excluded) +0.75`);
  } else if (le >= 50) {
    score += 0.25;
  } else if (le < 30) {
    score -= 0.5;
    issues.push(lang === 'pt'
      ? `Baixa otimização de logs (${le.toFixed(1)}% excluídos) - custos elevados prováveis -0.5`
      : `Low log optimization (${le.toFixed(1)}% excluded) - elevated costs likely -0.5`);
  } else {
    issues.push(lang === 'pt'
      ? `Otimização de logs limitada (${le.toFixed(1)}% excluídos)`
      : `Limited log optimization (${le.toFixed(1)}% excluded)`);
  }
  
  // Data quality monitoring (DSM + DJM)
  const products = data.historicalMRR.products || {};
  if (products.data_stream_monitoring && products.data_jobs_monitoring) {
    score += 0.75;
    signals.push(lang === 'pt'
      ? 'Monitoramento de qualidade de dados (DSM + DJM) +0.75'
      : 'Data quality monitoring (DSM + DJM) +0.75');
  } else if (products.data_stream_monitoring) {
    score += 0.25;
    signals.push(lang === 'pt'
      ? 'Data Stream Monitoring parcial +0.25'
      : 'Partial Data Stream Monitoring +0.25');
  } else {
    issues.push(lang === 'pt'
      ? 'Sem DSM/DJM - dificulta governança de custo'
      : 'No DSM/DJM - hinders cost governance');
  }
  
  // Observability Pipelines - cost control enabler
  if (products.observability_pipelines) {
    score += 0.5;
    signals.push(lang === 'pt'
      ? 'Observability Pipelines (controle fino de custos) +0.5'
      : 'Observability Pipelines (fine-grained cost control) +0.5');
  }
  
  // Sensitive Data Scanner
  if (products.sensitive_data_scanner) {
    score += 0.25;
    signals.push(lang === 'pt'
      ? 'Sensitive Data Scanner habilitado +0.25'
      : 'Sensitive Data Scanner enabled +0.25');
  }
  
  // High spend scrutiny
  const spend = data.historicalMRR.avgMonthlySpend || 0;
  if (spend > 500000) {
    if (score < 2.5) {
      score -= 0.5;
      issues.push(lang === 'pt'
        ? `Investimento massivo ($${(spend/1000).toFixed(0)}k/mês) sem evidência forte de governance -0.5`
        : `Massive investment ($${(spend/1000).toFixed(0)}k/month) without strong governance evidence -0.5`);
    } else {
      signals.push(lang === 'pt'
        ? `Investimento consistente em observabilidade ($${(spend/1000).toFixed(0)}k/mês)`
        : `Consistent observability investment ($${(spend/1000).toFixed(0)}k/month)`);
    }
  } else if (spend > 100000) {
    if (score < 2) {
      issues.push(lang === 'pt'
        ? `Investimento significativo ($${(spend/1000).toFixed(0)}k/mês) requer governance mais forte`
        : `Significant investment ($${(spend/1000).toFixed(0)}k/month) requires stronger governance`);
    }
  }
  
  // Product diversity without governance
  const pc = data.historicalMRR.productCount || 0;
  if (pc >= 20 && score < 2.5) {
    issues.push(lang === 'pt'
      ? `${pc} produtos ativos mas governance de custo limitada`
      : `${pc} active products but limited cost governance`);
  }
  
  // APM Indexed Ratio (NEW v27 - bonus field, only available for APM Pro plan)
  // High ratio = over-indexing = wasted spend.
  // < 1% is excellent (good control), 1-5% is OK, > 5% suggests review needed.
  // Field is OPTIONAL - clients without APM Pro won't have it (no penalty).
  const indexedRatio = data.healthCheck.apmIndexedRatio;
  if (indexedRatio !== undefined && indexedRatio !== null && !isNaN(indexedRatio)) {
    if (indexedRatio <= 1) {
      score += 0.25;
      signals.push(lang === 'pt'
        ? `Indexação APM bem controlada (${indexedRatio.toFixed(2)}%) +0.25`
        : `Well-controlled APM indexing (${indexedRatio.toFixed(2)}%) +0.25`);
    } else if (indexedRatio > 5) {
      score -= 0.25;
      issues.push(lang === 'pt'
        ? `Indexação APM elevada (${indexedRatio.toFixed(1)}%) sugere over-indexação -0.25`
        : `High APM indexing (${indexedRatio.toFixed(1)}%) suggests over-indexing -0.25`);
    }
  }
  
  // HARD CAP at 3.0 - need explicit evidence (usage attribution, cost alerts)
  // for higher levels (not available in current data structure)
  if (score > 3.0) {
    score = 3.0;
    issues.push(lang === 'pt'
      ? 'Cap em 3.0 - evidência explícita de cost governance (usage attribution, cost alerts) requerida para nível maior'
      : 'Capped at 3.0 - explicit cost governance evidence (usage attribution, cost alerts) required for higher level');
  }
  
  const finalScore = Math.max(0, Math.min(score, 5));
  return {
    score: finalScore,
    signals,
    issues,
    level: Math.max(0, Math.min(Math.round(finalScore), 5)),
    rationale: lang === 'pt'
      ? `Cost rebalanceada: baseline 1.0 + log exclusion (${le.toFixed(1)}%) + DSM/DJM + obs pipelines. Cap 3.0 sem governance explícita`
      : `Rebalanced cost: baseline 1.0 + log exclusion (${le.toFixed(1)}%) + DSM/DJM + obs pipelines. Cap 3.0 without explicit governance`
  };
}

function applyGatingRules(avgScore, dimensions, data, lang) {
  // Rebalanced v4: gates now also reduce rawScore (not just cap level)
  // and new Gate 5 for misconfigured channels > 5%.
  const gatings = [];
  let adjustedRawScore = avgScore; // NEW: can be reduced by gates
  let levelCap = 5;
  let qualifier = '';
  
  const total = data.healthCheck.totalMonitors || 0;
  const missingRecip = data.healthCheck.monitorsMissingRecipients || 0;
  const muted = data.healthCheck.monitorsMuted60Days || 0;
  const misconfigured = data.healthCheck.monitorsMisconfiguredChannels || 0;
  const recipientRate = total ? ((total - missingRecip) / total) * 100 : 0;
  const mutedRate = total ? (muted / total) * 100 : 0;
  const miscRate = total ? (misconfigured / total) * 100 : 0;
  const logsCorrelated = data.healthCheck.percentageLogsCorrelated || 0;
  
  // Gate 1: Poor recipient coverage blocks L4+ AND reduces rawScore
  if (recipientRate < 85) {
    levelCap = Math.min(levelCap, 3);
    adjustedRawScore -= 0.15;
    qualifier = lang === 'pt' 
      ? 'bloqueado por gaps críticos de alerting'
      : 'blocked by critical alerting gaps';
    gatings.push(lang === 'pt'
      ? `Nível 4+ bloqueado por cobertura fraca de destinatários (${recipientRate.toFixed(1)}%)`
      : `Level 4+ blocked by weak recipient coverage (${recipientRate.toFixed(1)}%)`);
  }
  
  // Gate 2: Weak telemetry correlation blocks L5 (strong penalty if <25%)
  if (logsCorrelated < 70) {
    levelCap = Math.min(levelCap, 4);
    if (logsCorrelated < 25) {
      adjustedRawScore -= 0.15;
    }
    if (!qualifier) {
      qualifier = lang === 'pt'
        ? 'bloqueado por correlação de telemetria incompleta'
        : 'blocked by incomplete telemetry correlation';
    }
    gatings.push(lang === 'pt'
      ? `Nível 5 bloqueado por correlação logs-APM fraca (${logsCorrelated.toFixed(1)}%)`
      : `Level 5 blocked by weak logs-APM correlation (${logsCorrelated.toFixed(1)}%)`);
  }
  
  // Gate 3: Poor monitor hygiene blocks L5
  if (mutedRate > 5) {
    levelCap = Math.min(levelCap, 4);
    if (!qualifier) {
      qualifier = lang === 'pt'
        ? 'bloqueado por higiene de monitores incompleta'
        : 'blocked by incomplete monitor hygiene';
    }
    gatings.push(lang === 'pt'
      ? `Nível 5 bloqueado por ${muted} monitores silenciados 60+ dias (${mutedRate.toFixed(1)}%)`
      : `Level 5 blocked by ${muted} monitors muted 60+ days (${mutedRate.toFixed(1)}%)`);
  }
  
  // Gate 4: Governance score blocks L5
  if (dimensions.governance.score < 4) {
    levelCap = Math.min(levelCap, 4);
    if (!qualifier) {
      qualifier = lang === 'pt'
        ? 'bloqueado por evidência incompleta de governança'
        : 'blocked by incomplete governance evidence';
    }
    gatings.push(lang === 'pt'
      ? `Nível 5 bloqueado por governança operacional insuficiente (${dimensions.governance.score.toFixed(2)})`
      : `Level 5 blocked by insufficient operational governance (${dimensions.governance.score.toFixed(2)})`);
  }
  
  // Gate 5 NEW: Misconfigured channels > 5% blocks L4+ AND reduces rawScore
  if (miscRate > 5) {
    levelCap = Math.min(levelCap, 3);
    adjustedRawScore -= 0.1;
    if (!qualifier) {
      qualifier = lang === 'pt'
        ? 'bloqueado por canais de alerta mal configurados'
        : 'blocked by misconfigured alert channels';
    }
    gatings.push(lang === 'pt'
      ? `Nível 4+ bloqueado por ${misconfigured} canais mal configurados (${miscRate.toFixed(1)}%)`
      : `Level 4+ blocked by ${misconfigured} misconfigured channels (${miscRate.toFixed(1)}%)`);
  }
  
  // Final level = min(adjustedRawScore floor, levelCap)
  adjustedRawScore = Math.max(0, adjustedRawScore);
  const cappedLevel = Math.min(Math.floor(adjustedRawScore), levelCap);
  
  return {
    finalLevel: cappedLevel,
    qualifier,
    gatings,
    adjustedRawScore // NEW: returned so assessMaturity can use it as rawScore
  };
}

function generateInsights(dimensions, data, lang) {
  const insights = {
    strengths: [],
    risks: [],
    businessImplications: []
  };
  
  // Strengths - use conditional and specific language
  if (dimensions.adoption.score >= 3.5) {
    insights.strengths.push(lang === 'pt'
      ? `Adoção ampla de plataforma (${data.historicalMRR.productCount} produtos), mas requer governança mais forte`
      : `Broad platform adoption (${data.historicalMRR.productCount} products), but requires stronger governance`);
  } else if (dimensions.adoption.score >= 2.5) {
    insights.strengths.push(lang === 'pt'
      ? `Adoção moderada de plataforma com base em ${data.historicalMRR.productCount} produtos`
      : `Moderate platform adoption with ${data.historicalMRR.productCount} products`);
  }
  
  if (dimensions.quality.score >= 3) {
    insights.strengths.push(lang === 'pt'
      ? 'Base de qualidade de telemetria, com importantes gaps em correlação e visibilidade de usuário'
      : 'Telemetry quality foundation, with important gaps in correlation and user visibility');
  } else if (dimensions.quality.score >= 2) {
    insights.strengths.push(lang === 'pt'
      ? 'Fundação básica de telemetria estabelecida'
      : 'Basic telemetry foundation established');
  }
  
  if (data.historicalMRR.products.synthetics_api_tests) {
    insights.strengths.push(lang === 'pt'
      ? 'Synthetics implementado para detecção proativa'
      : 'Synthetics implemented for proactive detection');
  }
  
  if (data.healthCheck.ingestedLogsProcessedByPipeline > 95) {
    insights.strengths.push(lang === 'pt'
      ? 'Pipelines de logs bem estruturados'
      : 'Well-structured log pipelines');
  }
  
  // ===== RISKS — v31: MRIR framework (Metric → Risk → Impact → Outcome) =====
  // Campo `businessImpact` é o NOVO campo do framework MRIR.
  // Lógica híbrida: tenta quantificar com benchmark Datadog quando há base, 
  // caso contrário usa qualitativo contextual (não inventa números).
  
  // RISCO 1: Monitores sem destinatários (CRÍTICO se >300)
  if (data.healthCheck.monitorsMissingRecipients > 50) {
    const orphanCount = data.healthCheck.monitorsMissingRecipients;
    const orphanPct = data.healthCheck.totalMonitors > 0 
      ? (orphanCount / data.healthCheck.totalMonitors) * 100 
      : 0;
    
    insights.risks.push({
      observation: lang === 'pt'
        ? `${orphanCount} monitores sem destinatários configurados (${orphanPct.toFixed(1)}% do parque)`
        : `${orphanCount} monitors without configured recipients (${orphanPct.toFixed(1)}% of fleet)`,
      interpretation: lang === 'pt'
        ? 'Alertas críticos podem disparar para canais não monitorados durante incidentes'
        : 'Critical alerts may fire to unmonitored channels during incidents',
      // QUANTITATIVO: benchmark Datadog
      businessImpact: lang === 'pt'
        ? 'MTTR tipicamente eleva 15-30 minutos em incidentes Sev1 envolvendo serviços não-roteados; em ambientes com SLAs de 4h, isso consome até 12% do orçamento de tempo de cada incidente'
        : 'MTTR typically rises 15-30 minutes in Sev1 incidents with unrouted services; in environments with 4h SLAs, this consumes up to 12% of each incident\'s time budget',
      operationalRisk: lang === 'pt'
        ? 'Atraso na triagem, escalação para o time errado, descoberta tardia do incidente'
        : 'Delayed triage, escalation to wrong team, late incident discovery',
      recommendedAction: lang === 'pt'
        ? `Cobertura 100% em 7 dias elimina alertas órfãos; auditoria via Tag-based notification routing reduz risco recorrente`
        : `100% coverage in 7 days eliminates orphan alerts; tag-based notification routing audit reduces recurring risk`
    });
  }
  
  // RISCO 2: Monitores silenciados há 60+ dias (drift de configuração)
  if (data.healthCheck.monitorsMuted60Days > 100) {
    const mutedCount = data.healthCheck.monitorsMuted60Days;
    const mutedPct = data.healthCheck.totalMonitors > 0
      ? (mutedCount / data.healthCheck.totalMonitors) * 100
      : 0;
    
    insights.risks.push({
      observation: lang === 'pt'
        ? `${mutedCount} monitores silenciados por mais de 60 dias (${mutedPct.toFixed(1)}% do parque)`
        : `${mutedCount} monitors muted for more than 60 days (${mutedPct.toFixed(1)}% of fleet)`,
      interpretation: lang === 'pt'
        ? 'Cobertura aparente sem cobertura real — falsa sensação de monitoramento'
        : 'Apparent coverage without real coverage — false sense of monitoring',
      // QUALITATIVO: não há benchmark numérico confiável
      businessImpact: lang === 'pt'
        ? 'Áreas críticas podem regredir sem detecção até causarem incidente cliente-impactante; risco de descoberta tardia em momentos de pico'
        : 'Critical areas may regress undetected until they cause customer-impacting incidents; risk of late discovery during peak moments',
      operationalRisk: lang === 'pt'
        ? 'Detecção tardia, descoberta de gaps somente em pós-mortem, perda de confiança no monitoramento'
        : 'Late detection, gap discovery only in post-mortems, loss of monitoring trust',
      recommendedAction: lang === 'pt'
        ? 'Auditoria em 15 dias separa silenciamentos legítimos (downtimes planejados) de drift de governança'
        : '15-day audit separates legitimate silences (planned downtimes) from governance drift'
    });
  }
  
  // RISCO 3: Correlação logs-APM baixa (limita capacidade de RCA)
  if (data.healthCheck.percentageLogsCorrelated < 50) {
    const correlation = data.healthCheck.percentageLogsCorrelated;
    
    insights.risks.push({
      observation: lang === 'pt'
        ? `Apenas ${correlation.toFixed(1)}% dos logs correlacionados com APM (meta: 70%+)`
        : `Only ${correlation.toFixed(1)}% of logs correlated with APM (target: 70%+)`,
      interpretation: lang === 'pt'
        ? 'Em RCA pós-incidente, falta contexto entre tracing e logs em mais de 50% dos casos'
        : 'In post-incident RCA, context between tracing and logs is missing in over 50% of cases',
      // QUANTITATIVO: benchmark Datadog
      businessImpact: lang === 'pt'
        ? 'Engenheiros precisam fazer correlação manual via timestamp, dobrando o tempo médio de RCA em incidentes complexos; cada hora extra de investigação representa risco contínuo de SLA'
        : 'Engineers must manually correlate via timestamp, doubling average RCA time on complex incidents; each extra hour of investigation represents ongoing SLA risk',
      operationalRisk: lang === 'pt'
        ? 'MTTR elevado, RCA incompleto, recorrência de incidentes pela falta de causa raiz identificada'
        : 'Elevated MTTR, incomplete RCA, incident recurrence due to unidentified root cause',
      recommendedAction: lang === 'pt'
        ? 'Implementar Trace IDs em logs estruturados e Unified Service Tagging em top 50 services destrava 80%+ da correlação'
        : 'Implementing Trace IDs in structured logs and Unified Service Tagging in top 50 services unlocks 80%+ correlation'
    });
  }
  
  // RISCO 4 (NEW): RUM sem User ID (limita análise de impacto cliente)
  if (data.healthCheck.rumSessionsWithUserID !== undefined && data.healthCheck.rumSessionsWithUserID < 30) {
    const rumPct = data.healthCheck.rumSessionsWithUserID;
    
    insights.risks.push({
      observation: lang === 'pt'
        ? `Apenas ${rumPct.toFixed(1)}% das sessões RUM com User ID identificado`
        : `Only ${rumPct.toFixed(1)}% of RUM sessions with identified User ID`,
      interpretation: lang === 'pt'
        ? 'Impossível mapear quais clientes específicos foram afetados durante uma degradação'
        : 'Impossible to map which specific customers were affected during degradation',
      // QUALITATIVO
      businessImpact: lang === 'pt'
        ? 'Em incidentes que afetam UX, não há visibilidade granular de impacto por usuário/segmento; comunicação proativa com clientes-chave fica comprometida'
        : 'In UX-affecting incidents, no granular visibility per user/segment; proactive communication with key customers is compromised',
      operationalRisk: lang === 'pt'
        ? 'Impacto cliente subdimensionado, perda de oportunidade de mitigação proativa, risco reputacional'
        : 'Underestimated customer impact, missed proactive mitigation, reputational risk',
      recommendedAction: lang === 'pt'
        ? 'Habilitar Datadog RUM User Tracking em camada de autenticação eleva cobertura para 80%+ em 30 dias'
        : 'Enabling Datadog RUM User Tracking in authentication layer raises coverage to 80%+ in 30 days'
    });
  }
  
  // RISCO 5 (NEW): Tagging incompleto (gap fundamental de governança)
  if (data.healthCheck.hostsWithEnvTag !== undefined && data.healthCheck.hostsWithEnvTag < 80) {
    const tagPct = data.healthCheck.hostsWithEnvTag;
    const untagged = (100 - tagPct).toFixed(1);
    
    insights.risks.push({
      observation: lang === 'pt'
        ? `${untagged}% dos hosts sem env tag (${tagPct.toFixed(1)}% taggeados)`
        : `${untagged}% of hosts without env tag (${tagPct.toFixed(1)}% tagged)`,
      interpretation: lang === 'pt'
        ? 'Sem tagging consistente, atribuição de custo, ownership e blast radius ficam comprometidos'
        : 'Without consistent tagging, cost attribution, ownership, and blast radius are compromised',
      // QUALITATIVO
      businessImpact: lang === 'pt'
        ? 'Conversas com FinOps e compliance ficam imprecisas; em incidentes, identificar serviços afetados depende de inferência manual em vez de filtro por tag'
        : 'FinOps and compliance conversations become imprecise; in incidents, identifying affected services depends on manual inference instead of tag filtering',
      operationalRisk: lang === 'pt'
        ? 'Cost allocation impreciso, blast radius mal mapeado, governance ad-hoc em vez de sistemática'
        : 'Imprecise cost allocation, poorly mapped blast radius, ad-hoc rather than systematic governance',
      recommendedAction: lang === 'pt'
        ? 'Tagging gate em pipeline de deploy (CI/CD) evita regressão; migração de legacy hosts em 60 dias eleva cobertura para 95%+'
        : 'Tagging gate in deploy pipeline (CI/CD) prevents regression; legacy hosts migration in 60 days raises coverage to 95%+'
    });
  }
  
  // RISCO 6 (NEW): Cliente em Nível 1 sem riscos visíveis = preencher seção (review feedback)
  // Garante que clientes em nível baixo nunca tenham seção vazia de riscos
  if (insights.risks.length === 0) {
    // Detectar pelo menos uma fragilidade para mostrar contexto
    if (data.healthCheck.totalMonitors === 0 || !data.healthCheck.totalMonitors) {
      insights.risks.push({
        observation: lang === 'pt'
          ? 'Dados de monitoramento não preenchidos no assessment'
          : 'Monitor data not filled in assessment',
        interpretation: lang === 'pt'
          ? 'Não foi possível avaliar riscos operacionais sem dados de monitor health'
          : 'Could not evaluate operational risks without monitor health data',
        businessImpact: lang === 'pt'
          ? 'Avaliação incompleta limita o valor estratégico do diagnóstico'
          : 'Incomplete assessment limits the strategic value of the diagnosis',
        operationalRisk: lang === 'pt'
          ? 'Diagnóstico parcial pode levar a roadmap impreciso'
          : 'Partial diagnosis may lead to imprecise roadmap',
        recommendedAction: lang === 'pt'
          ? 'Subir o PDF do Monitor Quality e refazer o assessment para diagnóstico completo'
          : 'Upload Monitor Quality PDF and re-run assessment for complete diagnosis'
      });
    }
  }
  
  // Business implications
  const recipientRate = ((data.healthCheck.totalMonitors - data.healthCheck.monitorsMissingRecipients) / data.healthCheck.totalMonitors) * 100;
  if (recipientRate < 85) {
    insights.businessImplications.push(lang === 'pt'
      ? `Risco de resposta a incidentes: ${(100 - recipientRate).toFixed(1)}% dos alertas podem não alcançar equipes responsáveis, impactando SLAs e confiabilidade do serviço`
      : `Incident response risk: ${(100 - recipientRate).toFixed(1)}% of alerts may not reach responsible teams, impacting SLAs and service reliability`);
  }
  
  if (data.healthCheck.rumSessionsWithUserID < 50) {
    insights.businessImplications.push(lang === 'pt'
      ? 'Visibilidade limitada de experiência do usuário impede análise precisa de impacto de negócio durante degradações'
      : 'Limited user experience visibility prevents accurate business impact analysis during degradations');
  }
  
  return insights;
}

function generateRecommendations(dimensions, data, insights, lang) {
  const recommendations = [];
  
  // Priority 1: Alert hygiene
  if (data.healthCheck.monitorsMissingRecipients > 50) {
    recommendations.push({
      title: lang === 'pt'
        ? 'Configurar destinatários em monitores críticos'
        : 'Configure recipients on critical monitors',
      rationale: lang === 'pt'
        ? `${data.healthCheck.monitorsMissingRecipients} monitores sem destinatários representam risco crítico de resposta a incidentes`
        : `${data.healthCheck.monitorsMissingRecipients} monitors without recipients represent critical incident response risk`,
      owner: 'SRE / Platform Team',
      priority: lang === 'pt' ? 'CRÍTICA' : 'CRITICAL',
      timeframe: lang === 'pt' ? '7 dias' : '7 days',
      expectedOutcome: lang === 'pt'
        ? 'Alertas alcançam equipes responsáveis durante incidentes'
        : 'Alerts reach responsible teams during incidents',
      dimensionImpact: 'alerting' // v35: dimension affected
    });
  }
  
  if (data.healthCheck.monitorsMuted60Days > 100) {
    recommendations.push({
      title: lang === 'pt'
        ? 'Auditar monitores silenciados há mais de 60 dias'
        : 'Audit monitors muted for 60+ days',
      rationale: lang === 'pt'
        ? `${data.healthCheck.monitorsMuted60Days} monitores silenciados indicam possível drift de configuração ou perda de relevância`
        : `${data.healthCheck.monitorsMuted60Days} muted monitors indicate possible configuration drift or loss of relevance`,
      owner: 'Engineering Teams',
      priority: lang === 'pt' ? 'ALTA' : 'HIGH',
      timeframe: lang === 'pt' ? '15 dias' : '15 days',
      expectedOutcome: lang === 'pt'
        ? 'Cobertura de monitoramento reflete estado real dos serviços'
        : 'Monitoring coverage reflects actual service state',
      dimensionImpact: 'governance' // v35
    });
  }
  
  // Priority 2: Ownership and routing
  const recipientRate = ((data.healthCheck.totalMonitors - data.healthCheck.monitorsMissingRecipients) / data.healthCheck.totalMonitors) * 100;
  if (recipientRate < 90) {
    recommendations.push({
      title: lang === 'pt'
        ? 'Estabelecer modelo de ownership de monitores'
        : 'Establish monitor ownership model',
      rationale: lang === 'pt'
        ? 'Ownership claro garante que alertas sejam direcionados às equipes corretas'
        : 'Clear ownership ensures alerts are routed to correct teams',
      owner: 'Engineering Manager / Platform',
      priority: lang === 'pt' ? 'ALTA' : 'HIGH',
      timeframe: lang === 'pt' ? '30 dias' : '30 days',
      expectedOutcome: lang === 'pt'
        ? 'Cada monitor tem owner e notification routing definidos'
        : 'Each monitor has defined owner and notification routing',
      dimensionImpact: 'governance' // v35
    });
  }
  
  // Priority 3: Telemetry correlation
  if (data.healthCheck.percentageLogsCorrelated < 70) {
    recommendations.push({
      title: lang === 'pt'
        ? 'Aumentar correlação logs-APM'
        : 'Increase logs-APM correlation',
      rationale: lang === 'pt'
        ? `Correlação atual de ${data.healthCheck.percentageLogsCorrelated.toFixed(1)}% limita eficácia de troubleshooting`
        : `Current correlation of ${data.healthCheck.percentageLogsCorrelated.toFixed(1)}% limits troubleshooting effectiveness`,
      owner: 'Engineering Teams',
      priority: lang === 'pt' ? 'MÉDIA' : 'MEDIUM',
      timeframe: lang === 'pt' ? '45 dias' : '45 days',
      expectedOutcome: lang === 'pt'
        ? 'Meta: 70%+ de logs correlacionados com traces para RCA eficaz'
        : 'Target: 70%+ logs correlated with traces for effective RCA',
      dimensionImpact: 'quality' // v35
    });
  }
  
  // Priority 4: Tag governance
  if (data.healthCheck.hostsWithEnvTag < 90) {
    recommendations.push({
      title: lang === 'pt'
        ? 'Implementar unified tagging strategy'
        : 'Implement unified tagging strategy',
      rationale: lang === 'pt'
        ? `${(100 - data.healthCheck.hostsWithEnvTag).toFixed(1)}% dos hosts sem env tag impede correlação completa`
        : `${(100 - data.healthCheck.hostsWithEnvTag).toFixed(1)}% of hosts without env tag prevents complete correlation`,
      owner: 'Platform / Engineering',
      priority: lang === 'pt' ? 'MÉDIA' : 'MEDIUM',
      timeframe: lang === 'pt' ? '60 dias' : '60 days',
      expectedOutcome: lang === 'pt'
        ? 'Tags env, service, version em 100% da infraestrutura'
        : 'Tags env, service, version on 100% of infrastructure',
      dimensionImpact: 'quality' // v35: tagging impacts data quality
    });
  }
  
  // Priority 5: RUM user tracking
  if (data.healthCheck.rumSessionsWithUserID < 80) {
    recommendations.push({
      title: lang === 'pt'
        ? 'Melhorar rastreamento de usuário no RUM'
        : 'Improve RUM user tracking',
      rationale: lang === 'pt'
        ? `${data.healthCheck.rumSessionsWithUserID.toFixed(1)}% de sessões com user ID limita análise de impacto ao usuário`
        : `${data.healthCheck.rumSessionsWithUserID.toFixed(1)}% sessions with user ID limits user impact analysis`,
      owner: 'Product / Engineering',
      priority: lang === 'pt' ? 'MÉDIA' : 'MEDIUM',
      timeframe: lang === 'pt' ? '45 dias' : '45 days',
      expectedOutcome: lang === 'pt'
        ? 'Meta: 80%+ de sessões com user ID para melhor visibilidade'
        : 'Target: 80%+ sessions with user ID for better visibility',
      dimensionImpact: 'quality' // v35
    });
  }
  
  // Priority 6: Cost optimization
  if (data.healthCheck.logsExcludedByExclusion < 65) {
    recommendations.push({
      title: lang === 'pt'
        ? 'Otimizar ingestão de logs com exclusion filters'
        : 'Optimize log ingestion with exclusion filters',
      rationale: lang === 'pt'
        ? 'Oportunidade de reduzir custos mantendo visibilidade necessária'
        : 'Opportunity to reduce costs while maintaining necessary visibility',
      owner: 'Platform / FinOps',
      priority: lang === 'pt' ? 'BAIXA' : 'LOW',
      timeframe: lang === 'pt' ? '30 dias' : '30 days',
      expectedOutcome: lang === 'pt'
        ? 'Redução de 10-15% no volume de logs sem perda de visibilidade crítica'
        : '10-15% reduction in log volume without losing critical visibility',
      dimensionImpact: 'cost' // v35
    });
  }
  
  return recommendations;
}

/**
 * v35: Severidade ponderada por dimensão.
 * Se uma recomendação impacta uma dimensão em nível ≤1 (CRÍTICO),
 * escala automaticamente a prioridade para CRITICAL e adiciona um
 * campo `escalationReason` para explicar a escalação no relatório.
 *
 * Regra:
 *   - dimensão impactada com score ≤ 1.0 → escalar para CRITICAL
 *   - escalação só ELEVA prioridade (nunca rebaixa)
 *   - adiciona escalationReason: { dimension, dimensionLabel, dimensionScore, dimensionLevel }
 */
function escalateRecommendations(recommendations, dimensions, lang) {
  const isPt = lang === 'pt';
  const CRITICAL_LABEL = isPt ? 'CRÍTICA' : 'CRITICAL';
  
  // Map dimension key → translated label for display
  const dimLabels = {
    adoption: isPt ? 'Adoção' : 'Adoption',
    governance: isPt ? 'Governança Operacional' : 'Operational Governance',
    quality: isPt ? 'Qualidade de Telemetria' : 'Telemetry Quality',
    alerting: isPt ? 'Confiabilidade de Alertas' : 'Alerting Reliability',
    cost: isPt ? 'Governança de Custo' : 'Cost Governance'
  };
  
  // Priority numeric weight (lower = more critical)
  const priorityWeight = (p) => {
    const upper = String(p || '').toUpperCase();
    if (upper === 'CRITICAL' || upper === 'CRÍTICA') return 0;
    if (upper === 'HIGH' || upper === 'ALTA') return 1;
    if (upper === 'MEDIUM' || upper === 'MÉDIA') return 2;
    if (upper === 'LOW' || upper === 'BAIXA') return 3;
    return 4;
  };
  
  return recommendations.map(rec => {
    if (!rec.dimensionImpact) return rec;
    
    const dim = dimensions[rec.dimensionImpact];
    if (!dim || typeof dim.score !== 'number') return rec;
    
    // Only escalate if dimension is in level ≤1 (i.e., score < 1.5)
    // and current priority is below CRITICAL
    if (dim.score < 1.5 && priorityWeight(rec.priority) > 0) {
      return {
        ...rec,
        priority: CRITICAL_LABEL,
        originalPriority: rec.priority, // preserve for transparency
        escalationReason: {
          dimensionKey: rec.dimensionImpact,
          dimensionLabel: dimLabels[rec.dimensionImpact] || rec.dimensionImpact,
          dimensionScore: dim.score,
          dimensionLevel: dim.level !== undefined ? dim.level : Math.floor(dim.score)
        }
      };
    }
    
    return rec;
  });
}

/**
 * v30: Classify recommendations into Quick Wins (≤30 days) and Strategic Initiatives (>30 days).
 * v35: Limits dynamic — if any dimension is critical (≤1), expand to 4 strategic + 6 quick wins
 *      to make space for escalated recommendations.
 * Within each bucket, prioritize by severity (CRITICAL > HIGH > MEDIUM > LOW).
 */
function classifyRecommendations(recommendations, lang, dimensions = null) {
  // Priority numeric weight for sorting
  const priorityWeight = (p) => {
    const upper = String(p || '').toUpperCase();
    if (upper === 'CRITICAL' || upper === 'CRÍTICA') return 0;
    if (upper === 'HIGH' || upper === 'ALTA') return 1;
    if (upper === 'MEDIUM' || upper === 'MÉDIA') return 2;
    if (upper === 'LOW' || upper === 'BAIXA') return 3;
    return 4;
  };
  
  // Extract numeric days from "7 days" / "30 dias" / etc.
  const extractDays = (timeframe) => {
    const match = String(timeframe || '').match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 999;
  };
  
  // v35: Detect if any dimension is in critical level (≤1)
  // If so, expand limits to make room for escalated recommendations
  let strategicLimit = 3;
  let quickWinsLimit = 5;
  if (dimensions) {
    const hasCriticalDim = Object.values(dimensions).some(
      d => d && typeof d.score === 'number' && d.score < 1.5
    );
    if (hasCriticalDim) {
      strategicLimit = 4;
      quickWinsLimit = 6;
    }
  }
  
  // Sort by priority, then by timeframe
  const sorted = [...recommendations].sort((a, b) => {
    const wa = priorityWeight(a.priority);
    const wb = priorityWeight(b.priority);
    if (wa !== wb) return wa - wb;
    return extractDays(a.timeframe) - extractDays(b.timeframe);
  });
  
  // Bucket by timeframe
  const quickWins = [];
  const strategic = [];
  
  for (const rec of sorted) {
    const days = extractDays(rec.timeframe);
    if (days <= 30) {
      if (quickWins.length < quickWinsLimit) quickWins.push(rec);
    } else {
      if (strategic.length < strategicLimit) strategic.push(rec);
    }
  }
  
  return { quickWins, strategic, strategicLimit, quickWinsLimit };
}

function generateTrainingRecommendations(dimensions, lang) {
  const trainings = [];
  
  // Governance training if score < 3.5
  if (dimensions.governance.score < 3.5) {
    trainings.push({
      dimension: lang === 'pt' ? 'Governança Operacional' : 'Operational Governance',
      courses: DATADOG_TRAINING.governance[lang].courses,
      priority: dimensions.governance.score < 2.5 ? 'HIGH' : 'MEDIUM',
      reason: lang === 'pt'
        ? 'Gaps em governança de monitores e tagging'
        : 'Gaps in monitor governance and tagging'
    });
  }
  
  // Quality training if score < 3.5
  if (dimensions.quality.score < 3.5) {
    trainings.push({
      dimension: lang === 'pt' ? 'Qualidade de Telemetria' : 'Telemetry Quality',
      courses: DATADOG_TRAINING.quality[lang].courses,
      priority: dimensions.quality.score < 2.5 ? 'HIGH' : 'MEDIUM',
      reason: lang === 'pt'
        ? 'Correlação logs-APM e RUM tracking precisam melhorar'
        : 'Logs-APM correlation and RUM tracking need improvement'
    });
  }
  
  // Alerting training if score < 3.5
  if (dimensions.alerting.score < 3.5) {
    trainings.push({
      dimension: lang === 'pt' ? 'Confiabilidade de Alertas' : 'Alerting Reliability',
      courses: DATADOG_TRAINING.alerting[lang].courses,
      priority: dimensions.alerting.score < 2.5 ? 'HIGH' : 'MEDIUM',
      reason: lang === 'pt'
        ? 'Alert fatigue e configuração de monitores precisam atenção'
        : 'Alert fatigue and monitor configuration need attention'
    });
  }
  
  // Cost training if score < 3
  if (dimensions.cost.score < 3) {
    trainings.push({
      dimension: lang === 'pt' ? 'Governança de Custo' : 'Cost Governance',
      courses: DATADOG_TRAINING.cost[lang].courses,
      priority: 'MEDIUM',
      reason: lang === 'pt'
        ? 'Otimização de custos e usage attribution'
        : 'Cost optimization and usage attribution'
    });
  }
  
  return trainings;
}

// Export to HTML function
function exportToHTML(assessment, serviceName, teamName, businessOwner, technicalOwner, accountId, language, assessmentHistory = [], inputData = null) {
  // v29: If we have the original input data, regenerate assessment in the export language.
  // This ensures PT-BR exports never contain English content (and vice versa).
  // The numerical scores remain identical — only the narrative strings change.
  let workingAssessment = assessment;
  if (inputData) {
    try {
      // v32: pass teamName/serviceName as customerName for personalized executive summary
      const customerName = teamName || serviceName || null;
      const regenerated = assessMaturity(inputData, language, customerName);
      // Preserve the scores from original (in case of slight floating-point differences)
      // but use all the narrative content from the regenerated assessment
      workingAssessment = {
        ...regenerated,
        finalLevel: assessment.finalLevel,
        rawScore: assessment.rawScore,
        qualifier: assessment.qualifier
      };
    } catch (e) {
      console.warn('Could not regenerate assessment in export language, using stored version:', e);
      workingAssessment = assessment;
    }
  }
  
  const t = TRANSLATIONS[language];
  const level = MATURITY_LEVELS[workingAssessment.finalLevel];
  const today = new Date();
  const formattedDate = today.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Use regenerated assessment everywhere from here
  assessment = workingAssessment;

  const htmlContent = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} - ${serviceName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1f2937;
      line-height: 1.6;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      background: #f9fafb;
    }
    .header {
      background: #632CA6;
      color: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    h2 { 
      font-size: 1.5rem; 
      margin: 2rem 0 1rem 0; 
      color: #1f2937;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    h3 { font-size: 1.125rem; margin: 1rem 0 0.75rem 0; color: #1f2937; }
    h4 { font-size: 1rem; margin: 0.75rem 0 0.5rem 0; color: #1f2937; font-weight: 600; }
    .maturity-card {
      background: linear-gradient(135deg, ${level.color}22 0%, ${level.color}11 100%);
      border: 3px solid ${level.color};
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }
    .maturity-level {
      font-size: 3rem;
      font-weight: 700;
      color: ${level.color};
      line-height: 1;
    }
    .qualifier {
      font-size: 1rem;
      color: #f59e0b;
      font-weight: 600;
      margin-top: 0.5rem;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .info-box {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .risk-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .recommendation {
      background: white;
      border-left: 4px solid #667eea;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }
    .priority-critical { border-left-color: #dc2626; }
    .priority-high { border-left-color: #f59e0b; }
    .priority-medium { border-left-color: #3b82f6; }
    .priority-low { border-left-color: #10b981; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
    }
    .badge-critical { background: #dc2626; }
    .badge-high { background: #f59e0b; }
    .badge-medium { background: #3b82f6; }
    .badge-low { background: #10b981; }
    ul { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    .docs-box {
      background: #eff6ff;
      border: 1px solid #3b82f6;
      border-radius: 6px;
      padding: 1rem;
      margin-top: 1rem;
    }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    @media print {
      body { padding: 0; }
      .header { page-break-after: avoid; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>${t.title}</h1>
        <p style="font-size: 1.1rem; opacity: 0.95; margin-top: 0.5rem;">${t.subtitle}</p>
      </div>
      <div style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; font-size: 0.875rem;">
        DATADOG
      </div>
    </div>
    <div style="margin-top: 1.5rem; opacity: 0.95;">
      <div style="font-size: 0.95rem; margin-bottom: 1rem;">${formattedDate}</div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; background: rgba(255,255,255,0.15); padding: 1rem; border-radius: 6px;">
        <div>
          <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 0.25rem;">${language === 'pt' ? 'Time/Área' : 'Team/Area'}</div>
          <div style="font-weight: 700; font-size: 1rem;">${teamName}</div>
        </div>
        <div>
          <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 0.25rem;">Account ID</div>
          <div style="font-weight: 700; font-size: 1rem;">${accountId}</div>
        </div>
        ${businessOwner ? `
        <div>
          <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 0.25rem;">Business Owner</div>
          <div style="font-weight: 600; font-size: 0.9375rem;">${businessOwner}</div>
        </div>
        ` : ''}
        ${technicalOwner ? `
        <div>
          <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 0.25rem;">Technical Owner</div>
          <div style="font-weight: 600; font-size: 0.9375rem;">${technicalOwner}</div>
        </div>
        ` : ''}
      </div>
    </div>
  </div>

  ${assessment.executiveSummary && assessment.executiveSummary.paragraphs && assessment.executiveSummary.paragraphs.length > 0 ? `
    <div style="background: linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%); border: 2px solid #632CA6; border-left: 6px solid #632CA6; border-radius: 12px; padding: 1.75rem 2rem; margin-bottom: 2rem;">
      <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #632CA6; letter-spacing: 0.08em; margin-bottom: 0.875rem;">
        📋 ${t.executiveSummary}
      </div>
      ${assessment.executiveSummary.paragraphs.map((para, idx) => `
        <p style="margin: ${idx === 0 ? '0 0 0.875rem 0' : '0.875rem 0'}; color: #1f2937; font-size: 0.9375rem; line-height: 1.65; font-weight: ${idx === 0 ? '500' : '400'};">
          ${para}
        </p>
      `).join('')}
    </div>
  ` : ''}

  <div class="maturity-card">
    <div style="font-size: 0.875rem; text-transform: uppercase; font-weight: 600; color: #6b7280; margin-bottom: 0.5rem;">
      ${t.maturityLevel}
    </div>
    <div class="maturity-level">${level.label[language]}</div>
    ${assessment.qualifier ? `<div class="qualifier">(${assessment.qualifier})</div>` : ''}
    <p style="color: #4b5563; margin-top: 1rem;">${level.description[language]}</p>
    ${assessment.gatings.length > 0 ? `
      <div style="background: #fff7ed; border: 1px solid #f59e0b; border-radius: 6px; padding: 1rem; margin-top: 1rem; text-align: left;">
        <div style="font-weight: 600; color: #92400e; margin-bottom: 0.5rem;">
          ${language === 'pt' ? '⚠️ Limitadores de Maturidade:' : '⚠️ Maturity Limiters:'}
        </div>
        <ul style="color: #92400e; font-size: 0.875rem;">
          ${assessment.gatings.map(gate => `<li>${gate}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
  </div>

  <div class="section">
    <h2>${t.maturityRationale}</h2>
    <p style="color: #4b5563; margin-bottom: 1.5rem; line-height: 1.7;">
      ${assessment.rationale.summary}
    </p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      <div>
        <h4 style="color: #059669; margin-bottom: 0.75rem;">${t.whatIncreased}</h4>
        <ul style="color: #065f46; font-size: 0.875rem;">
          ${(assessment.rationale?.increased || []).map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div>
        <h4 style="color: #dc2626; margin-bottom: 0.75rem;">${t.whatPrevented}</h4>
        <ul style="color: #991b1b; font-size: 0.875rem;">
          ${(assessment.rationale?.prevented || []).map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>${language === 'pt' ? 'Progresso para o Próximo Nível' : 'Progress to Next Level'}</h2>
    <div style="margin-bottom: 1rem; font-size: 0.9375rem; color: #6b7280; font-weight: 500;">
      ${language === 'pt' 
        ? `Nível ${Math.floor(assessment.rawScore)} → Nível ${Math.floor(assessment.rawScore) + 1}`
        : `Level ${Math.floor(assessment.rawScore)} → Level ${Math.floor(assessment.rawScore) + 1}`}
    </div>
    <div style="width: 100%; background: #e5e7eb; border-radius: 8px; height: 32px; overflow: hidden; position: relative;">
      <div style="width: ${((assessment.rawScore % 1) * 100).toFixed(0)}%; background: #632CA6; height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px; color: white; font-weight: 600; font-size: 0.875rem;">
        ${((assessment.rawScore % 1) * 100).toFixed(0)}%
      </div>
    </div>
    <div style="font-size: 0.8125rem; color: #6b7280; margin-top: 0.5rem; display: flex; justify-content: space-between;">
      <span>Score: ${assessment.rawScore.toFixed(2)}</span>
      <span>
        ${language === 'pt'
          ? `${((assessment.rawScore % 1) * 100).toFixed(0)}% de ${Math.floor(assessment.rawScore)}.0 para ${Math.floor(assessment.rawScore) + 1}.0`
          : `${((assessment.rawScore % 1) * 100).toFixed(0)}% from ${Math.floor(assessment.rawScore)}.0 to ${Math.floor(assessment.rawScore) + 1}.0`}
      </span>
    </div>
  </div>

  <div class="section">
    <h2>✅ ${t.strengths}</h2>
    <ul style="color: #065f46;">
      ${assessment.insights.strengths.map(s => `<li>${s}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h2>⚠️ ${t.risks}</h2>
    ${assessment.insights.risks.map(risk => `
      <div class="risk-box" style="padding: 1.25rem; margin-bottom: 1.25rem;">
        <div style="font-weight: 700; color: #991b1b; margin-bottom: 1rem; font-size: 1rem;">
          ${risk.observation}
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <tbody>
            <tr style="border-bottom: 1px solid #fecaca;">
              <td style="padding: 0.625rem 0.75rem 0.625rem 0; vertical-align: top; width: 130px; font-weight: 600; color: #7f1d1d; white-space: nowrap;">
                ⚠️ ${language === 'pt' ? 'Risco' : 'Risk'}
              </td>
              <td style="padding: 0.625rem 0; color: #7f1d1d; line-height: 1.5;">
                ${risk.interpretation}
              </td>
            </tr>
            ${risk.businessImpact ? `
            <tr style="border-bottom: 1px solid #fecaca;">
              <td style="padding: 0.625rem 0.75rem 0.625rem 0; vertical-align: top; font-weight: 600; color: #7f1d1d; white-space: nowrap;">
                💼 ${language === 'pt' ? 'Impacto' : 'Impact'}
              </td>
              <td style="padding: 0.625rem 0; color: #7f1d1d; line-height: 1.5;">
                ${risk.businessImpact}
              </td>
            </tr>
            ` : ''}
            <tr style="border-bottom: 1px solid #fecaca;">
              <td style="padding: 0.625rem 0.75rem 0.625rem 0; vertical-align: top; font-weight: 600; color: #7f1d1d; white-space: nowrap;">
                🔧 ${language === 'pt' ? 'Operacional' : 'Operational'}
              </td>
              <td style="padding: 0.625rem 0; color: #7f1d1d; line-height: 1.5;">
                ${risk.operationalRisk}
              </td>
            </tr>
            <tr>
              <td style="padding: 0.625rem 0.75rem 0.625rem 0; vertical-align: top; font-weight: 600; color: #065f46; white-space: nowrap;">
                ✅ ${language === 'pt' ? 'Resultado' : 'Outcome'}
              </td>
              <td style="padding: 0.625rem 0; color: #065f46; font-weight: 500; line-height: 1.5;">
                ${risk.recommendedAction}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>🎯 ${t.recommendations}</h2>
    ${(() => {
      // v30: render Quick Wins + Strategic Initiatives separately
      // Use classifiedRecommendations if available; fallback to inline classification
      let qw, str;
      if (assessment.classifiedRecommendations) {
        qw = assessment.classifiedRecommendations.quickWins || [];
        str = assessment.classifiedRecommendations.strategic || [];
      } else {
        // Fallback for older assessments
        const recs = assessment.recommendations || [];
        const extractDays = (tf) => {
          const m = String(tf || '').match(/(\d+)/);
          return m ? parseInt(m[1], 10) : 999;
        };
        const priorityWeight = (p) => {
          const u = String(p || '').toUpperCase();
          if (u === 'CRITICAL' || u === 'CRÍTICA') return 0;
          if (u === 'HIGH' || u === 'ALTA') return 1;
          if (u === 'MEDIUM' || u === 'MÉDIA') return 2;
          if (u === 'LOW' || u === 'BAIXA') return 3;
          return 4;
        };
        const sorted = [...recs].sort((a, b) => {
          const wa = priorityWeight(a.priority), wb = priorityWeight(b.priority);
          if (wa !== wb) return wa - wb;
          return extractDays(a.timeframe) - extractDays(b.timeframe);
        });
        qw = []; str = [];
        for (const r of sorted) {
          const d = extractDays(r.timeframe);
          if (d <= 30 && qw.length < 5) qw.push(r);
          else if (d > 30 && str.length < 3) str.push(r);
        }
      }
      
      const priorityClass = {
        'CRÍTICA': 'priority-critical', 'CRITICAL': 'priority-critical',
        'ALTA': 'priority-high', 'HIGH': 'priority-high',
        'MÉDIA': 'priority-medium', 'MEDIUM': 'priority-medium',
        'BAIXA': 'priority-low', 'LOW': 'priority-low'
      };
      const badgeClass = {
        'CRÍTICA': 'badge-critical', 'CRITICAL': 'badge-critical',
        'ALTA': 'badge-high', 'HIGH': 'badge-high',
        'MÉDIA': 'badge-medium', 'MEDIUM': 'badge-medium',
        'BAIXA': 'badge-low', 'LOW': 'badge-low'
      };
      
      const renderRec = (rec) => `
        <div class="recommendation ${priorityClass[rec.priority] || ''}">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
            <h3 style="margin: 0;">${rec.title}</h3>
            <span class="badge ${badgeClass[rec.priority] || ''}">${rec.priority}</span>
          </div>
          ${rec.escalationReason ? `
            <div style="background: #fef3c7; border-left: 3px solid #f59e0b; padding: 0.5rem 0.75rem; margin-bottom: 0.75rem; border-radius: 4px; font-size: 0.8125rem; color: #78350f;">
              <strong>⚠️ ${language === 'pt' ? 'Severidade elevada' : 'Severity elevated'}:</strong>
              ${language === 'pt' 
                ? `dimensão de <strong>${rec.escalationReason.dimensionLabel}</strong> em Nível ${rec.escalationReason.dimensionLevel} (score ${rec.escalationReason.dimensionScore.toFixed(1)}) requer ação cirúrgica.`
                : `<strong>${rec.escalationReason.dimensionLabel}</strong> dimension at Level ${rec.escalationReason.dimensionLevel} (score ${rec.escalationReason.dimensionScore.toFixed(1)}) requires surgical action.`
              }
              ${rec.originalPriority ? `<span style="color: #92400e; opacity: 0.7; font-size: 0.75rem; margin-left: 0.5rem;">(${language === 'pt' ? 'prioridade original' : 'original priority'}: ${rec.originalPriority})</span>` : ''}
            </div>
          ` : ''}
          <p style="color: #4b5563; font-size: 0.875rem; margin-bottom: 0.75rem;">${rec.rationale}</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.875rem;">
            <div>
              <div style="color: #6b7280; font-weight: 500;">${language === 'pt' ? 'Responsável' : 'Owner'}</div>
              <div>${rec.owner}</div>
            </div>
            <div>
              <div style="color: #6b7280; font-weight: 500;">${language === 'pt' ? 'Prazo' : 'Timeframe'}</div>
              <div>${rec.timeframe}</div>
            </div>
            <div>
              <div style="color: #6b7280; font-weight: 500;">${language === 'pt' ? 'Resultado Esperado' : 'Expected Outcome'}</div>
              <div style="color: #059669; font-size: 0.8125rem;">${rec.expectedOutcome}</div>
            </div>
          </div>
        </div>
      `;
      
      let html = '';
      
      // Quick Wins block
      html += `
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 1rem 1.25rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <h3 style="color: #065f46; margin: 0 0 0.25rem 0; font-size: 1.125rem;">⚡ ${t.quickWins}</h3>
          <p style="color: #047857; font-size: 0.875rem; margin: 0;">${t.quickWinsSubtitle}</p>
        </div>
      `;
      if (qw.length > 0) {
        html += qw.map(renderRec).join('');
      } else {
        html += `<p style="color: #6b7280; font-style: italic; padding: 0.75rem; font-size: 0.875rem;">${t.noQuickWins}</p>`;
      }
      
      // Strategic Initiatives block
      html += `
        <div style="background: #eef2ff; border-left: 4px solid #6366f1; padding: 1rem 1.25rem; border-radius: 8px; margin: 2rem 0 1.5rem 0;">
          <h3 style="color: #3730a3; margin: 0 0 0.25rem 0; font-size: 1.125rem;">🏗️ ${t.strategicInitiatives}</h3>
          <p style="color: #4338ca; font-size: 0.875rem; margin: 0;">${t.strategicInitiativesSubtitle}</p>
        </div>
      `;
      if (str.length > 0) {
        html += str.map(renderRec).join('');
      } else {
        html += `<p style="color: #6b7280; font-style: italic; padding: 0.75rem; font-size: 0.875rem;">${t.noStrategic}</p>`;
      }
      
      return html;
    })()}
  </div>

  <div class="section" style="border: 2px solid #632CA6;">
    <h2 style="color: #632CA6; margin-top: 0;">${t.roadmapToNext}</h2>
    
    ${assessment.roadmap?.strategy ? (() => {
      const strategy = assessment.roadmap.strategy;
      const colors = {
        surgical: { bg: '#fef2f2', border: '#dc2626', text: '#7f1d1d', icon: '🎯' },
        calibration: { bg: '#fff7ed', border: '#f59e0b', text: '#78350f', icon: '⚖️' },
        elevation: { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a', icon: '📈' }
      }[strategy.type] || { bg: '#fff7ed', border: '#f59e0b', text: '#78350f', icon: '⚖️' };
      const labelByType = {
        surgical: language === 'pt' ? 'Abordagem Cirúrgica' : 'Surgical Approach',
        calibration: language === 'pt' ? 'Abordagem de Calibração' : 'Calibration Approach',
        elevation: language === 'pt' ? 'Abordagem de Elevação Geral' : 'General Elevation Approach'
      };
      // Convert **bold** markdown to <strong>
      const renderedMessage = strategy.message.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      return `
        <div style="background: ${colors.bg}; border-left: 4px solid ${colors.border}; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: ${colors.border}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
            ${colors.icon} ${labelByType[strategy.type]}
          </div>
          <p style="margin: 0; font-size: 0.9375rem; line-height: 1.6; color: ${colors.text};">
            ${renderedMessage}
          </p>
        </div>
      `;
    })() : ''}
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb;">
      <div>
        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">${t.currentLevel}</div>
        <div style="font-size: 1.25rem; font-weight: 600; color: #632CA6;">
          ${MATURITY_LEVELS[assessment.roadmap?.currentLevel ?? 0]?.label?.[language] || `Level ${assessment.roadmap?.currentLevel ?? 0}`}
        </div>
      </div>
      <div>
        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">${t.nextTarget}</div>
        <div style="font-size: 1.25rem; font-weight: 600; color: #059669;">
          ${MATURITY_LEVELS[assessment.roadmap?.nextLevel ?? 1]?.label?.[language] || `Level ${assessment.roadmap?.nextLevel ?? 1}`}
        </div>
      </div>
    </div>
    
    ${(assessment.roadmap?.blockers?.length || 0) > 0 ? `
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-weight: 600; color: #991b1b; margin-bottom: 0.5rem;">${t.mainBlockers}:</div>
        <ul style="color: #7f1d1d; font-size: 0.875rem;">
          ${(assessment.roadmap?.blockers || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${(assessment.roadmap?.phases || []).map(phase => `
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 1.25rem; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; margin-bottom: 0.75rem;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: #632CA6; color: white; font-weight: 700; margin-right: 0.75rem; font-size: 1.125rem;">
            ${phase.number}
          </span>
          <h4 style="margin: 0; font-size: 1.0625rem;">${phase.title}</h4>
        </div>
        <ul style="font-size: 0.875rem; color: #4b5563; margin: 0 0 1rem 3rem;">
          ${phase.actions.map(action => `<li>${action}</li>`).join('')}
        </ul>
        <div style="margin-left: 3rem; font-size: 0.875rem;">
          <div style="color: #059669; font-weight: 500; margin-bottom: 0.5rem;">
            <strong>${language === 'pt' ? 'Resultado esperado:' : 'Expected outcome:'}</strong> ${phase.outcome}
          </div>
          <div style="color: #6b7280; font-style: italic; line-height: 1.6;">
            <strong>${language === 'pt' ? 'Por que importa:' : 'Why it matters:'}</strong> ${phase.why}
          </div>
        </div>
      </div>
    `).join('')}
  </div>

  ${(assessment.roadmap?.milestones?.length || 0) > 0 ? `
    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem;">
      <div style="background: #f9fafb; padding: 1rem; border-bottom: 2px solid #e5e7eb;">
        <h3 style="margin: 0; font-size: 1.125rem;">${t.milestones}</h3>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 0.75rem; text-align: left; font-weight: 600; font-size: 0.875rem; color: #4b5563; border-bottom: 1px solid #e5e7eb;">
              ${language === 'pt' ? 'Métrica' : 'Metric'}
            </th>
            <th style="padding: 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; color: #4b5563; border-bottom: 1px solid #e5e7eb;">
              ${language === 'pt' ? 'Atual' : 'Current'}
            </th>
            <th style="padding: 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; color: #4b5563; border-bottom: 1px solid #e5e7eb;">
              ${language === 'pt' ? 'Meta' : 'Target'}
            </th>
            <th style="padding: 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; color: #4b5563; border-bottom: 1px solid #e5e7eb;">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          ${(assessment.roadmap?.milestones || []).map((m, idx) => `
            <tr style="${idx === (assessment.roadmap?.milestones?.length || 1) - 1 ? '' : 'border-bottom: 1px solid #e5e7eb;'}">
              <td style="padding: 0.75rem; font-weight: 500; color: #1f2937;">${m.metric}</td>
              <td style="padding: 0.75rem; text-align: center; color: #4b5563;">${m.current}</td>
              <td style="padding: 0.75rem; text-align: center; color: #059669; font-weight: 600;">${m.target}</td>
              <td style="padding: 0.75rem; text-align: center;">
                <span style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; font-weight: 600; color: white; background: ${m.critical ? '#dc2626' : '#f59e0b'};">
                  ${m.critical ? (language === 'pt' ? 'CRÍTICO' : 'CRITICAL') : (language === 'pt' ? 'ATENÇÃO' : 'ATTENTION')}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  ${assessment.trainings && assessment.trainings.length > 0 ? `
  <div class="section">
    <h2>${language === 'pt' ? 'Recomendações de Treinamento' : 'Training Recommendations'}</h2>
    
    <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.875rem; color: #1e40af; line-height: 1.6;">
      <strong>${language === 'pt' ? 'Baseado nos gaps identificados, os seguintes treinamentos podem acelerar a evolução de maturidade' : 'Based on identified gaps, the following trainings can accelerate maturity evolution'}:</strong>
      <div style="margin-top: 0.75rem;">
        <a href="https://learn.datadoghq.com/collections" target="_blank" style="color: #2563eb; font-weight: 600; margin-right: 1rem;">
          ${language === 'pt' ? 'Ver todos os cursos' : 'View all courses'} ↗
        </a>
        <a href="https://learn.datadoghq.com/pages/learning-paths" target="_blank" style="color: #2563eb; font-weight: 600;">
          Learning Paths ↗
        </a>
      </div>
    </div>
    
    ${assessment.trainings.map(training => `
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid ${training.priority === 'HIGH' ? '#f59e0b' : '#3b82f6'}; border-radius: 6px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.0625rem; color: #1f2937;">${training.dimension || training.title || 'Training'}</h3>
            <p style="margin: 0; font-size: 0.875rem; color: #6b7280; font-style: italic;">${training.reason || training.description || ''}</p>
          </div>
          <span style="background: ${training.priority === 'HIGH' ? '#f59e0b' : '#3b82f6'}; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
            ${training.priority || 'MEDIUM'}
          </span>
        </div>
        
        ${(Array.isArray(training.courses) ? training.courses : []).map(course => `
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 1rem; margin-bottom: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
              <a href="${course.url}" target="_blank" style="font-size: 1rem; font-weight: 600; color: #632CA6; text-decoration: none;">
                ${course.name} ↗
              </a>
              <span style="font-size: 0.75rem; color: #6b7280; background: #f9fafb; padding: 0.25rem 0.5rem; border-radius: 4px;">
                ${course.duration}
              </span>
            </div>
            <p style="margin: 0; font-size: 0.875rem; color: #4b5563; line-height: 1.5;">
              ${course.description}
            </p>
          </div>
        `).join('')}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${assessmentHistory && assessmentHistory.length > 0 ? `
  <div class="section" style="page-break-before: always;">
    <h2>${language === 'pt' ? 'Evolução da Maturidade' : 'Maturity Evolution'}</h2>
    
    <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.875rem; color: #1e40af;">
      <strong>${language === 'pt' ? '📊 Sobre esta seção:' : '📊 About this section:'}</strong> 
      ${language === 'pt'
        ? 'Esta seção mostra a evolução da maturidade ao longo do tempo, permitindo identificar tendências e medir progresso trimestral/semestral.'
        : 'This section shows maturity evolution over time, enabling trend identification and quarterly/semi-annual progress measurement.'}
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(${Math.min(assessmentHistory.length, 4)}, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
      ${assessmentHistory.slice(0, 4).map((h, idx) => {
        const dateObj = new Date(h.date);
        const prevAssessment = assessmentHistory[idx + 1];
        const improvement = prevAssessment ? (h.rawScore - prevAssessment.rawScore).toFixed(2) : null;
        return `
        <div style="background: white; border: 2px solid ${MATURITY_LEVELS[h.finalLevel].color}; border-radius: 8px; padding: 1rem; text-align: center;">
          <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem; text-transform: uppercase; font-weight: 600;">
            ${dateObj.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' })}
          </div>
          <div style="font-size: 2.5rem; font-weight: 700; color: ${MATURITY_LEVELS[h.finalLevel].color}; line-height: 1;">
            ${h.rawScore.toFixed(1)}
          </div>
          <div style="font-size: 0.875rem; color: #4b5563; margin: 0.5rem 0;">
            ${language === 'pt' ? 'Nível' : 'Level'} ${h.finalLevel}
          </div>
          ${improvement !== null && parseFloat(improvement) !== 0 ? `
            <div style="font-size: 0.8125rem; font-weight: 600; padding: 0.25rem 0.5rem; background: ${parseFloat(improvement) > 0 ? '#d1fae5' : '#fef2f2'}; color: ${parseFloat(improvement) > 0 ? '#059669' : '#dc2626'}; border-radius: 4px; margin-top: 0.5rem;">
              ${parseFloat(improvement) > 0 ? '+' : ''}${improvement}
            </div>
          ` : ''}
        </div>
      `}).join('')}
    </div>
    
    <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-top: 1rem;">
      <thead>
        <tr style="background: #f9fafb;">
          <th style="padding: 0.75rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb;">${language === 'pt' ? 'Data' : 'Date'}</th>
          <th style="padding: 0.75rem; text-align: center; font-size: 0.875rem; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb;">${language === 'pt' ? 'Nível' : 'Level'}</th>
          <th style="padding: 0.75rem; text-align: center; font-size: 0.875rem; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb;">Score</th>
          <th style="padding: 0.75rem; text-align: center; font-size: 0.875rem; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb;">${language === 'pt' ? 'Adoção' : 'Adoption'}</th>
          <th style="padding: 0.75rem; text-align: center; font-size: 0.875rem; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb;">${language === 'pt' ? 'Governança' : 'Governance'}</th>
          <th style="padding: 0.75rem; text-align: center; font-size: 0.875rem; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb;">${language === 'pt' ? 'Qualidade' : 'Quality'}</th>
          <th style="padding: 0.75rem; text-align: center; font-size: 0.875rem; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb;">${language === 'pt' ? 'Alertas' : 'Alerting'}</th>
          <th style="padding: 0.75rem; text-align: center; font-size: 0.875rem; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb;">${language === 'pt' ? 'Custo' : 'Cost'}</th>
          <th style="padding: 0.75rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #4b5563; border-bottom: 2px solid #e5e7eb; min-width: 180px;">
            ${language === 'pt' ? 'Qualificador' : 'Qualifier'}
            <span style="font-size: 0.6875rem; font-weight: 400; color: #6b7280; display: block; margin-top: 0.25rem;">
              ${language === 'pt' ? '(bloqueios aplicados)' : '(blockers applied)'}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        ${assessmentHistory.map((h, idx) => {
          const dateObj = new Date(h.date);
          // v38-fix1: Same defensive read as EvolutionChart.dimScore() —
          // some assessments store dimensions as numbers (legacy), others as objects (v3.2+).
          const dScore = (d) => {
            if (d === undefined || d === null) return 0;
            if (typeof d === 'number') return d;
            if (typeof d === 'object' && d.score !== undefined) return Number(d.score);
            return 0;
          };
          return `
          <tr style="${idx < assessmentHistory.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
            <td style="padding: 0.75rem; font-size: 0.875rem; color: #4b5563;">
              ${dateObj.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>
            <td style="padding: 0.75rem; text-align: center;">
              <span style="background: ${MATURITY_LEVELS[h.finalLevel].color}; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; font-weight: 600;">
                ${h.finalLevel}
              </span>
            </td>
            <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #1f2937; font-size: 0.9375rem;">${h.rawScore.toFixed(2)}</td>
            <td style="padding: 0.75rem; text-align: center; color: #4b5563; font-size: 0.875rem;">${dScore(h.dimensions.adoption).toFixed(1)}</td>
            <td style="padding: 0.75rem; text-align: center; color: #4b5563; font-size: 0.875rem;">${dScore(h.dimensions.governance).toFixed(1)}</td>
            <td style="padding: 0.75rem; text-align: center; color: #4b5563; font-size: 0.875rem;">${dScore(h.dimensions.quality).toFixed(1)}</td>
            <td style="padding: 0.75rem; text-align: center; color: #4b5563; font-size: 0.875rem;">${dScore(h.dimensions.alerting).toFixed(1)}</td>
            <td style="padding: 0.75rem; text-align: center; color: #4b5563; font-size: 0.875rem;">${dScore(h.dimensions.cost).toFixed(1)}</td>
            <td style="padding: 0.75rem; font-size: 0.8125rem;">
              ${h.qualifier ? `
                <div style="background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 0.5rem; border-radius: 4px; font-weight: 500; line-height: 1.4;">
                  ${h.qualifier}
                </div>
              ` : `
                <span style="color: #059669; font-weight: 500;">✓ ${language === 'pt' ? 'Nenhum bloqueio' : 'No blockers'}</span>
              `}
            </td>
          </tr>
        `}).join('')}
      </tbody>
    </table>
    
    ${assessmentHistory.length > 1 ? `
      <div style="margin-top: 1.5rem; padding: 1rem; background: #eff6ff; border: 1px solid #3b82f6; border-radius: 6px;">
        <div style="font-weight: 600; color: #1e40af; margin-bottom: 0.5rem; font-size: 0.9375rem;">
          ${language === 'pt' ? 'Evolução Total:' : 'Total Evolution:'}
        </div>
        ${(() => {
          const oldest = assessmentHistory[assessmentHistory.length - 1];
          const newest = assessmentHistory[0];
          const totalChange = (newest.rawScore - oldest.rawScore).toFixed(2);
          const monthsDiff = Math.round((new Date(newest.date) - new Date(oldest.date)) / (1000 * 60 * 60 * 24 * 30));
          return `
          <p style="color: #1e40af; font-size: 0.875rem; line-height: 1.6; margin: 0;">
            ${language === 'pt' 
              ? `Score evoluiu <strong>${parseFloat(totalChange) > 0 ? '+' : ''}${totalChange} pontos</strong> em ${monthsDiff} meses (de ${oldest.rawScore.toFixed(2)} para ${newest.rawScore.toFixed(2)})`
              : `Score evolved <strong>${parseFloat(totalChange) > 0 ? '+' : ''}${totalChange} points</strong> in ${monthsDiff} months (from ${oldest.rawScore.toFixed(2)} to ${newest.rawScore.toFixed(2)})`}
          </p>
          `;
        })()}
      </div>
    ` : ''}
  </div>
  ` : ''}

  <div class="section">
    <h2>📊 ${t.dimensions}</h2>
    ${Object.entries(assessment.dimensions).map(([key, dim]) => `
      <div style="background: #f9fafb; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0;">${t.dimension[key]}</h3>
          <span class="badge" style="background: ${MATURITY_LEVELS[dim.level].color};">
            ${language === 'pt' ? 'Nível' : 'Level'} ${dim.level}
          </span>
        </div>
        ${dim.signals && dim.signals.length > 0 ? `
          <div style="margin-bottom: 1rem;">
            <div style="font-size: 0.875rem; font-weight: 600; color: #059669; margin-bottom: 0.5rem;">
              ${language === 'pt' ? '✓ Forças' : '✓ Strengths'}
            </div>
            <ul style="color: #065f46; font-size: 0.875rem;">
              ${dim.signals.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${dim.issues && dim.issues.length > 0 ? `
          <div>
            <div style="font-size: 0.875rem; font-weight: 600; color: #dc2626; margin-bottom: 0.5rem;">
              ${language === 'pt' ? '⚠ Gaps' : '⚠ Gaps'}
            </div>
            <ul style="color: #991b1b; font-size: 0.875rem;">
              ${dim.issues.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
          <div class="docs-box">
            <div style="font-size: 0.875rem; font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;">
              📚 ${DATADOG_DOCS[key][language].title}
            </div>
            <ul style="font-size: 0.8125rem;">
              ${DATADOG_DOCS[key][language].links.map(link => `
                <li><a href="${link.url}" target="_blank">${link.label} ↗</a></li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>

  <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 0.875rem;">
    <p>${language === 'pt' ? 'Gerado em' : 'Generated on'} ${formattedDate}</p>
    <p style="margin-top: 0.5rem;">Datadog Observability Maturity Assessment - ${t.subtitle}</p>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Observability-Assessment-${(teamName || serviceName).replace(/\s+/g, '-')}-${accountId}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// MRR PDF Parser
// ============================================================================
// Parses the Historical MRR PDF (which is text-extractable) to detect:
// - Which products the customer has active
// - Monthly spend average
// Supports multiple MRR formats:
//   - Simple: "billing_dimension ... Usage ... Cost" format
//   - Complex: commit vs on-demand breakdown
//   - Tabular: "Cost Share" format with monthly columns
// ============================================================================

/**
 * List of all Datadog products/SKUs we track for maturity scoring.
 * Maps product names in MRR to their canonical names used in assessMaturity().
 */
const DATADOG_PRODUCTS_CATALOG = {
  // Core APM
  'apm_host': 'apm_host',
  'apm_host_pro': 'apm_host_pro',
  'apm_fargate': 'apm_fargate',
  'apm_trace_search': 'apm_trace_search',
  'ingested_spans': 'ingested_spans',
  // Infrastructure
  'infra_host': 'infra_host',
  'infra_container': 'infra_container',
  'infra_container_excl_agent': 'infra_container',
  'fargate_container': 'fargate_container',
  'fargate_container_profiler': 'fargate_container',
  // Logs
  'logs_ingested': 'logs_ingested',
  'logs_indexed_7day': 'logs_indexed_7day',
  'logs_indexed_15day': 'logs_indexed',
  'flex_stored_logs': 'logs_indexed',
  'flex_compute_logs_extra_large': 'logs_indexed',
  // RUM
  'rum_lite': 'rum_lite',
  'rum_replay': 'rum_replay',
  'rum_session_replay_add_on': 'rum_replay',
  'rum_ingested': 'rum_lite',
  'rum_investigate': 'rum_replay',
  // Synthetics
  'synthetics_api_tests': 'synthetics_api_tests',
  'synthetics_browser_checks': 'synthetics_browser_checks',
  'synthetics_browser_c..': 'synthetics_browser_checks',
  'synthetics_mobile_ap..': 'synthetics_mobile',
  'synthetics_mobile_app_testing': 'synthetics_mobile',
  // Serverless
  'serverless_apm': 'serverless_apm',
  'serverless_apps': 'serverless_apm',
  'serverless_apps_apm': 'serverless_apm',
  'serverless_infra': 'serverless_infra',
  'serverless_asm': 'serverless_asm',
  // Custom metrics
  'custom_event': 'custom_event',
  'timeseries': 'timeseries',
  'ingested_timeseries': 'ingested_timeseries',
  // Database
  'dbm_host': 'dbm_host',
  // Network
  'network_device': 'network_device',
  // CI/CD
  'ci_pipeline': 'ci_pipeline',
  'ci_pipeline_indexed_spans': 'ci_pipeline',
  'ci_test_indexed_spans': 'ci_testing',
  'ci_testing': 'ci_testing',
  // Security
  'application_security_h..': 'application_security_host',
  'application_security_fargate': 'application_security_host',
  'sensitive_data_scanner': 'sensitive_data_scanner',
  // Data products
  'data_stream_monitoring': 'data_stream_monitoring',
  'data_stream_monitori..': 'data_stream_monitoring',
  'data_jobs_monitoring..': 'data_jobs_monitoring',
  // AI/LLM
  'llm_observability': 'llm_observability',
  'llm_observability_min..': 'llm_observability',
  'llm_observability_min_spend': 'llm_observability',
  'bits_ai_investigations': 'bits_ai_investigations',
  // Workflow
  'workflow_execution': 'workflow_execution',
  // Incident/On-call
  'incident_management': 'incident_management',
  'incident_management..': 'incident_management',
  'on_call_seat': 'on_call',
  // Profiling
  'prof_host': 'profiling',
  'prof_container': 'profiling',
  // Other
  'audit_trail': 'audit_trail',
  'error_tracking': 'error_tracking',
  'observability_pipelines_plus': 'observability_pipelines',
  'iot': 'iot',
  'drawdown_min_spend': 'drawdown_min_spend',
};

/**
 * Extracts text content from a PDF File object using pdfjs-dist from CDN.
 * Returns the raw text as a string.
 */
async function extractTextFromPDF(file) {
  // Load pdfjs-dist from CDN if not already loaded
  if (typeof window.pdfjsLib === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // IMPORTANT: pdfjs may return text at different granularities:
    //   - Word-level items (pdfjs 5.x, macOS Preview PDFs): item.str = "Healthy monitors"
    //   - Glyph-level items (pdfjs 3.x CDN, some Quartz PDFs): item.str = "H", "e", "a", ...
    // 
    // Simply doing items.map(i => i.str).join(' ') produces broken text in the glyph case:
    //   "H e a l t h y   m o n i t o r s"
    // 
    // Fix: inspect transform[5] (Y coordinate) and transform[4] (X coordinate) to
    // detect adjacent glyphs on the same baseline. If two consecutive items are on
    // the same line and horizontally close, concatenate them without a space.
    // Use hasEOL as authoritative line-break signal when available.
    const items = textContent.items;
    let pageText = '';
    let prevY = null;
    let prevEndX = null;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const str = item.str;
      
      // Skip empty strings, but respect hasEOL (line break signal)
      if (item.hasEOL) {
        pageText += '\n';
        prevY = null;
        prevEndX = null;
        continue;
      }
      if (!str) continue;
      
      // Extract position from transform matrix [a, b, c, d, e, f]
      // e = X translation, f = Y translation
      const transform = item.transform || [0, 0, 0, 0, 0, 0];
      const x = transform[4];
      const y = transform[5];
      const width = item.width || 0;
      
      // Decide whether to add a space before this item.
      // Add space if:
      //   - This is the first item on a new line (different Y)
      //   - OR there's a horizontal gap between this item and the previous end
      // No space if:
      //   - Same Y (baseline) AND this X is close to previous end X (glyph continuation)
      if (prevY !== null && Math.abs(y - prevY) < 0.5) {
        // Same baseline — check horizontal proximity
        const gap = x - prevEndX;
        // If gap is smaller than a typical character width, likely glyph continuation
        if (gap < 2 && gap >= -0.5) {
          // Glyph continuation — no space
          pageText += str;
        } else {
          // Word boundary or wider gap — space separator
          pageText += ' ' + str;
        }
      } else {
        // Different line
        if (pageText.length > 0 && !pageText.endsWith('\n')) {
          pageText += ' ';
        }
        pageText += str;
      }
      
      prevY = y;
      prevEndX = x + width;
    }
    
    fullText += pageText + '\n';
  }
  
  return fullText;
}

/**
 * Parses the MRR PDF text and extracts product list + monthly spend.
 * Handles 3 known MRR formats.
 * 
 * Returns:
 *   {
 *     success: boolean,
 *     products: { [canonicalName]: true },
 *     productCount: number,
 *     avgMonthlySpend: number,
 *     rawDetectedProducts: string[],
 *     error: string | null
 *   }
 */
function parseMRRText(text) {
  const result = {
    success: false,
    products: {},
    productCount: 0,
    avgMonthlySpend: 0,
    rawDetectedProducts: [],
    error: null
  };
  
  if (!text || text.trim().length === 0) {
    result.error = 'PDF text is empty';
    return result;
  }
  
  // ---- Step 1: Detect products ----
  // Look for each known product name in the text
  const normalizedText = text.toLowerCase();
  const detectedRaw = new Set();
  const detectedCanonical = new Set();
  
  Object.entries(DATADOG_PRODUCTS_CATALOG).forEach(([rawName, canonicalName]) => {
    // Use word boundary or specific patterns to avoid false matches
    // e.g., "apm_host" shouldn't match "apm_host_pro"
    const searchPattern = rawName.toLowerCase();
    
    // For exact matches, look for the product name followed by whitespace/newline/number
    const regex = new RegExp(
      `\\b${searchPattern.replace(/\./g, '\\.').replace(/\s+/g, '\\s+')}(?=[\\s\\n]|$)`,
      'g'
    );
    
    if (regex.test(normalizedText)) {
      detectedRaw.add(rawName);
      detectedCanonical.add(canonicalName);
    }
  });
  
  // ---- Step 2: Extract monthly spend ----
  // Multiple strategies depending on MRR format:
  
  // Strategy A: Look for "Grand Total" followed by dollar amounts.
  // The pattern allows usage numbers (digits, commas, dots, whitespace) between
  // "Grand Total" and the actual $ values (some MRRs show "Usage | Cost" side-by-side).
  // Uses [\d,\s\.]* to allow ONLY numeric separators — not letters — so we don't
  // accidentally match table headers like "Billing Dimension Jan/26 Feb/26 Grand Total"
  // which would have words between "Grand Total" and the $ values.
  const grandTotalPattern = /grand\s+total\s+[\d,\s\.]*?(\$[\d,]+\.?\d{0,2}(?:\s+\$[\d,]+\.?\d{0,2}){2,})/i;
  const grandTotalMatch = text.match(grandTotalPattern);
  
  let monthlySpends = [];
  
  if (grandTotalMatch) {
    const amountsStr = grandTotalMatch[1];
    const amounts = amountsStr.match(/\$[\d,]+\.?\d{0,2}/g);
    if (amounts) {
      monthlySpends = amounts
        .map(a => parseFloat(a.replace(/[$,]/g, '')))
        .filter(n => !isNaN(n) && n > 0);
      
      // Some MRR formats include a cumulative "Grand Total" as the last value.
      // Detect and remove it: if the last value is approximately the sum of the others,
      // it's cumulative and should be excluded.
      if (monthlySpends.length >= 3) {
        const lastValue = monthlySpends[monthlySpends.length - 1];
        const restSum = monthlySpends.slice(0, -1).reduce((a, b) => a + b, 0);
        // If last value is within 5% of the sum of others, it's the cumulative total
        const ratio = restSum > 0 ? lastValue / restSum : 0;
        if (ratio > 0.95 && ratio < 1.05) {
          monthlySpends = monthlySpends.slice(0, -1);
          console.log('📄 [MRR PARSER] Detected and removed cumulative Grand Total');
        }
      }
    }
  }
  
  // Strategy B: Look for "Grand Total" followed by single large amount (cumulative)
  // Format: "Grand Total $X,XXX,XXX.XX" - this is the totalized sum
  if (monthlySpends.length === 0) {
    const cumulativeTotalPattern = /grand\s+total\s*\$?([\d,]+\.?\d{0,2})/i;
    const cumMatch = text.match(cumulativeTotalPattern);
    if (cumMatch) {
      const total = parseFloat(cumMatch[1].replace(/,/g, ''));
      if (!isNaN(total) && total > 0) {
        // Assume 3 months (typical in MRR reports)
        monthlySpends = [total / 3];
      }
    }
  }
  
  // Strategy C: Sum all individual product costs from the last "Cost" column
  // Look for patterns like "$X,XXX.XX" at end of lines
  if (monthlySpends.length === 0) {
    const allDollarAmounts = text.match(/\$[\d,]+\.\d{2}/g) || [];
    const validAmounts = allDollarAmounts
      .map(a => parseFloat(a.replace(/[$,]/g, '')))
      .filter(n => !isNaN(n) && n > 0);
    
    if (validAmounts.length > 0) {
      // Take the median as rough estimate
      validAmounts.sort((a, b) => a - b);
      const median = validAmounts[Math.floor(validAmounts.length / 2)];
      // Heuristic: if median is reasonable, multiply by a factor
      if (median > 10 && median < 1000000) {
        monthlySpends = [median * 20]; // rough estimate
      }
    }
  }
  
  // Calculate average monthly spend
  if (monthlySpends.length > 0) {
    const sum = monthlySpends.reduce((a, b) => a + b, 0);
    result.avgMonthlySpend = Math.round(sum / monthlySpends.length);
  }
  
  // ---- Step 3: Build products object ----
  detectedCanonical.forEach(productName => {
    result.products[productName] = true;
  });
  
  result.productCount = Object.keys(result.products).length;
  result.rawDetectedProducts = Array.from(detectedRaw).sort();
  result.success = result.productCount > 0;
  
  if (!result.success) {
    result.error = 'No Datadog products detected in the PDF. Ensure it is an MRR report.';
  }
  
  return result;
}

/**
 * Parses Monitor Quality PDF text and extracts the 8 key metrics.
 * 
 * Only works on PDFs with extractable text (e.g., saved via macOS Preview or
 * browser's Print-to-PDF). PDFs generated by jsPDF (Datadog's native Export button)
 * do NOT contain extractable text and will return { success: false }.
 * 
 * The patterns look for common Datadog phrases like:
 *   "N Healthy monitors"
 *   "N Monitors to improve"
 *   "N monitors are generating a high volume of alerts"
 *   etc.
 * 
 * Returns:
 *   {
 *     success: boolean,
 *     fields: { healthyMonitors, monitorsToImprove, ... },  // field -> number
 *     extractedCount: number,  // how many of the 8 fields were found
 *     error?: string
 *   }
 */
function parseMonitorQualityText(text) {
  const result = {
    success: false,
    fields: {},
    extractedCount: 0,
    error: null
  };
  
  if (!text || text.length < 50) {
    result.error = 'No extractable text in this PDF';
    return result;
  }
  
  // Safe number parse: '38,441' -> 38441, '1080' -> 1080
  const toNumber = (s) => {
    const cleaned = String(s).replace(/[,.]/g, '');
    const n = parseInt(cleaned, 10);
    return isNaN(n) ? null : n;
  };
  
  // Field -> regex pattern (case-insensitive, flexible whitespace).
  // Each pattern captures the number preceding the phrase.
  const patterns = {
    healthyMonitors: /([\d,]+)\s+Healthy\s+monitors/i,
    monitorsToImprove: /([\d,]+)\s+Monitors\s+to\s+improve/i,
    monitorsWithHighAlerts: /([\d,]+)\s+monitors\s+are\s+generating\s+a\s+high\s+volume/i,
    monitorsMissingRecipients: /([\d,]+)\s+monitors\s+have\s+missing\s+recipients/i,
    monitorsMissingDelay: /([\d,]+)\s+monitors\s+are\s+missing\s+a\s+delay/i,
    monitorsMuted60Days: /([\d,]+)\s+monitors\s+have\s+been\s+muted\s+for\s+more\s+than\s+60\s+days/i,
    monitorsMisconfiguredChannels: /([\d,]+)\s+monitors\s+have\s+misconfigured\s+notification\s+channels/i,
    monitorsInAlertOver7Days: /([\d,]+)\s+monitors\s+have\s+been\s+in\s+alert\s+for\s+more\s+than\s+7\s+days/i,
  };
  
  for (const [field, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      const num = toNumber(match[1]);
      if (num !== null) {
        result.fields[field] = num;
        result.extractedCount++;
      }
    }
  }
  
  // Consider successful if we got at least 4 of the 8 fields
  // (some clients may have dismissed issues, so not all sections appear)
  if (result.extractedCount >= 4) {
    result.success = true;
  } else {
    result.error = `Only ${result.extractedCount}/8 fields detected. PDF may be image-based (jsPDF export).`;
  }
  
  return result;
}

/**
 * Parses Platform Utilization PDF text and extracts 3 key metrics + bonuses.
 * 
 * STRATEGY: The browser's pdfjs extracts text in an unpredictable order, and
 * charts have both the big value AND axis labels in the stream. We locate each
 * metric by its TEXTUAL MARKER (section title), then parse numbers in the chunk
 * between markers. Observations from actual pdfjs output:
 * 
 *   "Time Spent In Platform  2.3 days  58.7 min   36 days Total & Concurrent..."
 *                            ^^^^^^^^  ^^^^^^^^   ^^^^^^^
 *                            min-axis  min-axis   big value (always largest)
 * 
 *   "Total & Concurrent Active Users  39  6   364 Concurrent Active Sessions..."
 *                                     ^^  ^   ^^^
 *                                     axis axis big value (largest reasonable)
 * 
 *   "AVG Usage / user  2.2 hr  0.06 hr   2 hr Time Spent in OTB..."
 *                      ^^^^^^  ^^^^^^^   ^^^^
 *                      max-ax  min-axis  big value (integer, no decimal)
 * 
 * For days and users: pick the LARGEST reasonable value in the chunk.
 * For hours: prefer the integer (no decimal) — Datadog displays big values
 * without decimals ("2 hr") while axis labels use decimals ("2.2 hr", "0.06 hr").
 * 
 * Returns:
 *   {
 *     success: boolean,
 *     fields: { timeSpentDays, totalActiveUsers, avgUsagePerUser, datadogSupportDays? },
 *     extractedCount: number,
 *     error?: string
 *   }
 */
function parsePlatformUtilizationText(text) {
  const result = {
    success: false,
    fields: {},
    extractedCount: 0,
    error: null
  };
  
  if (!text || text.length < 100) {
    result.error = 'No extractable text in this PDF';
    return result;
  }
  
  // 1. timeSpentDays: chunk between "Time Spent In Platform" and "Total & Concurrent"
  //    Pick the LARGEST value among "N days" occurrences (big number > axis labels).
  const timeChunkMatch = text.match(
    /Time\s+Spent\s+In\s+Platform([\s\S]+?)Total\s+&\s+Concurrent\s+Active\s+Users/
  );
  if (timeChunkMatch) {
    const chunk = timeChunkMatch[1];
    const dayValues = [...chunk.matchAll(/(\d+(?:\.\d+)?)\s*days?/gi)]
      .map(m => parseFloat(m[1]))
      .filter(n => n > 0 && n < 10000);
    if (dayValues.length > 0) {
      result.fields.timeSpentDays = Math.max(...dayValues);
      result.extractedCount++;
    }
  }
  
  // 2. totalActiveUsers: scan lines after "Total & Concurrent Active Users"
  //    and collect reasonable user-count integers (50-50000) until we hit a
  //    year (like "2026") or a chart axis sequence (0, 50, 100, 150, 200, 250).
  //    This handles both pdftotext -layout (single chunk) and browser's noisy
  //    multiline output.
  const labelIdx = text.indexOf('Total & Concurrent Active Users');
  if (labelIdx >= 0) {
    const startIdx = labelIdx + 'Total & Concurrent Active Users'.length;
    const chunkText = text.substring(startIdx, startIdx + 1500);
    const lines = chunkText.split('\n');
    const collected = [];
    for (let i = 0; i < Math.min(lines.length, 15); i++) {
      const line = lines[i].trim();
      if (!line) continue;
      // Stop at year (2000-2099) — marks chart X-axis
      if (/^\s*20\d{2}\b/.test(line)) break;
      // Stop at isolated axis-ticks typical of this chart (0, 50, 100, 150, 200, 250)
      if (/^\s*(?:0|50|100|150|200|250)\s*$/.test(line)) break;
      // Collect integers in reasonable range
      const nums = [...line.matchAll(/\b(\d+)\b/g)]
        .map(m => parseInt(m[1], 10))
        .filter(n => n >= 50 && n <= 50000);
      collected.push(...nums);
    }
    if (collected.length > 0) {
      result.fields.totalActiveUsers = Math.max(...collected);
      result.extractedCount++;
    }
  }
  
  // 3. avgUsagePerUser: chunk between "AVG Usage / user" and "Time Spent in OTB".
  //    Prefer integer values (big numbers like "2 hr") over decimals (axis labels
  //    like "2.2 hr", "0.06 hr").
  const usageChunkMatch = text.match(
    /AVG\s+Usage\s*\/\s*user([\s\S]+?)Time\s+Spent\s+in\s+OTB/
  );
  if (usageChunkMatch) {
    const chunk = usageChunkMatch[1];
    const hrMatches = [...chunk.matchAll(/(\d+(?:\.\d+)?)\s*hr\b/gi)];
    const hrValues = hrMatches.map(m => m[1]);
    // Prefer integers (no decimal point) — those are the big numbers
    const integers = hrValues.filter(v => !v.includes('.'));
    const pickedValue = integers.length > 0
      ? parseFloat(integers[0])
      : (hrValues.length > 0 ? Math.max(...hrValues.map(parseFloat)) : null);
    if (pickedValue !== null && pickedValue > 0 && pickedValue < 10000) {
      result.fields.avgUsagePerUser = pickedValue;
      result.extractedCount++;
    }
  }
  
  // Bonus: Datadog Support usage days
  const supportMatch = text.match(/(\d+(?:\.\d+)?)\s*days?\s+Datadog\s+Support/);
  if (supportMatch) {
    result.fields.datadogSupportDays = parseFloat(supportMatch[1]);
  }
  
  // Bonus: Agent Versions Count (NEW v27)
  // Counts distinct Datadog agent versions (X.YY.Z format starting with 6. or 7.)
  // appearing anywhere in the PDF. Datadog target is ≤4 distinct versions.
  // Found mostly in "Agent Updates over last month" section.
  const versionMatches = [...text.matchAll(/\b([67]\.\d+\.\d+)\b/g)]
    .map(m => m[1]);
  const uniqueVersions = new Set(versionMatches);
  if (uniqueVersions.size > 0) {
    result.fields.agentVersionsCount = uniqueVersions.size;
    // Note: NOT counted in extractedCount (bonus metric)
  }
  
  if (result.extractedCount >= 2) {
    result.success = true;
  } else {
    result.error = `Only ${result.extractedCount}/3 core fields detected. PDF may be image-based (jsPDF export).`;
  }
  
  return result;
}

/**
 * Parses Health Check Lite PDF text and extracts 9 key metrics + bonuses.
 * 
 * The Datadog Health Check has:
 *   - A top table with "Infra/APM AVG MIN MAX SUM VALUE" hosts data
 *   - Multiple "big number" percentage charts (Agent ratio, env tag, logs correlated, etc.)
 *   - Each big chart has the VALUE with space before %, ceiling/floor without space
 * 
 * Key disambiguation: "Percentage of Logs Correlated" appears TWICE in the PDF:
 *   1. In "Best Practices" text paragraph (no number)
 *   2. As the actual chart title (followed by the number)
 * So we use LAST match to get the chart occurrence.
 * 
 * Only works on PDFs with extractable text (macOS Preview / Print-to-PDF).
 * 
 * Returns:
 *   {
 *     success: boolean,
 *     fields: { infraHostsAvg, apmHostsAvg, agentImplementationRate, hostsWithEnvTag,
 *               percentageLogsCorrelated, ingestedLogsProcessedByPipeline,
 *               logsExcludedByExclusion, rumAsyncRequestEvents, rumSessionsWithUserID,
 *               k8sWithFullTags? },
 *     extractedCount: number,
 *     error?: string
 *   }
 */
function parseHealthCheckText(text) {
  const result = {
    success: false,
    fields: {},
    extractedCount: 0,
    error: null
  };
  
  if (!text || text.length < 200) {
    result.error = 'No extractable text in this PDF';
    return result;
  }
  
  // Helper: parse Datadog-style compact numbers ("26.1k" -> 26100, "1.59M" -> 1590000)
  const parseDatadogNumber = (s) => {
    if (!s) return null;
    s = s.trim();
    const multipliers = { k: 1000, M: 1000000, G: 1000000000, T: 1000000000000 };
    const lastChar = s.slice(-1);
    if (multipliers[lastChar]) {
      return parseFloat(s.slice(0, -1)) * multipliers[lastChar];
    }
    return parseFloat(s.replace(/,/g, ''));
  };
  
  // Helper: for big-number charts, uses LAST match of label to skip
  // best-practices text and lock onto the chart title, then extracts the
  // first "NN.NN %" pattern (with space before %).
  const parseBigPctLast = (labelPattern) => {
    const regex = new RegExp(labelPattern, 'gi');
    const matches = [...text.matchAll(regex)];
    if (matches.length === 0) return null;
    const lastMatch = matches[matches.length - 1];
    const startIdx = lastMatch.index + lastMatch[0].length;
    const chunk = text.substring(startIdx, startIdx + 800);
    // Primary: number with space before % (big value)
    let m = chunk.match(/(\d+(?:\.\d+)?)\s+%/);
    if (m) return parseFloat(m[1]);
    // Fallback: any number with %
    m = chunk.match(/(\d+(?:\.\d+)?)\s*%/);
    if (m) return parseFloat(m[1]);
    return null;
  };
  
  // --- 1. Infra Hosts AVG (from "Infra and APM Hosts last month" table) ---
  // Line like: "* Infra 26.1k hosts 24.5k hosts 29.0k hosts 1.59M hosts 25.4k hosts"
  // AVG is the first number.
  const infraMatch = text.match(/\*\s+Infra\s+([\d.]+[kMGT]?)\s+hosts/);
  if (infraMatch) {
    const val = parseDatadogNumber(infraMatch[1]);
    if (val !== null && !isNaN(val)) {
      result.fields.infraHostsAvg = val;
      result.extractedCount++;
    }
  }
  
  // --- 2. APM Hosts AVG (same table, second row) ---
  // Line: "* APM 9.16k 8.25k 10.3k 559k 8.38k" (no "hosts" suffix for APM row)
  const apmMatch = text.match(/\*\s+APM\s+([\d.]+[kMGT]?)\s/);
  if (apmMatch) {
    const val = parseDatadogNumber(apmMatch[1]);
    if (val !== null && !isNaN(val)) {
      result.fields.apmHostsAvg = val;
      result.extractedCount++;
    }
  }
  
  // --- 3-9. Big number percentage charts ---
  const charts = {
    agentImplementationRate: 'Agent\\s+instrumentation\\s+ratio\\s+last\\s+month',
    hostsWithEnvTag: 'Host\\s+agents\\s+with\\s+"?env"?\\s+tag',
    percentageLogsCorrelated: 'Percentage\\s+of\\s+Logs\\s+Correlated\\s+with\\s+APM\\s+Services',
    ingestedLogsProcessedByPipeline: 'Ingested\\s+logs\\s+proces+esed\\s+by\\s+pipeline',
    logsExcludedByExclusion: 'Log\\s+events\\s+excluded\\s+by\\s+exclusion\\s+f[il]+ters',
    rumAsyncRequestEvents: 'RUM\\s+async\\s+request\\s+events\\s+with\\s+APM\\s+traces',
    rumSessionsWithUserID: "RUM\\s+sessions\\s+with\\s+User\\s+ID"
  };
  
  for (const [field, pattern] of Object.entries(charts)) {
    const val = parseBigPctLast(pattern);
    if (val !== null && !isNaN(val)) {
      result.fields[field] = val;
      result.extractedCount++;
    }
  }
  
  // --- BONUS: K8s containers with full tags (not currently in manual form) ---
  const k8sVal = parseBigPctLast('K8s\\s+containers\\s+with\\s+Env');
  if (k8sVal !== null && !isNaN(k8sVal)) {
    result.fields.k8sWithFullTags = k8sVal;
    // Note: NOT counted in extractedCount (bonus metric)
  }
  
  // --- BONUS: APM Indexed Ratio (NEW v27) ---
  // From "Ratio of indexed to ingested spans" chart in Health Check.
  // Only present for customers on APM Pro plan with Allotment chart.
  //
  // Layout (Itaú example):
  //   Ratio of indexed to ingested spans  Past 1 Month 1mo
  //   ...chart axes...
  //   *  Ingested spans  25.8G spans  ...
  //   *  Indexed spans   133M items   ...
  //   *  Percentage      0.58         <-- WANT THIS (AVG)
  //
  // Customers without APM Pro have ONLY axis labels under "Ratio of indexed..."
  // and no Ingested/Indexed table rows. The downstream "Percentage of Logs
  // Correlated" can leak into our match, causing false positives.
  //
  // GUARD: Require BOTH "Ingested spans" AND "Indexed spans" inside the chunk
  // to confirm the actual APM Pro Allotment table is present.
  const indexedRatioChunk = text.match(
    /Ratio of indexed to ingested[\s\S]{0,2000}/
  );
  if (indexedRatioChunk) {
    const startIdx = indexedRatioChunk.index;
    const chunk = text.substring(startIdx, startIdx + 2000);
    // Validate that the actual table rows are present (not just axis labels)
    const hasTable = chunk.includes('Ingested spans') && chunk.includes('Indexed spans');
    if (hasTable) {
      // Match the Percentage row: "Percentage" then the first number (AVG)
      const pctMatch = chunk.match(/Percentage[^\d\n]*([\d.]+)/);
      if (pctMatch) {
        const irVal = parseFloat(pctMatch[1]);
        // Sanity check: indexedRatio is typically 0-100 (often < 5)
        if (!isNaN(irVal) && irVal >= 0 && irVal < 100) {
          result.fields.apmIndexedRatio = irVal;
          // Note: NOT counted in extractedCount (bonus, optional)
        }
      }
    }
  }
  
  // Consider successful if we got at least 5 of the 9 core fields
  // (some clients may not have RUM or may have no log correlation)
  if (result.extractedCount >= 5) {
    result.success = true;
  } else {
    result.error = `Only ${result.extractedCount}/9 fields detected. PDF may be image-based (jsPDF export).`;
  }
  
  return result;
}

// Main Component
function ObservabilityMaturityAssessment({ onBack, onNavigateToAdmin, initialLanguage }) {
  const [language, setLanguage] = useState(initialLanguage || null);
  const [serviceName, setServiceName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [businessOwner, setBusinessOwner] = useState('');
  const [technicalOwner, setTechnicalOwner] = useState('');
  const [teamName, setTeamName] = useState('');
  const [assessment, setAssessment] = useState(null);
  // v29: Keep input data + language used for assessment, for regeneration in another language
  const [assessmentInputData, setAssessmentInputData] = useState(null);
  const [assessmentLanguageUsed, setAssessmentLanguageUsed] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({
    healthCheck: null,
    historicalMRR: null,
    monitorQuality: null,
    platformUtilization: null
  });
  
  // State for manual form data (replaces automatic extraction for non-parseable PDFs)
  const [manualData, setManualData] = useState({
    // Health Check Lite (from visual PDF)
    infraHostsAvg: '',
    apmHostsAvg: '',
    agentImplementationRate: '',
    hostsWithEnvTag: '',
    percentageLogsCorrelated: '',
    ingestedLogsProcessedByPipeline: '',
    logsExcludedByExclusion: '',
    rumAsyncRequestEvents: '',
    rumSessionsWithUserID: '',
    // Monitor Quality (from visual PDF)
    healthyMonitors: '',
    monitorsToImprove: '',
    monitorsWithHighAlerts: '',
    monitorsMissingRecipients: '',
    monitorsMissingDelay: '',
    monitorsMuted60Days: '',
    monitorsMisconfiguredChannels: '',
    monitorsInAlertOver7Days: '',
    // Platform Utilization (from visual PDF)
    timeSpentDays: '',
    totalActiveUsers: '',
    avgUsagePerUser: '',
    // MRR is parsed automatically from uploaded PDF
    mrrParsed: null
  });
  
  // State to track MRR parsing status
  const [mrrParseStatus, setMrrParseStatus] = useState({
    parsing: false,
    success: false,
    error: null,
    detectedProducts: [],
    avgMonthlySpend: null
  });
  // Monitor Quality auto-parse status. Fields are populated into manualData
  // automatically when the PDF has extractable text (Print-to-PDF).
  const [monitorQualityParseStatus, setMonitorQualityParseStatus] = useState({
    parsing: false,
    success: false,
    error: null,
    extractedCount: 0,
    extractedFields: []
  });
  // Platform Utilization auto-parse status
  const [platformUtilizationParseStatus, setPlatformUtilizationParseStatus] = useState({
    parsing: false,
    success: false,
    error: null,
    extractedCount: 0,
    extractedFields: []
  });
  // Health Check auto-parse status
  const [healthCheckParseStatus, setHealthCheckParseStatus] = useState({
    parsing: false,
    success: false,
    error: null,
    extractedCount: 0,
    extractedFields: []
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    if (language) {
      const storageKey = `datadog-assessments-${accountId || 'default'}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const history = JSON.parse(stored);
          setAssessmentHistory(history);
        } catch (e) {
          console.error('Failed to load history:', e);
        }
      }
    }
  }, [language, accountId]);

  // Parse MRR PDF when uploaded (extracts products + spend automatically)
  const handleMRRUpload = useCallback(async (file) => {
    if (!file) return;
    
    setMrrParseStatus({
      parsing: true,
      success: false,
      error: null,
      detectedProducts: [],
      avgMonthlySpend: null
    });
    
    try {
      console.log('📄 [MRR PARSER] Starting extraction for:', file.name);
      const text = await extractTextFromPDF(file);
      console.log('📄 [MRR PARSER] Extracted text length:', text.length);
      console.log('📄 [MRR PARSER] First 500 chars:', text.substring(0, 500));
      
      const parsed = parseMRRText(text);
      console.log('📄 [MRR PARSER] Parse result:', parsed);
      
      if (parsed.success) {
        setMrrParseStatus({
          parsing: false,
          success: true,
          error: null,
          detectedProducts: parsed.rawDetectedProducts,
          avgMonthlySpend: parsed.avgMonthlySpend
        });
        
        // Save parsed data to manualData state
        setManualData(prev => ({
          ...prev,
          mrrParsed: {
            products: parsed.products,
            productCount: parsed.productCount,
            avgMonthlySpend: parsed.avgMonthlySpend
          }
        }));
      } else {
        setMrrParseStatus({
          parsing: false,
          success: false,
          error: parsed.error || 'Failed to parse MRR',
          detectedProducts: [],
          avgMonthlySpend: null
        });
      }
    } catch (err) {
      console.error('📄 [MRR PARSER] Error:', err);
      setMrrParseStatus({
        parsing: false,
        success: false,
        error: err.message || 'PDF extraction failed',
        detectedProducts: [],
        avgMonthlySpend: null
      });
    }
  }, []);

  /**
   * Attempts to parse Monitor Quality PDF automatically.
   * If PDF has extractable text (Print-to-PDF), auto-fills manualData fields.
   * If PDF is image-based (jsPDF), fails gracefully — user falls back to
   * manual entry with the 👁️ PDF preview helper.
   */
  const handleMonitorQualityUpload = useCallback(async (file) => {
    if (!file) return;
    
    setMonitorQualityParseStatus({
      parsing: true,
      success: false,
      error: null,
      extractedCount: 0,
      extractedFields: []
    });
    
    try {
      console.log('📋 [MQ PARSER] Starting extraction for:', file.name);
      const text = await extractTextFromPDF(file);
      console.log('📋 [MQ PARSER] Extracted text length:', text.length);
      console.log('📋 [MQ PARSER] First 800 chars:', text.substring(0, 800));
      
      const parsed = parseMonitorQualityText(text);
      console.log('📋 [MQ PARSER] Parse result:', JSON.stringify(parsed, null, 2));
      
      if (parsed.success) {
        // Auto-fill the manualData fields that were extracted
        setManualData(prev => {
          const updated = { ...prev };
          Object.entries(parsed.fields).forEach(([field, value]) => {
            // Only overwrite if empty or different (don't clobber user edits)
            if (!prev[field] || String(prev[field]) !== String(value)) {
              updated[field] = String(value);
            }
          });
          return updated;
        });
        
        setMonitorQualityParseStatus({
          parsing: false,
          success: true,
          error: null,
          extractedCount: parsed.extractedCount,
          extractedFields: Object.keys(parsed.fields)
        });
        
        console.log(`📋 [MQ PARSER] ✅ Auto-filled ${parsed.extractedCount} fields`);
      } else {
        setMonitorQualityParseStatus({
          parsing: false,
          success: false,
          error: parsed.error || 'Failed to parse Monitor Quality',
          extractedCount: parsed.extractedCount,
          extractedFields: []
        });
      }
    } catch (err) {
      console.error('📋 [MQ PARSER] Error:', err);
      setMonitorQualityParseStatus({
        parsing: false,
        success: false,
        error: err.message || 'PDF extraction failed',
        extractedCount: 0,
        extractedFields: []
      });
    }
  }, []);

  /**
   * Attempts to parse Platform Utilization PDF automatically.
   * Extracts timeSpentDays, totalActiveUsers, avgUsagePerUser (+ datadogSupportDays bonus).
   */
  const handlePlatformUtilizationUpload = useCallback(async (file) => {
    if (!file) return;
    
    setPlatformUtilizationParseStatus({
      parsing: true,
      success: false,
      error: null,
      extractedCount: 0,
      extractedFields: []
    });
    
    try {
      console.log('👥 [PU PARSER] Starting extraction for:', file.name);
      const text = await extractTextFromPDF(file);
      console.log('👥 [PU PARSER] Extracted text length:', text.length);
      console.log('👥 [PU PARSER] First 800 chars:', text.substring(0, 800));
      
      const parsed = parsePlatformUtilizationText(text);
      console.log('👥 [PU PARSER] Parse result:', JSON.stringify(parsed, null, 2));
      
      if (parsed.success) {
        setManualData(prev => {
          const updated = { ...prev };
          Object.entries(parsed.fields).forEach(([field, value]) => {
            // Only overwrite if empty or different (don't clobber user edits).
            // Also: datadogSupportDays is a bonus field not in manualData, skip it.
            if (field === 'datadogSupportDays') return;
            if (!prev[field] || String(prev[field]) !== String(value)) {
              updated[field] = String(value);
            }
          });
          return updated;
        });
        
        setPlatformUtilizationParseStatus({
          parsing: false,
          success: true,
          error: null,
          extractedCount: parsed.extractedCount,
          extractedFields: Object.keys(parsed.fields)
        });
        
        console.log(`👥 [PU PARSER] ✅ Auto-filled ${parsed.extractedCount} fields`);
      } else {
        setPlatformUtilizationParseStatus({
          parsing: false,
          success: false,
          error: parsed.error || 'Failed to parse Platform Utilization',
          extractedCount: parsed.extractedCount,
          extractedFields: []
        });
      }
    } catch (err) {
      console.error('👥 [PU PARSER] Error:', err);
      setPlatformUtilizationParseStatus({
        parsing: false,
        success: false,
        error: err.message || 'PDF extraction failed',
        extractedCount: 0,
        extractedFields: []
      });
    }
  }, []);

  /**
   * Attempts to parse Health Check Lite PDF automatically.
   * Extracts 9 core metrics (hosts, tags, logs, RUM) plus k8sWithFullTags bonus.
   */
  const handleHealthCheckUpload = useCallback(async (file) => {
    if (!file) return;
    
    setHealthCheckParseStatus({
      parsing: true,
      success: false,
      error: null,
      extractedCount: 0,
      extractedFields: []
    });
    
    try {
      console.log('🏥 [HC PARSER] Starting extraction for:', file.name);
      const text = await extractTextFromPDF(file);
      console.log('🏥 [HC PARSER] Extracted text length:', text.length);
      console.log('🏥 [HC PARSER] First 800 chars:', text.substring(0, 800));
      
      const parsed = parseHealthCheckText(text);
      console.log('🏥 [HC PARSER] Parse result:', JSON.stringify(parsed, null, 2));
      
      if (parsed.success) {
        setManualData(prev => {
          const updated = { ...prev };
          Object.entries(parsed.fields).forEach(([field, value]) => {
            // k8sWithFullTags is bonus, not in the manual form — skip.
            if (field === 'k8sWithFullTags') return;
            if (!prev[field] || String(prev[field]) !== String(value)) {
              updated[field] = String(value);
            }
          });
          return updated;
        });
        
        setHealthCheckParseStatus({
          parsing: false,
          success: true,
          error: null,
          extractedCount: parsed.extractedCount,
          extractedFields: Object.keys(parsed.fields)
        });
        
        console.log(`🏥 [HC PARSER] ✅ Auto-filled ${parsed.extractedCount} fields`);
      } else {
        setHealthCheckParseStatus({
          parsing: false,
          success: false,
          error: parsed.error || 'Failed to parse Health Check',
          extractedCount: parsed.extractedCount,
          extractedFields: []
        });
      }
    } catch (err) {
      console.error('🏥 [HC PARSER] Error:', err);
      setHealthCheckParseStatus({
        parsing: false,
        success: false,
        error: err.message || 'PDF extraction failed',
        extractedCount: 0,
        extractedFields: []
      });
    }
  }, []);

  // Single-slot file upload handler. Must be declared AFTER the parser handlers
  // above because it references them (JS temporal dead zone for const).
  const handleFileUpload = useCallback((files, fileType) => {
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`📂 [SINGLE UPLOAD] slot=${fileType} file=${file.name}`);
      
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
      
      setUploadStatus(language === 'pt' 
        ? `✅ ${file.name} carregado com sucesso`
        : `✅ ${file.name} uploaded successfully`);
      setTimeout(() => setUploadStatus(''), 3000);
      
      // Auto-parse based on file type
      if (fileType === 'historicalMRR') {
        console.log('  → triggering MRR parser');
        handleMRRUpload(file);
      } else if (fileType === 'monitorQuality') {
        console.log('  → triggering Monitor Quality parser');
        handleMonitorQualityUpload(file);
      } else if (fileType === 'platformUtilization') {
        console.log('  → triggering Platform Utilization parser');
        handlePlatformUtilizationUpload(file);
      } else if (fileType === 'healthCheck') {
        console.log('  → triggering Health Check parser');
        handleHealthCheckUpload(file);
      } else {
        console.warn('  ⚠️ No parser for fileType:', fileType);
      }
    }
  }, [language, handleMRRUpload, handleMonitorQualityUpload, handlePlatformUtilizationUpload, handleHealthCheckUpload]);

  const handleMultipleFilesSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    console.log('📂 [MULTI SELECT] Files received:', files.map(f => f.name));
    const newFiles = { ...uploadedFiles };
    let mrrFile = null;
    let monitorQualityFile = null;
    let platformUtilizationFile = null;
    let healthCheckFile = null;
    
    files.forEach(file => {
      const fileName = file.name.toLowerCase();
      if (fileName.includes('health') || fileName.includes('healh')) {
        console.log('  → classified as healthCheck:', file.name);
        newFiles.healthCheck = file;
        healthCheckFile = file;
      } else if (fileName.includes('mrr') || fileName.includes('historical')) {
        console.log('  → classified as historicalMRR:', file.name);
        newFiles.historicalMRR = file;
        mrrFile = file;
      } else if (fileName.includes('quality') || fileName.includes('monitor')) {
        console.log('  → classified as monitorQuality:', file.name);
        newFiles.monitorQuality = file;
        monitorQualityFile = file;
      } else if (fileName.includes('utilization') || fileName.includes('platform')) {
        console.log('  → classified as platformUtilization:', file.name);
        newFiles.platformUtilization = file;
        platformUtilizationFile = file;
      } else {
        console.warn('  ⚠️ UNCLASSIFIED file:', file.name);
      }
    });
    
    setUploadedFiles(newFiles);
    
    // Auto-parse all supported PDFs
    if (mrrFile) handleMRRUpload(mrrFile);
    if (monitorQualityFile) handleMonitorQualityUpload(monitorQualityFile);
    if (platformUtilizationFile) handlePlatformUtilizationUpload(platformUtilizationFile);
    if (healthCheckFile) handleHealthCheckUpload(healthCheckFile);
    
    const uploadedCount = Object.values(newFiles).filter(f => f !== null).length;
    setUploadStatus(language === 'pt'
      ? `✅ ${uploadedCount} arquivo(s) carregado(s)`
      : `✅ ${uploadedCount} file(s) uploaded`);
    setTimeout(() => setUploadStatus(''), 3000);
  }, [uploadedFiles, language, handleMRRUpload, handleMonitorQualityUpload, handlePlatformUtilizationUpload, handleHealthCheckUpload]);

  const handleMultiDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('📂 [MULTI DROP] Files received:', files.map(f => f.name));
    const newFiles = { ...uploadedFiles };
    let mrrFile = null;
    let monitorQualityFile = null;
    let platformUtilizationFile = null;
    let healthCheckFile = null;
    
    files.forEach(file => {
      const fileName = file.name.toLowerCase();
      if (fileName.includes('health') || fileName.includes('healh')) {
        console.log('  → classified as healthCheck:', file.name);
        newFiles.healthCheck = file;
        healthCheckFile = file;
      } else if (fileName.includes('mrr') || fileName.includes('historical')) {
        console.log('  → classified as historicalMRR:', file.name);
        newFiles.historicalMRR = file;
        mrrFile = file;
      } else if (fileName.includes('quality') || fileName.includes('monitor')) {
        console.log('  → classified as monitorQuality:', file.name);
        newFiles.monitorQuality = file;
        monitorQualityFile = file;
      } else if (fileName.includes('utilization') || fileName.includes('platform')) {
        console.log('  → classified as platformUtilization:', file.name);
        newFiles.platformUtilization = file;
        platformUtilizationFile = file;
      } else {
        console.warn('  ⚠️ UNCLASSIFIED file:', file.name);
      }
    });
    
    setUploadedFiles(newFiles);
    
    // Auto-parse all supported PDFs
    if (mrrFile) handleMRRUpload(mrrFile);
    if (monitorQualityFile) handleMonitorQualityUpload(monitorQualityFile);
    if (platformUtilizationFile) handlePlatformUtilizationUpload(platformUtilizationFile);
    if (healthCheckFile) handleHealthCheckUpload(healthCheckFile);
    
    const uploadedCount = Object.values(newFiles).filter(f => f !== null).length;
    setUploadStatus(language === 'pt'
      ? `✅ ${uploadedCount} arquivo(s) carregado(s)`
      : `✅ ${uploadedCount} file(s) uploaded`);
    setTimeout(() => setUploadStatus(''), 3000);
  }, [uploadedFiles, language, handleMRRUpload, handleMonitorQualityUpload, handlePlatformUtilizationUpload, handleHealthCheckUpload]);

  const handleDrop = useCallback((e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files, fileType);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e, fileType) => {
    handleFileUpload(e.target.files, fileType);
  }, [handleFileUpload]);

  const allFilesUploaded = uploadedFiles.healthCheck && 
                          uploadedFiles.historicalMRR && 
                          uploadedFiles.monitorQuality &&
                          uploadedFiles.platformUtilization;

  const handleCalculate = useCallback(() => {
    // Build real data object from manual form + parsed MRR
    const md = manualData;
    
    // Helper: parse number with fallback
    const num = (val, fallback = 0) => {
      if (val === '' || val === null || val === undefined) return fallback;
      const parsed = parseFloat(String(val).replace(',', '.'));
      return isNaN(parsed) ? fallback : parsed;
    };
    
    // Build dataToUse from real sources
    const dataToUse = {
      healthCheck: {
        infraHostsAvg: num(md.infraHostsAvg),
        apmHostsAvg: num(md.apmHostsAvg),
        agentImplementationRate: num(md.agentImplementationRate),
        hostsWithEnvTag: num(md.hostsWithEnvTag),
        percentageLogsCorrelated: num(md.percentageLogsCorrelated),
        ingestedLogsProcessedByPipeline: num(md.ingestedLogsProcessedByPipeline, 95),
        logsExcludedByExclusion: num(md.logsExcludedByExclusion),
        rumAsyncRequestEvents: num(md.rumAsyncRequestEvents),
        rumSessionsWithUserID: num(md.rumSessionsWithUserID),
        customMetricsCardinality: 'Medium', // Not extractable from form, default
        monitorsWithHighAlerts: num(md.monitorsWithHighAlerts),
        monitorsMissingRecipients: num(md.monitorsMissingRecipients),
        monitorsMissingDelay: num(md.monitorsMissingDelay),
        monitorsMuted60Days: num(md.monitorsMuted60Days),
        monitorsMisconfiguredChannels: num(md.monitorsMisconfiguredChannels),
        totalMonitors: num(md.healthyMonitors) + num(md.monitorsToImprove)
      },
      historicalMRR: md.mrrParsed || {
        products: {},
        productCount: 0,
        avgMonthlySpend: 0
      },
      monitorQuality: {
        healthyMonitors: num(md.healthyMonitors),
        monitorsToImprove: num(md.monitorsToImprove),
        qualityScore: (() => {
          const total = num(md.healthyMonitors) + num(md.monitorsToImprove);
          if (total === 0) return 0;
          return (num(md.healthyMonitors) / total) * 100;
        })()
      },
      platformUtilization: {
        timeSpentDays: num(md.timeSpentDays),
        totalActiveUsers: num(md.totalActiveUsers),
        concurrentActiveSessionsHours: num(md.avgUsagePerUser) / 10,
        avgUsagePerUser: num(md.avgUsagePerUser),
        customDashboardsRatio: 0.5, // Not extractable, sensible default
        topDashboardsTimeSpent: {},
        mostInteractedProducts: [],
        newApmUsers: 0,
        activeUsersByTime: 'unknown',
        ootbIntegrations: 'unknown'
      }
    };
    
    console.log('🧮 [CALCULATE] Using real data:', dataToUse);
    
    // v32: pass teamName/serviceName as customerName for personalized executive summary
    const customerNameForSummary = teamName || serviceName || null;
    const result = assessMaturity(dataToUse, language, customerNameForSummary);
    console.log('🧮 [CALCULATE] Assessment result:', result);
    setAssessment(result);
    // v29: Store input data + language for later regeneration in any language
    setAssessmentInputData(dataToUse);
    setAssessmentLanguageUsed(language);
    
    // Scroll to top when results are shown
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, [language, manualData, teamName, serviceName]);

  const handleSaveAssessment = useCallback(() => {
    if (!assessment || !accountId || !teamName) return;
    
    const newEntry = {
      // Core IDs
      id: Date.now(),
      assessmentId: `ASM-${Date.now()}`,
      customerId: accountId.split('-')[0] || accountId,
      accountId,
      
      // Metadata
      date: new Date().toISOString(),
      assessmentType: 'manual', // manual | quarterly | semi-annual | annual
      version: '3.2', // bumped from 3.1 - now includes full report data
      
      // Organization
      serviceName,
      teamName,
      businessOwner,
      technicalOwner,
      orgUnitType: 'area', // Can be enhanced with a selector
      
      // Results
      finalLevel: assessment.finalLevel,
      rawScore: assessment.rawScore,
      qualifier: assessment.qualifier,
      gatings: assessment.gatings,
      
      dimensions: {
        adoption: assessment.dimensions.adoption.score,
        governance: assessment.dimensions.governance.score,
        quality: assessment.dimensions.quality.score,
        alerting: assessment.dimensions.alerting.score,
        cost: assessment.dimensions.cost.score
      },
      
      // Full dimension details (signals, issues, rationale) - enables full report view
      dimensionsDetailed: {
        adoption: {
          score: assessment.dimensions.adoption.score,
          signals: assessment.dimensions.adoption.signals || [],
          issues: assessment.dimensions.adoption.issues || [],
          rationale: assessment.dimensions.adoption.rationale || ''
        },
        governance: {
          score: assessment.dimensions.governance.score,
          signals: assessment.dimensions.governance.signals || [],
          issues: assessment.dimensions.governance.issues || [],
          rationale: assessment.dimensions.governance.rationale || ''
        },
        quality: {
          score: assessment.dimensions.quality.score,
          signals: assessment.dimensions.quality.signals || [],
          issues: assessment.dimensions.quality.issues || [],
          rationale: assessment.dimensions.quality.rationale || ''
        },
        alerting: {
          score: assessment.dimensions.alerting.score,
          signals: assessment.dimensions.alerting.signals || [],
          issues: assessment.dimensions.alerting.issues || [],
          rationale: assessment.dimensions.alerting.rationale || ''
        },
        cost: {
          score: assessment.dimensions.cost.score,
          signals: assessment.dimensions.cost.signals || [],
          issues: assessment.dimensions.cost.issues || [],
          rationale: assessment.dimensions.cost.rationale || ''
        }
      },
      
      // Additional context for admin console
      insights: {
        strengthsCount: assessment.insights.strengths.length,
        risksCount: assessment.insights.risks.length,
        recommendationsCount: assessment.recommendations.length,
        // Full insight data (enables full report view)
        strengths: assessment.insights.strengths || [],
        risks: assessment.insights.risks || []
      },
      
      // Full recommendations list (enables full report view)
      recommendations: assessment.recommendations || [],
      
      // Full rationale (summary + what increased + what prevented)
      rationale: assessment.rationale || null,
      
      // Full roadmap to next level
      roadmap: assessment.roadmap || null,
      
      // Training recommendations
      trainings: assessment.trainings || [],
      
      // Flags
      hasBlockers: assessment.gatings.length > 0,
      needsAttention: assessment.finalLevel < 2 || assessment.gatings.length > 2,
      
      // NEW v29: Original input data + language for regeneration in any language
      // This enables exporting reports in PT or EN without losing detail
      assessmentLanguage: assessmentLanguageUsed || language,
      inputData: assessmentInputData
    };
    
    const storageKey = `datadog-assessments-${accountId}`;
    const updatedHistory = [newEntry, ...assessmentHistory].slice(0, 4);
    
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    setAssessmentHistory(updatedHistory);
    
    // Save to global index for admin console
    const globalIndexKey = 'datadog-global-assessment-index';
    const globalIndex = JSON.parse(localStorage.getItem(globalIndexKey) || '[]');
    globalIndex.unshift({
      assessmentId: newEntry.assessmentId,
      customerId: newEntry.customerId,
      accountId: newEntry.accountId,
      teamName: newEntry.teamName,
      date: newEntry.date,
      score: newEntry.rawScore,
      level: newEntry.finalLevel
    });
    localStorage.setItem(globalIndexKey, JSON.stringify(globalIndex.slice(0, 100)));
    
    setUploadStatus(language === 'pt'
      ? '✅ Assessment salvo com sucesso'
      : '✅ Assessment saved successfully');
    setTimeout(() => setUploadStatus(''), 3000);
  }, [assessment, accountId, teamName, businessOwner, technicalOwner, serviceName, assessmentHistory, language, assessmentInputData, assessmentLanguageUsed]);

  const handleReset = useCallback(() => {
    setAssessment(null);
    setServiceName('');
    setAccountId('');
    setBusinessOwner('');
    setTechnicalOwner('');
    setTeamName('');
    setUploadedFiles({
      healthCheck: null,
      historicalMRR: null,
      monitorQuality: null,
      platformUtilization: null
    });
    setManualData({
      infraHostsAvg: '',
      apmHostsAvg: '',
      agentImplementationRate: '',
      hostsWithEnvTag: '',
      percentageLogsCorrelated: '',
      ingestedLogsProcessedByPipeline: '',
      logsExcludedByExclusion: '',
      rumAsyncRequestEvents: '',
      rumSessionsWithUserID: '',
      healthyMonitors: '',
      monitorsToImprove: '',
      monitorsWithHighAlerts: '',
      monitorsMissingRecipients: '',
      monitorsMissingDelay: '',
      monitorsMuted60Days: '',
      monitorsMisconfiguredChannels: '',
      monitorsInAlertOver7Days: '',
      timeSpentDays: '',
      totalActiveUsers: '',
      avgUsagePerUser: '',
      mrrParsed: null
    });
    setMrrParseStatus({
      parsing: false,
      success: false,
      error: null,
      detectedProducts: [],
      avgMonthlySpend: null
    });
    setUploadStatus('');
    setLanguage(null);
  }, []);

  const t = language ? TRANSLATIONS[language] : TRANSLATIONS.pt;

  if (!language) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f3f4f6',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '3rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <DatadogLogo />
            <h1 style={{ margin: '1.5rem 0 0.5rem 0', fontSize: '1.75rem', color: '#1f2937' }}>
              Observability Maturity Assessment
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Framework Oficial Datadog
            </p>
          </div>
          
          <h2 style={{ fontSize: '1.25rem', color: '#1f2937', marginBottom: '1rem' }}>
            Select Assessment Language / Selecione o Idioma
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <button
              onClick={() => setLanguage('pt')}
              style={{
                padding: '1.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                border: '2px solid #667eea',
                borderRadius: '8px',
                background: 'white',
                color: '#667eea',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#632CA6';
              }}
            >
              Português
            </button>
            
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '1.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                border: '2px solid #632CA6',
                borderRadius: '8px',
                background: 'white',
                color: '#632CA6',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#632CA6';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#632CA6';
              }}
            >
              English
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f4f6',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#632CA6',
          padding: '2rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700' }}>
                {t.title}
              </h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
                {t.subtitle}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {onNavigateToAdmin && (
                <button
                  onClick={onNavigateToAdmin}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title={language === 'pt' ? 'Abrir Admin Console' : 'Open Admin Console'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3H10V10H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 3H21V10H14V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 14H21V21H14V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 14H10V21H3V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {language === 'pt' ? 'Console Admin' : 'Admin Console'}
                </button>
              )}
              <DatadogLogo />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {!assessment ? (
            <>
              {/* Multi-File Upload Section */}
              <div style={{
                background: '#f9fafb',
                padding: '2rem',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', color: '#1f2937' }}>
                  {language === 'pt' ? 'Upload de Arquivos' : 'File Upload'}
                </h2>
                
                <MultiFileUploadZone
                  uploadedFiles={uploadedFiles}
                  onFilesSelect={handleMultipleFilesSelect}
                  onDrop={handleMultiDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  isDragging={isDragging}
                  language={language}
                />
                
                {uploadStatus && (
                  <div style={{
                    background: '#d1fae5',
                    border: '1px solid #10b981',
                    borderRadius: '6px',
                    padding: '0.75rem 1rem',
                    color: '#065f46',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginTop: '1rem'
                  }}>
                    {uploadStatus}
                  </div>
                )}
                
                {!allFilesUploaded && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#991b1b',
                    marginTop: '1rem'
                  }}>
                    <strong>{language === 'pt' ? 'Atenção:' : 'Attention:'}</strong>{' '}
                    {language === 'pt'
                      ? 'Os quatro arquivos PDF são obrigatórios: Health Check Lite, Historical MRR, Monitor Quality e Platform Utilization.'
                      : 'All four PDF files are required: Health Check Lite, Historical MRR, Monitor Quality, and Platform Utilization.'}
                  </div>
                )}
                
                {/* MRR Parse Status Banner */}
                {mrrParseStatus.parsing && (
                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#1e40af',
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>⏳</span>
                    <span>
                      {language === 'pt'
                        ? 'Analisando Historical MRR... (pode demorar alguns segundos)'
                        : 'Analyzing Historical MRR... (may take a few seconds)'}
                    </span>
                  </div>
                )}
                
                {mrrParseStatus.success && (
                  <div style={{
                    background: '#d1fae5',
                    border: '1px solid #10b981',
                    borderRadius: '6px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#065f46',
                    marginTop: '1rem'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                      ✅ {language === 'pt' ? 'MRR analisado com sucesso' : 'MRR parsed successfully'}
                    </div>
                    <div style={{ fontSize: '0.8125rem' }}>
                      {language === 'pt' ? 'Produtos detectados:' : 'Products detected:'} <strong>{mrrParseStatus.detectedProducts.length}</strong>
                      {mrrParseStatus.avgMonthlySpend > 0 && (
                        <>
                          {' · '}
                          {language === 'pt' ? 'Spend médio mensal:' : 'Avg monthly spend:'} <strong>${mrrParseStatus.avgMonthlySpend.toLocaleString()}</strong>
                        </>
                      )}
                    </div>
                    <details style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                      <summary style={{ cursor: 'pointer', color: '#047857' }}>
                        {language === 'pt' ? 'Ver produtos detectados' : 'See detected products'}
                      </summary>
                      <div style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>
                        {mrrParseStatus.detectedProducts.join(', ')}
                      </div>
                    </details>
                  </div>
                )}
                
                {mrrParseStatus.error && (
                  <div style={{
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '6px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#92400e',
                    marginTop: '1rem'
                  }}>
                    <strong>⚠️ {language === 'pt' ? 'Atenção com MRR:' : 'MRR Warning:'}</strong>{' '}
                    {mrrParseStatus.error}
                  </div>
                )}
              </div>

              {/* Input Section */}
              <div style={{
                background: '#f9fafb',
                padding: '2rem',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', color: '#1f2937' }}>
                  {t.serviceInfo}
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem'
                }}>
                  <MemoizedInput
                    label={t.accountId}
                    value={accountId}
                    onChange={setAccountId}
                    placeholder=""
                  />
                  <MemoizedInput
                    label={t.teamName}
                    value={teamName}
                    onChange={setTeamName}
                    placeholder=""
                  />
                  <MemoizedInput
                    label={t.businessOwner}
                    value={businessOwner}
                    onChange={setBusinessOwner}
                    placeholder=""
                  />
                  <MemoizedInput
                    label={t.technicalOwner}
                    value={technicalOwner}
                    onChange={setTechnicalOwner}
                    placeholder=""
                  />
                </div>
              </div>

              {/* Manual Metrics Form */}
              <ManualMetricsForm 
                manualData={manualData}
                setManualData={setManualData}
                language={language}
                uploadedFiles={uploadedFiles}
                monitorQualityParseStatus={monitorQualityParseStatus}
                platformUtilizationParseStatus={platformUtilizationParseStatus}
                healthCheckParseStatus={healthCheckParseStatus}
              />

              {/* Calculate Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleCalculate}
                  disabled={!teamName || !accountId || !allFilesUploaded}
                  style={{
                    background: (!teamName || !accountId || !allFilesUploaded) 
                      ? '#9ca3af' 
                      : '#632CA6',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 3rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '8px',
                    cursor: (!teamName || !accountId || !allFilesUploaded) ? 'not-allowed' : 'pointer',
                    opacity: (!teamName || !accountId || !allFilesUploaded) ? 0.6 : 1
                  }}
                >
                  {t.calculate}
                </button>
                {(!teamName || !accountId || !allFilesUploaded) && (
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    color: '#dc2626'
                  }}>
                    {language === 'pt'
                      ? '⚠️ Preencha todos os campos e faça upload dos 4 arquivos PDF para continuar'
                      : '⚠️ Fill in all fields and upload all 4 PDF files to continue'}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <AssessmentResults 
                assessment={assessment}
                serviceName={serviceName}
                teamName={teamName}
                businessOwner={businessOwner}
                technicalOwner={technicalOwner}
                accountId={accountId}
                language={language}
                onReset={handleReset}
                assessmentHistory={assessmentHistory}
                onSaveAssessment={handleSaveAssessment}
                onAssessmentImported={(updated) => setAssessmentHistory(updated)}
                assessmentInputData={assessmentInputData}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Evolution Chart Component
const EvolutionChart = ({ history, currentAssessment, language }) => {
  const t = TRANSLATIONS[language];
  
  // v38-fix1: Extract numeric score regardless of whether the dimension is
  // a bare number (legacy assessments, pre-v3.2) or an object with `score`
  // (v3.2+). Without this, charting a recent assessment crashes with
  // React error #31 ("object with keys {score, signals, issues, level, rationale}
  // is not valid as a React child") because Recharts tries to render it directly.
  const dimScore = (d) => {
    if (d === undefined || d === null) return 0;
    if (typeof d === 'number') return d;
    if (typeof d === 'object' && d.score !== undefined) return Number(d.score);
    return 0;
  };
  
  if (!history || history.length === 0) {
    return (
      <div style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        {t.noHistory}
      </div>
    );
  }
  
  // Prepare data for line chart
  const evolutionData = [...history].reverse().map(h => ({
    date: new Date(h.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' }),
    overall: h.rawScore,
    adoption: dimScore(h.dimensions.adoption),
    governance: dimScore(h.dimensions.governance),
    quality: dimScore(h.dimensions.quality),
    alerting: dimScore(h.dimensions.alerting),
    cost: dimScore(h.dimensions.cost)
  }));
  
  // Add current if available
  if (currentAssessment) {
    evolutionData.push({
      date: language === 'pt' ? 'Atual' : 'Current',
      overall: currentAssessment.rawScore,
      adoption: dimScore(currentAssessment.dimensions.adoption),
      governance: dimScore(currentAssessment.dimensions.governance),
      quality: dimScore(currentAssessment.dimensions.quality),
      alerting: dimScore(currentAssessment.dimensions.alerting),
      cost: dimScore(currentAssessment.dimensions.cost)
    });
  }
  
  const latestPrevious = history[0];
  const improvement = currentAssessment 
    ? (currentAssessment.rawScore - latestPrevious.rawScore).toFixed(2)
    : 0;
  
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937' }}>
          {t.evolutionHistory}
        </h2>
        {currentAssessment && parseFloat(improvement) !== 0 && (
          <div style={{
            background: parseFloat(improvement) > 0 ? '#d1fae5' : '#fef2f2',
            border: `1px solid ${parseFloat(improvement) > 0 ? '#10b981' : '#fecaca'}`,
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: parseFloat(improvement) > 0 ? '#059669' : '#dc2626'
          }}>
            {parseFloat(improvement) > 0 ? '+' : ''}{improvement} {language === 'pt' ? 'desde último assessment' : 'since last assessment'}
          </div>
        )}
      </div>
      
      {/* Evolution Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={evolutionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#4b5563' }}
          />
          <YAxis 
            domain={[0, 5]} 
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="overall" 
            stroke="#632CA6" 
            strokeWidth={3}
            name={language === 'pt' ? 'Score Geral' : 'Overall Score'}
          />
          <Line 
            type="monotone" 
            dataKey="adoption" 
            stroke="#4a1d7a" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name={language === 'pt' ? 'Adoção' : 'Adoption'}
          />
          <Line 
            type="monotone" 
            dataKey="governance" 
            stroke="#7c45b8" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name={language === 'pt' ? 'Governança' : 'Governance'}
          />
          <Line 
            type="monotone" 
            dataKey="quality" 
            stroke="#9560ca" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name={language === 'pt' ? 'Qualidade' : 'Quality'}
          />
          <Line 
            type="monotone" 
            dataKey="alerting" 
            stroke="#ae7bdc" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name={language === 'pt' ? 'Alertas' : 'Alerting'}
          />
          <Line 
            type="monotone" 
            dataKey="cost" 
            stroke="#c9a3e8" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name={language === 'pt' ? 'Custo' : 'Cost'}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Historical assessments table */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', color: '#1f2937', marginBottom: '0.75rem' }}>
          {t.historicalAssessments}
        </h3>
        
        {/* Explanation box */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #3b82f6',
          borderRadius: '6px',
          padding: '1rem',
          marginBottom: '1rem',
          fontSize: '0.8125rem',
          color: '#1e40af'
        }}>
          <strong>{language === 'pt' ? '💡 Sobre o Qualificador:' : '💡 About the Qualifier:'}</strong>{' '}
          {language === 'pt'
            ? 'Indica se o nível de maturidade foi bloqueado por gaps críticos. Quando vazio (✓ Nenhum bloqueio), significa que o nível foi atingido naturalmente sem limitadores.'
            : 'Indicates if the maturity level was blocked by critical gaps. When empty (✓ No blockers), it means the level was achieved naturally without limiters.'}
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                  {language === 'pt' ? 'Data' : 'Date'}
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                  {language === 'pt' ? 'Nível' : 'Level'}
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                  Score
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {language === 'pt' ? 'Qualificador' : 'Qualifier'}
                    <span 
                      title={language === 'pt' 
                        ? 'Indica se o nível foi bloqueado por algum gap crítico. "Nenhum bloqueio" significa que o nível foi atingido naturalmente sem limitadores.'
                        : 'Indicates if the level was blocked by a critical gap. "No blockers" means the level was achieved naturally without limiters.'}
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'help'
                      }}
                    >
                      ?
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={h.id} style={{ borderBottom: idx === history.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#4b5563' }}>
                    {new Date(h.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{
                      background: MATURITY_LEVELS[h.finalLevel].color,
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {h.finalLevel}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                    {h.rawScore.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                    {h.qualifier ? (
                      <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#991b1b',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8125rem',
                        fontWeight: '500',
                        lineHeight: '1.4'
                      }}>
                        {h.qualifier}
                      </div>
                    ) : (
                      <span style={{ 
                        color: '#059669', 
                        fontWeight: '500',
                        fontSize: '0.8125rem'
                      }}>
                        ✓ {language === 'pt' ? 'Nenhum bloqueio' : 'No blockers'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Results Component
// When viewMode=true, renders the report in "view-only" mode for display in the
// AssessmentReportModal. Hides Save/New/History buttons, shows Export + Close.
function AssessmentResults({ assessment, serviceName, teamName, businessOwner, technicalOwner, accountId, language, onReset, assessmentHistory, onSaveAssessment, viewMode = false, onClose, onAssessmentImported, assessmentInputData = null }) {
  const t = TRANSLATIONS[language];
  const level = MATURITY_LEVELS[assessment.finalLevel];
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  return (
    <>
      {/* v32: Executive Summary — Principal CSM tone, 3 personalized paragraphs */}
      {assessment.executiveSummary && assessment.executiveSummary.paragraphs && assessment.executiveSummary.paragraphs.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%)',
          border: '2px solid #632CA6',
          borderLeft: '6px solid #632CA6',
          borderRadius: '12px',
          padding: '1.75rem 2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            fontSize: '0.75rem', 
            textTransform: 'uppercase', 
            fontWeight: '700', 
            color: '#632CA6', 
            letterSpacing: '0.08em',
            marginBottom: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📋 {t.executiveSummary}
          </div>
          {assessment.executiveSummary.paragraphs.map((para, idx) => (
            <p key={idx} style={{
              margin: idx === 0 ? '0 0 0.875rem 0' : '0.875rem 0',
              color: '#1f2937',
              fontSize: '0.9375rem',
              lineHeight: '1.65',
              fontWeight: idx === 0 ? '500' : '400'
            }}>
              {para}
            </p>
          ))}
        </div>
      )}
      
      {/* Maturity Card */}
      <div style={{
        background: `linear-gradient(135deg, ${level.color}22 0%, ${level.color}11 100%)`,
        border: `3px solid ${level.color}`,
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
          {t.maturityLevel}
        </div>
        <div style={{ fontSize: '3rem', fontWeight: '700', color: level.color, marginBottom: '0.5rem' }}>
          {level.label[language]}
        </div>
        {assessment.qualifier && (
          <div style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: '600', marginTop: '0.5rem' }}>
            ({assessment.qualifier})
          </div>
        )}
        <div style={{ fontSize: '1rem', color: '#4b5563', maxWidth: '800px', margin: '1rem auto 0' }}>
          {level.description[language]}
        </div>
        {assessment.gatings.length > 0 && (
          <div style={{
            background: '#fff7ed',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            padding: '1rem',
            marginTop: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
              {language === 'pt' ? '⚠️ Limitadores de Maturidade:' : '⚠️ Maturity Limiters:'}
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e', fontSize: '0.875rem' }}>
              {assessment.gatings.map((gate, idx) => (
                <li key={idx}>{gate}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Service Info - Moved to top */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            {t.accountId}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{accountId}</div>
        </div>
        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            {t.teamName}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{teamName}</div>
        </div>
        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            {t.businessOwner}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{businessOwner || '-'}</div>
        </div>
        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            {t.technicalOwner}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{technicalOwner || '-'}</div>
        </div>
      </div>

      {/* Maturity Rationale */}
      <div style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#1f2937' }}>
          {t.maturityRationale}
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
          {assessment.rationale.summary}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
              {t.whatIncreased}
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#065f46', fontSize: '0.875rem' }}>
              {assessment.rationale.increased.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
              {t.whatPrevented}
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#991b1b', fontSize: '0.875rem' }}>
              {assessment.rationale.prevented.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ marginBottom: '2rem' }}>
        {/* Top Row - Gauge and Radar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* Gauge Chart - Overall Score */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#4b5563', textAlign: 'center' }}>
              {language === 'pt' ? 'Score Geral' : 'Overall Score'}
            </h3>
            <GaugeChart score={assessment.rawScore} maxScore={5} color={level.color} />
            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              {assessment.rawScore.toFixed(2)} / 5.0
            </div>
          </div>

          {/* Radar Chart - 5 Dimensions */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#4b5563', textAlign: 'center' }}>
              {language === 'pt' ? 'Visão das 5 Dimensões' : '5 Dimensions Overview'}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={getRadarData(assessment.dimensions, language)}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fill: '#4b5563', fontSize: 11 }} 
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 5]} 
                  tick={{ fill: '#6b7280', fontSize: 10 }} 
                />
                <Radar
                  dataKey="score"
                  stroke="#632CA6"
                  fill="#632CA6"
                  fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Bar - Next Level */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#4b5563' }}>
            {language === 'pt' ? 'Progresso para o Próximo Nível' : 'Progress to Next Level'}
          </h3>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            {language === 'pt' 
              ? `Nível ${Math.floor(assessment.rawScore)} → Nível ${Math.floor(assessment.rawScore) + 1}`
              : `Level ${Math.floor(assessment.rawScore)} → Level ${Math.floor(assessment.rawScore) + 1}`}
          </div>
          <div style={{ 
            width: '100%', 
            background: '#e5e7eb', 
            borderRadius: '8px', 
            height: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((assessment.rawScore % 1) * 100)}%`,
              background: '#632CA6',
              height: '100%',
              borderRadius: '8px',
              transition: 'width 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '8px'
            }}>
              <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '600' }}>
                {((assessment.rawScore % 1) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              Score: {assessment.rawScore.toFixed(2)}
            </span>
            <span>
              {language === 'pt'
                ? `${((assessment.rawScore % 1) * 100).toFixed(0)}% de ${Math.floor(assessment.rawScore)}.0 para ${Math.floor(assessment.rawScore) + 1}.0`
                : `${((assessment.rawScore % 1) * 100).toFixed(0)}% from ${Math.floor(assessment.rawScore)}.0 to ${Math.floor(assessment.rawScore) + 1}.0`}
            </span>
          </div>
          <div style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            background: '#f9fafb',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#4b5563',
            fontStyle: 'italic'
          }}>
            {language === 'pt'
              ? `Nota: O progresso mostra quanto falta para atingir o próximo nível inteiro. Score ${assessment.rawScore.toFixed(2)} está ${((assessment.rawScore % 1) * 100).toFixed(0)}% do caminho de ${Math.floor(assessment.rawScore)}.0 para ${Math.floor(assessment.rawScore) + 1}.0`
              : `Note: Progress shows how far to the next whole level. Score ${assessment.rawScore.toFixed(2)} is ${((assessment.rawScore % 1) * 100).toFixed(0)}% of the way from ${Math.floor(assessment.rawScore)}.0 to ${Math.floor(assessment.rawScore) + 1}.0`}
          </div>
        </div>

        {/* Bottom Row - Bar Chart and Stacked Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem'
        }}>
          {/* Bar Chart - Levels by Dimension */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#4b5563', textAlign: 'center' }}>
              {language === 'pt' ? 'Níveis por Dimensão' : 'Levels by Dimension'}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getBarChartData(assessment.dimensions, language)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#4b5563' }} 
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="level" radius={[4, 4, 0, 0]}>
                  {getBarChartData(assessment.dimensions, language).map((entry, index) => {
                    const purpleShades = ['#4a1d7a', '#632CA6', '#7c45b8', '#9560ca', '#ae7bdc'];
                    return <Cell key={`cell-${index}`} fill={purpleShades[index]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stacked Bar - Strengths vs Gaps */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#4b5563', textAlign: 'center' }}>
              {language === 'pt' ? 'Forças vs Gaps por Dimensão' : 'Strengths vs Gaps by Dimension'}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getStrengthsVsGapsData(assessment.dimensions, language)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#4b5563' }} width={80} />
                <Tooltip />
                <Bar dataKey="strengths" stackId="a" fill="#632CA6" name={language === 'pt' ? 'Forças' : 'Strengths'} />
                <Bar dataKey="gaps" stackId="a" fill="#a98dd1" name={language === 'pt' ? 'Gaps' : 'Gaps'} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths and Risks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#059669' }}>
            {t.strengths}
          </h2>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#065f46', lineHeight: '1.8' }}>
            {assessment.insights.strengths.map((strength, idx) => (
              <li key={idx}>{strength}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#dc2626' }}>
            {t.risks}
          </h2>
          {assessment.insights.risks.map((risk, idx) => (
            <div key={idx} style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '1.25rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontWeight: '700', color: '#991b1b', marginBottom: '0.875rem', fontSize: '1rem' }}>
                {risk.observation}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #fecaca' }}>
                    <td style={{ padding: '0.5rem 0.625rem 0.5rem 0', verticalAlign: 'top', width: '120px', fontWeight: '600', color: '#7f1d1d', whiteSpace: 'nowrap' }}>
                      ⚠️ {language === 'pt' ? 'Risco' : 'Risk'}
                    </td>
                    <td style={{ padding: '0.5rem 0', color: '#7f1d1d', lineHeight: '1.5' }}>
                      {risk.interpretation}
                    </td>
                  </tr>
                  {risk.businessImpact && (
                    <tr style={{ borderBottom: '1px solid #fecaca' }}>
                      <td style={{ padding: '0.5rem 0.625rem 0.5rem 0', verticalAlign: 'top', fontWeight: '600', color: '#7f1d1d', whiteSpace: 'nowrap' }}>
                        💼 {language === 'pt' ? 'Impacto' : 'Impact'}
                      </td>
                      <td style={{ padding: '0.5rem 0', color: '#7f1d1d', lineHeight: '1.5' }}>
                        {risk.businessImpact}
                      </td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '1px solid #fecaca' }}>
                    <td style={{ padding: '0.5rem 0.625rem 0.5rem 0', verticalAlign: 'top', fontWeight: '600', color: '#7f1d1d', whiteSpace: 'nowrap' }}>
                      🔧 {language === 'pt' ? 'Operacional' : 'Operational'}
                    </td>
                    <td style={{ padding: '0.5rem 0', color: '#7f1d1d', lineHeight: '1.5' }}>
                      {risk.operationalRisk}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0.625rem 0.5rem 0', verticalAlign: 'top', fontWeight: '600', color: '#065f46', whiteSpace: 'nowrap' }}>
                      ✅ {language === 'pt' ? 'Resultado' : 'Outcome'}
                    </td>
                    <td style={{ padding: '0.5rem 0', color: '#065f46', fontWeight: '500', lineHeight: '1.5' }}>
                      {risk.recommendedAction}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations - v30: split into Quick Wins + Strategic Initiatives */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#1f2937' }}>
          {t.recommendations}
        </h2>
        
        {(() => {
          const priorityColors = {
            'CRÍTICA': '#dc2626', 'CRITICAL': '#dc2626',
            'ALTA': '#f59e0b', 'HIGH': '#f59e0b',
            'MÉDIA': '#3b82f6', 'MEDIUM': '#3b82f6',
            'BAIXA': '#10b981', 'LOW': '#10b981'
          };
          
          // Use classifiedRecommendations if available, fallback to inline classification
          let qw, strat;
          if (assessment.classifiedRecommendations) {
            qw = assessment.classifiedRecommendations.quickWins || [];
            strat = assessment.classifiedRecommendations.strategic || [];
          } else {
            const recs = assessment.recommendations || [];
            const extractDays = (tf) => {
              const m = String(tf || '').match(/(\d+)/);
              return m ? parseInt(m[1], 10) : 999;
            };
            const priorityWeight = (p) => {
              const u = String(p || '').toUpperCase();
              if (u === 'CRITICAL' || u === 'CRÍTICA') return 0;
              if (u === 'HIGH' || u === 'ALTA') return 1;
              if (u === 'MEDIUM' || u === 'MÉDIA') return 2;
              if (u === 'LOW' || u === 'BAIXA') return 3;
              return 4;
            };
            const sorted = [...recs].sort((a, b) => {
              const wa = priorityWeight(a.priority), wb = priorityWeight(b.priority);
              if (wa !== wb) return wa - wb;
              return extractDays(a.timeframe) - extractDays(b.timeframe);
            });
            qw = []; strat = [];
            for (const r of sorted) {
              const d = extractDays(r.timeframe);
              if (d <= 30 && qw.length < 5) qw.push(r);
              else if (d > 30 && strat.length < 3) strat.push(r);
            }
          }
          
          const renderRec = (rec, idx) => (
            <div key={idx} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderLeft: `4px solid ${priorityColors[rec.priority] || '#6b7280'}`,
              borderRadius: '6px',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#1f2937' }}>{rec.title}</h3>
                <span style={{
                  background: priorityColors[rec.priority] || '#6b7280',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {rec.priority}
                </span>
              </div>
              {rec.escalationReason && (
                <div style={{
                  background: '#fef3c7',
                  borderLeft: '3px solid #f59e0b',
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  color: '#78350f'
                }}>
                  <strong>⚠️ {language === 'pt' ? 'Severidade elevada' : 'Severity elevated'}:</strong>{' '}
                  {language === 'pt' ? (
                    <>
                      dimensão de <strong>{rec.escalationReason.dimensionLabel}</strong> em Nível {rec.escalationReason.dimensionLevel} (score {rec.escalationReason.dimensionScore.toFixed(1)}) requer ação cirúrgica.
                    </>
                  ) : (
                    <>
                      <strong>{rec.escalationReason.dimensionLabel}</strong> dimension at Level {rec.escalationReason.dimensionLevel} (score {rec.escalationReason.dimensionScore.toFixed(1)}) requires surgical action.
                    </>
                  )}
                  {rec.originalPriority && (
                    <span style={{ color: '#92400e', opacity: 0.7, fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                      ({language === 'pt' ? 'prioridade original' : 'original priority'}: {rec.originalPriority})
                    </span>
                  )}
                </div>
              )}
              <p style={{ margin: '0 0 0.75rem 0', color: '#4b5563', fontSize: '0.875rem' }}>{rec.rationale}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: '#6b7280', fontWeight: '500' }}>
                    {language === 'pt' ? 'Responsável' : 'Owner'}
                  </div>
                  <div style={{ color: '#1f2937' }}>{rec.owner}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontWeight: '500' }}>
                    {language === 'pt' ? 'Prazo' : 'Timeframe'}
                  </div>
                  <div style={{ color: '#1f2937' }}>{rec.timeframe}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontWeight: '500' }}>
                    {language === 'pt' ? 'Resultado Esperado' : 'Expected Outcome'}
                  </div>
                  <div style={{ color: '#059669', fontSize: '0.8125rem' }}>{rec.expectedOutcome}</div>
                </div>
              </div>
            </div>
          );
          
          return (
            <>
              {/* Quick Wins block */}
              <div style={{
                background: '#ecfdf5',
                borderLeft: '4px solid #10b981',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h3 style={{ color: '#065f46', margin: '0 0 0.25rem 0', fontSize: '1.125rem' }}>
                  ⚡ {t.quickWins}
                </h3>
                <p style={{ color: '#047857', fontSize: '0.875rem', margin: 0 }}>
                  {t.quickWinsSubtitle}
                </p>
              </div>
              <div style={{ display: 'grid', gap: '0' }}>
                {qw.length > 0 ? qw.map((rec, idx) => renderRec(rec, idx)) : (
                  <p style={{ color: '#6b7280', fontStyle: 'italic', padding: '0.75rem', fontSize: '0.875rem' }}>
                    {t.noQuickWins}
                  </p>
                )}
              </div>
              
              {/* Strategic Initiatives block */}
              <div style={{
                background: '#eef2ff',
                borderLeft: '4px solid #6366f1',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                margin: '2rem 0 1rem 0'
              }}>
                <h3 style={{ color: '#3730a3', margin: '0 0 0.25rem 0', fontSize: '1.125rem' }}>
                  🏗️ {t.strategicInitiatives}
                </h3>
                <p style={{ color: '#4338ca', fontSize: '0.875rem', margin: 0 }}>
                  {t.strategicInitiativesSubtitle}
                </p>
              </div>
              <div style={{ display: 'grid', gap: '0' }}>
                {strat.length > 0 ? strat.map((rec, idx) => renderRec(rec, idx + 100)) : (
                  <p style={{ color: '#6b7280', fontStyle: 'italic', padding: '0.75rem', fontSize: '0.875rem' }}>
                    {t.noStrategic}
                  </p>
                )}
              </div>
            </>
          );
        })()}
      </div>

      {/* Roadmap to Next Level */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#1f2937' }}>
          {t.roadmapToNext}
        </h2>
        
        {/* v37: Strategy header — varies by σ profile */}
        {assessment.roadmap.strategy && (() => {
          const strategy = assessment.roadmap.strategy;
          const strategyColors = {
            surgical: { bg: '#fef2f2', border: '#dc2626', text: '#7f1d1d', icon: '🎯' },
            calibration: { bg: '#fff7ed', border: '#f59e0b', text: '#78350f', icon: '⚖️' },
            elevation: { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a', icon: '📈' }
          };
          const colors = strategyColors[strategy.type] || strategyColors.calibration;
          const labelByType = {
            surgical: language === 'pt' ? 'Abordagem Cirúrgica' : 'Surgical Approach',
            calibration: language === 'pt' ? 'Abordagem de Calibração' : 'Calibration Approach',
            elevation: language === 'pt' ? 'Abordagem de Elevação Geral' : 'General Elevation Approach'
          };
          // Render markdown-style **bold** as <strong>
          const parts = strategy.message.split(/\*\*([^*]+)\*\*/);
          return (
            <div style={{
              background: colors.bg,
              borderLeft: `4px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: '700', 
                color: colors.border, 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                {colors.icon} {labelByType[strategy.type]}
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '0.9375rem', 
                lineHeight: '1.6', 
                color: colors.text 
              }}>
                {parts.map((part, idx) => 
                  idx % 2 === 1 
                    ? <strong key={idx}>{part}</strong> 
                    : part
                )}
              </p>
            </div>
          );
        })()}
        
        <div style={{
          background: 'white',
          border: '2px solid #632CA6',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                {t.currentLevel}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#632CA6' }}>
                {MATURITY_LEVELS[assessment.roadmap.currentLevel].label[language]}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                {t.nextTarget}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#059669' }}>
                {MATURITY_LEVELS[assessment.roadmap.nextLevel].label[language]}
              </div>
            </div>
          </div>
          
          {/* Main Blockers */}
          {assessment.roadmap.blockers.length > 0 && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontWeight: '600', color: '#991b1b', marginBottom: '0.5rem' }}>
                {t.mainBlockers}:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#7f1d1d', fontSize: '0.875rem' }}>
                {assessment.roadmap.blockers.map((blocker, idx) => (
                  <li key={idx}>{blocker}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Phases */}
          {assessment.roadmap.phases.map((phase, idx) => (
            <div key={idx} style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '1.25rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{
                  display: 'inline-block',
                  width: '32px',
                  height: '32px',
                  lineHeight: '32px',
                  textAlign: 'center',
                  borderRadius: '50%',
                  background: '#632CA6',
                  color: 'white',
                  fontWeight: '700',
                  marginRight: '0.75rem'
                }}>
                  {phase.number}
                </span>
                <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                  {phase.title}
                </h4>
              </div>
              
              <ul style={{ margin: '0 0 0.75rem 0', paddingLeft: '3rem', fontSize: '0.875rem', color: '#4b5563' }}>
                {phase.actions.map((action, aidx) => (
                  <li key={aidx}>{action}</li>
                ))}
              </ul>
              
              <div style={{ marginLeft: '3rem', fontSize: '0.875rem' }}>
                <div style={{ color: '#059669', fontWeight: '500', marginBottom: '0.25rem' }}>
                  <strong>{language === 'pt' ? 'Resultado esperado:' : 'Expected outcome:'}</strong> {phase.outcome}
                </div>
                <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                  <strong>{language === 'pt' ? 'Por que importa:' : 'Why it matters:'}</strong> {phase.why}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Milestones */}
        {assessment.roadmap.milestones.length > 0 && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div style={{ background: '#f9fafb', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                {t.milestones}
              </h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    {language === 'pt' ? 'Métrica' : 'Metric'}
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>
                    {language === 'pt' ? 'Atual' : 'Current'}
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>
                    {language === 'pt' ? 'Meta' : 'Target'}
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>
                    {language === 'pt' ? 'Status' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessment.roadmap.milestones.map((milestone, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500', color: '#1f2937' }}>
                      {milestone.metric}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#4b5563' }}>
                      {milestone.current}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#059669', fontWeight: '600' }}>
                      {milestone.target}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span style={{
                        background: milestone.critical ? '#dc2626' : '#f59e0b',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {milestone.critical 
                          ? (language === 'pt' ? 'CRÍTICO' : 'CRITICAL')
                          : (language === 'pt' ? 'ATENÇÃO' : 'ATTENTION')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dimensions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#1f2937' }}>
          {t.dimensions}
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {Object.entries(assessment.dimensions).map(([key, dim]) => (
            <div key={key} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#1f2937' }}>
                  {t.dimension[key]}
                </h3>
                <span style={{
                  background: MATURITY_LEVELS[dim.level].color,
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  {language === 'pt' ? 'Nível' : 'Level'} {dim.level}
                </span>
              </div>
              {dim.signals && dim.signals.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
                    {language === 'pt' ? '✓ Forças' : '✓ Strengths'}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#065f46', fontSize: '0.875rem' }}>
                    {dim.signals.map((signal, idx) => (
                      <li key={idx}>{signal}</li>
                    ))}
                  </ul>
                </div>
              )}
              {dim.issues && dim.issues.length > 0 && (
                <>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
                      {language === 'pt' ? '⚠ Gaps' : '⚠ Gaps'}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#991b1b', fontSize: '0.875rem' }}>
                      {dim.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Documentation Links */}
                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #3b82f6',
                    borderRadius: '6px',
                    padding: '1rem',
                    marginTop: '1rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem' }}>
                      📚 {DATADOG_DOCS[key][language].title}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.8125rem' }}>
                      {DATADOG_DOCS[key][language].links.map((link, idx) => (
                        <li key={idx} style={{ marginBottom: '0.25rem' }}>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'none' }}
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                          >
                            {link.label} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Training Recommendations */}
      {assessment.trainings && assessment.trainings.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#1f2937' }}>
            {t.trainingRecommendations}
          </h2>
          
          <div style={{
            background: '#eff6ff',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            <strong>{t.trainingIntro}</strong>
            <div style={{ marginTop: '0.5rem' }}>
              <a 
                href="https://learn.datadoghq.com/collections" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600', marginRight: '1rem' }}
              >
                {t.allCourses} ↗
              </a>
              <a 
                href="https://learn.datadoghq.com/pages/learning-paths" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}
              >
                {t.learningPaths} ↗
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {assessment.trainings.map((training, idx) => (
              <div key={idx} style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderLeft: `4px solid ${training.priority === 'HIGH' ? '#f59e0b' : '#3b82f6'}`,
                borderRadius: '6px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: '#1f2937' }}>
                      {training.dimension}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                      {training.reason}
                    </p>
                  </div>
                  <span style={{
                    background: training.priority === 'HIGH' ? '#f59e0b' : '#3b82f6',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {training.priority}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {training.courses.map((course, cidx) => (
                    <div key={cidx} style={{
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <a 
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            fontSize: '1rem', 
                            fontWeight: '600', 
                            color: '#632CA6',
                            textDecoration: 'none'
                          }}
                        >
                          {course.name} ↗
                        </a>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: '#6b7280',
                          background: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb'
                        }}>
                          {course.duration}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>
                        {course.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evolution History */}
      {(assessmentHistory.length > 0 || showHistoryPanel) && (
        <EvolutionChart 
          history={assessmentHistory}
          currentAssessment={assessment}
          language={language}
        />
      )}

      {/* Actions */}
      {uploadStatus && (
        <div style={{
          textAlign: 'center',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          background: uploadStatus.startsWith('❌') ? '#fef2f2' : (uploadStatus.startsWith('⚠️') ? '#fffbeb' : '#f0fdf4'),
          border: `1px solid ${uploadStatus.startsWith('❌') ? '#fca5a5' : (uploadStatus.startsWith('⚠️') ? '#fcd34d' : '#86efac')}`,
          color: uploadStatus.startsWith('❌') ? '#991b1b' : (uploadStatus.startsWith('⚠️') ? '#92400e' : '#166534'),
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          {uploadStatus}
        </div>
      )}
      
      <div style={{ textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {!viewMode && (
          <button
            onClick={onSaveAssessment}
            style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {t.saveAssessment}
          </button>
        )}
        
        {!viewMode && (
          <button
            onClick={() => setShowHistoryPanel(!showHistoryPanel)}
            style={{
              background: assessmentHistory.length > 0 ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: assessmentHistory.length > 0 ? 'pointer' : 'not-allowed',
              opacity: assessmentHistory.length > 0 ? 1 : 0.6
            }}
            disabled={assessmentHistory.length === 0}
          >
            {t.viewHistory} ({assessmentHistory.length})
          </button>
        )}
        
        {/* Drive Sync: Export single assessment */}
        {!viewMode && assessment && (
          <button
            onClick={() => {
              if (!assessment) return;
              try {
                const fullAssessment = {
                  assessmentId: `${accountId || 'no-id'}-${Date.now()}`,
                  customerId: accountId,
                  accountId: accountId,
                  teamName: teamName || serviceName,
                  customerName: serviceName,
                  businessOwner,
                  technicalOwner,
                  date: new Date().toISOString(),
                  rawScore: assessment.rawScore,
                  finalLevel: assessment.finalLevel,
                  dimensions: assessment.dimensions,
                  gatings: assessment.gatings,
                  // Include the full assessment data for re-import
                  fullData: assessment
                };
                const result = exportAssessmentToFile(fullAssessment);
                setUploadStatus(language === 'pt'
                  ? `📤 ${result.filename} baixado. Suba para o Drive da equipe.`
                  : `📤 ${result.filename} downloaded. Upload to team Drive.`);
                setTimeout(() => setUploadStatus(''), 5000);
              } catch (err) {
                console.error('Export error:', err);
                setUploadStatus('❌ ' + err.message);
                setTimeout(() => setUploadStatus(''), 5000);
              }
            }}
            style={{
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            title={language === 'pt' 
              ? 'Baixa um arquivo JSON do assessment atual. Arraste para a pasta compartilhada do Drive.' 
              : 'Downloads a JSON file of the current assessment. Drag to the shared Drive folder.'}
          >
            📤 {t.exportToDrive}
          </button>
        )}
        
        {/* Drive Sync: Import from file */}
        {!viewMode && (
          <>
            <input
              type="file"
              id="drive-import-input"
              accept=".json,application/json"
              multiple
              style={{ display: 'none' }}
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;
                
                let totalImported = 0;
                let totalSkipped = 0;
                const allErrors = [];
                
                for (const file of files) {
                  try {
                    const result = await importAssessmentFromFile(file);
                    totalImported += result.imported;
                    totalSkipped += result.skipped;
                    allErrors.push(...result.errors);
                  } catch (err) {
                    allErrors.push(`${file.name}: ${err.message}`);
                  }
                }
                
                // Reload history if we imported into the current accountId
                if (totalImported > 0 && accountId && onAssessmentImported) {
                  const storageKey = `datadog-assessments-${accountId}`;
                  const updated = JSON.parse(localStorage.getItem(storageKey) || '[]');
                  onAssessmentImported(updated);
                }
                
                let msg;
                if (totalImported > 0 && allErrors.length === 0) {
                  msg = language === 'pt'
                    ? `✅ ${totalImported} assessment(s) importado(s)`
                    : `✅ ${totalImported} assessment(s) imported`;
                } else if (totalImported > 0) {
                  msg = language === 'pt'
                    ? `⚠️ ${totalImported} importado(s), ${allErrors.length} erro(s)`
                    : `⚠️ ${totalImported} imported, ${allErrors.length} error(s)`;
                  console.warn('Import errors:', allErrors);
                } else {
                  msg = language === 'pt'
                    ? `❌ Nenhum importado. ${allErrors.length} erro(s) - veja o console.`
                    : `❌ None imported. ${allErrors.length} error(s) - check console.`;
                  console.error('Import errors:', allErrors);
                }
                setUploadStatus(msg);
                setTimeout(() => setUploadStatus(''), 6000);
                
                // Reset input so the same file can be re-selected later
                e.target.value = '';
              }}
            />
            <button
              onClick={() => document.getElementById('drive-import-input').click()}
              style={{
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              title={language === 'pt'
                ? 'Importa um ou mais arquivos JSON de assessments baixados do Drive.'
                : 'Imports one or more assessment JSON files downloaded from Drive.'}
            >
              📥 {t.importFromDrive}
            </button>
          </>
        )}
        
        <button
          onClick={() => exportToHTML(assessment, serviceName, teamName, businessOwner, technicalOwner, accountId, language, assessmentHistory, assessmentInputData)}
          style={{
            background: '#632CA6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {t.exportReport}
        </button>
        
        {!viewMode && (
          <button
            onClick={onReset}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {t.newAssessment}
          </button>
        )}
        
        {viewMode && onClose && (
          <button
            onClick={onClose}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {language === 'pt' ? 'Fechar' : 'Close'}
          </button>
        )}
      </div>
    </>
  );
}


// =====================================================
// ADMIN CONSOLE COMPONENT
// =====================================================


// Admin Console for Datadog Maturity Assessment Platform
// Manages multiple customers, org units, and assessments

// Admin Console Translations
// =====================================================
// DRIVE SYNC - Export/Import for Google Drive sharing
// =====================================================
// 
// Strategy: instead of automatic cloud sync (blocked by CORS in this 
// environment), we let CSMs export assessments as JSON files that they 
// drag to a shared Google Drive folder. Other CSMs can import those 
// JSONs back into the app.
//
// Pros: zero infrastructure, zero authentication, works offline, 
// CSMs do what they already know (drag files in Drive).
//
// Cons: not real-time, manual sync step, last-write-wins conflicts.
// For an internal team of 5-10 CSMs, these tradeoffs are acceptable.
// =====================================================

/**
 * Sanitize a string for use as a filename (remove unsafe chars).
 */
function sanitizeFilename(s) {
  return String(s || '')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, '-')
    .substring(0, 80);
}

/**
 * Trigger a browser download of a string as a file.
 */
function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType || 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after a tick to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Build a friendly filename for a single assessment.
 * Example: "DMA-Serasa-B2C-700722-2026-04-27.json"
 */
function buildAssessmentFilename(assessment) {
  const name = sanitizeFilename(assessment.teamName || assessment.customerName || 'unnamed');
  const accountId = sanitizeFilename(assessment.accountId || 'no-id');
  const date = (assessment.date || new Date().toISOString()).substring(0, 10);
  return `DMA-${name}-${accountId}-${date}.json`;
}

/**
 * Export a single assessment to a downloadable JSON file.
 * The CSM then drags this file to the team's shared Drive folder.
 */
function exportAssessmentToFile(assessment) {
  const payload = {
    schema: 'datadog-maturity-assessment',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    assessment: assessment
  };
  const filename = buildAssessmentFilename(assessment);
  const content = JSON.stringify(payload, null, 2);
  downloadFile(filename, content, 'application/json');
  return { filename, size: content.length };
}

/**
 * Export ALL assessments from localStorage as a single bundle file.
 * Useful for periodic backups or migrations.
 */
function exportAllAssessmentsToFile() {
  const allAssessments = [];
  
  // Walk all localStorage keys for assessment data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('datadog-assessments-')) continue;
    
    try {
      const accountId = key.replace('datadog-assessments-', '');
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.forEach(a => {
        allAssessments.push({ ...a, _accountId: accountId });
      });
    } catch (err) {
      console.warn('Skipping malformed key:', key, err);
    }
  }
  
  const payload = {
    schema: 'datadog-maturity-assessment-bundle',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    count: allAssessments.length,
    assessments: allAssessments
  };
  
  const date = new Date().toISOString().substring(0, 10);
  const filename = `DMA-bundle-all-${date}.json`;
  const content = JSON.stringify(payload, null, 2);
  downloadFile(filename, content, 'application/json');
  return { filename, count: allAssessments.length, size: content.length };
}

/**
 * Read a File object from <input type="file"> and parse it as JSON.
 * Returns a Promise resolving to the parsed object.
 */
function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const parsed = JSON.parse(text);
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Invalid JSON in "${file.name}": ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
    reader.readAsText(file);
  });
}

/**
 * Import a single assessment file (or bundle) into localStorage.
 * Detects the schema and handles both formats.
 * 
 * Returns: { imported: number, skipped: number, errors: string[] }
 */
async function importAssessmentFromFile(file) {
  const result = { imported: 0, skipped: 0, errors: [] };
  
  let parsed;
  try {
    parsed = await readJsonFile(file);
  } catch (err) {
    result.errors.push(err.message);
    return result;
  }
  
  // Detect format
  if (parsed.schema === 'datadog-maturity-assessment-bundle' && Array.isArray(parsed.assessments)) {
    // Bundle: import each
    for (const a of parsed.assessments) {
      const accountId = a._accountId || a.accountId;
      if (!accountId) {
        result.skipped++;
        result.errors.push(`Assessment without accountId in bundle`);
        continue;
      }
      // Strip helper field
      const clean = { ...a };
      delete clean._accountId;
      addAssessmentToStorage(accountId, clean);
      result.imported++;
    }
  } else if (parsed.schema === 'datadog-maturity-assessment' && parsed.assessment) {
    // Single
    const a = parsed.assessment;
    if (!a.accountId) {
      result.errors.push('Assessment without accountId');
      result.skipped++;
    } else {
      addAssessmentToStorage(a.accountId, a);
      result.imported++;
    }
  } else if (parsed.assessmentId && parsed.accountId) {
    // Legacy: raw assessment object (no schema wrapper)
    addAssessmentToStorage(parsed.accountId, parsed);
    result.imported++;
  } else {
    result.errors.push(`Unrecognized format in "${file.name}". Expected DMA schema.`);
    result.skipped++;
  }
  
  return result;
}

/**
 * Insert/merge an assessment into localStorage at the right key.
 * Avoids duplicates by checking assessmentId.
 */
function addAssessmentToStorage(accountId, assessment) {
  const storageKey = `datadog-assessments-${accountId}`;
  const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  // Check duplicate by assessmentId
  const existingIdx = existing.findIndex(a => 
    String(a.assessmentId) === String(assessment.assessmentId)
  );
  
  if (existingIdx >= 0) {
    // Update in place
    existing[existingIdx] = assessment;
  } else {
    // Insert at front
    existing.unshift(assessment);
  }
  
  // Keep most recent 4 (same policy as save)
  const trimmed = existing.slice(0, 4);
  localStorage.setItem(storageKey, JSON.stringify(trimmed));
  
  // Update global index
  const globalIndexKey = 'datadog-global-assessment-index';
  const globalIndex = JSON.parse(localStorage.getItem(globalIndexKey) || '[]');
  
  const globalIdx = globalIndex.findIndex(g => 
    String(g.assessmentId) === String(assessment.assessmentId)
  );
  
  const indexEntry = {
    assessmentId: assessment.assessmentId,
    customerId: assessment.customerId,
    accountId: assessment.accountId,
    teamName: assessment.teamName,
    date: assessment.date,
    score: assessment.rawScore || assessment.score,
    level: assessment.finalLevel || assessment.level
  };
  
  if (globalIdx >= 0) {
    globalIndex[globalIdx] = indexEntry;
  } else {
    globalIndex.unshift(indexEntry);
  }
  
  localStorage.setItem(globalIndexKey, JSON.stringify(globalIndex.slice(0, 100)));
}

// =====================================================
// ASSESSMENT MANAGEMENT - Edit/Delete utilities
// =====================================================

/**
 * Delete a single assessment by its id (for a given accountId).
 * Updates both the per-customer storage and the global index.
 * 
 * ROBUST STRATEGY: If the assessment is not found in the specified accountId's
 * storage, this function will search ALL datadog-assessments-* keys in localStorage
 * to find and delete it. This handles cases where:
 * - The customer has multiple accountIds grouped together
 * - The accountId was changed/migrated
 * - There's any mismatch between the UI state and localStorage keys
 */
function deleteAssessmentFromStorage(accountId, assessmentId) {
  const assessmentIdStr = String(assessmentId);
  let foundAndDeleted = false;
  let foundInKey = null;
  
  try {
    // First, try the specific accountId (fast path)
    const primaryKey = `datadog-assessments-${accountId}`;
    const primaryData = localStorage.getItem(primaryKey);
    
    if (primaryData) {
      const history = JSON.parse(primaryData);
      const beforeLength = history.length;
      
      const updatedHistory = history.filter(a => {
        const aIdStr = a.id !== undefined ? String(a.id) : '';
        const aAssessmentIdStr = a.assessmentId !== undefined ? String(a.assessmentId) : '';
        return aIdStr !== assessmentIdStr && aAssessmentIdStr !== assessmentIdStr;
      });
      
      if (updatedHistory.length < beforeLength) {
        // Found and removed
        if (updatedHistory.length === 0) {
          localStorage.removeItem(primaryKey);
        } else {
          localStorage.setItem(primaryKey, JSON.stringify(updatedHistory));
        }
        foundAndDeleted = true;
        foundInKey = primaryKey;
      }
    }
    
    // FALLBACK: if not found in primary key, search ALL assessment keys
    if (!foundAndDeleted) {
      console.warn(`deleteAssessment: "${assessmentId}" not found in "${primaryKey}", searching all keys...`);
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith('datadog-assessments-')) continue;
        if (key === primaryKey) continue; // already tried
        
        try {
          const data = JSON.parse(localStorage.getItem(key) || '[]');
          const beforeLength = data.length;
          
          const updated = data.filter(a => {
            const aIdStr = a.id !== undefined ? String(a.id) : '';
            const aAssessmentIdStr = a.assessmentId !== undefined ? String(a.assessmentId) : '';
            return aIdStr !== assessmentIdStr && aAssessmentIdStr !== assessmentIdStr;
          });
          
          if (updated.length < beforeLength) {
            if (updated.length === 0) {
              localStorage.removeItem(key);
            } else {
              localStorage.setItem(key, JSON.stringify(updated));
            }
            foundAndDeleted = true;
            foundInKey = key;
            console.log(`✅ Found and deleted from fallback key: ${key}`);
            break;
          }
        } catch (e) {
          console.warn(`Failed to process key ${key}:`, e);
        }
      }
    }
    
    if (!foundAndDeleted) {
      console.warn(`deleteAssessment: assessmentId "${assessmentId}" not found in ANY storage key`);
      return false;
    }
    
    // Update global index (remove from there too)
    const globalIndexKey = 'datadog-global-assessment-index';
    const globalIndex = JSON.parse(localStorage.getItem(globalIndexKey) || '[]');
    const updatedIndex = globalIndex.filter(a => {
      const aIdStr = a.id !== undefined ? String(a.id) : '';
      const aAssessmentIdStr = a.assessmentId !== undefined ? String(a.assessmentId) : '';
      return aIdStr !== assessmentIdStr && aAssessmentIdStr !== assessmentIdStr;
    });
    localStorage.setItem(globalIndexKey, JSON.stringify(updatedIndex));
    
    console.log(`✅ Deleted assessment ${assessmentId} from ${foundInKey}`);
    return true;
  } catch (e) {
    console.error('Failed to delete assessment:', e);
    return false;
  }
}

/**
 * Delete ALL assessments for a given accountId or customerId.
 * Updates both per-customer storage and global index.
 * 
 * ROBUST STRATEGY: Searches all datadog-assessments-* keys and removes any where
 * an assessment matches the accountId OR customerId. Handles grouped customers
 * with multiple accountIds.
 */
function deleteAllAssessmentsForCustomer(accountId) {
  try {
    const primaryKey = `datadog-assessments-${accountId}`;
    let deletedCount = 0;
    
    // Step 1: Remove the direct key if exists
    if (localStorage.getItem(primaryKey) !== null) {
      localStorage.removeItem(primaryKey);
      deletedCount++;
      console.log(`✅ Removed storage key: ${primaryKey}`);
    }
    
    // Step 2: Scan ALL datadog-assessments-* keys and remove entries
    // that match this accountId or customerId (handles grouped customers)
    const keysToCheck = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('datadog-assessments-') && key !== primaryKey) {
        keysToCheck.push(key);
      }
    }
    
    keysToCheck.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = data.filter(a => 
          a.accountId !== accountId && 
          a.customerId !== accountId
        );
        
        if (filtered.length < data.length) {
          if (filtered.length === 0) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, JSON.stringify(filtered));
          }
          deletedCount += (data.length - filtered.length);
          console.log(`✅ Cleaned ${data.length - filtered.length} assessment(s) from ${key}`);
        }
      } catch (e) {
        console.warn(`Failed to process ${key}:`, e);
      }
    });
    
    // Step 3: Clean global index
    const globalIndexKey = 'datadog-global-assessment-index';
    const globalIndex = JSON.parse(localStorage.getItem(globalIndexKey) || '[]');
    const updatedIndex = globalIndex.filter(a => 
      a.accountId !== accountId && 
      a.customerId !== accountId
    );
    localStorage.setItem(globalIndexKey, JSON.stringify(updatedIndex));
    
    console.log(`✅ Total deleted: ${deletedCount} (for ${accountId})`);
    // Return true even if 0 deleted - caller may retry with other accountIds
    return true;
  } catch (e) {
    console.error('Failed to delete all assessments:', e);
    return false;
  }
}

/**
 * Rename an assessment's teamName.
 */
function renameAssessmentInStorage(accountId, assessmentId, newTeamName) {
  const storageKey = `datadog-assessments-${accountId}`;
  try {
    const rawData = localStorage.getItem(storageKey);
    if (!rawData) {
      console.warn(`renameAssessment: storage key "${storageKey}" not found`);
      return false;
    }
    
    const history = JSON.parse(rawData);
    const assessmentIdStr = String(assessmentId);
    let found = false;
    
    const updatedHistory = history.map(a => {
      const aIdStr = a.id !== undefined ? String(a.id) : '';
      const aAssessmentIdStr = a.assessmentId !== undefined ? String(a.assessmentId) : '';
      if (aIdStr === assessmentIdStr || aAssessmentIdStr === assessmentIdStr) {
        found = true;
        return { ...a, teamName: newTeamName };
      }
      return a;
    });
    
    if (!found) {
      console.warn(`renameAssessment: assessmentId "${assessmentId}" not found in "${storageKey}"`);
      return false;
    }
    
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    
    // Update global index too
    const globalIndexKey = 'datadog-global-assessment-index';
    const globalIndex = JSON.parse(localStorage.getItem(globalIndexKey) || '[]');
    const updatedIndex = globalIndex.map(a => {
      const aIdStr = a.id !== undefined ? String(a.id) : '';
      const aAssessmentIdStr = a.assessmentId !== undefined ? String(a.assessmentId) : '';
      if (aIdStr === assessmentIdStr || aAssessmentIdStr === assessmentIdStr) {
        return { ...a, teamName: newTeamName };
      }
      return a;
    });
    localStorage.setItem(globalIndexKey, JSON.stringify(updatedIndex));
    
    console.log(`✅ Renamed assessment ${assessmentId} to "${newTeamName}"`);
    return true;
  } catch (e) {
    console.error('Failed to rename assessment:', e);
    return false;
  }
}

/**
 * Rename ALL assessments for a customer at once (bulk customer rename).
 */
function renameAllAssessmentsForCustomer(accountId, newTeamName) {
  const storageKey = `datadog-assessments-${accountId}`;
  try {
    const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedHistory = history.map(a => ({ ...a, teamName: newTeamName }));
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    
    // Update global index
    const globalIndexKey = 'datadog-global-assessment-index';
    const globalIndex = JSON.parse(localStorage.getItem(globalIndexKey) || '[]');
    const updatedIndex = globalIndex.map(a => {
      if (a.accountId === accountId || a.customerId === accountId) {
        return { ...a, teamName: newTeamName };
      }
      return a;
    });
    localStorage.setItem(globalIndexKey, JSON.stringify(updatedIndex));
    
    return true;
  } catch (e) {
    console.error('Failed to rename customer:', e);
    return false;
  }
}

// =====================================================
// CSV EXPORT - Portfolio data export for QBRs, reports, analysis
// =====================================================
function exportPortfolioCSV(allAssessments, customerGroups, language) {
  if (!allAssessments || allAssessments.length === 0) {
    alert(language === 'pt' 
      ? 'Nenhum assessment disponível para exportar.' 
      : 'No assessments available to export.');
    return;
  }

  const labels = language === 'pt' ? {
    customerId: 'ID Cliente',
    teamName: 'Nome do Time/Área',
    accountId: 'Account ID',
    date: 'Data',
    businessOwner: 'Business Owner',
    technicalOwner: 'Technical Owner',
    finalLevel: 'Nível Final',
    rawScore: 'Score Raw',
    adoption: 'Adoção de Plataforma',
    governance: 'Governança Operacional',
    quality: 'Qualidade de Telemetria',
    alerting: 'Confiabilidade de Alertas',
    cost: 'Governança de Custo',
    hasBlockers: 'Tem Bloqueadores',
    needsAttention: 'Requer Atenção',
    qualifier: 'Qualificador',
    // Summary sheet
    summaryTitle: 'Resumo do Portfolio',
    totalCustomers: 'Total de Clientes',
    totalAssessments: 'Total de Assessments',
    avgScore: 'Score Médio',
    customersImproving: 'Clientes Melhorando',
    customersStable: 'Clientes Estáveis',
    customersAtRisk: 'Clientes em Risco',
    exportDate: 'Data do Export'
  } : {
    customerId: 'Customer ID',
    teamName: 'Team/Area Name',
    accountId: 'Account ID',
    date: 'Date',
    businessOwner: 'Business Owner',
    technicalOwner: 'Technical Owner',
    finalLevel: 'Final Level',
    rawScore: 'Raw Score',
    adoption: 'Platform Adoption',
    governance: 'Operational Governance',
    quality: 'Telemetry Quality',
    alerting: 'Alerting Reliability',
    cost: 'Cost Governance',
    hasBlockers: 'Has Blockers',
    needsAttention: 'Needs Attention',
    qualifier: 'Qualifier',
    // Summary sheet
    summaryTitle: 'Portfolio Summary',
    totalCustomers: 'Total Customers',
    totalAssessments: 'Total Assessments',
    avgScore: 'Average Score',
    customersImproving: 'Customers Improving',
    customersStable: 'Stable Customers',
    customersAtRisk: 'At-Risk Customers',
    exportDate: 'Export Date'
  };

  // Helper: Escape CSV fields (handle commas, quotes, newlines)
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes(';')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const locale = language === 'pt' ? 'pt-BR' : 'en-US';

  // ============ SECTION 1: SUMMARY ============
  const totalCustomers = customerGroups.length;
  const totalAssessments = allAssessments.length;
  const avgScore = allAssessments.reduce((s, a) => s + a.rawScore, 0) / totalAssessments;
  const improving = customerGroups.filter(c => c.trend > 0.1).length;
  const declining = customerGroups.filter(c => c.trend < -0.1).length;
  const stable = totalCustomers - improving - declining;

  const summaryRows = [
    [labels.summaryTitle],
    [],
    [labels.exportDate, new Date().toLocaleString(locale)],
    [labels.totalCustomers, totalCustomers],
    [labels.totalAssessments, totalAssessments],
    [labels.avgScore, avgScore.toFixed(2)],
    [labels.customersImproving, improving],
    [labels.customersStable, stable],
    [labels.customersAtRisk, declining],
    [],
    []
  ];

  // ============ SECTION 2: DETAILED ASSESSMENTS ============
  const detailHeaders = [
    labels.customerId,
    labels.teamName,
    labels.accountId,
    labels.date,
    labels.businessOwner,
    labels.technicalOwner,
    labels.finalLevel,
    labels.rawScore,
    labels.adoption,
    labels.governance,
    labels.quality,
    labels.alerting,
    labels.cost,
    labels.hasBlockers,
    labels.needsAttention,
    labels.qualifier
  ];

  const detailRows = allAssessments.map(a => {
    const dims = a.dimensions || {};
    // Get score from dimension object (handles different shapes)
    const getDimScore = (d) => {
      if (!d) return '';
      if (typeof d === 'number') return d.toFixed(2);
      if (d.score !== undefined) return Number(d.score).toFixed(2);
      if (d.level !== undefined) return Number(d.level).toFixed(2);
      return '';
    };

    return [
      a.customerId || '',
      a.teamName || '',
      a.accountId || '',
      a.date ? new Date(a.date).toLocaleDateString(locale) : '',
      a.businessOwner || '',
      a.technicalOwner || '',
      a.finalLevel ?? '',
      a.rawScore ? a.rawScore.toFixed(2) : '',
      getDimScore(dims.adoption),
      getDimScore(dims.governance),
      getDimScore(dims.quality),
      getDimScore(dims.alerting),
      getDimScore(dims.cost),
      a.hasBlockers ? (language === 'pt' ? 'Sim' : 'Yes') : (language === 'pt' ? 'Não' : 'No'),
      a.needsAttention ? (language === 'pt' ? 'Sim' : 'Yes') : (language === 'pt' ? 'Não' : 'No'),
      a.qualifier || ''
    ];
  });

  // ============ SECTION 3: CUSTOMER AGGREGATES ============
  const aggregateTitle = language === 'pt' ? 'Resumo por Cliente' : 'Per-Customer Summary';
  const aggregateHeaders = [
    labels.customerId,
    labels.teamName,
    language === 'pt' ? '# Assessments' : '# Assessments',
    labels.avgScore,
    language === 'pt' ? 'Tendência' : 'Trend',
    language === 'pt' ? 'Status' : 'Status'
  ];

  const aggregateRows = customerGroups.map(c => {
    let status;
    if (c.trend > 0.1) status = language === 'pt' ? 'Melhorando' : 'Improving';
    else if (c.trend < -0.1) status = language === 'pt' ? 'Em Risco' : 'At Risk';
    else status = language === 'pt' ? 'Estável' : 'Stable';

    return [
      c.customerId || '',
      c.latestAssessment?.teamName || '',
      c.assessmentCount || 0,
      c.avgScore ? c.avgScore.toFixed(2) : '',
      c.trend ? (c.trend > 0 ? '+' : '') + c.trend.toFixed(2) : '0.00',
      status
    ];
  });

  // ============ BUILD CSV ============
  const allRows = [
    ...summaryRows,
    [aggregateTitle],
    aggregateHeaders,
    ...aggregateRows,
    [],
    [],
    [language === 'pt' ? 'Detalhamento de Assessments' : 'Assessment Details'],
    detailHeaders,
    ...detailRows
  ];

  const csvContent = allRows
    .map(row => row.map(escapeCSV).join(','))
    .join('\n');

  // BOM for UTF-8 (Excel compatibility with accented characters)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = language === 'pt'
    ? `datadog-portfolio-${timestamp}.csv`
    : `datadog-portfolio-${timestamp}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const ADMIN_TRANSLATIONS = {
  pt: {
    headerTitle: 'Datadog Maturity Assessment Platform',
    headerSubtitle: 'Console Admin e Gestão de Portfólio',
    tabDashboard: '📊 Dashboard',
    tabCustomers: '👥 Clientes',
    tabPortfolio: '📈 Meu Portfolio',
    tabBenchmarks: '🎯 Benchmarks',
    tabHeatmap: '🔥 Heatmap',
    tabCompare: '⚖️ Comparar',
    // Dashboard
    noDataTitle: 'Nenhum dado disponível',
    noDataDesc: 'Comece criando assessments usando o Assessment Tool',
    dashboardTitle: 'Dashboard Geral',
    totalCustomers: 'Total de Clientes',
    avgScore: 'Score Médio',
    globalPortfolio: 'Portfólio global',
    improving: 'Melhorando',
    portfolioPercent: 'do portfólio',
    atRisk: 'Em Risco',
    needsAttention: 'Requer atenção',
    none: 'Nenhum',
    distributionTitle: 'Distribuição de Clientes por Nível',
    level: 'Nível',
    customer: 'cliente',
    customers: 'clientes',
    recentActivity: 'Atividade Recente',
    assessment: 'assessment',
    assessments: 'assessments',
    // Customers View
    customersCount: 'Clientes',
    searchCustomer: 'Buscar cliente...',
    exportSelected: 'Exportar Atual',
    exportAll: 'Exportar Tudo',
    importFiles: 'Importar do Drive',
    selectCustomerFirst: 'Selecione um cliente para exportar',
    portfolioExported: 'Portfolio exportado',
    nothingToExport: 'Nenhum cliente para exportar',
    sortByScore: 'Ordenar por Score',
    sortByTrend: 'Ordenar por Tendência',
    sortByCount: 'Ordenar por # Assessments',
    account: 'Conta',
    unit: 'unidade',
    units: 'unidades',
    business: 'Negócio',
    technical: 'Técnico',
    // Portfolio View
    myPortfolio: 'Meu Portfolio',
    stable: 'Estáveis',
    attentionNeeded: '⚠️ Atenção Necessária',
    scoreDecreasing: 'Score decrescente',
    lastPeriod: 'no último período',
    createActionPlan: 'Criar Plano de Ação',
    topPerformers: '🏆 Top Performers',
    unitsAssessed: 'unidades avaliadas',
    // Benchmarks
    benchmarksTitle: 'Benchmarks e Análise Comparativa',
    insufficientData: 'Dados insuficientes para benchmark',
    average: 'Média',
    median: 'Mediana',
    bottomQuartile: 'Quartil inferior',
    topQuartile: 'Quartil superior',
    top10: 'Top 10%',
    maturityDistribution: 'Distribuição de Maturidade',
    percentileCalculator: 'Calculadora de Percentil',
    percentileDesc: 'Insira um score para ver onde ele se posiciona no benchmark',
    example: 'Exemplo',
    percentile: 'Percentil',
    aboveOf: 'Acima de',
    of: 'de',
    // Modal
    close: 'Fechar',
    avgScoreLabel: 'Score médio',
    trend: 'Tendência',
    assessmentHistory: 'Histórico de Assessments',
    // Empty state
    noData: 'Sem dados',
    locale: 'pt-BR',
    // Cross-navigation
    goToAssessment: 'Novo Assessment',
    exportCSV: 'Exportar CSV',
    // Modal enhancements
    dimensionsTitle: 'Última Avaliação por Dimensão',
    evolutionTitle: 'Evolução do Score',
    noDimensionData: 'Dados de dimensões indisponíveis',
    // Heatmap view
    heatmapTitle: 'Heatmap de Dimensões',
    heatmapSubtitle: 'Identifique gaps sistêmicos — áreas onde múltiplos clientes apresentam baixa maturidade',
    heatmapLegend: 'Legenda: escala 0-5',
    dimAdoption: 'Adoção',
    dimGovernance: 'Governança',
    dimQuality: 'Qualidade',
    dimAlerting: 'Alertas',
    dimCost: 'Custo',
    noHeatmapData: 'Dados insuficientes para gerar o heatmap. Faça pelo menos um assessment com dimensões preenchidas.',
    sortByName: 'Nome',
    sortByAvg: 'Score Médio',
    sortByWorst: 'Pior Dimensão',
    sortBy: 'Ordenar por',
    avgColumn: 'Média',
    insightsTitle: 'Insights do Portfolio',
    weakestDimension: 'Dimensão mais fraca no portfólio',
    strongestDimension: 'Dimensão mais forte no portfólio',
    clientsBelowTarget: 'clientes abaixo de 3.0',
    // Compare view
    compareTitle: 'Análise Comparativa',
    compareSubtitle: 'Selecione 2 a 4 clientes para comparar lado a lado',
    selectCustomers: 'Selecionar clientes',
    selectedCount: 'selecionados',
    minSelection: 'Selecione pelo menos 2 clientes para comparar',
    maxSelection: 'Máximo de 4 clientes por comparação',
    clearSelection: 'Limpar seleção',
    comparisonRadar: 'Comparação por Dimensão',
    gapAnalysis: 'Análise de Gaps',
    bestIn: 'Melhor em',
    worstIn: 'Pior em',
    tied: 'Empatado',
    // Edit / Delete assessments
    renameCustomer: 'Renomear cliente',
    renameAssessment: 'Renomear assessment',
    deleteAssessment: 'Apagar assessment',
    deleteAllAssessments: 'Apagar todos os assessments',
    newTeamName: 'Novo nome do time/área',
    confirmDeleteAssessment: 'Tem certeza que deseja apagar este assessment? Esta ação não pode ser desfeita.',
    confirmDeleteAllAssessments: 'Tem certeza que deseja apagar TODOS os assessments deste cliente? Esta ação não pode ser desfeita.',
    assessmentDeleted: 'Assessment apagado',
    allAssessmentsDeleted: 'Todos os assessments apagados',
    customerRenamed: 'Cliente renomeado',
    // View Report modal
    viewReport: 'Ver relatório',
    reportTitle: 'Relatório do Assessment',
    finalLevel: 'Nível Final',
    rawScore: 'Score Bruto',
    blockers: 'Bloqueadores',
    qualifier: 'Qualificador',
    dimensionsRadar: 'Visão Geral das Dimensões',
    dimensionsDetail: 'Detalhamento por Dimensão',
    strengths: 'Forças',
    gaps: 'Gaps',
    recommendations: 'Recomendações',
    keyStrengths: 'Principais Forças',
    keyRisks: 'Principais Riscos',
    downloadHTML: 'Baixar HTML',
    legacyAssessment: 'Assessment antigo (dados limitados)',
    legacyAssessmentDesc: 'Este assessment foi salvo antes da v3.2 e mostra apenas dados resumidos. Rode um novo assessment para obter o relatório completo com recomendações, forças e gaps detalhados.',
    // New sections
    maturityRationale: 'Justificativa do Nível de Maturidade',
    whatIncreased: 'O que elevou a maturidade',
    whatPrevented: 'O que impediu níveis mais altos',
    roadmapToNext: 'Roadmap para o Próximo Nível',
    currentLevel: 'Atual',
    targetLevel: 'Meta',
    level: 'Nível',
    phase: 'Fase',
    milestones: 'Marcos (Milestones)',
    milestone: 'Marco',
    timeframe: 'Prazo',
    metric: 'Métrica',
    trainings: 'Recomendações de Treinamento',
    openTraining: 'Abrir',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar'
  },
  en: {
    headerTitle: 'Datadog Maturity Assessment Platform',
    headerSubtitle: 'Admin Console & Portfolio Management',
    tabDashboard: '📊 Dashboard',
    tabCustomers: '👥 Customers',
    tabPortfolio: '📈 My Portfolio',
    tabBenchmarks: '🎯 Benchmarks',
    tabHeatmap: '🔥 Heatmap',
    tabCompare: '⚖️ Compare',
    // Dashboard
    noDataTitle: 'No data available',
    noDataDesc: 'Start by creating assessments using the Assessment Tool',
    dashboardTitle: 'General Dashboard',
    totalCustomers: 'Total Customers',
    avgScore: 'Average Score',
    globalPortfolio: 'Global portfolio',
    improving: 'Improving',
    portfolioPercent: 'of portfolio',
    atRisk: 'At Risk',
    needsAttention: 'Needs attention',
    none: 'None',
    distributionTitle: 'Customer Distribution by Level',
    level: 'Level',
    customer: 'customer',
    customers: 'customers',
    recentActivity: 'Recent Activity',
    assessment: 'assessment',
    assessments: 'assessments',
    // Customers View
    customersCount: 'Customers',
    searchCustomer: 'Search customer...',
    exportSelected: 'Export Current',
    exportAll: 'Export All',
    importFiles: 'Import from Drive',
    selectCustomerFirst: 'Select a customer to export',
    portfolioExported: 'Portfolio exported',
    nothingToExport: 'No customer to export',
    sortByScore: 'Sort by Score',
    sortByTrend: 'Sort by Trend',
    sortByCount: 'Sort by # Assessments',
    account: 'Account',
    unit: 'unit',
    units: 'units',
    business: 'Business',
    technical: 'Technical',
    // Portfolio View
    myPortfolio: 'My Portfolio',
    stable: 'Stable',
    attentionNeeded: '⚠️ Attention Required',
    scoreDecreasing: 'Decreasing score',
    lastPeriod: 'in the last period',
    createActionPlan: 'Create Action Plan',
    topPerformers: '🏆 Top Performers',
    unitsAssessed: 'units assessed',
    // Benchmarks
    benchmarksTitle: 'Benchmarks and Comparative Analysis',
    insufficientData: 'Insufficient data for benchmark',
    average: 'Average',
    median: 'Median',
    bottomQuartile: 'Bottom quartile',
    topQuartile: 'Top quartile',
    top10: 'Top 10%',
    maturityDistribution: 'Maturity Distribution',
    percentileCalculator: 'Percentile Calculator',
    percentileDesc: 'Enter a score to see where it stands in the benchmark',
    example: 'Example',
    percentile: 'Percentile',
    aboveOf: 'Above',
    of: 'of',
    // Modal
    close: 'Close',
    avgScoreLabel: 'Average score',
    trend: 'Trend',
    assessmentHistory: 'Assessment History',
    // Empty state
    noData: 'No data',
    locale: 'en-US',
    // Cross-navigation
    goToAssessment: 'New Assessment',
    exportCSV: 'Export CSV',
    // Modal enhancements
    dimensionsTitle: 'Latest Assessment by Dimension',
    evolutionTitle: 'Score Evolution',
    noDimensionData: 'Dimension data unavailable',
    // Heatmap view
    heatmapTitle: 'Dimension Heatmap',
    heatmapSubtitle: 'Identify systemic gaps — areas where multiple customers show low maturity',
    heatmapLegend: 'Legend: 0-5 scale',
    dimAdoption: 'Adoption',
    dimGovernance: 'Governance',
    dimQuality: 'Quality',
    dimAlerting: 'Alerting',
    dimCost: 'Cost',
    noHeatmapData: 'Insufficient data for heatmap. Complete at least one assessment with dimension scores.',
    sortByName: 'Name',
    sortByAvg: 'Average Score',
    sortByWorst: 'Worst Dimension',
    sortBy: 'Sort by',
    avgColumn: 'Avg',
    insightsTitle: 'Portfolio Insights',
    weakestDimension: 'Weakest portfolio dimension',
    strongestDimension: 'Strongest portfolio dimension',
    clientsBelowTarget: 'customers below 3.0',
    // Compare view
    compareTitle: 'Comparative Analysis',
    compareSubtitle: 'Select 2 to 4 customers to compare side by side',
    selectCustomers: 'Select customers',
    selectedCount: 'selected',
    minSelection: 'Select at least 2 customers to compare',
    maxSelection: 'Maximum of 4 customers per comparison',
    clearSelection: 'Clear selection',
    comparisonRadar: 'Comparison by Dimension',
    gapAnalysis: 'Gap Analysis',
    bestIn: 'Best in',
    worstIn: 'Worst in',
    tied: 'Tied',
    // Edit / Delete assessments
    renameCustomer: 'Rename customer',
    renameAssessment: 'Rename assessment',
    deleteAssessment: 'Delete assessment',
    deleteAllAssessments: 'Delete all assessments',
    newTeamName: 'New team/area name',
    confirmDeleteAssessment: 'Are you sure you want to delete this assessment? This cannot be undone.',
    confirmDeleteAllAssessments: 'Are you sure you want to delete ALL assessments for this customer? This cannot be undone.',
    assessmentDeleted: 'Assessment deleted',
    allAssessmentsDeleted: 'All assessments deleted',
    customerRenamed: 'Customer renamed',
    // View Report modal
    viewReport: 'View report',
    reportTitle: 'Assessment Report',
    finalLevel: 'Final Level',
    rawScore: 'Raw Score',
    blockers: 'Blockers',
    qualifier: 'Qualifier',
    dimensionsRadar: 'Dimensions Overview',
    dimensionsDetail: 'Dimensions Detail',
    strengths: 'Strengths',
    gaps: 'Gaps',
    recommendations: 'Recommendations',
    keyStrengths: 'Key Strengths',
    keyRisks: 'Key Risks',
    downloadHTML: 'Download HTML',
    legacyAssessment: 'Legacy assessment (limited data)',
    legacyAssessmentDesc: 'This assessment was saved before v3.2 and only shows summary data. Run a new assessment to get the full report with recommendations, detailed strengths, and gaps.',
    // New sections
    maturityRationale: 'Maturity Level Rationale',
    whatIncreased: 'What increased maturity',
    whatPrevented: 'What prevented higher maturity',
    roadmapToNext: 'Roadmap to Next Level',
    currentLevel: 'Current',
    targetLevel: 'Target',
    level: 'Level',
    phase: 'Phase',
    milestones: 'Milestones',
    milestone: 'Milestone',
    timeframe: 'Timeframe',
    metric: 'Metric',
    trainings: 'Training Recommendations',
    openTraining: 'Open',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit'
  }
};

function DatadogAdminConsole({ onBack, onNavigateToAssessment, initialLanguage }) {
  const [view, setView] = useState('dashboard'); // dashboard | customers | portfolio | benchmarks
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState(null);
  const t = ADMIN_TRANSLATIONS[initialLanguage || 'en'];
  const language = initialLanguage || 'en';
  const [filter, setFilter] = useState({
    region: 'all',
    industry: 'all',
    segment: 'all',
    dateRange: 'last6months'
  });

  // Load all assessments from localStorage
  const [allAssessments, setAllAssessments] = useState([]);
  
  useEffect(() => {
    loadAllAssessments();
  }, []);

  const loadAllAssessments = () => {
    const assessments = [];
    
    // Iterate through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('datadog-assessments-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const accountId = key.replace('datadog-assessments-', '');
          
          data.forEach(assessment => {
            assessments.push({
              ...assessment,
              accountId,
              customerId: accountId.split('-')[0] || accountId, // Extract customer ID
            });
          });
        } catch (e) {
          console.error('Failed to load:', key, e);
        }
      }
    }
    
    setAllAssessments(assessments.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    ));
  };

  // Group assessments by customer
  const customerGroups = useMemo(() => {
    const groups = {};
    
    allAssessments.forEach(assessment => {
      const custId = assessment.customerId;
      if (!groups[custId]) {
        groups[custId] = {
          customerId: custId,
          accountIds: new Set(),
          assessments: [],
          orgUnits: new Set()
        };
      }
      
      groups[custId].accountIds.add(assessment.accountId);
      groups[custId].assessments.push(assessment);
      if (assessment.teamName) {
        groups[custId].orgUnits.add(assessment.teamName);
      }
    });
    
    // Calculate stats for each customer
    return Object.values(groups).map(group => {
      const latestAssessments = {};
      group.assessments.forEach(a => {
        if (!latestAssessments[a.accountId] || 
            new Date(a.date) > new Date(latestAssessments[a.accountId].date)) {
          latestAssessments[a.accountId] = a;
        }
      });
      
      const scores = Object.values(latestAssessments).map(a => a.rawScore);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      // Calculate trend (last vs previous)
      const sorted = group.assessments.sort((a, b) => new Date(b.date) - new Date(a.date));
      const trend = sorted.length > 1 
        ? sorted[0].rawScore - sorted[1].rawScore 
        : 0;
      
      // Calculate balance stdev across the 5 dimensions of latest assessment
      // Lower stdev = more balanced/homogeneous profile
      // Higher stdev = extremes (great in some dims, poor in others)
      let balanceStdev = null;
      let balanceLabel = 'unknown';
      const latestDims = sorted[0]?.dimensions;
      if (latestDims) {
        const dimScores = [
          latestDims.adoption,
          latestDims.governance,
          latestDims.quality,
          latestDims.alerting,
          latestDims.cost
        ].filter(s => typeof s === 'number' && !isNaN(s));
        
        if (dimScores.length >= 3) {
          const mean = dimScores.reduce((a, b) => a + b, 0) / dimScores.length;
          const variance = dimScores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / dimScores.length;
          balanceStdev = Math.sqrt(variance);
          
          // Classify balance:
          //   <0.6  = balanced (uniform across dims)
          //   0.6-1.2 = moderate variance
          //   >1.2 = unbalanced (extremes)
          if (balanceStdev < 0.6) balanceLabel = 'balanced';
          else if (balanceStdev < 1.2) balanceLabel = 'moderate';
          else balanceLabel = 'unbalanced';
        }
      }
      
      return {
        ...group,
        accountIds: Array.from(group.accountIds),
        orgUnits: Array.from(group.orgUnits),
        avgScore,
        trend,
        balanceStdev,
        balanceLabel,
        latestAssessment: sorted[0],
        assessmentCount: group.assessments.length
      };
    }).sort((a, b) => b.avgScore - a.avgScore);
  }, [allAssessments]);

  // Calculate portfolio KPIs
  const portfolioKPIs = useMemo(() => {
    if (allAssessments.length === 0) return null;
    
    const uniqueCustomers = new Set(allAssessments.map(a => a.customerId)).size;
    const totalAssessments = allAssessments.length;
    const avgScore = allAssessments.reduce((sum, a) => sum + a.rawScore, 0) / totalAssessments;
    
    // Count improving/declining
    const customerTrends = customerGroups.map(g => g.trend);
    const improving = customerTrends.filter(t => t > 0.1).length;
    const declining = customerTrends.filter(t => t < -0.1).length;
    const stable = customerTrends.length - improving - declining;
    
    return {
      totalCustomers: uniqueCustomers,
      totalAssessments,
      avgScore,
      improving,
      declining,
      stable
    };
  }, [allAssessments, customerGroups]);

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      background: '#f9fafb'
    }}>
      {/* Header */}
      <div style={{
        background: '#632CA6',
        color: 'white',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
              {t.headerTitle}
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.875rem' }}>
              {t.headerSubtitle}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onNavigateToAssessment && (
              <button
                onClick={onNavigateToAssessment}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                title={t.goToAssessment}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t.goToAssessment}
              </button>
            )}
            <button
              onClick={() => exportPortfolioCSV(allAssessments, customerGroups, language)}
              disabled={allAssessments.length === 0}
              style={{
                background: allAssessments.length === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
                color: allAssessments.length === 0 ? 'rgba(255,255,255,0.4)' : 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                cursor: allAssessments.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (allAssessments.length > 0) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (allAssessments.length > 0) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
              title={t.exportCSV}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t.exportCSV}
            </button>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600' }}>
              DATADOG
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '0.5rem', padding: '0 2rem' }}>
          {[
            { id: 'dashboard', label: t.tabDashboard },
            { id: 'customers', label: t.tabCustomers },
            { id: 'portfolio', label: t.tabPortfolio },
            { id: 'heatmap', label: t.tabHeatmap },
            { id: 'compare', label: t.tabCompare },
            { id: 'benchmarks', label: t.tabBenchmarks }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                background: view === tab.id ? '#632CA6' : 'transparent',
                color: view === tab.id ? 'white' : '#4b5563',
                border: 'none',
                padding: '1rem 1.5rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: view === tab.id ? '3px solid #632CA6' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {view === 'dashboard' && <DashboardView kpis={portfolioKPIs} customers={customerGroups} t={t} onSelectCustomer={setSelectedCustomer} />}
        {view === 'customers' && <CustomersView customers={customerGroups} onSelectCustomer={setSelectedCustomer} t={t} language={language} onDataChanged={loadAllAssessments} />}
        {view === 'portfolio' && <PortfolioView customers={customerGroups} kpis={portfolioKPIs} t={t} onSelectCustomer={setSelectedCustomer} />}
        {view === 'heatmap' && <HeatmapView customers={customerGroups} t={t} />}
        {view === 'compare' && <CompareView customers={customerGroups} t={t} />}
        {view === 'benchmarks' && <BenchmarksView assessments={allAssessments} customers={customerGroups} t={t} />}
      </div>
      
      {selectedCustomer && (
        <CustomerDetailModal 
          customer={selectedCustomer} 
          onClose={() => setSelectedCustomer(null)}
          onDataChange={() => {
            loadAllAssessments();
            setSelectedCustomer(null);
          }}
          t={t}
        />
      )}
    </div>
  );
}

// Dashboard View
function DashboardView({ kpis, customers, t, onSelectCustomer }) {
  if (!kpis) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>{t.noDataTitle}</h2>
        <p>{t.noDataDesc}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937', marginBottom: '2rem' }}>
        {t.dashboardTitle}
      </h2>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <KPICard 
          title={t.totalCustomers}
          value={kpis.totalCustomers} 
          color="#632CA6" 
        />
        <KPICard 
          title={t.avgScore}
          value={kpis.avgScore.toFixed(2)} 
          color="#632CA6"
          subtitle={t.globalPortfolio}
        />
        <KPICard 
          title={t.improving}
          value={kpis.improving} 
          color="#059669"
          subtitle={`${((kpis.improving / kpis.totalCustomers) * 100).toFixed(0)}% ${t.portfolioPercent}`}
        />
        <KPICard 
          title={t.atRisk}
          value={kpis.declining} 
          color="#dc2626"
          subtitle={kpis.declining > 0 ? t.needsAttention : t.none}
        />
      </div>

      {/* Customer Distribution by Level */}
      <div style={{ 
        background: 'white', 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px', 
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#1f2937' }}>
          {t.distributionTitle}
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[5, 4, 3, 2, 1, 0].map(level => {
            const count = customers.filter(c => Math.floor(c.avgScore) === level).length;
            const percentage = (count / customers.length) * 100;
            
            return (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ minWidth: '100px', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>
                  {t.level} {level}
                </div>
                <div style={{ flex: 1, background: '#e5e7eb', height: '32px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    width: `${percentage}%`,
                    background: level >= 4 ? '#059669' : level >= 3 ? '#3b82f6' : level >= 2 ? '#f59e0b' : '#dc2626',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '1rem',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    {count > 0 && `${count} ${count > 1 ? t.customers : t.customer} (${percentage.toFixed(0)}%)`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ 
        background: 'white', 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px', 
        padding: '1.5rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#1f2937' }}>
          {t.recentActivity}
        </h3>
        
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {customers.slice(0, 5).map(customer => (
            <div 
              key={customer.customerId} 
              onClick={() => onSelectCustomer && onSelectCustomer(customer)}
              onMouseEnter={(e) => {
                if (onSelectCustomer) {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#632CA6';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (onSelectCustomer) {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                cursor: onSelectCustomer ? 'pointer' : 'default',
                transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease'
              }}
              title={onSelectCustomer ? (t.locale === 'pt-BR' ? 'Clique para ver detalhes do cliente' : 'Click to view customer details') : undefined}
            >
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                  {customer.latestAssessment?.teamName || customer.customerId}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {new Date(customer.latestAssessment?.date).toLocaleDateString(t.locale)} - {customer.assessments.length} {customer.assessments.length > 1 ? t.assessments : t.assessment}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  background: customer.trend > 0.1 ? '#d1fae5' : customer.trend < -0.1 ? '#fef2f2' : '#f3f4f6',
                  color: customer.trend > 0.1 ? '#059669' : customer.trend < -0.1 ? '#dc2626' : '#6b7280',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {customer.trend > 0 ? '↗' : customer.trend < 0 ? '↘' : '→'} {customer.trend > 0 ? '+' : ''}{customer.trend.toFixed(2)}
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#632CA6'
                }}>
                  {customer.avgScore.toFixed(2)}
                </div>
                {onSelectCustomer && (
                  <div style={{
                    fontSize: '1.125rem',
                    color: '#9ca3af',
                    marginLeft: '0.25rem',
                    fontWeight: '300'
                  }}>
                    ›
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KPICard({ title, value, color, subtitle }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '500' }}>
        {title}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: '700', color, lineHeight: '1' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

// Customers View
function CustomersView({ customers, onSelectCustomer, t, language, onDataChanged }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('avgScore'); // avgScore | trend | assessmentCount
  const [adminStatus, setAdminStatus] = useState('');
  const [exportTargetId, setExportTargetId] = useState(''); // for "Export Current"

  const filteredCustomers = useMemo(() => {
    let filtered = customers;
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.latestAssessment?.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === 'avgScore') return b.avgScore - a.avgScore;
      if (sortBy === 'trend') return b.trend - a.trend;
      return b.assessmentCount - a.assessmentCount;
    });
  }, [customers, searchTerm, sortBy]);

  // Helper: show admin status with auto-clear
  const showStatus = (msg, durationMs = 5000) => {
    setAdminStatus(msg);
    setTimeout(() => setAdminStatus(''), durationMs);
  };

  // Export current selected customer (all its assessments)
  const handleExportCurrent = () => {
    if (!exportTargetId) {
      showStatus(language === 'pt'
        ? '⚠️ Selecione um cliente abaixo para exportar'
        : '⚠️ Select a customer below to export');
      return;
    }
    const customer = customers.find(c => c.customerId === exportTargetId);
    if (!customer) {
      showStatus('❌ ' + (language === 'pt' ? 'Cliente não encontrado' : 'Customer not found'));
      return;
    }
    try {
      const storageKey = `datadog-assessments-${customer.customerId}`;
      const list = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (list.length === 0) {
        showStatus(language === 'pt' ? '⚠️ Cliente sem assessments' : '⚠️ No assessments for this customer');
        return;
      }
      const payload = {
        schema: 'datadog-maturity-assessment-bundle',
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        scope: 'single-customer',
        customerId: customer.customerId,
        count: list.length,
        assessments: list.map(a => ({ ...a, _accountId: customer.customerId }))
      };
      const teamName = sanitizeFilename(customer.latestAssessment?.teamName || customer.customerId);
      const date = new Date().toISOString().substring(0, 10);
      const filename = `DMA-${teamName}-${customer.customerId}-${date}.json`;
      downloadFile(filename, JSON.stringify(payload, null, 2), 'application/json');
      showStatus(language === 'pt'
        ? `📤 ${filename} baixado (${list.length} assessment${list.length > 1 ? 's' : ''})`
        : `📤 ${filename} downloaded (${list.length} assessment${list.length > 1 ? 's' : ''})`);
    } catch (err) {
      console.error('Export error:', err);
      showStatus('❌ ' + err.message);
    }
  };

  // Export all customers as a single bundle
  const handleExportAll = () => {
    try {
      if (customers.length === 0) {
        showStatus('⚠️ ' + t.nothingToExport);
        return;
      }
      const result = exportAllAssessmentsToFile();
      showStatus(language === 'pt'
        ? `📦 ${result.filename} baixado (${result.count} assessments)`
        : `📦 ${result.filename} downloaded (${result.count} assessments)`);
    } catch (err) {
      console.error('Export all error:', err);
      showStatus('❌ ' + err.message);
    }
  };

  // Import multiple JSON files
  const handleImport = async (files) => {
    if (!files || files.length === 0) return;
    let totalImported = 0;
    let totalSkipped = 0;
    const allErrors = [];
    
    for (const file of files) {
      try {
        const result = await importAssessmentFromFile(file);
        totalImported += result.imported;
        totalSkipped += result.skipped;
        allErrors.push(...result.errors);
      } catch (err) {
        allErrors.push(`${file.name}: ${err.message}`);
      }
    }
    
    let msg;
    if (totalImported > 0 && allErrors.length === 0) {
      msg = language === 'pt'
        ? `✅ ${totalImported} assessment(s) importado(s)`
        : `✅ ${totalImported} assessment(s) imported`;
    } else if (totalImported > 0) {
      msg = language === 'pt'
        ? `⚠️ ${totalImported} importado(s), ${allErrors.length} erro(s)`
        : `⚠️ ${totalImported} imported, ${allErrors.length} error(s)`;
      console.warn('Import errors:', allErrors);
    } else {
      msg = language === 'pt'
        ? `❌ Nenhum importado. ${allErrors.length} erro(s) - veja o console.`
        : `❌ None imported. ${allErrors.length} error(s) - check console.`;
      console.error('Import errors:', allErrors);
    }
    showStatus(msg, 7000);
    
    // Trigger reload in parent
    if (totalImported > 0 && onDataChanged) {
      onDataChanged();
    }
  };

  return (
    <div>
      {/* Drive Sync Action Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '0.5rem', 
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <select
          value={exportTargetId}
          onChange={(e) => setExportTargetId(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '0.875rem',
            background: 'white',
            color: '#374151',
            minWidth: '200px'
          }}
          title={language === 'pt' ? 'Cliente para exportar individualmente' : 'Customer to export individually'}
        >
          <option value="">{language === 'pt' ? '-- Cliente para exportar --' : '-- Customer to export --'}</option>
          {customers.map(c => (
            <option key={c.customerId} value={c.customerId}>
              {(c.latestAssessment?.teamName || c.customerId)} ({c.customerId})
            </option>
          ))}
        </select>
        
        <button
          onClick={handleExportCurrent}
          disabled={!exportTargetId}
          style={{
            background: exportTargetId ? '#0ea5e9' : '#cbd5e1',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderRadius: '6px',
            cursor: exportTargetId ? 'pointer' : 'not-allowed'
          }}
          title={language === 'pt' 
            ? 'Exporta todos os assessments do cliente selecionado'
            : 'Exports all assessments for the selected customer'}
        >
          📤 {t.exportSelected}
        </button>
        
        <button
          onClick={handleExportAll}
          style={{
            background: '#0284c7',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          title={language === 'pt'
            ? 'Exporta todo o portfolio em um único arquivo'
            : 'Exports the entire portfolio in a single file'}
        >
          📦 {t.exportAll}
        </button>
        
        <input
          type="file"
          id="admin-drive-import-input"
          accept=".json,application/json"
          multiple
          style={{ display: 'none' }}
          onChange={async (e) => {
            await handleImport(Array.from(e.target.files || []));
            e.target.value = '';
          }}
        />
        <button
          onClick={() => document.getElementById('admin-drive-import-input').click()}
          style={{
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          title={language === 'pt'
            ? 'Importa um ou mais arquivos JSON do Drive'
            : 'Imports one or more JSON files from Drive'}
        >
          📥 {t.importFiles}
        </button>
      </div>
      
      {/* Status message */}
      {adminStatus && (
        <div style={{
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          background: adminStatus.startsWith('❌') ? '#fef2f2' : (adminStatus.startsWith('⚠️') ? '#fffbeb' : '#f0fdf4'),
          border: `1px solid ${adminStatus.startsWith('❌') ? '#fca5a5' : (adminStatus.startsWith('⚠️') ? '#fcd34d' : '#86efac')}`,
          color: adminStatus.startsWith('❌') ? '#991b1b' : (adminStatus.startsWith('⚠️') ? '#92400e' : '#166534'),
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {adminStatus}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          {t.customersCount} ({customers.length})
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder={t.searchCustomer}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.875rem',
              width: '250px'
            }}
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.875rem',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="avgScore">{t.sortByScore}</option>
            <option value="trend">{t.sortByTrend}</option>
            <option value="assessmentCount">{t.sortByCount}</option>
          </select>
        </div>
      </div>

      {/* Customer Cards */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredCustomers.map(customer => (
          <CustomerCard 
            key={customer.customerId} 
            customer={customer} 
            onClick={() => onSelectCustomer(customer)}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

// Customer Card
function CustomerCard({ customer, onClick, t }) {
  const levelColor = customer.avgScore >= 4 ? '#059669' 
    : customer.avgScore >= 3 ? '#3b82f6' 
    : customer.avgScore >= 2 ? '#f59e0b' 
    : '#dc2626';

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderLeft: `4px solid ${levelColor}`,
        borderRadius: '8px',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        ':hover': { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#1f2937', fontWeight: '600' }}>
            {customer.latestAssessment?.teamName || customer.customerId}
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <span>{t.account}: {customer.accountIds[0]}</span>
            <span>• {customer.assessmentCount} {customer.assessmentCount > 1 ? t.assessments : t.assessment}</span>
            <span>• {customer.orgUnits.length} {customer.orgUnits.length > 1 ? t.units : t.unit}</span>
          </div>
          
          {customer.latestAssessment?.businessOwner && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: '#6b7280' }}>
              {t.business}: {customer.latestAssessment.businessOwner}
              {customer.latestAssessment.technicalOwner && ` | ${t.technical}: ${customer.latestAssessment.technicalOwner}`}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: customer.trend > 0.1 ? '#d1fae5' : customer.trend < -0.1 ? '#fef2f2' : '#f3f4f6',
            border: `1px solid ${customer.trend > 0.1 ? '#10b981' : customer.trend < -0.1 ? '#fecaca' : '#e5e7eb'}`,
            color: customer.trend > 0.1 ? '#059669' : customer.trend < -0.1 ? '#dc2626' : '#6b7280',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            textAlign: 'center',
            minWidth: '80px'
          }}>
            <div style={{ fontSize: '1.25rem' }}>{customer.trend > 0 ? '↗' : customer.trend < 0 ? '↘' : '→'}</div>
            <div>{customer.trend > 0 ? '+' : ''}{customer.trend.toFixed(2)}</div>
          </div>
          
          <div style={{
            background: `${levelColor}11`,
            border: `2px solid ${levelColor}`,
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            minWidth: '100px'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '600' }}>
              {t.level}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: levelColor, lineHeight: '1' }}>
              {Math.floor(customer.avgScore)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>
              {customer.avgScore.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Portfolio View (CSM View)
function PortfolioView({ customers, kpis, t, onSelectCustomer }) {
  if (!kpis) return <div>{t.noData}</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937', marginBottom: '2rem' }}>
        {t.myPortfolio}
      </h2>

      {/* Portfolio KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <KPICard title={t.customersCount} value={kpis.totalCustomers} color="#632CA6" />
        <KPICard title={t.avgScore} value={kpis.avgScore.toFixed(2)} color="#632CA6" />
        <KPICard title={t.improving} value={kpis.improving} color="#059669" />
        <KPICard title={t.stable} value={kpis.stable} color="#6b7280" />
        <KPICard title={t.atRisk} value={kpis.declining} color="#dc2626" />
      </div>

      {/* Attention Needed */}
      {kpis.declining > 0 && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#991b1b', fontWeight: '600' }}>
            {t.attentionNeeded} ({kpis.declining} {kpis.declining > 1 ? t.customers : t.customer})
          </h3>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {customers.filter(c => c.trend < -0.1).map(customer => (
              <div 
                key={customer.customerId} 
                onClick={() => onSelectCustomer && onSelectCustomer(customer)}
                style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  cursor: onSelectCustomer ? 'pointer' : 'default',
                  transition: 'transform 0.1s, box-shadow 0.1s'
                }}
                onMouseEnter={(e) => {
                  if (onSelectCustomer) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(220, 38, 38, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {customer.latestAssessment?.teamName || customer.customerId}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {t.scoreDecreasing}: {customer.trend.toFixed(2)} {t.lastPeriod}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      // v39: Stop propagation so the card's onClick doesn't double-fire.
                      // Both the button and the card open the customer detail — clicking
                      // the button explicitly is the user's intent, no need to bubble.
                      e.stopPropagation();
                      if (onSelectCustomer) onSelectCustomer(customer);
                    }}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {t.createActionPlan}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performers */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#1f2937', fontWeight: '600' }}>
          {t.topPerformers}
        </h3>
        
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {customers.filter(c => c.avgScore >= 3.5).slice(0, 5).map((customer, idx) => (
            <div key={customer.customerId} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: idx === 0 ? '#f0fdf4' : '#f9fafb',
              borderRadius: '6px',
              border: `1px solid ${idx === 0 ? '#10b981' : '#e5e7eb'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  background: idx === 0 ? '#059669' : '#6b7280',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700'
                }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>
                    {customer.latestAssessment?.teamName || customer.customerId}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {customer.orgUnits.length} {t.unitsAssessed}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#059669'
              }}>
                {customer.avgScore.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Benchmarks View
function BenchmarksView({ assessments, customers, t }) {
  if (assessments.length === 0) return <div>{t.insufficientData}</div>;

  const scores = assessments.map(a => a.rawScore).sort((a, b) => a - b);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const median = scores[Math.floor(scores.length / 2)];
  const p25 = scores[Math.floor(scores.length * 0.25)];
  const p75 = scores[Math.floor(scores.length * 0.75)];
  const p90 = scores[Math.floor(scores.length * 0.90)];

  // Distribution data
  const distribution = [0, 1, 2, 3, 4, 5].map(level => ({
    level: `${t.level} ${level}`,
    count: scores.filter(s => Math.floor(s) === level).length
  }));

  return (
    <div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937', marginBottom: '2rem' }}>
        {t.benchmarksTitle}
      </h2>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <KPICard title={t.average} value={avg.toFixed(2)} color="#632CA6" />
        <KPICard title={t.median} value={median.toFixed(2)} color="#632CA6" />
        <KPICard title="P25" value={p25.toFixed(2)} color="#6b7280" subtitle={t.bottomQuartile} />
        <KPICard title="P75" value={p75.toFixed(2)} color="#059669" subtitle={t.topQuartile} />
        <KPICard title="P90" value={p90.toFixed(2)} color="#059669" subtitle={t.top10} />
      </div>

      {/* Distribution Chart */}
      <div style={{ 
        background: 'white', 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px', 
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#1f2937' }}>
          {t.maturityDistribution}
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="level" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#632CA6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Percentile Calculator */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#1f2937' }}>
          {t.percentileCalculator}
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          {t.percentileDesc}
        </p>
        
        <div style={{ 
          background: '#f9fafb', 
          padding: '1.5rem', 
          borderRadius: '6px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
            <strong>{t.example}:</strong> Score 3.2
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#632CA6', marginBottom: '0.5rem' }}>
            {t.percentile}: {((scores.filter(s => s < 3.2).length / scores.length) * 100).toFixed(0)}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {t.aboveOf} {scores.filter(s => s < 3.2).length} {t.of} {scores.length} {t.assessments} ({((scores.filter(s => s < 3.2).length / scores.length) * 100).toFixed(0)}%)
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// HEATMAP VIEW - Matrix of customers × 5 dimensions
// =====================================================
function HeatmapView({ customers, t }) {
  const [sortBy, setSortBy] = useState('avgScore'); // name | avgScore | worst

  // Helper to extract dimension score
  const getDimScore = (d) => {
    if (!d) return null;
    if (typeof d === 'number') return d;
    if (d.score !== undefined) return Number(d.score);
    if (d.level !== undefined) return Number(d.level);
    return null;
  };

  // Build heatmap data: row = customer, columns = 5 dimensions + avg
  const heatmapRows = useMemo(() => {
    const rows = customers
      .filter(c => c.latestAssessment?.dimensions)
      .map(c => {
        const dims = c.latestAssessment.dimensions;
        const scores = {
          adoption: getDimScore(dims.adoption),
          governance: getDimScore(dims.governance),
          quality: getDimScore(dims.quality),
          alerting: getDimScore(dims.alerting),
          cost: getDimScore(dims.cost)
        };
        const validScores = Object.values(scores).filter(s => s !== null);
        const avg = validScores.length > 0 
          ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
          : 0;
        const worst = validScores.length > 0 ? Math.min(...validScores) : 0;
        
        // Balance stdev: measures profile uniformity across the 5 dimensions
        // Low stdev (<0.6) = balanced/uniform profile
        // High stdev (>1.2) = extremes (great in some dims, poor in others)
        let balanceStdev = null;
        let balanceLabel = 'unknown';
        if (validScores.length >= 3) {
          const variance = validScores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / validScores.length;
          balanceStdev = Math.sqrt(variance);
          if (balanceStdev < 0.6) balanceLabel = 'balanced';
          else if (balanceStdev < 1.2) balanceLabel = 'moderate';
          else balanceLabel = 'unbalanced';
        }
        
        return {
          customerId: c.customerId,
          name: c.latestAssessment?.teamName || c.customerId,
          scores,
          avg,
          worst,
          balanceStdev,
          balanceLabel
        };
      });

    // Sort
    if (sortBy === 'name') {
      return rows.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'worst') {
      return rows.sort((a, b) => a.worst - b.worst); // lowest worst first
    } else if (sortBy === 'balance') {
      return rows.sort((a, b) => (b.balanceStdev || 0) - (a.balanceStdev || 0)); // most unbalanced first
    }
    return rows.sort((a, b) => b.avg - a.avg); // highest avg first
  }, [customers, sortBy]);

  // Compute per-dimension averages (portfolio level)
  const dimensionAvgs = useMemo(() => {
    const dims = ['adoption', 'governance', 'quality', 'alerting', 'cost'];
    const avgs = {};
    dims.forEach(d => {
      const scores = heatmapRows.map(r => r.scores[d]).filter(s => s !== null);
      avgs[d] = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    });
    return avgs;
  }, [heatmapRows]);

  // Insights
  const weakestDim = useMemo(() => {
    const entries = Object.entries(dimensionAvgs);
    if (entries.length === 0) return null;
    return entries.reduce((min, curr) => curr[1] < min[1] ? curr : min);
  }, [dimensionAvgs]);

  const strongestDim = useMemo(() => {
    const entries = Object.entries(dimensionAvgs);
    if (entries.length === 0) return null;
    return entries.reduce((max, curr) => curr[1] > max[1] ? curr : max);
  }, [dimensionAvgs]);

  const clientsBelow3 = useMemo(() => {
    return heatmapRows.filter(r => r.avg < 3.0).length;
  }, [heatmapRows]);

  // Empty state
  if (heatmapRows.length === 0) {
    return (
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          {t.heatmapTitle}
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{t.heatmapSubtitle}</p>
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
          <p style={{ fontSize: '0.9375rem' }}>{t.noHeatmapData}</p>
        </div>
      </div>
    );
  }

  // Color scale for cells (Datadog palette)
  const getCellColor = (score) => {
    if (score === null) return { bg: '#f3f4f6', text: '#9ca3af' };
    if (score >= 4.5) return { bg: '#059669', text: '#fff' };       // verde forte
    if (score >= 3.5) return { bg: '#10b981', text: '#fff' };       // verde
    if (score >= 2.5) return { bg: '#f59e0b', text: '#fff' };       // âmbar
    if (score >= 1.5) return { bg: '#f97316', text: '#fff' };       // laranja
    return { bg: '#dc2626', text: '#fff' };                          // vermelho
  };

  const dimensions = [
    { key: 'adoption', label: t.dimAdoption },
    { key: 'governance', label: t.dimGovernance },
    { key: 'quality', label: t.dimQuality },
    { key: 'alerting', label: t.dimAlerting },
    { key: 'cost', label: t.dimCost }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
            {t.heatmapTitle}
          </h2>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9375rem' }}>
            {t.heatmapSubtitle}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>{t.sortBy}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem 0.875rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.875rem',
              background: 'white',
              cursor: 'pointer',
              color: '#1f2937',
              fontWeight: '500'
            }}
          >
            <option value="avgScore">{t.sortByAvg}</option>
            <option value="worst">{t.sortByWorst}</option>
            <option value="name">{t.sortByName}</option>
          </select>
        </div>
      </div>

      {/* Insights Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {weakestDim && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              ⚠️ {t.weakestDimension}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#991b1b' }}>
              {t['dim' + weakestDim[0].charAt(0).toUpperCase() + weakestDim[0].slice(1)]}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#7f1d1d', marginTop: '0.25rem' }}>
              {t.locale === 'pt-BR' ? 'Média' : 'Average'}: <strong>{weakestDim[1].toFixed(2)}</strong>
            </div>
          </div>
        )}

        {strongestDim && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              🏆 {t.strongestDimension}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#065f46' }}>
              {t['dim' + strongestDim[0].charAt(0).toUpperCase() + strongestDim[0].slice(1)]}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#047857', marginTop: '0.25rem' }}>
              {t.locale === 'pt-BR' ? 'Média' : 'Average'}: <strong>{strongestDim[1].toFixed(2)}</strong>
            </div>
          </div>
        )}

        <div style={{
          background: clientsBelow3 > 0 ? '#fffbeb' : '#f0fdf4',
          border: `1px solid ${clientsBelow3 > 0 ? '#fcd34d' : '#bbf7d0'}`,
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: clientsBelow3 > 0 ? '#92400e' : '#065f46', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            📊 {t.insightsTitle}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: clientsBelow3 > 0 ? '#92400e' : '#065f46' }}>
            {clientsBelow3}/{heatmapRows.length}
          </div>
          <div style={{ fontSize: '0.8125rem', color: clientsBelow3 > 0 ? '#78350f' : '#047857', marginTop: '0.25rem' }}>
            {t.clientsBelowTarget}
          </div>
        </div>
      </div>

      {/* Heatmap Table */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '0.875rem'
          }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  color: '#4b5563',
                  position: 'sticky',
                  left: 0,
                  background: '#f9fafb',
                  minWidth: '200px',
                  borderRight: '2px solid #e5e7eb'
                }}>
                  {t.locale === 'pt-BR' ? 'Cliente' : 'Customer'}
                </th>
                {dimensions.map(d => (
                  <th key={d.key} style={{ 
                    padding: '1rem 0.75rem', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    color: '#4b5563',
                    minWidth: '100px'
                  }}>
                    {d.label}
                  </th>
                ))}
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: '700', 
                  color: '#632CA6',
                  background: '#faf5ff',
                  borderLeft: '2px solid #e5e7eb',
                  minWidth: '80px'
                }}>
                  {t.avgColumn}
                </th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: '600', 
                  color: '#6b7280',
                  background: '#fafafa',
                  borderLeft: '1px solid #e5e7eb',
                  minWidth: '90px',
                  fontSize: '0.875rem'
                }} title={t.locale === 'pt-BR' 
                  ? 'Desvio padrão entre dimensões. Baixo = perfil equilibrado. Alto = extremos.' 
                  : 'Standard deviation across dimensions. Low = balanced profile. High = extremes.'}>
                  σ {t.locale === 'pt-BR' ? '(balanço)' : '(balance)'}
                </th>
              </tr>
            </thead>
            <tbody>
              {heatmapRows.map((row, idx) => (
                <tr key={row.customerId} style={{ 
                  borderBottom: idx === heatmapRows.length - 1 ? 'none' : '1px solid #f3f4f6',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ 
                    padding: '0.875rem 1rem', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    position: 'sticky',
                    left: 0,
                    background: 'white',
                    borderRight: '2px solid #e5e7eb'
                  }}>
                    {row.name}
                  </td>
                  {dimensions.map(d => {
                    const score = row.scores[d.key];
                    const cell = getCellColor(score);
                    return (
                      <td key={d.key} style={{ padding: '0.5rem', textAlign: 'center' }}>
                        <div style={{
                          background: cell.bg,
                          color: cell.text,
                          padding: '0.625rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: '700',
                          fontSize: '0.9375rem',
                          minWidth: '60px',
                          display: 'inline-block'
                        }}>
                          {score !== null ? score.toFixed(1) : '—'}
                        </div>
                      </td>
                    );
                  })}
                  <td style={{ 
                    padding: '0.5rem', 
                    textAlign: 'center',
                    background: '#faf5ff',
                    borderLeft: '2px solid #e5e7eb'
                  }}>
                    <div style={{
                      color: '#632CA6',
                      fontWeight: '700',
                      fontSize: '1rem'
                    }}>
                      {row.avg.toFixed(2)}
                    </div>
                  </td>
                  <td style={{ 
                    padding: '0.5rem', 
                    textAlign: 'center',
                    background: '#fafafa',
                    borderLeft: '1px solid #e5e7eb'
                  }}>
                    {row.balanceStdev !== null ? (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: row.balanceLabel === 'unbalanced' ? '#fee2e2' 
                                    : row.balanceLabel === 'moderate' ? '#fef3c7'
                                    : '#dcfce7',
                        color: row.balanceLabel === 'unbalanced' ? '#991b1b'
                               : row.balanceLabel === 'moderate' ? '#92400e'
                               : '#166534',
                        padding: '0.375rem 0.625rem',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '0.8125rem'
                      }}>
                        <span>
                          {row.balanceLabel === 'unbalanced' ? '⚠️' 
                           : row.balanceLabel === 'moderate' ? '◐' 
                           : '✓'}
                        </span>
                        <span>{row.balanceStdev.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
              {/* Portfolio average row */}
              <tr style={{ 
                background: '#f9fafb',
                borderTop: '2px solid #e5e7eb',
                fontWeight: '600'
              }}>
                <td style={{ 
                  padding: '0.875rem 1rem', 
                  fontWeight: '700', 
                  color: '#4b5563',
                  position: 'sticky',
                  left: 0,
                  background: '#f9fafb',
                  borderRight: '2px solid #e5e7eb'
                }}>
                  {t.locale === 'pt-BR' ? '📊 Média do Portfolio' : '📊 Portfolio Average'}
                </td>
                {dimensions.map(d => {
                  const avg = dimensionAvgs[d.key];
                  const cell = getCellColor(avg);
                  return (
                    <td key={d.key} style={{ padding: '0.5rem', textAlign: 'center' }}>
                      <div style={{
                        background: cell.bg,
                        color: cell.text,
                        padding: '0.625rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '0.9375rem',
                        minWidth: '60px',
                        display: 'inline-block',
                        opacity: 0.9
                      }}>
                        {avg.toFixed(1)}
                      </div>
                    </td>
                  );
                })}
                <td style={{ 
                  padding: '0.5rem', 
                  textAlign: 'center',
                  background: '#faf5ff',
                  borderLeft: '2px solid #e5e7eb'
                }}>
                  <div style={{
                    color: '#632CA6',
                    fontWeight: '700',
                    fontSize: '1rem'
                  }}>
                    {(Object.values(dimensionAvgs).reduce((a, b) => a + b, 0) / 5).toFixed(2)}
                  </div>
                </td>
                <td style={{ 
                  padding: '0.5rem', 
                  textAlign: 'center',
                  background: '#fafafa',
                  borderLeft: '1px solid #e5e7eb'
                }}>
                  {(() => {
                    // Average σ across all rows
                    const stdevs = heatmapRows.map(r => r.balanceStdev).filter(s => s !== null);
                    if (stdevs.length === 0) return <span style={{ color: '#9ca3af' }}>—</span>;
                    const avgStdev = stdevs.reduce((a, b) => a + b, 0) / stdevs.length;
                    return (
                      <div style={{
                        color: '#6b7280',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {avgStdev.toFixed(2)}
                      </div>
                    );
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        fontSize: '0.8125rem'
      }}>
        <span style={{ fontWeight: '600', color: '#4b5563' }}>{t.heatmapLegend}:</span>
        {[
          { range: '0 - 1.4', color: '#dc2626', label: t.locale === 'pt-BR' ? 'Crítico' : 'Critical' },
          { range: '1.5 - 2.4', color: '#f97316', label: t.locale === 'pt-BR' ? 'Baixo' : 'Low' },
          { range: '2.5 - 3.4', color: '#f59e0b', label: t.locale === 'pt-BR' ? 'Médio' : 'Medium' },
          { range: '3.5 - 4.4', color: '#10b981', label: t.locale === 'pt-BR' ? 'Bom' : 'Good' },
          { range: '4.5 - 5.0', color: '#059669', label: t.locale === 'pt-BR' ? 'Excelente' : 'Excellent' }
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: item.color, 
              borderRadius: '3px' 
            }} />
            <span style={{ color: '#4b5563' }}>
              <strong>{item.range}</strong> {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// COMPARE VIEW - Side-by-side comparison of 2-4 customers
// =====================================================
function CompareView({ customers, t }) {
  const [selectedIds, setSelectedIds] = useState([]);

  // Helper to extract dimension score
  const getDimScore = (d) => {
    if (!d) return 0;
    if (typeof d === 'number') return d;
    if (d.score !== undefined) return Number(d.score);
    if (d.level !== undefined) return Number(d.level);
    return 0;
  };

  // Filter customers with dimension data
  const availableCustomers = useMemo(() => {
    return customers.filter(c => c.latestAssessment?.dimensions);
  }, [customers]);

  const toggleCustomer = (customerId) => {
    setSelectedIds(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      }
      if (prev.length >= 4) {
        return prev; // max 4
      }
      return [...prev, customerId];
    });
  };

  const selectedCustomers = useMemo(() => {
    return selectedIds
      .map(id => availableCustomers.find(c => c.customerId === id))
      .filter(Boolean);
  }, [selectedIds, availableCustomers]);

  // Build radar data with all selected customers as series
  const radarData = useMemo(() => {
    if (selectedCustomers.length < 2) return null;
    
    const dimensions = [
      { key: 'adoption', label: t.dimAdoption },
      { key: 'governance', label: t.dimGovernance },
      { key: 'quality', label: t.dimQuality },
      { key: 'alerting', label: t.dimAlerting },
      { key: 'cost', label: t.dimCost }
    ];

    return dimensions.map(dim => {
      const row = { dimension: dim.label };
      selectedCustomers.forEach(c => {
        row[c.customerId] = getDimScore(c.latestAssessment.dimensions[dim.key]);
      });
      return row;
    });
  }, [selectedCustomers, t]);

  // Gap analysis: who is best/worst in each dimension
  const gapAnalysis = useMemo(() => {
    if (selectedCustomers.length < 2 || !radarData) return null;
    
    return radarData.map(row => {
      const scores = selectedCustomers.map(c => ({
        customer: c,
        score: row[c.customerId]
      }));
      scores.sort((a, b) => b.score - a.score);
      
      const best = scores[0];
      const worst = scores[scores.length - 1];
      const gap = best.score - worst.score;
      const isTied = gap < 0.1;
      
      return {
        dimension: row.dimension,
        best: isTied ? null : best,
        worst: isTied ? null : worst,
        gap,
        isTied
      };
    });
  }, [radarData, selectedCustomers]);

  // Color palette for each customer in the radar
  const colors = ['#632CA6', '#ec4899', '#0891b2', '#ea580c'];

  // Empty state — no customers available
  if (availableCustomers.length === 0) {
    return (
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          {t.compareTitle}
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{t.compareSubtitle}</p>
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
          <p style={{ fontSize: '0.9375rem' }}>{t.noHeatmapData}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
          {t.compareTitle}
        </h2>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9375rem' }}>
          {t.compareSubtitle}
        </p>
      </div>

      {/* Customer Selection */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#1f2937', fontWeight: '600' }}>
              {t.selectCustomers}
            </h3>
            <span style={{
              background: selectedIds.length >= 2 ? '#d1fae5' : '#f3f4f6',
              color: selectedIds.length >= 2 ? '#059669' : '#6b7280',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.8125rem',
              fontWeight: '600'
            }}>
              {selectedIds.length} / 4 {t.selectedCount}
            </span>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              style={{
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                padding: '0.4rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {t.clearSelection}
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {availableCustomers.map(c => {
            const isSelected = selectedIds.includes(c.customerId);
            const selIdx = selectedIds.indexOf(c.customerId);
            const customerColor = isSelected ? colors[selIdx] : null;
            const disabled = !isSelected && selectedIds.length >= 4;
            
            return (
              <div
                key={c.customerId}
                onClick={() => !disabled && toggleCustomer(c.customerId)}
                style={{
                  padding: '0.875rem 1rem',
                  border: isSelected ? `2px solid ${customerColor}` : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  background: isSelected ? `${customerColor}11` : 'white',
                  opacity: disabled ? 0.4 : 1,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    fontSize: '0.9375rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {c.latestAssessment?.teamName || c.customerId}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>
                    Score: <strong>{c.avgScore.toFixed(2)}</strong>
                  </div>
                </div>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: isSelected ? `2px solid ${customerColor}` : '2px solid #d1d5db',
                  background: isSelected ? customerColor : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {isSelected && '✓'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation message */}
      {selectedIds.length < 2 && (
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          color: '#1e40af',
          fontSize: '0.9375rem',
          textAlign: 'center'
        }}>
          ℹ️ {t.minSelection}
        </div>
      )}

      {/* Comparison */}
      {selectedIds.length >= 2 && radarData && (
        <>
          {/* Radar Chart */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#1f2937', fontWeight: '600' }}>
              {t.comparisonRadar}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 600 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 5]} 
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                />
                {selectedCustomers.map((c, idx) => (
                  <Radar
                    key={c.customerId}
                    name={c.latestAssessment?.teamName || c.customerId}
                    dataKey={c.customerId}
                    stroke={colors[idx]}
                    fill={colors[idx]}
                    fillOpacity={0.15}
                    strokeWidth={2.5}
                  />
                ))}
                <Legend 
                  wrapperStyle={{ paddingTop: '1rem' }}
                  iconType="line"
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  formatter={(value) => Number(value).toFixed(2)}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Gap Analysis */}
          {gapAnalysis && (
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#1f2937', fontWeight: '600' }}>
                {t.gapAnalysis}
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {gapAnalysis.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr 1fr 80px',
                    gap: '1rem',
                    padding: '0.875rem 1rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    alignItems: 'center',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {item.dimension}
                    </div>
                    {item.isTied ? (
                      <>
                        <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                          — {t.tied} —
                        </div>
                        <div></div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span style={{ color: '#059669', fontWeight: '600' }}>🏆 {t.bestIn}:</span>{' '}
                          <span style={{ color: '#1f2937' }}>
                            {item.best.customer.latestAssessment?.teamName || item.best.customer.customerId}
                          </span>{' '}
                          <span style={{ color: '#059669', fontWeight: '700' }}>({item.best.score.toFixed(2)})</span>
                        </div>
                        <div>
                          <span style={{ color: '#dc2626', fontWeight: '600' }}>⚠️ {t.worstIn}:</span>{' '}
                          <span style={{ color: '#1f2937' }}>
                            {item.worst.customer.latestAssessment?.teamName || item.worst.customer.customerId}
                          </span>{' '}
                          <span style={{ color: '#dc2626', fontWeight: '700' }}>({item.worst.score.toFixed(2)})</span>
                        </div>
                      </>
                    )}
                    <div style={{ 
                      textAlign: 'right',
                      fontWeight: '700',
                      color: item.gap > 1 ? '#dc2626' : item.gap > 0.5 ? '#f59e0b' : '#6b7280',
                      fontSize: '0.9375rem'
                    }}>
                      {item.isTied ? '—' : `Δ ${item.gap.toFixed(2)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================================
// Assessment Report Modal
// ============================================================================
// Shows the full saved report for a specific assessment, including:
// - Dimensions with scores, signals, issues, and rationale
// - Insights (strengths and risks)
// - Recommendations
// - Qualifier and gating rules
// Provides a download button to export as standalone HTML.
// ============================================================================
function AssessmentReportModal({ assessment: rawAssessment, customer, onClose, t }) {
  if (!rawAssessment) return null;
  
  // Detect language from the t translations object for use inside this modal
  const language = t.locale === 'pt-BR' ? 'pt' : 'en';
  
  // v36-fix3: If inputData is available, regenerate the assessment content in the
  // current UI language. This is the same trick exportToHTML uses (v29).
  // Without this, an assessment saved in PT would always display in PT,
  // even when the user switches the UI to EN.
  // Scores are preserved from the original to avoid floating-point surprises.
  let assessment = rawAssessment;
  if (rawAssessment.inputData) {
    try {
      const customerName = rawAssessment.teamName || rawAssessment.serviceName || customer?.customerId || null;
      const regenerated = assessMaturity(rawAssessment.inputData, language, customerName);
      assessment = {
        ...rawAssessment,
        // Preserve identity + numeric scores (avoid floating point drift)
        finalLevel: rawAssessment.finalLevel,
        rawScore: rawAssessment.rawScore,
        // v36-fix4: qualifier and gatings ARE language-specific text strings,
        // so they must come from the regenerated content, not from rawAssessment.
        qualifier: regenerated.qualifier,
        gatings: regenerated.gatings,
        // Use freshly regenerated narrative content
        dimensions: regenerated.dimensions,
        dimensionsDetailed: {
          adoption: {
            score: rawAssessment.dimensionsDetailed?.adoption?.score ?? regenerated.dimensions.adoption.score,
            level: regenerated.dimensions.adoption.level,
            signals: regenerated.dimensions.adoption.signals || [],
            issues: regenerated.dimensions.adoption.issues || [],
            rationale: regenerated.dimensions.adoption.rationale || ''
          },
          governance: {
            score: rawAssessment.dimensionsDetailed?.governance?.score ?? regenerated.dimensions.governance.score,
            level: regenerated.dimensions.governance.level,
            signals: regenerated.dimensions.governance.signals || [],
            issues: regenerated.dimensions.governance.issues || [],
            rationale: regenerated.dimensions.governance.rationale || ''
          },
          quality: {
            score: rawAssessment.dimensionsDetailed?.quality?.score ?? regenerated.dimensions.quality.score,
            level: regenerated.dimensions.quality.level,
            signals: regenerated.dimensions.quality.signals || [],
            issues: regenerated.dimensions.quality.issues || [],
            rationale: regenerated.dimensions.quality.rationale || ''
          },
          alerting: {
            score: rawAssessment.dimensionsDetailed?.alerting?.score ?? regenerated.dimensions.alerting.score,
            level: regenerated.dimensions.alerting.level,
            signals: regenerated.dimensions.alerting.signals || [],
            issues: regenerated.dimensions.alerting.issues || [],
            rationale: regenerated.dimensions.alerting.rationale || ''
          },
          cost: {
            score: rawAssessment.dimensionsDetailed?.cost?.score ?? regenerated.dimensions.cost.score,
            level: regenerated.dimensions.cost.level,
            signals: regenerated.dimensions.cost.signals || [],
            issues: regenerated.dimensions.cost.issues || [],
            rationale: regenerated.dimensions.cost.rationale || ''
          }
        },
        insights: regenerated.insights,
        recommendations: regenerated.recommendations,
        classifiedRecommendations: regenerated.classifiedRecommendations,
        rationale: regenerated.rationale,
        executiveSummary: regenerated.executiveSummary,
        roadmap: regenerated.roadmap,
        trainings: regenerated.trainings
      };
    } catch (e) {
      console.warn('[AssessmentReportModal] Could not regenerate in current language, using stored content:', e);
      assessment = rawAssessment;
    }
  }
  
  // Detect legacy assessments (saved before v3.2 - missing rich report data).
  const isLegacy = !assessment.dimensionsDetailed 
    || !assessment.recommendations 
    || !assessment.rationale;
  
  // Helper: extract score from dimension (number or object)
  const getDimScore = (d) => {
    if (d === undefined || d === null) return 0;
    if (typeof d === 'number') return d;
    if (d.score !== undefined) return Number(d.score);
    return 0;
  };
  
  // Dimension labels for fallback generators
  const dimensionNames = {
    adoption: t.dimAdoption || 'Adoption',
    governance: t.dimGovernance || 'Governance',
    quality: t.dimQuality || 'Quality',
    alerting: t.dimAlerting || 'Alerting',
    cost: t.dimCost || 'Cost'
  };
  
  // ==========================================================================
  // Reconstruct the FULL assessment object that AssessmentResults expects.
  // For modern assessments (v3.2+), use saved data directly.
  // For legacy assessments, generate best-effort fallbacks from available scores
  // so the report is still useful.
  // ==========================================================================
  
  // Build detailed dimensions: { adoption: { score, level, signals[], issues[], rationale } }
  const buildDimensions = () => {
    if (assessment.dimensionsDetailed) {
      // Ensure each dimension has a level (fallback to floor of score)
      const result = {};
      Object.entries(assessment.dimensionsDetailed).forEach(([key, dim]) => {
        result[key] = {
          ...dim,
          level: dim.level !== undefined ? dim.level : Math.floor(getDimScore(dim))
        };
      });
      return result;
    }
    // Legacy fallback: scores only, empty signals/issues/rationale
    const result = {};
    Object.keys(dimensionNames).forEach(key => {
      const score = getDimScore(assessment.dimensions?.[key]);
      result[key] = {
        score: score,
        level: Math.floor(score),
        signals: [],
        issues: [],
        rationale: ''
      };
    });
    return result;
  };
  
  // Build rationale: { summary, increased[], prevented[] }
  const buildRationale = () => {
    if (assessment.rationale) return assessment.rationale;
    
    const increased = [];
    const prevented = [];
    Object.entries(dimensionNames).forEach(([key, label]) => {
      const score = getDimScore(assessment.dimensions?.[key]);
      if (score >= 3.5) {
        increased.push(`${label}: ${score.toFixed(2)} (${language === 'pt' ? 'desempenho forte' : 'strong performance'})`);
      } else if (score < 2.5) {
        prevented.push(`${label}: ${score.toFixed(2)} (${language === 'pt' ? 'precisa melhorar' : 'needs improvement'})`);
      }
    });
    
    if (assessment.gatings?.length > 0) {
      assessment.gatings.forEach(g => {
        prevented.push(typeof g === 'string' ? g : (g.name || g.title || JSON.stringify(g)));
      });
    }
    
    const summary = language === 'pt'
      ? `Este assessment atingiu o Nível ${assessment.finalLevel} com score bruto de ${assessment.rawScore?.toFixed(2) || '—'}. O cálculo considera a média das 5 dimensões e aplica regras de gating baseadas em práticas recomendadas.`
      : `This assessment reached Level ${assessment.finalLevel} with a raw score of ${assessment.rawScore?.toFixed(2) || '—'}. The calculation averages the 5 dimensions and applies gating rules based on best practices.`;
    
    return { summary, increased, prevented };
  };
  
  // Build roadmap
  const buildRoadmap = () => {
    if (assessment.roadmap) return assessment.roadmap;
    
    const currentLevel = assessment.finalLevel || 0;
    const nextLevel = Math.min(currentLevel + 1, 5);
    
    const weakDimensions = Object.entries(dimensionNames)
      .map(([key, label]) => ({ key, label, score: getDimScore(assessment.dimensions?.[key]) }))
      .filter(d => d.score < 3.5)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
    
    const phases = weakDimensions.map((d, idx) => ({
      title: language === 'pt' 
        ? `Fase ${idx + 1}: Elevar ${d.label}` 
        : `Phase ${idx + 1}: Improve ${d.label}`,
      duration: idx === 0 ? '30 days' : idx === 1 ? '60 days' : '90 days',
      description: language === 'pt'
        ? `Score atual: ${d.score.toFixed(2)}. Ação prioritária para elevar esta dimensão.`
        : `Current score: ${d.score.toFixed(2)}. Priority action to raise this dimension.`,
      actions: []
    }));
    
    const blockers = assessment.gatings?.length > 0 
      ? assessment.gatings.map(g => typeof g === 'string' ? g : (g.name || g.title || JSON.stringify(g)))
      : [];
    
    return { currentLevel, nextLevel, blockers, phases, milestones: [] };
  };
  
  // Build trainings in the { dimension, reason, priority, courses } format
  const buildTrainings = () => {
    if (assessment.trainings?.length > 0) {
      return assessment.trainings.map(training => ({
        ...training,
        dimension: training.dimension || training.title || 'General',
        reason: training.reason || training.description || '',
        priority: training.priority || 'MEDIUM',
        courses: Array.isArray(training.courses) ? training.courses : [{
          name: training.title || training.name || 'Datadog Learn',
          url: training.url || 'https://learn.datadoghq.com/',
          duration: training.duration || '2-4h',
          description: training.description || ''
        }]
      }));
    }
    
    const weakDims = Object.entries(dimensionNames)
      .map(([key, label]) => ({ key, label, score: getDimScore(assessment.dimensions?.[key]) }))
      .filter(d => d.score < 3.5)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
    
    return weakDims.map(d => ({
      dimension: d.label,
      reason: language === 'pt'
        ? `Sugestão de aprendizado para elevar ${d.label} (score atual: ${d.score.toFixed(2)}).`
        : `Learning suggestion to improve ${d.label} (current score: ${d.score.toFixed(2)}).`,
      priority: d.score < 2.5 ? 'HIGH' : 'MEDIUM',
      courses: [{
        name: `Datadog Learn: ${d.label}`,
        url: 'https://learn.datadoghq.com/',
        duration: d.score < 2 ? '1-2h' : d.score < 3 ? '2-4h' : '4h+',
        description: language === 'pt'
          ? `Curso introdutório focado em ${d.label}.`
          : `Introductory course focused on ${d.label}.`
      }]
    }));
  };
  
  // Rebuild the full assessment object in the shape AssessmentResults expects
  const fullAssessment = {
    finalLevel: assessment.finalLevel,
    rawScore: assessment.rawScore,
    qualifier: assessment.qualifier,
    gatings: assessment.gatings || [],
    dimensions: buildDimensions(),
    insights: {
      strengths: assessment.insights?.strengths || [],
      risks: assessment.insights?.risks || []
    },
    recommendations: assessment.recommendations || [],
    rationale: buildRationale(),
    roadmap: buildRoadmap(),
    trainings: buildTrainings()
  };
  
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '95vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button fixed at top-right */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'sticky',
            top: '1rem',
            left: 'calc(100% - 3.5rem)',
            float: 'right',
            zIndex: 10,
            marginTop: '1rem',
            marginRight: '1rem',
            background: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600'
          }}
          title={language === 'pt' ? 'Fechar' : 'Close'}
        >
          ×
        </button>
        
        <div style={{ padding: '2rem', paddingTop: '1rem' }}>
          {/* Legacy info banner (if applicable) */}
          {isLegacy && (
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
              padding: '0.875rem 1rem',
              fontSize: '0.875rem',
              color: '#1e40af',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>ℹ️</span>
              <div>
                <strong>{language === 'pt' ? 'Assessment de versão anterior' : 'Assessment from a previous version'}</strong>
                <div style={{ fontSize: '0.8125rem', marginTop: '0.25rem', opacity: 0.9 }}>
                  {language === 'pt' 
                    ? 'Este assessment foi salvo antes da v3.2 e alguns detalhes (recomendações completas, plano de ação) foram reconstruídos a partir dos scores. Rode um novo assessment para obter o relatório integral original.'
                    : 'This assessment was saved before v3.2 and some details (full recommendations, action plan) were reconstructed from scores. Run a new assessment to get the original full report.'}
                </div>
              </div>
            </div>
          )}
          
          {/* Reuse the AssessmentResults component in viewMode */}
          <AssessmentResults
            assessment={fullAssessment}
            serviceName={assessment.serviceName || ''}
            teamName={assessment.teamName || customer.customerId}
            businessOwner={assessment.businessOwner || ''}
            technicalOwner={assessment.technicalOwner || ''}
            accountId={assessment.accountId || ''}
            language={language}
            assessmentHistory={[]}
            viewMode={true}
            onClose={onClose}
            assessmentInputData={assessment.inputData || null}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ConfirmDialog — replacement for window.confirm() which is blocked in
// sandboxed artifact iframes.
// ============================================================================
function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, danger, onConfirm, onCancel }) {
  if (!open) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem'
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '440px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: danger ? '#fef2f2' : '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              flexShrink: 0
            }}>
              {danger ? '⚠️' : 'ℹ️'}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.0625rem', fontWeight: '600', color: '#1f2937' }}>
                {title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>
                {message}
              </p>
            </div>
          </div>
        </div>
        <div style={{
          padding: '1rem 1.5rem',
          background: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem'
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'white',
              color: '#4b5563',
              border: '1px solid #d1d5db',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {cancelLabel || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              background: danger ? '#dc2626' : '#632CA6',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Notification — replacement for window.alert() which is blocked in
// sandboxed artifact iframes. Auto-dismisses after 4 seconds.
// ============================================================================
function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  
  if (!message) return null;
  
  const styles = {
    success: { bg: '#d1fae5', border: '#10b981', color: '#065f46', icon: '✅' },
    error: { bg: '#fee2e2', border: '#ef4444', color: '#991b1b', icon: '❌' },
    info: { bg: '#eff6ff', border: '#3b82f6', color: '#1e40af', icon: 'ℹ️' }
  };
  const s = styles[type] || styles.info;
  
  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      zIndex: 3000,
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: '8px',
      padding: '0.875rem 1rem',
      maxWidth: '400px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.625rem',
      cursor: 'pointer'
    }}
    onClick={onClose}
    >
      <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>{s.icon}</span>
      <span style={{ fontSize: '0.875rem', color: s.color, fontWeight: '500', lineHeight: '1.4' }}>
        {message}
      </span>
    </div>
  );
}

// Customer Detail Modal - Enhanced with radar chart, dimensions, and score evolution
function CustomerDetailModal({ customer, onClose, onDataChange, t }) {
  // Get latest assessment for dimension data
  const latest = customer.latestAssessment;
  
  // Edit mode states
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editingCustomerName, setEditingCustomerName] = useState(
    customer.latestAssessment?.teamName || customer.customerId
  );
  const [editingAssessmentId, setEditingAssessmentId] = useState(null);
  const [editingAssessmentName, setEditingAssessmentName] = useState('');
  
  // State for viewing a specific assessment's report
  const [viewingReport, setViewingReport] = useState(null);
  
  // v36: State for recalculate flow
  // recalcPreview holds { assessmentToReplace, recalculatedAssessment, diff } for diff modal
  const [recalcPreview, setRecalcPreview] = useState(null);
  
  // Replacement for browser's blocked confirm() and alert():
  // - confirmDialog holds { title, message, confirmLabel, danger, onConfirm } or null
  // - notification holds { message, type } or null
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // v38: Radar comparison — user picks any 2 assessments to overlay
  // Defaults: most recent (atual) and second-most-recent (anterior).
  // customer.assessments comes sorted newest-first.
  const sortedAssessmentsForCompare = useMemo(() => {
    return [...(customer.assessments || [])].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [customer.assessments]);
  
  const getAssessmentId = (a) => {
    // v38-fix2: Always return STRING. The id field can be a number (Date.now())
    // or a Date object (legacy date fallback). When this value goes into a
    // <select value={...}>, React serializes to string. The onChange returns
    // e.target.value (string) — which then fails strict equality in find()
    // against the original number/Date. Coercing to string everywhere fixes it.
    const raw = a?.assessmentId || a?.id || a?.date;
    if (raw === undefined || raw === null) return '';
    return String(raw);
  };
  
  const [compareCurrentId, setCompareCurrentId] = useState(() => 
    sortedAssessmentsForCompare[0] ? getAssessmentId(sortedAssessmentsForCompare[0]) : null
  );
  const [comparePreviousId, setComparePreviousId] = useState(() => 
    sortedAssessmentsForCompare[1] ? getAssessmentId(sortedAssessmentsForCompare[1]) : null
  );
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Handlers for edit/delete operations
  const handleRenameCustomer = () => {
    if (!editingCustomerName.trim()) return;
    const accountIds = customer.accountIds || [];
    
    if (accountIds.length === 0) {
      console.error('No accountIds found for customer', customer);
      return;
    }
    
    // Rename in ALL accountIds this customer has
    let allSuccess = true;
    accountIds.forEach(accountId => {
      const success = renameAllAssessmentsForCustomer(accountId, editingCustomerName.trim());
      if (!success) allSuccess = false;
    });
    
    if (allSuccess) {
      setIsEditingCustomer(false);
      showNotification(
        t.customerRenamed || (t.locale === 'pt-BR' ? 'Cliente renomeado' : 'Customer renamed'),
        'success'
      );
      if (onDataChange) onDataChange();
    } else {
      showNotification(
        t.locale === 'pt-BR' 
          ? 'Falha ao renomear alguns assessments.' 
          : 'Failed to rename some assessments.',
        'error'
      );
      if (onDataChange) onDataChange();
    }
  };

  const [editingAssessmentAccountId, setEditingAssessmentAccountId] = useState(null);
  
  // v36: Recalculate handlers
  // computes a small diff between original and recalculated assessment
  const computeRecalcDiff = (original, recalculated) => {
    const diff = {
      scoreChanges: [],
      newFields: [],
      changedFields: []
    };
    
    // Score deltas (raw + each dimension)
    const oldRaw = original.rawScore || 0;
    const newRaw = recalculated.rawScore || 0;
    if (Math.abs(oldRaw - newRaw) > 0.01) {
      diff.scoreChanges.push({ key: 'rawScore', label: t.locale === 'pt-BR' ? 'Score geral' : 'Overall score', from: oldRaw, to: newRaw });
    }
    
    const dims = ['adoption', 'governance', 'quality', 'alerting', 'cost'];
    const dimLabels = {
      adoption: t.locale === 'pt-BR' ? 'Adoção' : 'Adoption',
      governance: t.locale === 'pt-BR' ? 'Governança' : 'Governance',
      quality: t.locale === 'pt-BR' ? 'Qualidade' : 'Quality',
      alerting: t.locale === 'pt-BR' ? 'Alertas' : 'Alerting',
      cost: t.locale === 'pt-BR' ? 'Custo' : 'Cost'
    };
    dims.forEach(dim => {
      const oldDim = original.dimensions?.[dim];
      const newDim = recalculated.dimensions?.[dim];
      const oldScore = typeof oldDim === 'object' ? oldDim?.score : oldDim;
      const newScore = typeof newDim === 'object' ? newDim?.score : newDim;
      if (typeof oldScore === 'number' && typeof newScore === 'number' && Math.abs(oldScore - newScore) > 0.01) {
        diff.scoreChanges.push({ key: dim, label: dimLabels[dim], from: oldScore, to: newScore });
      }
    });
    
    // New fields added by newer logic versions
    const newFieldsToCheck = [
      { key: 'executiveSummary', label: t.locale === 'pt-BR' ? 'Resumo Executivo' : 'Executive Summary' },
      { key: 'classifiedRecommendations', label: t.locale === 'pt-BR' ? 'Quick Wins + Iniciativas Estratégicas' : 'Quick Wins + Strategic Initiatives' }
    ];
    newFieldsToCheck.forEach(({ key, label }) => {
      if (!original[key] && recalculated[key]) {
        diff.newFields.push(label);
      }
    });
    
    // Number of recommendations escalated (v35)
    const oldEscalated = (original.recommendations || []).filter(r => r.escalationReason).length;
    const newEscalated = (recalculated.recommendations || []).filter(r => r.escalationReason).length;
    if (oldEscalated !== newEscalated) {
      diff.changedFields.push({
        label: t.locale === 'pt-BR' ? 'Recomendações com severidade elevada' : 'Recommendations with escalated severity',
        from: oldEscalated,
        to: newEscalated
      });
    }
    
    // Number of risks (v31 added more)
    const oldRisks = (original.insights?.risks || []).length;
    const newRisks = (recalculated.insights?.risks || []).length;
    if (oldRisks !== newRisks) {
      diff.changedFields.push({
        label: t.locale === 'pt-BR' ? 'Riscos identificados' : 'Identified risks',
        from: oldRisks,
        to: newRisks
      });
    }
    
    return diff;
  };
  
  const handleStartRecalc = (assessment) => {
    if (!assessment.inputData) {
      showNotification(
        t.locale === 'pt-BR' 
          ? 'Este assessment não possui dados de entrada salvos. Recarregue os PDFs para recalcular.' 
          : 'This assessment has no saved input data. Re-upload PDFs to recalculate.',
        'error'
      );
      return;
    }
    
    try {
      // v36 fix: Use the CURRENT UI language, not the language the assessment was saved in.
      // This ensures CSM recalculating from a PT-BR session gets PT-BR content,
      // even if the original assessment was created with the UI in English.
      const assessmentLang = t.locale === 'pt-BR' ? 'pt' : 'en';
      const customerName = assessment.teamName || assessment.serviceName || customer.customerId;
      const recalculated = assessMaturity(assessment.inputData, assessmentLang, customerName);
      
      // Build full recalculated assessment object preserving identity fields
      const recalculatedAssessment = {
        ...assessment,
        // Update language stamp to reflect the new content language
        assessmentLanguage: assessmentLang,
        // Score & maturity (recalculated, NOT preserved)
        finalLevel: recalculated.finalLevel,
        rawScore: recalculated.rawScore,
        qualifier: recalculated.qualifier,
        gatings: recalculated.gatings,
        // Dimensions & insights (recalculated)
        dimensions: recalculated.dimensions,
        // v36-fix2: ALSO regenerate dimensionsDetailed (used by report viewer)
        // Without this, the saved signals/issues/rationale stay in the old language.
        dimensionsDetailed: {
          adoption: {
            score: recalculated.dimensions.adoption.score,
            level: recalculated.dimensions.adoption.level,
            signals: recalculated.dimensions.adoption.signals || [],
            issues: recalculated.dimensions.adoption.issues || [],
            rationale: recalculated.dimensions.adoption.rationale || ''
          },
          governance: {
            score: recalculated.dimensions.governance.score,
            level: recalculated.dimensions.governance.level,
            signals: recalculated.dimensions.governance.signals || [],
            issues: recalculated.dimensions.governance.issues || [],
            rationale: recalculated.dimensions.governance.rationale || ''
          },
          quality: {
            score: recalculated.dimensions.quality.score,
            level: recalculated.dimensions.quality.level,
            signals: recalculated.dimensions.quality.signals || [],
            issues: recalculated.dimensions.quality.issues || [],
            rationale: recalculated.dimensions.quality.rationale || ''
          },
          alerting: {
            score: recalculated.dimensions.alerting.score,
            level: recalculated.dimensions.alerting.level,
            signals: recalculated.dimensions.alerting.signals || [],
            issues: recalculated.dimensions.alerting.issues || [],
            rationale: recalculated.dimensions.alerting.rationale || ''
          },
          cost: {
            score: recalculated.dimensions.cost.score,
            level: recalculated.dimensions.cost.level,
            signals: recalculated.dimensions.cost.signals || [],
            issues: recalculated.dimensions.cost.issues || [],
            rationale: recalculated.dimensions.cost.rationale || ''
          }
        },
        insights: recalculated.insights,
        // Recommendations (escalated)
        recommendations: recalculated.recommendations,
        classifiedRecommendations: recalculated.classifiedRecommendations,
        // Narrative
        rationale: recalculated.rationale,
        executiveSummary: recalculated.executiveSummary,
        roadmap: recalculated.roadmap,
        trainings: recalculated.trainings,
        // Update flag for tracking
        recalculatedAt: new Date().toISOString(),
        recalculatedFromVersion: assessment.recalculatedAt ? 'v-recalc' : 'v-original'
      };
      
      const diff = computeRecalcDiff(assessment, recalculatedAssessment);
      
      setRecalcPreview({
        assessmentToReplace: assessment,
        recalculatedAssessment,
        diff
      });
    } catch (e) {
      console.error('Recalculation failed:', e);
      showNotification(
        t.locale === 'pt-BR' 
          ? `Falha ao recalcular: ${e.message}` 
          : `Recalculation failed: ${e.message}`,
        'error'
      );
    }
  };
  
  const handleConfirmRecalc = () => {
    if (!recalcPreview) return;
    
    const { assessmentToReplace, recalculatedAssessment } = recalcPreview;
    const accountId = assessmentToReplace.accountId || customer.customerId;
    
    try {
      // addAssessmentToStorage updates in place when assessmentId matches
      addAssessmentToStorage(accountId, recalculatedAssessment);
      
      setRecalcPreview(null);
      showNotification(
        t.locale === 'pt-BR' 
          ? 'Assessment recalculado com sucesso!' 
          : 'Assessment recalculated successfully!',
        'success'
      );
      
      if (onDataChange) onDataChange();
    } catch (e) {
      console.error('Save failed:', e);
      showNotification(
        t.locale === 'pt-BR' 
          ? `Falha ao salvar: ${e.message}` 
          : `Save failed: ${e.message}`,
        'error'
      );
    }
  };

  const handleStartEditAssessment = (assessment) => {
    setEditingAssessmentId(assessment.id || assessment.assessmentId);
    setEditingAssessmentName(assessment.teamName || '');
    // Remember the specific accountId for this assessment (customer may have multiple)
    setEditingAssessmentAccountId(assessment.accountId || customer.accountIds[0]);
  };

  const handleSaveAssessmentRename = () => {
    if (!editingAssessmentName.trim()) return;
    const accountId = editingAssessmentAccountId || customer.accountIds[0];
    
    if (!accountId || !editingAssessmentId) {
      console.error('Missing accountId or assessmentId for rename', { accountId, editingAssessmentId });
      return;
    }
    
    const success = renameAssessmentInStorage(
      accountId, 
      editingAssessmentId, 
      editingAssessmentName.trim()
    );
    if (success) {
      setEditingAssessmentId(null);
      setEditingAssessmentName('');
      setEditingAssessmentAccountId(null);
      showNotification(
        t.locale === 'pt-BR' ? 'Renomeado com sucesso' : 'Renamed successfully',
        'success'
      );
      if (onDataChange) onDataChange();
    } else {
      showNotification(
        t.locale === 'pt-BR' 
          ? 'Falha ao renomear. Verifique o console (F12).' 
          : 'Failed to rename. Check console (F12).',
        'error'
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingAssessmentId(null);
    setEditingAssessmentName('');
    setEditingAssessmentAccountId(null);
  };

  const performDeleteAssessment = (assessment) => {
    console.log('🗑️ [DELETE] Performing delete', { assessment });
    
    // Use the assessment's own accountId, NOT customer.accountIds[0]
    // (a customer may have multiple accountIds grouped together)
    const accountId = assessment.accountId || customer.accountIds[0];
    const assessmentId = assessment.id || assessment.assessmentId;
    
    console.log('🗑️ [DELETE] Parameters:', {
      accountId,
      assessmentId,
      'customer.accountIds': customer.accountIds,
      'assessment.accountId': assessment.accountId,
      storageKey: `datadog-assessments-${accountId}`
    });
    
    if (!accountId || !assessmentId) {
      console.error('🗑️ [DELETE] Missing accountId or assessmentId', { accountId, assessmentId, assessment });
      showNotification(
        t.locale === 'pt-BR' 
          ? 'Erro: não foi possível identificar o assessment.' 
          : 'Error: could not identify the assessment.',
        'error'
      );
      return;
    }
    
    const success = deleteAssessmentFromStorage(accountId, assessmentId);
    console.log('🗑️ [DELETE] Result:', success);
    
    if (success) {
      showNotification(
        t.assessmentDeleted || (t.locale === 'pt-BR' ? 'Assessment apagado' : 'Assessment deleted'),
        'success'
      );
      if (onDataChange) onDataChange();
    } else {
      showNotification(
        t.locale === 'pt-BR' 
          ? 'Falha ao apagar. Verifique o console (F12).' 
          : 'Failed to delete. Check console (F12).',
        'error'
      );
    }
  };
  
  const handleDeleteAssessment = (assessment) => {
    console.log('🗑️ [DELETE] Handler triggered', { assessment });
    setConfirmDialog({
      title: t.locale === 'pt-BR' ? 'Apagar assessment?' : 'Delete assessment?',
      message: t.confirmDeleteAssessment,
      confirmLabel: t.locale === 'pt-BR' ? 'Apagar' : 'Delete',
      cancelLabel: t.locale === 'pt-BR' ? 'Cancelar' : 'Cancel',
      danger: true,
      onConfirm: () => {
        setConfirmDialog(null);
        performDeleteAssessment(assessment);
      }
    });
  };

  const performDeleteAllAssessments = () => {
    console.log('🗑️ [DELETE ALL] Performing delete all');
    
    // A customer may have multiple accountIds grouped together (same customerId prefix).
    // We need to delete all of them.
    const accountIds = customer.accountIds || [];
    
    if (accountIds.length === 0) {
      console.error('No accountIds found for customer', customer);
      showNotification(
        t.locale === 'pt-BR' 
          ? 'Erro: nenhum accountId encontrado.' 
          : 'Error: no accountId found.',
        'error'
      );
      return;
    }
    
    let allSuccess = true;
    accountIds.forEach(accountId => {
      const success = deleteAllAssessmentsForCustomer(accountId);
      if (!success) allSuccess = false;
    });
    
    if (allSuccess) {
      showNotification(
        t.allAssessmentsDeleted || (t.locale === 'pt-BR' ? 'Todos os assessments apagados' : 'All assessments deleted'),
        'success'
      );
      if (onDataChange) onDataChange();
    } else {
      showNotification(
        t.locale === 'pt-BR' 
          ? 'Falha ao apagar alguns assessments.' 
          : 'Failed to delete some assessments.',
        'error'
      );
      if (onDataChange) onDataChange();
    }
  };
  
  const handleDeleteAllAssessments = () => {
    console.log('🗑️ [DELETE ALL] Handler triggered');
    setConfirmDialog({
      title: t.locale === 'pt-BR' ? 'Apagar TODOS os assessments?' : 'Delete ALL assessments?',
      message: t.confirmDeleteAllAssessments,
      confirmLabel: t.locale === 'pt-BR' ? 'Apagar todos' : 'Delete all',
      cancelLabel: t.locale === 'pt-BR' ? 'Cancelar' : 'Cancel',
      danger: true,
      onConfirm: () => {
        setConfirmDialog(null);
        performDeleteAllAssessments();
      }
    });
  };
  
  // Build radar chart data from dimensions
  const getDimScore = (d) => {
    if (!d) return 0;
    if (typeof d === 'number') return d;
    if (d.score !== undefined) return Number(d.score);
    if (d.level !== undefined) return Number(d.level);
    return 0;
  };

  // v38: Resolve the 2 assessments selected for radar comparison.
  // Falls back to latest + previous when state is null (initial render or when
  // user deletes an assessment that was selected).
  const compareCurrent = useMemo(() => {
    return sortedAssessmentsForCompare.find(a => getAssessmentId(a) === compareCurrentId) 
      || sortedAssessmentsForCompare[0] 
      || null;
  }, [compareCurrentId, sortedAssessmentsForCompare]);
  
  const comparePrevious = useMemo(() => {
    if (!comparePreviousId) return null;
    return sortedAssessmentsForCompare.find(a => getAssessmentId(a) === comparePreviousId) || null;
  }, [comparePreviousId, sortedAssessmentsForCompare]);
  
  // Should the comparison UI be available at all? Only if there are ≥2 assessments.
  const canCompareAssessments = sortedAssessmentsForCompare.length >= 2;
  
  // v38: radar data — when 2 assessments are selected, build 2 series.
  // When only 1 is available (or selected), keep the single-series legacy shape.
  const radarData = useMemo(() => {
    const baseAssessment = compareCurrent || latest;
    if (!baseAssessment?.dimensions) return null;
    
    const dimDefs = [
      { key: 'adoption',  label: t.locale === 'pt-BR' ? 'Adoção'      : 'Adoption' },
      { key: 'governance',label: t.locale === 'pt-BR' ? 'Governança' : 'Governance' },
      { key: 'quality',   label: t.locale === 'pt-BR' ? 'Qualidade'  : 'Quality' },
      { key: 'alerting',  label: t.locale === 'pt-BR' ? 'Alertas'    : 'Alerting' },
      { key: 'cost',      label: t.locale === 'pt-BR' ? 'Custo'      : 'Cost' }
    ];
    
    return dimDefs.map(dim => {
      const row = {
        dimension: dim.label,
        fullMark: 5,
        // Backward-compatible single-series key
        score: getDimScore(baseAssessment.dimensions[dim.key])
      };
      // When 2 assessments are selected, expose them under stable keys so the
      // <Radar> components below can read them with dataKey="current"/"previous".
      if (canCompareAssessments && comparePrevious && compareCurrent) {
        row.current  = getDimScore(compareCurrent.dimensions[dim.key]);
        row.previous = getDimScore(comparePrevious.dimensions[dim.key]);
      }
      return row;
    });
  }, [compareCurrent, comparePrevious, latest, t.locale, canCompareAssessments]);
  
  // v38: per-dimension delta summary (used in caption below radar)
  const radarDeltas = useMemo(() => {
    if (!canCompareAssessments || !comparePrevious || !compareCurrent) return null;
    const dimDefs = [
      { key: 'adoption',  label: t.locale === 'pt-BR' ? 'Adoção'      : 'Adoption' },
      { key: 'governance',label: t.locale === 'pt-BR' ? 'Governança' : 'Governance' },
      { key: 'quality',   label: t.locale === 'pt-BR' ? 'Qualidade'  : 'Quality' },
      { key: 'alerting',  label: t.locale === 'pt-BR' ? 'Alertas'    : 'Alerting' },
      { key: 'cost',      label: t.locale === 'pt-BR' ? 'Custo'      : 'Cost' }
    ];
    return dimDefs.map(dim => {
      const cur  = getDimScore(compareCurrent.dimensions[dim.key]);
      const prev = getDimScore(comparePrevious.dimensions[dim.key]);
      return {
        label: dim.label,
        current: cur,
        previous: prev,
        delta: cur - prev
      };
    });
  }, [compareCurrent, comparePrevious, t.locale, canCompareAssessments]);

  // Build evolution chart data from all assessments (sorted by date, oldest first)
  const evolutionData = [...customer.assessments]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((a, idx) => ({
      index: idx + 1,
      date: new Date(a.date).toLocaleDateString(t.locale, { month: 'short', day: 'numeric' }),
      score: a.rawScore,
      level: a.finalLevel
    }));

  // Determine trend color
  const trendColor = customer.trend > 0.1 ? '#059669' 
    : customer.trend < -0.1 ? '#dc2626' 
    : '#6b7280';

  const levelColor = customer.avgScore >= 4 ? '#059669' 
    : customer.avgScore >= 3 ? '#3b82f6' 
    : customer.avgScore >= 2 ? '#f59e0b' 
    : '#dc2626';

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}
      >
        {/* Header with gradient */}
        <div style={{
          background: `linear-gradient(135deg, #632CA6 0%, #9560ca 100%)`,
          padding: '2rem',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              {isEditingCustomer ? (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    value={editingCustomerName}
                    onChange={(e) => setEditingCustomerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameCustomer();
                      if (e.key === 'Escape') {
                        setIsEditingCustomer(false);
                        setEditingCustomerName(customer.latestAssessment?.teamName || customer.customerId);
                      }
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      padding: '0.5rem 0.875rem',
                      border: '2px solid rgba(255,255,255,0.5)',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleRenameCustomer}
                    style={{
                      background: 'rgba(255,255,255,0.25)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.4)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    ✓ {t.save}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingCustomer(false);
                      setEditingCustomerName(customer.latestAssessment?.teamName || customer.customerId);
                    }}
                    style={{
                      background: 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.875rem'
                    }}
                  >
                    {t.cancel}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700' }}>
                    {customer.latestAssessment?.teamName || customer.customerId}
                  </h2>
                  <button
                    onClick={() => setIsEditingCustomer(true)}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.25)',
                      padding: '0.375rem 0.625rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    title={t.renameCustomer}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t.edit}
                  </button>
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                fontSize: '0.875rem', 
                opacity: 0.9,
                flexWrap: 'wrap'
              }}>
                <span>{t.account}: {customer.accountIds[0]}</span>
                <span>•</span>
                <span>{customer.assessmentCount} {customer.assessmentCount > 1 ? t.assessments : t.assessment}</span>
                <span>•</span>
                <span>{customer.orgUnits.length} {customer.orgUnits.length > 1 ? t.units : t.unit}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.25rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              aria-label={t.close}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {/* KPI Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: `${levelColor}11`,
              border: `1px solid ${levelColor}44`,
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                {t.avgScoreLabel}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: levelColor, lineHeight: '1' }}>
                {customer.avgScore.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {t.level} {Math.floor(customer.avgScore)}
              </div>
            </div>

            <div style={{
              background: `${trendColor}11`,
              border: `1px solid ${trendColor}44`,
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                {t.trend}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: trendColor, lineHeight: '1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{customer.trend > 0 ? '↗' : customer.trend < 0 ? '↘' : '→'}</span>
                <span>{customer.trend > 0 ? '+' : ''}{customer.trend.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {customer.trend > 0.1 ? (t.locale === 'pt-BR' ? 'Melhorando' : 'Improving') 
                  : customer.trend < -0.1 ? (t.locale === 'pt-BR' ? 'Em risco' : 'At risk')
                  : (t.locale === 'pt-BR' ? 'Estável' : 'Stable')}
              </div>
            </div>

            <div style={{
              background: '#632CA611',
              border: '1px solid #632CA644',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                {t.assessments}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#632CA6', lineHeight: '1' }}>
                {customer.assessmentCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {customer.orgUnits.length} {customer.orgUnits.length > 1 ? t.units : t.unit}
              </div>
            </div>
          </div>

          {/* Owners Info */}
          {(latest?.businessOwner || latest?.technicalOwner) && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '2rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              {latest?.businessOwner && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {t.business}
                  </div>
                  <div style={{ fontSize: '0.9375rem', color: '#1f2937', fontWeight: '500' }}>
                    {latest.businessOwner}
                  </div>
                </div>
              )}
              {latest?.technicalOwner && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {t.technical}
                  </div>
                  <div style={{ fontSize: '0.9375rem', color: '#1f2937', fontWeight: '500' }}>
                    {latest.technicalOwner}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Charts Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: radarData && evolutionData.length > 1 ? '1fr 1fr' : '1fr', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Radar Chart - Dimensions */}
            {radarData && (
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#1f2937', fontWeight: '600' }}>
                    {canCompareAssessments && comparePrevious 
                      ? (t.locale === 'pt-BR' ? 'Comparação entre Avaliações' : 'Assessment Comparison')
                      : t.dimensionsTitle}
                  </h3>
                </div>
                
                {/* v38: Dropdowns to pick which 2 assessments to compare */}
                {canCompareAssessments && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '0.75rem', 
                    marginBottom: '1rem',
                    fontSize: '0.8125rem'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '0.25rem' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#632CA6', marginRight: '0.375rem', verticalAlign: 'middle' }} />
                        {t.locale === 'pt-BR' ? 'Atual' : 'Current'}
                      </label>
                      <select 
                        value={compareCurrentId || ''} 
                        onChange={(e) => setCompareCurrentId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.8125rem',
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        {sortedAssessmentsForCompare.map((a, idx) => {
                          const aid = getAssessmentId(a);
                          const dateLabel = new Date(a.date).toLocaleDateString(t.locale, { day: '2-digit', month: 'short', year: 'numeric' });
                          const isPrevSelected = aid === comparePreviousId;
                          return (
                            <option key={aid} value={aid} disabled={isPrevSelected}>
                              {idx === 0 ? '★ ' : ''}{dateLabel} — {t.locale === 'pt-BR' ? 'Nível' : 'Level'} {a.finalLevel}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '0.25rem' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#0891b2', marginRight: '0.375rem', verticalAlign: 'middle' }} />
                        {t.locale === 'pt-BR' ? 'Comparar com' : 'Compare with'}
                      </label>
                      <select 
                        value={comparePreviousId || ''} 
                        onChange={(e) => setComparePreviousId(e.target.value || null)}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.8125rem',
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">{t.locale === 'pt-BR' ? 'Sem comparação' : 'No comparison'}</option>
                        {sortedAssessmentsForCompare.map((a, idx) => {
                          const aid = getAssessmentId(a);
                          const dateLabel = new Date(a.date).toLocaleDateString(t.locale, { day: '2-digit', month: 'short', year: 'numeric' });
                          const isCurSelected = aid === compareCurrentId;
                          return (
                            <option key={aid} value={aid} disabled={isCurSelected}>
                              {idx === 0 ? '★ ' : ''}{dateLabel} — {t.locale === 'pt-BR' ? 'Nível' : 'Level'} {a.finalLevel}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}
                
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fill: '#4b5563', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                    />
                    {canCompareAssessments && comparePrevious ? (
                      // v38: Two-series radar — overlay current and previous.
                      // Use array (not fragment) — Recharts iterates children flatly,
                      // so a Fragment may break legend/tooltip wiring on some versions.
                      [
                        <Radar 
                          key="prev"
                          name={t.locale === 'pt-BR' ? 'Anterior' : 'Previous'}
                          dataKey="previous" 
                          stroke="#0891b2" 
                          fill="#0891b2" 
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />,
                        <Radar 
                          key="curr"
                          name={t.locale === 'pt-BR' ? 'Atual' : 'Current'}
                          dataKey="current" 
                          stroke="#632CA6" 
                          fill="#632CA6" 
                          fillOpacity={0.4}
                          strokeWidth={2}
                        />
                      ]
                    ) : (
                      // Single-series fallback (1 assessment only, or no comparison selected)
                      <Radar 
                        name="Score" 
                        dataKey="score" 
                        stroke="#632CA6" 
                        fill="#632CA6" 
                        fillOpacity={0.4}
                        strokeWidth={2}
                      />
                    )}
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                      }}
                      formatter={(value) => Number(value).toFixed(2)}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                
                {/* v38: Compact delta summary — one line per dimension with arrow */}
                {radarDeltas && (
                  <div style={{ 
                    marginTop: '0.875rem', 
                    paddingTop: '0.875rem', 
                    borderTop: '1px solid #f3f4f6',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    {radarDeltas.map((d) => {
                      const deltaColor = d.delta > 0.05 ? '#059669' : d.delta < -0.05 ? '#dc2626' : '#6b7280';
                      const arrow = d.delta > 0.05 ? '↑' : d.delta < -0.05 ? '↓' : '→';
                      return (
                        <div key={d.label} style={{ textAlign: 'center' }}>
                          <div style={{ color: '#9ca3af', fontSize: '0.6875rem', marginBottom: '0.125rem' }}>
                            {d.label}
                          </div>
                          <div style={{ color: deltaColor, fontWeight: '600' }}>
                            {arrow} {d.delta > 0 ? '+' : ''}{d.delta.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Evolution Chart - Score over time */}
            {evolutionData.length > 1 && (
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#1f2937', fontWeight: '600' }}>
                  {t.evolutionTitle}
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={evolutionData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                    />
                    <YAxis 
                      domain={[0, 5]} 
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                      }}
                      formatter={(value) => [Number(value).toFixed(2), 'Score']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#632CA6" 
                      strokeWidth={3}
                      dot={{ fill: '#632CA6', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* No dimension data fallback */}
          {!radarData && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#92400e',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              ⚠️ {t.noDimensionData}
            </div>
          )}

          {/* Assessment History Table */}
          <div style={{ 
            background: '#f9fafb', 
            padding: '1.5rem', 
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#1f2937', fontWeight: '600' }}>
                {t.assessmentHistory}
              </h3>
              {customer.assessments.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('🗑️ [DELETE ALL BUTTON CLICKED]', customer);
                    handleDeleteAllAssessments();
                  }}
                  style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.borderColor = '#fca5a5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fef2f2';
                    e.currentTarget.style.borderColor = '#fecaca';
                  }}
                  title={t.deleteAllAssessments}
                >
                  <span style={{ pointerEvents: 'none', userSelect: 'none' }}>🗑️</span>
                  <span style={{ pointerEvents: 'none', userSelect: 'none' }}>{t.deleteAllAssessments}</span>
                </button>
              )}
            </div>
            
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {customer.assessments.slice(0, 8).map((assessment, idx) => {
                const prevScore = idx < customer.assessments.length - 1 
                  ? customer.assessments[idx + 1].rawScore 
                  : null;
                const delta = prevScore !== null ? assessment.rawScore - prevScore : null;
                const assessmentId = assessment.id || assessment.assessmentId;
                const isBeingEdited = editingAssessmentId === assessmentId;
                
                return (
                  <div key={assessmentId || idx} style={{
                    background: 'white',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: isBeingEdited ? '2px solid #632CA6' : '1px solid #e5e7eb',
                    gap: '1rem',
                    transition: 'border 0.2s'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.9375rem' }}>
                        {new Date(assessment.date).toLocaleDateString(t.locale, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      {isBeingEdited ? (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={editingAssessmentName}
                            onChange={(e) => setEditingAssessmentName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveAssessmentRename();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            autoFocus
                            placeholder={t.newTeamName}
                            style={{
                              flex: 1,
                              fontSize: '0.8125rem',
                              padding: '0.375rem 0.625rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              outline: 'none',
                              color: '#1f2937'
                            }}
                          />
                          <button
                            onClick={handleSaveAssessmentRename}
                            style={{
                              background: '#632CA6',
                              color: 'white',
                              border: 'none',
                              padding: '0.375rem 0.75rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              background: 'transparent',
                              color: '#6b7280',
                              border: '1px solid #d1d5db',
                              padding: '0.375rem 0.75rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.125rem' }}>
                          {assessment.teamName}
                        </div>
                      )}
                    </div>
                    {!isBeingEdited && (
                      <>
                        {delta !== null && Math.abs(delta) > 0.01 && (
                          <div style={{
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            color: delta > 0 ? '#059669' : '#dc2626',
                            padding: '0.25rem 0.5rem',
                            background: delta > 0 ? '#d1fae5' : '#fef2f2',
                            borderRadius: '4px'
                          }}>
                            {delta > 0 ? '+' : ''}{delta.toFixed(2)}
                          </div>
                        )}
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: '#632CA6',
                          minWidth: '60px',
                          textAlign: 'right'
                        }}>
                          {assessment.rawScore.toFixed(2)}
                        </div>
                        {/* Edit/View/Delete action buttons */}
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              console.log('✏️ [EDIT BUTTON CLICKED]', assessment);
                              handleStartEditAssessment(assessment);
                            }}
                            style={{
                              background: '#f3f4f6',
                              color: '#4b5563',
                              border: '1px solid #d1d5db',
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                              fontSize: '16px',
                              padding: 0,
                              lineHeight: 1,
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#e5e7eb';
                              e.currentTarget.style.color = '#632CA6';
                              e.currentTarget.style.borderColor = '#632CA6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#f3f4f6';
                              e.currentTarget.style.color = '#4b5563';
                              e.currentTarget.style.borderColor = '#d1d5db';
                            }}
                            title={t.renameAssessment}
                          >
                            <span style={{ pointerEvents: 'none', userSelect: 'none' }}>✏️</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              console.log('📄 [VIEW REPORT BUTTON CLICKED]', assessment);
                              setViewingReport(assessment);
                            }}
                            style={{
                              background: '#eff6ff',
                              color: '#1e40af',
                              border: '1px solid #bfdbfe',
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                              fontSize: '16px',
                              padding: 0,
                              lineHeight: 1,
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#dbeafe';
                              e.currentTarget.style.borderColor = '#60a5fa';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#eff6ff';
                              e.currentTarget.style.borderColor = '#bfdbfe';
                            }}
                            title={t.viewReport || 'Ver Relatório'}
                          >
                            <span style={{ pointerEvents: 'none', userSelect: 'none' }}>📄</span>
                          </button>
                          {/* v36: Recalculate button — only if inputData is present */}
                          {assessment.inputData && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleStartRecalc(assessment);
                              }}
                              style={{
                                background: '#f5f3ff',
                                color: '#632CA6',
                                border: '1px solid #ddd6fe',
                                width: '36px',
                                height: '36px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                fontSize: '16px',
                                padding: 0,
                                lineHeight: 1,
                                flexShrink: 0
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#ede9fe';
                                e.currentTarget.style.borderColor = '#a78bfa';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f5f3ff';
                                e.currentTarget.style.borderColor = '#ddd6fe';
                              }}
                              title={t.locale === 'pt-BR' 
                                ? 'Recalcular com lógica atual' 
                                : 'Recalculate with current logic'}
                            >
                              <span style={{ pointerEvents: 'none', userSelect: 'none' }}>🔄</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              console.log('🗑️ [DELETE BUTTON CLICKED]', assessment);
                              handleDeleteAssessment(assessment);
                            }}
                            style={{
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fecaca',
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                              fontSize: '16px',
                              padding: 0,
                              lineHeight: 1,
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                              e.currentTarget.style.borderColor = '#f87171';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#fef2f2';
                              e.currentTarget.style.borderColor = '#fecaca';
                            }}
                            title={t.deleteAssessment}
                          >
                            <span style={{ pointerEvents: 'none', userSelect: 'none' }}>🗑️</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            
            {customer.assessments.length > 8 && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '0.75rem', 
                fontSize: '0.8125rem', 
                color: '#6b7280' 
              }}>
                + {customer.assessments.length - 8} {t.locale === 'pt-BR' ? 'mais' : 'more'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Assessment Report Modal - shows when user clicks 📄 to view a specific assessment */}
      {viewingReport && (
        <AssessmentReportModal
          assessment={viewingReport}
          customer={customer}
          onClose={() => setViewingReport(null)}
          t={t}
        />
      )}
      
      {/* v36: Recalculate Diff Preview Modal */}
      {recalcPreview && (
        <div
          onClick={() => setRecalcPreview(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '12px', padding: '2rem',
              maxWidth: '700px', width: '100%', maxHeight: '85vh',
              overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🔄</span>
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>
                {t.locale === 'pt-BR' ? 'Recalcular Assessment' : 'Recalculate Assessment'}
              </h2>
            </div>
            <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
              {t.locale === 'pt-BR' 
                ? 'Pré-visualização das mudanças que serão aplicadas ao recalcular este assessment com a lógica atual.' 
                : 'Preview of the changes that will be applied when recalculating this assessment with current logic.'}
            </p>
            
            {/* Score Changes */}
            {recalcPreview.diff.scoreChanges.length > 0 ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: '#1f2937' }}>
                  📊 {t.locale === 'pt-BR' ? 'Alterações de Score' : 'Score Changes'}
                </h3>
                <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '0.75rem' }}>
                  {recalcPreview.diff.scoreChanges.map((change, idx) => {
                    const delta = change.to - change.from;
                    const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
                    const color = delta > 0 ? '#059669' : delta < 0 ? '#dc2626' : '#6b7280';
                    return (
                      <div key={idx} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '0.375rem 0', borderBottom: idx < recalcPreview.diff.scoreChanges.length - 1 ? '1px solid #e5e7eb' : 'none',
                        fontSize: '0.875rem'
                      }}>
                        <span style={{ color: '#4b5563' }}>{change.label}</span>
                        <span>
                          <span style={{ color: '#9ca3af' }}>{change.from.toFixed(2)}</span>
                          {' '}<span style={{ color }}>{arrow}</span>{' '}
                          <span style={{ color, fontWeight: 600 }}>{change.to.toFixed(2)}</span>
                          {' '}<span style={{ color, fontSize: '0.75rem' }}>
                            ({delta > 0 ? '+' : ''}{delta.toFixed(2)})
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{
                background: '#f0fdf4', borderLeft: '3px solid #10b981',
                padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1.5rem',
                fontSize: '0.875rem', color: '#065f46'
              }}>
                ✓ {t.locale === 'pt-BR' 
                  ? 'Scores numéricos não mudam — apenas conteúdo narrativo será atualizado.'
                  : 'Numerical scores will not change — only narrative content will be updated.'}
              </div>
            )}
            
            {/* New fields */}
            {recalcPreview.diff.newFields.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: '#1f2937' }}>
                  ✨ {t.locale === 'pt-BR' ? 'Novas Seções' : 'New Sections'}
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                  {recalcPreview.diff.newFields.map((field, idx) => (
                    <li key={idx} style={{ padding: '0.25rem 0' }}>{field}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Changed counts (escalations, risks) */}
            {recalcPreview.diff.changedFields.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: '#1f2937' }}>
                  🔄 {t.locale === 'pt-BR' ? 'Conteúdo Atualizado' : 'Updated Content'}
                </h3>
                <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '0.75rem' }}>
                  {recalcPreview.diff.changedFields.map((change, idx) => (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '0.375rem 0', borderBottom: idx < recalcPreview.diff.changedFields.length - 1 ? '1px solid #e5e7eb' : 'none',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ color: '#4b5563' }}>{change.label}</span>
                      <span>
                        <span style={{ color: '#9ca3af' }}>{change.from}</span>
                        {' → '}
                        <span style={{ color: '#1f2937', fontWeight: 600 }}>{change.to}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* No changes case */}
            {recalcPreview.diff.scoreChanges.length === 0 
              && recalcPreview.diff.newFields.length === 0
              && recalcPreview.diff.changedFields.length === 0 && (
              <div style={{
                background: '#f9fafb', padding: '1rem', borderRadius: '8px',
                color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                {t.locale === 'pt-BR' 
                  ? 'Nenhuma mudança detectada. O assessment já está atualizado.' 
                  : 'No changes detected. Assessment is already up to date.'}
              </div>
            )}
            
            <div style={{ 
              background: '#fef3c7', borderLeft: '3px solid #f59e0b',
              padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1.5rem',
              fontSize: '0.8125rem', color: '#78350f'
            }}>
              ⚠️ {t.locale === 'pt-BR' 
                ? 'Esta ação irá sobrescrever o assessment salvo. A data original e ID serão preservados.' 
                : 'This action will overwrite the saved assessment. Original date and ID will be preserved.'}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setRecalcPreview(null)}
                style={{
                  padding: '0.625rem 1.25rem', background: 'white',
                  border: '1px solid #d1d5db', borderRadius: '6px',
                  cursor: 'pointer', color: '#4b5563', fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {t.locale === 'pt-BR' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setConfirmDialog({
                    title: t.locale === 'pt-BR' ? 'Confirmar recálculo' : 'Confirm recalculation',
                    message: t.locale === 'pt-BR' 
                      ? 'Tem certeza que deseja sobrescrever o assessment com a versão recalculada?' 
                      : 'Are you sure you want to overwrite the assessment with the recalculated version?',
                    confirmLabel: t.locale === 'pt-BR' ? 'Sim, recalcular' : 'Yes, recalculate',
                    cancelLabel: t.locale === 'pt-BR' ? 'Cancelar' : 'Cancel',
                    onConfirm: () => {
                      handleConfirmRecalc();
                      setConfirmDialog(null);
                    }
                  });
                }}
                style={{
                  padding: '0.625rem 1.25rem', background: '#632CA6',
                  border: 'none', borderRadius: '6px', cursor: 'pointer',
                  color: 'white', fontSize: '0.875rem', fontWeight: 500
                }}
              >
                🔄 {t.locale === 'pt-BR' ? 'Aplicar Recálculo' : 'Apply Recalculation'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Dialog - replaces window.confirm() which is blocked in sandboxed iframes */}
      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmLabel={confirmDialog?.confirmLabel}
        cancelLabel={confirmDialog?.cancelLabel}
        danger={confirmDialog?.danger}
        onConfirm={confirmDialog?.onConfirm}
        onCancel={() => setConfirmDialog(null)}
      />
      
      {/* Notification toast - replaces window.alert() which is blocked in sandboxed iframes */}
      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}


// =====================================================
// MAIN APP - Router between all three views
// =====================================================

export default function DatadogMaturityPlatform() {
  const [currentView, setCurrentView] = useState('launcher');
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('datadog-platform-language') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentView('launcher');
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {currentView === 'launcher' && (
        <DatadogPlatformLauncher 
          onNavigate={handleNavigate}
          language={language}
          setLanguage={setLanguage}
        />
      )}
      
      {currentView === 'assessment' && (
        <div style={{ position: 'relative' }}>
          <HomeButton onBack={handleBack} color="#632CA6" />
          <ObservabilityMaturityAssessment 
            onBack={handleBack}
            onNavigateToAdmin={() => handleNavigate('admin')}
            initialLanguage={language}
          />
        </div>
      )}
      
      {currentView === 'admin' && (
        <div style={{ position: 'relative' }}>
          <HomeButton onBack={handleBack} color="#632CA6" />
          <DatadogAdminConsole 
            onBack={handleBack}
            onNavigateToAssessment={() => handleNavigate('assessment')}
            initialLanguage={language}
          />
        </div>
      )}
    </div>
  );
}
