import React from 'react';

const HeroSection: React.FC = () => (
    <header className="text-center w-full animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-light">
                Vibe Check
            </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-text-secondary max-w-xl mx-auto">
            Click the button below to discover the vibe of your current location based on nearby points of interest.
        </p>
    </header>
);

export default HeroSection;