export const metadata = {
  title: 'Contrata Empregos',
  description: 'A maior plataforma de empregos do Brasil',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box', overflowX: 'hidden', backgroundColor: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}