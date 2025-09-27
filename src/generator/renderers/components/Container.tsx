import React from 'react';

function DiscordContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '500px',
        flexDirection: 'column',
        backgroundColor: '#393a41',
        padding: '16px',
        border: '1px solid #44454c',
        marginTop: '2px',
        marginBottom: '2px',
        borderRadius: '10px',
        gap: '8px',
      }}
    >
      {children}
    </div>
  );
}

export default DiscordContainer;
