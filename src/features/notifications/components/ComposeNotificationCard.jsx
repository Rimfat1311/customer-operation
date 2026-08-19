import React, { useState, useRef } from 'react';
import {
  Bell, Send, ChevronDown, Upload, X, FileText, ImageIcon,
  Video, Megaphone, Users, MapPin, Sparkles,
  Package, Truck, LogOut, File as FileIcon, Headphones, Paperclip, Loader2, CheckCircle2
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import Toast from '@/components/ui/Toast';

/* ─────────────────────────── Option Configs ─────────────────────────── */
const NOTIFICATION_TYPES = [
  { value: 'GENERAL', label: 'GENERAL', desc: 'Broadcast to all users', icon: Megaphone, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
  { value: 'PROMOTIONAL', label: 'PROMOTIONAL', desc: 'Special offers and promotions', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50' },
  { value: 'ORDER', label: 'ORDER', desc: 'Order updates and status', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: 'TRUCK', label: 'TRUCK', desc: 'Vehicle and transport updates', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { value: 'DEPOT_EXIT', label: 'DEPOT_EXIT', desc: 'Depot departure alerts', icon: LogOut, color: 'text-rose-600', bg: 'bg-rose-50' },
  { value: 'OTHERS', label: 'OTHERS', desc: 'Miscellaneous notifications', icon: Bell, color: 'text-slate-600', bg: 'bg-slate-100' },
];

const TARGET_ROLES = ['ALL', 'DRIVER', 'ADMIN', 'AGENT', 'TRANSPORTER', 'LOGIC', 'OFT_DM', 'SALES_TEAM'];
const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Lagos'];
const MEDIA_TYPES = [
  { value: 'text', label: 'Text', icon: FileText },
  { value: 'image', label: 'Image', icon: ImageIcon },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'document', label: 'Document', icon: FileIcon },
  { value: 'audio', label: 'Audio', icon: Headphones },
  { value: 'other', label: 'Other', icon: Paperclip },
];

function SelectChip({ label, active, onClick, disabled, icon: Icon, color, bg }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
        active
          ? `${bg} ${color} border-current shadow-sm scale-105`
          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      {label}
    </button>
  );
}

function DropdownSelect({ label, value, options, onChange, disabled }) {
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
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white hover:border-brand-primary/40 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && !disabled && (
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

export default function ComposeNotificationCard() {
  const [notifType, setNotifType] = useState('GENERAL');
  const [targetRole, setTargetRole] = useState('ALL');
  const [region, setRegion] = useState('All');
  const [mediaType, setMediaType] = useState('text');
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef(null);

  const MAX_CHARS = 500;
  const charCount = description.length;

  const showNotificationToast = (message, type = 'success', customTitle) => {
    setToastMessage({ type, message, title: customTitle });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setMediaFile(file);
  };

  const handleDescChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setDesc(e.target.value);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new window.File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.85);
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || sending) return;

    setSending(true);
    setUploadProgress(0);
    setJustSent(false);

    try {
      let processedFile = mediaFile;
      if (mediaFile && mediaType === 'image') {
        try {
          processedFile = await compressImage(mediaFile);
        } catch (err) {
          console.warn("Image compression failed, proceeding with raw file:", err);
        }
      }

      let base64Payload = null;
      if (processedFile && mediaType !== 'text') {
        try {
          base64Payload = await fileToBase64(processedFile);
        } catch (err) {
          console.warn("Base64 conversion failed:", err);
        }
      }

      const formattedRole = targetRole ? targetRole.toUpperCase() : 'ALL';
      const formattedRegion = region ? region.toUpperCase() : 'ALL';

      const payload = {
        notificationType: notifType,
        title: title.trim(),
        description: description.trim(),
        mediaType: mediaType === 'text' ? 'TEXT' : mediaType.toUpperCase(),
        mediaBase64Payload: base64Payload,
        mediaContentType: processedFile ? processedFile.type : null,
        mediaFileName: processedFile ? processedFile.name : null,
        targetRole: formattedRole,
        targetUserId: null,
        region: formattedRegion
      };

      const handleProgress = (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      };

      if (processedFile && mediaType !== 'text') {
        try {
          await notificationService.createBroadcastMedia(payload, processedFile, handleProgress);
        } catch (err1) {
          await notificationService.createBroadcastBase64(payload);
        }
      } else {
        try {
          await notificationService.createBroadcast(payload);
        } catch (err1) {
          await notificationService.createBroadcastBase64(payload);
        }
      }

      setJustSent(true);

      showNotificationToast(
        `Notification broadcast successfully sent to ${targetRole} users in ${region} region.`,
        'success',
        'Broadcast Delivered'
      );

      setTitle('');
      setDesc('');
      setMediaFile(null);
      if (fileRef.current) fileRef.current.value = '';

      setTimeout(() => setJustSent(false), 2000);
    } catch (error) {
      console.error('Failed to send notification:', error);
      setJustSent(false);
      showNotificationToast(
        error.message || 'Failed to send notification broadcast. Please try again.',
        'error',
        'Delivery Failed'
      );
    } finally {
      setSending(false);
      setUploadProgress(0);
    }
  };

  const selectedType = NOTIFICATION_TYPES.find((t) => t.value === notifType) || NOTIFICATION_TYPES[0];

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8 animate-slide-up max-w-3xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up px-4 w-full max-w-md pointer-events-none">
          <Toast
            message={toastMessage.message}
            type={toastMessage.type}
            title={toastMessage.title}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

      {/* ── Page Header Banner ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-sm">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Compose Notification</h2>
          </div>
          <p className="text-slate-400 text-sm ml-12">
            Craft and broadcast targeted messages to your team in real time.
          </p>
        </div>
        {/* Type Badge */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border ${selectedType.bg} ${selectedType.color} border-current/20`}>
          <selectedType.icon className="w-3.5 h-3.5" />
          {selectedType.label}
        </div>
      </div>

      <form onSubmit={handleSend}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />

          <div className="p-6 sm:p-8 space-y-8">
            {/* Notification Type */}
            <section>
              <FormLabel>Notification Type</FormLabel>
              <div className="flex flex-wrap gap-2.5">
                {NOTIFICATION_TYPES.map((t) => (
                  <SelectChip
                    key={t.value}
                    label={t.label}
                    active={notifType === t.value}
                    onClick={() => setNotifType(t.value)}
                    disabled={sending}
                    icon={t.icon}
                    color={t.color}
                    bg={t.bg}
                  />
                ))}
              </div>
              <p className="mt-2.5 text-xs text-slate-400 flex items-center gap-1.5">
                <selectedType.icon className={`w-3.5 h-3.5 ${selectedType.color}`} />
                {selectedType.desc}
              </p>
            </section>

            {/* Targeting Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DropdownSelect
                label="Target Role"
                value={targetRole}
                options={TARGET_ROLES}
                onChange={setTargetRole}
                disabled={sending}
              />
              <DropdownSelect
                label="Region"
                value={region}
                options={REGIONS}
                onChange={setRegion}
                disabled={sending}
              />
            </div>

            {/* Media Type Selection */}
            <section>
              <FormLabel>Media Type</FormLabel>
              <div className="flex flex-wrap gap-2.5">
                {MEDIA_TYPES.map((m) => {
                  const Icon = m.icon;
                  const active = mediaType === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      disabled={sending}
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

            <div className="border-t border-slate-100" />

            {/* Title */}
            <section>
              <FormLabel>Notification Title</FormLabel>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                required
                disabled={sending}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all disabled:opacity-60"
              />
            </section>

            {/* Description */}
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
                disabled={sending}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-light text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all resize-none leading-relaxed disabled:opacity-60"
              />
            </section>

            {/* Upload File Section */}
            {mediaType !== 'text' && (
              <section>
                <FormLabel>Upload Media (Optional)</FormLabel>
                <div
                  onClick={() => !sending && fileRef.current?.click()}
                  className={`relative border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary/50 hover:bg-brand-primary/[0.02] transition-all group ${
                    sending ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    disabled={sending}
                    accept={
                      mediaType === 'image' ? 'image/*' :
                        mediaType === 'video' ? 'video/*' :
                          mediaType === 'audio' ? 'audio/*' :
                            mediaType === 'document' ? '.pdf,.doc,.docx,.xls,.xlsx,.txt' :
                              '*/*'
                    }
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {mediaFile ? (
                    <div className="flex items-center gap-3 w-full max-w-xs">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        {mediaType === 'image' && <ImageIcon className="w-5 h-5 text-brand-primary" />}
                        {mediaType === 'video' && <Video className="w-5 h-5 text-brand-primary" />}
                        {mediaType === 'document' && <FileIcon className="w-5 h-5 text-brand-primary" />}
                        {mediaType === 'audio' && <Headphones className="w-5 h-5 text-brand-primary" />}
                        {mediaType === 'other' && <Paperclip className="w-5 h-5 text-brand-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{mediaFile.name}</p>
                        <p className="text-xs text-slate-400">{formatFileSize(mediaFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        disabled={sending}
                        onClick={(e) => { e.stopPropagation(); setMediaFile(null); if (fileRef.current) fileRef.current.value = ''; }}
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
                        {mediaType === 'image' && 'PNG, JPG, GIF up to 10MB'}
                        {mediaType === 'video' && 'MP4, MOV, AVI up to 100MB'}
                        {mediaType === 'audio' && 'MP3, WAV, OGG up to 50MB'}
                        {mediaType === 'document' && 'PDF, DOCX, XLSX up to 20MB'}
                        {mediaType === 'other' && 'Any file up to 50MB'}
                      </p>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* Targeting Summary Chips */}
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

          {/* Upload Progress Bar */}
          {sending && uploadProgress > 0 && (
            <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
              <div
                className="bg-brand-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="px-6 sm:px-8 py-5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              Delivered to <strong className="text-slate-600">{targetRole}</strong> in <strong className="text-slate-600">{region}</strong> region.
            </p>

            <button
              type="submit"
              disabled={sending || !title.trim() || !description.trim()}
              className={`relative group flex items-center justify-center gap-2.5 px-8 py-3 font-bold text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 min-w-[180px] ${
                justSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-primary hover:bg-brand-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white'
              }`}
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>
                    {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Sending...'}
                  </span>
                </>
              ) : justSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                  <span>Sent!</span>
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
