import React from 'react';

// Daftar kata-kata motivasi dari Bill Gates
const quotes = [
  "Don't compare yourself with anyone in this world. If you do so, you are insulting yourself.",
  "Your most unhappy customers are your greatest source of learning.",
  "We always overestimate the change that will occur in the next two years and underestimate the change that will occur in the next ten.",
  "It's fine to celebrate success, but it is more important to heed the lessons of failure.",
  "We always say we are going to be successful, but that is not the most important thing. The most important thing is to be able to contribute to society.",
];

const Direktori = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
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
            color: '#39b3c6', 
            fontSize: '32px', 
            fontWeight: 'bold',
            textShadow: 'rgba(57, 198, 198, 0.78) 100%', // Glow effect
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
                marginBottom: '15px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p 
                style={{
                  color: '#333',
                  fontSize: '18px',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.7)', // Glow effect
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
