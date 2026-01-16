import React from 'react';
import Sidebar from './components/Sidebar'; 

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="pt-br">
      <body style={{ margin: 0, backgroundColor: '#061224', color: 'white' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, marginLeft: '240px', backgroundColor: '#061224' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}