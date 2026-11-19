import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, GraduationCap, ArrowRight, Shield, Loader2, CheckCircle } from 'lucide-react';
import LearnuzLogo from './LearnuzLogo';
import { initialPrograms } from '../data/programs';

const levelMapping = {
  'Bachelor Degree': 'Undergraduate',
  'Master Degree': 'Postgraduate',
  'Professional Cert': 'Certificate',
  'Executive Diploma': 'Diploma'
};

const reverseLevelMapping = {
  'Undergraduate': 'Bachelor Degree',
  'Postgraduate': 'Master Degree',
  'Certificate': 'Professional Cert',
  'Diploma': 'Executive Diploma'
};

export default function RegisterModal({ isOpen, onClose, selectedCourse }) {
  const [mounted, setMounted] = useState(false);
  const [programs, setPrograms] = useState(initialPrograms || []);
  
  const getInitialProgram = () => {
    if (selectedCourse && selectedCourse.title) {
      return selectedCourse.title;
    }
    const initialLevel = selectedCourse?.level ? reverseLevelMapping[selectedCourse.level] : 'Bachelor Degree';
    const targetLevel = levelMapping[initialLevel];
    const initialUni = selectedCourse?.university ? selectedCourse.university : 'All Universities';
    
    const matchingProgs = initialPrograms.filter(p => {
      const matchesLevel = p.level === targetLevel;
      const matchesUni = initialUni === 'All Universities' || p.university === initialUni;
      return matchesLevel && matchesUni;
    });
    return matchingProgs.length > 0 ? matchingProgs[0].title : '';
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: getInitialProgram(),
    degreeLevel: selectedCourse?.level ? (reverseLevelMapping[selectedCourse.level] || 'Bachelor Degree') : 'Bachelor Degree',
    university: selectedCourse?.university ? selectedCourse.university : 'All Universities'
  });

  const [submitting, setSubmitting] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  // Set mounted state on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch programs from API
  useEffect(() => {
    if (isOpen) {
      const fetchPrograms = async () => {
        try {
          const res = await fetch('/api/programs');
          if (res.ok) {
            const data = await res.json();
            setPrograms(data);
          }
        } catch (error) {
          console.error('Error fetching programs:', error);
        }
      };
      fetchPrograms();
    }
  }, [isOpen]);

  // Synchronize program when selectedCourse changes
  useEffect(() => {
    if (selectedCourse) {
      if (selectedCourse.title) {
        const mappedLevel = reverseLevelMapping[selectedCourse.level] || 'Bachelor Degree';
        setFormData(prev => ({
          ...prev,
          degreeLevel: mappedLevel,
          university: selectedCourse.university,
          program: selectedCourse.title
        }));
      } else {
        const targetLevel = levelMapping['Bachelor Degree'];
        const matchingProgs = programs.filter(p => {
          const matchesLevel = p.level === targetLevel;
          const matchesUni = selectedCourse.university === 'All Universities' || p.university === selectedCourse.university;
          return matchesLevel && matchesUni;
        });
        const defaultProgram = matchingProgs.length > 0 ? matchingProgs[0].title : '';
        setFormData(prev => ({
          ...prev,
          degreeLevel: 'Bachelor Degree',
          university: selectedCourse.university,
          program: defaultProgram
        }));
      }
    } else {
      const defaultProgram = initialPrograms.filter(p => p.level === 'Undergraduate')[0]?.title || '';
      setFormData(prev => ({
        ...prev,
        degreeLevel: 'Bachelor Degree',
        university: 'All Universities',
        program: defaultProgram
      }));
    }
  }, [selectedCourse, programs]);

  const handleDegreeLevelChange = (e) => {
    const newDegreeLevel = e.target.value;
    const targetLevel = levelMapping[newDegreeLevel];
    const matchingProgs = programs.filter(p => {
      const matchesLevel = p.level === targetLevel;
      const matchesUniversity = formData.university === 'All Universities' || p.university === formData.university;
      return matchesLevel && matchesUniversity;
    });
    const newProgram = matchingProgs.length > 0 ? matchingProgs[0].title : '';
    setFormData(prev => ({
      ...prev,
      degreeLevel: newDegreeLevel,
      program: newProgram
    }));
  };

  const handleUniversityChange = (e) => {
    const newUniversity = e.target.value;
    const targetLevel = levelMapping[formData.degreeLevel];
    const matchingProgs = programs.filter(p => {
      const matchesLevel = p.level === targetLevel;
      const matchesUniversity = newUniversity === 'All Universities' || p.university === newUniversity;
      return matchesLevel && matchesUniversity;
    });
    const newProgram = matchingProgs.length > 0 ? matchingProgs[0].title : '';
    setFormData(prev => ({
      ...prev,
      university: newUniversity,
      program: newProgram
    }));
  };

  const filteredPrograms = programs.filter(prog => {
    const matchesLevel = prog.level === levelMapping[formData.degreeLevel];
    const matchesUniversity = formData.university === 'All Universities' || prog.university === formData.university;
    return matchesLevel && matchesUniversity;
  });

  const uniqueUniversities = Array.from(new Set(programs.map(p => p.university))).filter(Boolean).sort();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || alreadyRegistered) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 409 || errorData.alreadyRegistered) {
          setAlreadyRegistered(true);
        } else {
          console.error('Failed to submit application:', errorData.error);
          alert(errorData.error || 'Failed to submit application. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative max-h-[90vh] overflow-y-auto" data-lenis-prevent>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

          <div className="p-6 sm:p-8">
            
            {/* Header */}
            <div className="mb-6">
              <LearnuzLogo size="small" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-3">
                Register for University Programs
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Start your accredited learning journey with top global faculty today.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => { setAlreadyRegistered(false); setFormData({ ...formData, email: e.target.value }); }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => { setAlreadyRegistered(false); setFormData({ ...formData, phone: e.target.value }); }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    COURSES
                  </label>
                  <select
                    disabled={selectedCourse && !!selectedCourse.title}
                    value={formData.degreeLevel}
                    onChange={handleDegreeLevelChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-100"
                  >
                    <option>Bachelor Degree</option>
                    <option>Master Degree</option>
                    <option>Professional Cert</option>
                    <option>Executive Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    University
                  </label>
                  <select
                    disabled={selectedCourse && !!selectedCourse.title}
                    value={formData.university}
                    onChange={handleUniversityChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-100"
                  >
                    <option value="All Universities">All Universities</option>
                    {uniqueUniversities.map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Selected Program
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 z-10 pointer-events-none" />
                  <select
                    disabled={selectedCourse && !!selectedCourse.title}
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-100"
                  >
                    {filteredPrograms.length > 0 ? (
                      filteredPrograms.map((prog) => (
                        <option key={prog._id || `${prog.code}-${prog.university}-${prog.title}`} value={prog.title}>
                          {prog.title} {prog.university ? `(${prog.university})` : ''}
                        </option>
                      ))
                    ) : (
                      <option value="">No programs available for this level/university</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                {alreadyRegistered ? (
                  <>
                    <button
                      type="button"
                      disabled
                      className="w-full py-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Already Registered</span>
                    </button>
                    <p className="text-xs text-slate-500 text-center mt-2">
                      This email or phone number is already registered. Our advisors will contact you soon.
                    </p>
                  </>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 disabled:cursor-wait disabled:hover:scale-100"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span>Your information is encrypted & 100% confidential</span>
              </div>
            </form>
          </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
