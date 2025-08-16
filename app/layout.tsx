export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
    title: 'Nexora Portal',
};
export default function RootLayout({children}: { children: React.ReactNode }) {
    return (<html lang='es'>
    <body style={{fontFamily: 'Inter,system-ui'}}>{children}</body>
    </html>)
}
