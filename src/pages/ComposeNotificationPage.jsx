import React, { useState, useRef } from 'react';
import {
  Bell, Send, ChevronDown, Upload, X, FileText, ImageIcon,
  Video, Megaphone, Users, MapPin, CheckCircle2, Sparkles, AlertCircle
} from 'lucide-react';

/* ─────────────────────────── Option Configs ─────────────────────────── */
const NOTIFICATION_TYPES = [
  { value: 'general',     label: 'General',     desc: 'Broadcast to all users',         icon: Megaphone,    color: 'text-brand-primary',  bg: 'bg-brand-primary/10' },
  { value: 'alert',       label: 'Alert',       desc: 'Urgent system-level notice',      icon: AlertCircle,  color: 'text-rose-600',       bg: 'bg-rose-50' },
  { value: 'update',      label: 'Update',      desc: 'Product or service update',       icon: Sparkles,     color: 'text-indigo-600',     bg: 'bg-indigo-50' },
  { value: 'assignment',  label: 'Assignment',  desc: 'Task or ticket assigned',         icon: CheckCircle2, color: 'text-emerald-600',    bg: 'bg-emerald-50' },
];

const TARGET_ROLES = ['Driver', 'Agent', 'Supervisor', 'Admin', 'All Users'];
const REGIONS     = ['All', 'North', 'South', 'East', 'West', 'Central'];
const MEDIA_TYPES = [
  { value: 'text',  label: 'Text',  icon: FileText  },
  { value: 'image', label: 'Image', icon: ImageIcon },
  { value: 'video', label: 'Video', icon: Video     },
];

/* ─────────────────────────── Sub-components ─────────────────────────── */

function SelectChip({ label, active, onClick, icon: Icon, color, bg }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
        active
          ? `${bg} ${color} border-current shadow-sm scale-105`
          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      {label}
    </button>
  );
}

function DropdownSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white hover:border-brand-primary/40 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-slide-up">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === opt
                  ? 'bg-brand-primary/5 text-brand-primary font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FormLabel({ children }) {
  return (
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
      {children}
    </label>
  );
}

/* ─────────────────────────── Main Page ─────────────────────────── */
export default function ComposeNotificationPage() {
  const [notifType, setNotifType]   = useState('general');
  const [targetRole, setTargetRole] = useState('Driver');
  const [region, setRegion]         = useState('All');
  const [mediaType, setMediaType]   = useState('text');
  const [title, setTitle]           = useState('');
  const [description, setDesc]      = useState('');
  const [mediaFile, setMediaFile]   = useState(null);
  const [sending, setSending]       = useState(false);
  const [sent, setSent]             = useState(false);
  const [charCount, setCharCount]   = useState(0);
  const fileRef = useRef(null);

  const MAX_CHARS = 500;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setMediaFile(file);
  };

  const handleDescChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setDesc(e.target.value);
      setCharCount(e.target.value.length);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      setTitle('');
      setDesc('');
      setCharCount(0);
      setMediaFile(null);
    }, 1800);
  };

  const selectedType = NOTIFICATION_TYPES.find((t) => t.value === notifType);

  return (
    <div className="space-y-8 animate-slide-up max-w-3xl mx-auto">

      {/* ── Success Toast ── */}
      {sent && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-slate-900 text-white text-sm px-5 py-3 rounded-full shadow-xl flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Notification sent successfully!</span>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-sm">
              <Megaphone className="w-4.5 h-4.5 text-white w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Compose Notification</h2>
          </div>
          <p className="text-slate-400 text-sm ml-12">
            Craft and broadcast targeted messages to your team in real time.
          </p>
        </div>
        {/* Live Preview Pill */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border ${selectedType.bg} ${selectedType.color} border-current/20`}>
          <selectedType.icon className="w-3.5 h-3.5" />
          {selectedType.label}
        </div>
      </div>

      {/* ── Main Form Card ── */}
      <form onSubmit={handleSend}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* ── Card Hero Accent ── */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />

          <div className="p-6 sm:p-8 space-y-8">

            {/* ── NOTIFICATION TYPE ── */}
            <section>
              <FormLabel>Notification Type</FormLabel>
              <div className="flex flex-wrap gap-2.5">
                {NOTIFICATION_TYPES.map((t) => (
                  <SelectChip
                    key={t.value}
                    label={t.label}
                    active={notifType === t.value}
                    onClick={() => setNotifType(t.value)}
                    icon={t.icon}
                    color={t.color}
                    bg={t.bg}
                  />
                ))}
              </div>
              {/* Type description */}
              <p className="mt-2.5 text-xs text-slate-400 flex items-center gap-1.5">
                <selectedType.icon className={`w-3.5 h-3.5 ${selectedType.color}`} />
                {selectedType.desc}
              </p>
            </section>

            {/* ── TARGETING ROW ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DropdownSelect
                label="Target Role"
                value={targetRole}
                options={TARGET_ROLES}
                onChange={setTargetRole}
              />
              <DropdownSelect
                label="Region"
                value={region}
                options={REGIONS}
                onChange={setRegion}
              />
            </div>

            {/* ── MEDIA TYPE ── */}
            <section>
              <FormLabel>Media Type</FormLabel>
              <div className="flex gap-2.5">
                {MEDIA_TYPES.map((m) => {
                  const Icon = m.icon;
                  const active = mediaType === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMediaType(m.value)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                        active
                          ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── DIVIDER ── */}
            <div className="border-t border-slate-100" />

            {/* ── NOTIFICATION TITLE ── */}
            <section>
              <FormLabel>Notification Title</FormLabel>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                required
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
              />
            </section>

            {/* ── DESCRIPTION ── */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Description</FormLabel>
                <span className={`text-[10px] font-semibold ${charCount > MAX_CHARS * 0.85 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
              <textarea
                value={description}
                onChange={handleDescChange}
                placeholder="Enter notification content — be clear, concise and actionable."
                required
                rows={5}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-light text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all resize-none leading-relaxed"
              />
            </section>

            {/* ── UPLOAD MEDIA ── */}
            {(mediaType === 'image' || mediaType === 'video') && (
              <section>
                <FormLabel>Upload Media (Optional)</FormLabel>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary/50 hover:bg-brand-primary/[0.02] transition-all group"
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {mediaFile ? (
                    <div className="flex items-center gap-3 w-full max-w-xs">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        {mediaType === 'image'
                          ? <ImageIcon className="w-5 h-5 text-brand-primary" />
                          : <Video className="w-5 h-5 text-brand-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{mediaFile.name}</p>
                        <p className="text-xs text-slate-400">{(mediaFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setMediaFile(null); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-brand-primary/10 flex items-center justify-center mb-3 transition-colors">
                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-brand-primary transition-colors" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 group-hover:text-slate-700">
                        Drop your {mediaType} here, or <span className="text-brand-primary">browse</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {mediaType === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV, AVI up to 100MB'}
                      </p>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* ── PREVIEW SUMMARY CHIP ROW ── */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center mr-1">Targeting:</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${selectedType.bg} ${selectedType.color}`}>
                <selectedType.icon className="w-3 h-3" />
                {selectedType.label}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                <Users className="w-3 h-3" />
                {targetRole}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                <MapPin className="w-3 h-3" />
                {region}
              </span>
            </div>
          </div>

          {/* ── Form Footer / Send Button ── */}
          <div className="px-6 sm:px-8 py-5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              This notification will be delivered to{' '}
              <strong className="text-slate-600">{targetRole}</strong>{' '}
              in <strong className="text-slate-600">{region}</strong> region.
            </p>

            <button
              type="submit"
              disabled={sending || !title.trim() || !description.trim()}
              className="relative group flex items-center justify-center gap-2.5 px-8 py-3 bg-brand-primary hover:bg-brand-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 min-w-[180px]"
            >
              {sending ? (
                <>
                  {/* Animated dots while sending */}
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:300ms]" />
                  </span>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Send Notification</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
