import React from 'react';

const Home = () => {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <h1>Animarket</h1>
        <p>Your trusted animal ecommerce marketplace for livestock, feed, and farm supplies.</p>
      </section>
    </main>
  );
};

const mainStyle = {
  padding: '3rem',
  textAlign: 'center' as const,
};

const heroStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  backgroundColor: '#f5f5f5',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
};

export default Home;
