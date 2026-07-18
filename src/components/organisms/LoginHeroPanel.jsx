import React from 'react';
import { Check, Users } from 'lucide-react';
import Logo from '../atoms/Logo';

/**
 * Left-side branded gradient panel with logo, welcome copy, floating cards, and dots.
 */
export default function LoginHeroPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-brand-primary to-brand-secondary text-white relative overflow-hidden p-12 flex-col justify-between">
      
      {/* Soft Background Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      
      {/* Logo and Brand */}
      <Logo size="md" textClass="text-white" bgClass="bg-white/20" className="z-10" />

      {/* Core Welcoming Messages */}
      <div className="my-auto max-w-lg z-10 animate-slide-up">
        <h1 className="text-4xl font-extrabold leading-tight mb-4 text-white">
          Welcome to your workspace.
        </h1>
        <p className="text-white/80 text-lg font-light leading-relaxed">
          Everything you need to manage your projects, collaborate with your team, and track your daily tasks — all in one beautiful place.
        </p>
      </div>

      {/* Abstract Dynamic Illustration / Floating UI Cards */}
      <div className="relative h-60 w-full z-10 select-none">
        {/* Main Backdrop Glowing Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full filter blur-2xl animate-pulse" />
        
        {/* Floating Card A */}
        <div className="absolute top-4 left-6 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-brand shadow-lg flex items-center space-x-3 w-56 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-white/60">Tasks Completed</span>
            <span className="block font-semibold text-sm">128 this week</span>
          </div>
        </div>

        {/* Floating Card B */}
        <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-brand shadow-lg flex items-center space-x-3 w-56 transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-white/60">Team Collaboration</span>
            <span className="block font-semibold text-sm">24 active members</span>
          </div>
        </div>

        {/* Floating Card C */}
        <div className="absolute top-28 left-48 bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2 rounded-full shadow-lg flex items-center space-x-2">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-[10px] border border-white">T</div>
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] border border-white">M</div>
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] border border-white">S</div>
          </div>
          <span className="text-[11px] font-medium text-white/95">+12 online</span>
        </div>
      </div>

      {/* Footer Carousel Dots Indicator */}
      <div className="flex space-x-2 z-10">
        <span className="w-6 h-1.5 rounded-full bg-white opacity-100 transition-all duration-300" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300 cursor-pointer" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300 cursor-pointer" />
      </div>
    </div>
  );
}
