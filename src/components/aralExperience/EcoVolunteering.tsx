import { useState } from 'react';
import { Sprout, MapPin, Calendar, TrendingUp, Users, Globe, Mail, Phone, User, Check, X, Loader2, Leaf } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabase';
import { ecoProjects, COUNTRIES } from '@/data/aralExperience';
import type { EcoProject } from '@/data/aralExperience';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function EcoVolunteering() {
  const { t, lang } = useLang();
  const [selectedProject, setSelectedProject] = useState<EcoProject | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', date: '', message: '' });

  const handleOpenReg = (project: EcoProject) => {
    setSelectedProject(project);
    setStatus('idle');
    setForm({ name: '', email: '', phone: '', country: '', date: '', message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setStatus('submitting');
    try {
      const { error } = await supabase.from('eco_volunteers').insert({
        project_id: selectedProject.id,
        project_name: selectedProject.name.en,
        name: form.name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        preferred_date: form.date || null,
        message: form.message || null,
      });
      if (error) throw error;
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-deepblue-900">{t('aral.eco.title')}</h3>
        <p className="mt-1.5 text-sm text-deepblue-600">{t('aral.eco.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ecoProjects.map((project, i) => {
          const progress = Math.round((project.current / project.goal) * 100);
          return (
            <div
              key={project.id}
              className="group overflow-hidden rounded-2xl bg-white ring-1 ring-sand-200 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 animate-fade-up flex flex-col"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name[lang]}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 left-3 rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-medium text-white flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="font-display text-base font-bold text-white leading-tight">{project.name[lang]}</h4>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <p className="text-sm text-deepblue-600 leading-relaxed mb-3 line-clamp-3">{project.description[lang]}</p>

                <div className="space-y-2 mb-4 text-xs text-deepblue-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-terracotta-400" />
                    <span>{project.location[lang]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-terracotta-400" />
                    <span><span className="font-medium">{t('aral.eco.season')}:</span> {project.season[lang]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-3.5 w-3.5 text-terracotta-400" />
                    <span>{project.duration[lang]}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1 text-xs font-medium text-deepblue-600">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                      {t('aral.eco.progress')}
                    </span>
                    <span className="text-xs font-bold text-green-600">{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-sand-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-deepblue-500">
                    {project.current.toLocaleString()} / {project.goal.toLocaleString()} {project.unit[lang]}
                  </p>
                </div>

                <div className="mb-4 rounded-lg bg-green-50 p-2.5">
                  <p className="text-xs text-green-800 leading-relaxed flex items-start gap-1.5">
                    <Sprout className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    {project.impact[lang]}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenReg(project)}
                  className="mt-auto w-full rounded-lg bg-green-600 py-2.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Users className="h-4 w-4" />
                  {t('aral.eco.join')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => status === 'submitting' ? undefined : setSelectedProject(null)}>
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-elevated" onClick={(e) => e.stopPropagation()}>
            {status === 'success' ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-display text-lg font-bold text-deepblue-900 mb-2">{t('aral.eco.success')}</h4>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="mt-4 rounded-lg bg-deepblue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-deepblue-700 transition-colors"
                >
                  {t('aral.eco.close')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-sand-100 p-5">
                  <h4 className="font-display text-lg font-bold text-deepblue-900">{t('aral.eco.volunteer')}</h4>
                  <button
                    onClick={() => setSelectedProject(null)}
                    disabled={status === 'submitting'}
                    className="rounded-lg p-1.5 text-deepblue-400 hover:bg-sand-100 disabled:opacity-40"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="mb-4 rounded-xl bg-green-50 p-3 ring-1 ring-green-100">
                    <p className="text-xs font-medium text-deepblue-400 mb-0.5">{t('aral.eco.project')}</p>
                    <p className="text-sm font-semibold text-deepblue-900">{selectedProject.name[lang]}</p>
                    <p className="text-xs text-green-700 mt-0.5">{selectedProject.location[lang]}</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Field icon={<User className="h-4 w-4" />} label={t('aral.eco.name')}>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none" />
                    </Field>
                    <Field icon={<Mail className="h-4 w-4" />} label={t('aral.eco.email')} type="email">
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none" />
                    </Field>
                    <Field icon={<Phone className="h-4 w-4" />} label={t('aral.eco.phone')}>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none" />
                    </Field>
                    <div className="rounded-xl bg-sand-50 ring-1 ring-sand-200 px-3 py-2.5">
                      <label className="block text-xs font-medium text-deepblue-600 mb-1">{t('aral.eco.country')}</label>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-deepblue-400 flex-shrink-0" />
                        <select
                          required
                          value={form.country}
                          onChange={(e) => setForm({ ...form, country: e.target.value })}
                          className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none cursor-pointer"
                        >
                          <option value="" disabled>{t('aral.eco.countryPlaceholder')}</option>
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Field icon={<Calendar className="h-4 w-4" />} label={t('aral.eco.date')} type="date" optional>
                      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-transparent text-sm text-deepblue-900 focus:outline-none" />
                    </Field>
                    <div>
                      <label className="block text-xs font-medium text-deepblue-600 mb-1.5">{t('aral.eco.message')}</label>
                      <textarea
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={t('aral.eco.messagePlaceholder')}
                        className="w-full rounded-xl bg-sand-50 px-3 py-2.5 text-sm text-deepblue-900 placeholder-deepblue-400 ring-1 ring-sand-200 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                      />
                    </div>
                    {status === 'error' && (
                      <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{t('aral.eco.error')}</p>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                    >
                      {status === 'submitting' ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> {t('aral.eco.submitting')}</>
                      ) : (
                        t('aral.eco.submit')
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Clock3({ className }: { className?: string }) {
  return <Calendar className={className} />;
}

function Field({ icon, label, type: _type = 'text', optional, children }: { icon: React.ReactNode; label: string; type?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-sand-50 ring-1 ring-sand-200 px-3 py-2.5">
      <label className="block text-xs font-medium text-deepblue-600 mb-1">
        {label} {optional && <span className="text-deepblue-400 font-normal">(optional)</span>}
      </label>
      <div className="flex items-center gap-2">
        <span className="text-deepblue-400 flex-shrink-0">{icon}</span>
        {children}
      </div>
    </div>
  );
}
