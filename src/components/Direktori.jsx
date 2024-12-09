import React from 'react';

// Daftar kata-kata motivasi dari Bill Gates
const quotes = [
  "Don't compare yourself with anyone in this world. If you do so, you are insulting yourself.",
];

const Direktori = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '25px' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.5)', 
          backdropFilter: 'blur(10px)', 
          borderRadius: '15px', 
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px', 
          margin: '0 auto',
        }}
      >
        <h1 
          style={{
            textAlign: 'center', 
            color: '#4CAF50', 
            fontSize: '32px', 
            fontWeight: 'bold',
            textShadow: '0 0 15px rgba(57, 198, 198, 0.78)', // Glow effect
            marginBottom: '20px'
          }}
        >
            Quots
        </h1>
        
        {/* Menampilkan daftar kata-kata motivasi */}
        <div>
          {quotes.map((quote, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                borderRadius: '10px',
                padding: '15px', 
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p 
                style={{
                  color: '#4CAF50',
                  fontSize: '18px',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  textShadow: '0 0 10px rgba(57, 198, 198, 0.78', // Glow effect
                }}
              >
                "{quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Direktori;
