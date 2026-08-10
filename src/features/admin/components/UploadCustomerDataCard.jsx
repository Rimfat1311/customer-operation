import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, Download, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { customerService } from '@/features/customers/services/customerService';
import Toast from '@/components/ui/Toast';

export default function UploadCustomerDataCard() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success', title) => {
    setToastMessage({ message, type, title });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      showToast('Please upload a valid Excel file (.xlsx or .xls).', 'error', 'Invalid File');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || uploading) return;

    setUploading(true);
    setProgress(0);
    setUploadResult(null);

    try {
      const result = await customerService.uploadDetailedCustomerExcel(file, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });

      setUploadResult(result);

      const hasErrors = result?.errors?.length > 0;
      showToast(
        hasErrors
          ? `Upload completed with ${result.errors.length} error(s). Review the summary below.`
          : `Customer data from "${file.name}" successfully processed!`,
        hasErrors ? 'warning' : 'success',
        hasErrors ? 'Upload Completed with Warnings' : 'Upload Successful',
      );

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      showToast(err.message || 'Failed to upload customer data file.', 'error', 'Upload Failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDownloadSample = () => {
    // Generate a simple CSV/Excel sample file download
    const sampleHeaders = 'sapSoldTo,salesArea,customerName,email,phoneNumber,address,location,stateCode,geoState,geoRegion,accountType,isKeyAccount,commercialRegion,commercialState,zone,territory,segment,cpTp,tsmName,zsmName,hosName,propRegion,propZoneTerritory,sapSoldToSecondary\n';
    const sampleRow = '470011,NG01,Sample Enterprise Ltd,sample@email.com,+2348012345678,12 Commercial Ave Lagos,Lagos Island,LA,Lagos,South-West,Key,true,South,Lagos,Zone A,Territory 1,Premium,CP,TSM John,ZSM Paul,HOS Mary,Region 1,Zone-Territory 1,470012\n';
    const blob = new Blob([sampleHeaders + sampleRow], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Sample_Customer_Template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Sample Template (.xlsx)', 'info', 'Template Downloaded');
  };

  const dismissResult = () => setUploadResult(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-slide-up max-w-2xl mx-auto">
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

      {/* Hero Header Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />

      <form onSubmit={handleUpload} className="p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Upload Customer Data</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Upload an Excel file (.xlsx or .xls) to create or update customers by SAP Sold To.
          </p>
        </div>

        {/* File Select & Drop Area */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Select Excel File
          </label>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              file ? 'border-brand-primary/40 bg-brand-primary/5' : 'border-slate-200 hover:border-brand-primary/40 hover:bg-slate-50'
            } ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />

            {file ? (
              <div className="flex items-center gap-4 w-full max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Click to choose file or drag & drop here
                </p>
                <p className="text-xs text-slate-400 mt-1">Accepts .xlsx or .xls files</p>
              </div>
            )}
          </div>
        </div>

        {/* Uploading Progress Indicator */}
        {uploading && progress > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Upload Result Summary ────────────────────────────────── */}
        {uploadResult && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {uploadResult.errors?.length > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                <h4 className="text-sm font-bold text-slate-800">Upload Summary</h4>
              </div>
              <button
                type="button"
                onClick={dismissResult}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Rows',  value: uploadResult.totalRows   ?? 0, color: 'text-brand-primary' },
                { label: 'Created',      value: uploadResult.createdCount ?? 0, color: 'text-emerald-600' },
                { label: 'Updated',      value: uploadResult.updatedCount ?? 0, color: 'text-sky-600' },
                { label: 'Skipped',      value: uploadResult.skippedCount ?? 0, color: 'text-slate-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-lg border border-slate-100 p-3 text-center">
                  <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Error List */}
            {uploadResult.errors?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Errors</p>
                <ul className="max-h-40 overflow-y-auto space-y-1 text-xs text-slate-600">
                  {uploadResult.errors.map((err, i) => (
                    <li key={i} className="flex items-start gap-1.5 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                      <span>{typeof err === 'string' ? err : JSON.stringify(err)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={!file || uploading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary-dark disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Customers</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadSample}
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Sample Template (.xlsx)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
