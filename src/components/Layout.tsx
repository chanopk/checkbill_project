import React from 'react';

interface Props {
    children: React.ReactNode;
}

export function Layout({ children }: Props) {
    return (
        <div className="layout-wrapper">
            <header className="header-area">
                <div className="header-content">
                    <h1 className="brand-title">
                        CheckBill
                    </h1>
                </div>
            </header>

            <main className="main-area">
                {children}
            </main>

            <footer className="footer-area">
                <p>&copy; {new Date().getFullYear()} CheckBill App. All rights reserved.</p>
            </footer>
        </div>
    );
}
