import MatrixRain from './MatrixRain';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-black">
            <MatrixRain />
            {children}
        </div>
    );
};

export default Layout; 