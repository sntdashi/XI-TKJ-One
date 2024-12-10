import React from 'react';
import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"

// Daftar kata-kata motivasi dari Bill Gates
const quotes = [
  "semoga, semoga dirimu menemukan seseorang yang berbicara dalam bahasamu, sehingga kamu tidak perlu menghabiskan seumur hidup untuk menerjemahkan jiwamu.",
];

const Direktori = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.14)', 
          backdropFilter: 'blur(6.9px)', 
          webkitbackdropfilter: 'blur(6.9px)',
          borderRadius: '15px', 
          padding: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px', 
          margin: '0 auto',
        }}
      >
        <h1 
          style={{
            textAlign: 'center', 
            color: '#39b3c6', 
            fontSize: '25px', 
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
                  color: '#39b3c6',
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
