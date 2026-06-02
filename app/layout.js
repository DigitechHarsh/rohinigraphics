import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
  title: 'Rohini Graphics | Premium Sign Board Manufacturing & Graphic Design',
  description: 'Established in 2008 in Surat, Rohini Graphics manufactures premium glowing sign boards, LED letters, SS architectural metal letters, safety signages, ACP elevation facades, and complete business branding.',
  keywords: 'Sign Board, LED Sign, SS Letter, Acrylic Name Plate, ACP Elevation, Flex Printing, Rohini Graphics, Surat Banner, Laser Cutting, MSME Supplier',
  authors: [{ name: 'Rohini Graphics' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        {/* FontAwesome CSS stylesheet fallback */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          precedence="default"
        />
      </head>
      <body>
        {/* Modern Aesthetic Ambient Glow Backgrounds */}
        <div className="ambient-glow"></div>
        <div className="ambient-glow-2"></div>

        {/* Layout Wrapper for conditional rendering of Header/Footer */}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
