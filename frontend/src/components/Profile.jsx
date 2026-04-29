import React, { useMemo, useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MapPin, Mail, PenSquare, Phone, Sparkles, Globe, Github, Linkedin, BriefcaseBusiness, GraduationCap, Trophy, FolderKanban, FileText, CircleCheck } from 'lucide-react'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { getProfileCompletion, getProfileSuggestions, normalizeUserProfile } from '@/utils/profile'

const fallbackAvatar = 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80'

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-900">{value || 'Not added yet'}</p>
      </div>
    </div>
  </div>
)

const SectionPanel = ({ title, subtitle, action, children }) => (
  <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/70">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
)

const LinkPill = ({ href, icon: Icon, label }) => {
  if (!href) {
    return null
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  )
}

const TimelineCard = ({ title, meta, body, tags }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
    {meta ? <p className="mt-1 text-sm text-slate-500">{meta}</p> : null}
    {body ? <p className="mt-3 text-sm leading-6 text-slate-700">{body}</p> : null}
    {tags?.length ? (
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} className="bg-violet-100 text-violet-800 hover:bg-violet-100">
            {tag}
          </Badge>
        ))}
      </div>
    ) : null}
  </div>
)

const Profile = () => {
  useGetAppliedJobs()
  const [open, setOpen] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const profileData = useMemo(() => normalizeUserProfile(user), [user])
  const profile = profileData.profile
  const completion = useMemo(() => getProfileCompletion(profile), [profile])
  const suggestions = useMemo(() => getProfileSuggestions(profile), [profile])
  const hasResume = Boolean(profile.resume)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/70">
          <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.15fr,0.85fr] lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                Professional profile
              </div>
              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar className="h-28 w-28 rounded-[1.5rem] border-4 border-white shadow-lg shadow-violet-200/70">
                  <AvatarImage src={profile.profilePhoto || fallbackAvatar} alt={profileData.fullname || 'Profile'} className="object-cover" />
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">{profileData.fullname || 'Your name'}</h1>
                  <p className="mt-2 text-lg font-medium text-violet-700">{profile.headline || 'Add a headline that communicates your strongest value.'}</p>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    {profile.bio || 'Use the profile editor to add a concise bio, your current role, preferred job types, and links recruiters can verify quickly.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <LinkPill href={profile.website} icon={Globe} label="Website" />
                    <LinkPill href={profile.linkedinUrl} icon={Linkedin} label="LinkedIn" />
                    <LinkPill href={profile.githubUrl} icon={Github} label="GitHub" />
                    <LinkPill href={profile.portfolioUrl} icon={FolderKanban} label="Portfolio" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-lg shadow-slate-300/50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Profile strength</p>
                  <p className="mt-2 text-4xl font-bold">{completion}%</p>
                </div>
                <Button onClick={() => setOpen(true)} className="rounded-full bg-white text-slate-950 hover:bg-violet-100">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
              <div className="mt-5 h-3 rounded-full bg-white/15">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <div className="mt-5 space-y-3">
                {suggestions.length ? (
                  suggestions.slice(0, 4).map((suggestion) => (
                    <div key={suggestion} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                      <CircleCheck className="mt-0.5 h-4 w-4 text-violet-300" />
                      <span>{suggestion}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                    Your profile already covers the key recruiter-facing details.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-slate-200 bg-slate-50/80 px-6 py-5 md:grid-cols-2 xl:grid-cols-4 lg:px-8">
            <InfoCard icon={Mail} label="Email" value={profileData.email} />
            <InfoCard icon={Phone} label="Phone" value={profileData.phoneNumber} />
            <InfoCard icon={MapPin} label="Location" value={profile.location} />
            <InfoCard icon={BriefcaseBusiness} label="Current focus" value={profile.currentPosition || profileData.role} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <SectionPanel
              title="Experience"
              subtitle="Your most relevant work and internship history."
              action={<Badge className="bg-violet-100 text-violet-800 hover:bg-violet-100">{profile.experience.filter((item) => item.company || item.title).length} entries</Badge>}
            >
              <div className="space-y-4">
                {profile.experience.some((item) => item.company || item.title) ? (
                  profile.experience
                    .filter((item) => item.company || item.title)
                    .map((item, index) => (
                      <TimelineCard
                        key={`${item.company}-${index}`}
                        title={`${item.title || 'Role'}${item.company ? ` at ${item.company}` : ''}`}
                        meta={[item.employmentType, item.location, `${item.startDate || 'Start'} - ${item.currentlyWorking ? 'Present' : item.endDate || 'End'}`].filter(Boolean).join(' • ')}
                        body={item.summary}
                        tags={item.achievements}
                      />
                    ))
                ) : (
                  <p className="text-sm text-slate-500">No experience added yet. Add internships, freelance work, or campus leadership if you are early in your career.</p>
                )}
              </div>
            </SectionPanel>

            <SectionPanel
              title="Projects"
              subtitle="Hands-on work that proves capability beyond the resume headline."
              action={<Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">{profile.projects.filter((item) => item.name || item.link).length} projects</Badge>}
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {profile.projects.some((item) => item.name || item.link) ? (
                  profile.projects
                    .filter((item) => item.name || item.link)
                    .map((item, index) => (
                      <TimelineCard
                        key={`${item.name}-${index}`}
                        title={item.name || 'Project'}
                        meta={item.role}
                        body={item.summary || item.link}
                        tags={item.techStack}
                      />
                    ))
                ) : (
                  <p className="text-sm text-slate-500 lg:col-span-2">No projects added yet. Add portfolio pieces, capstone work, or production apps you have shipped.</p>
                )}
              </div>
            </SectionPanel>

            <SectionPanel title="Applied jobs" subtitle="Track the roles you have already interacted with.">
              <AppliedJobTable />
            </SectionPanel>
          </div>

          <div className="space-y-6">
            <SectionPanel title="Education" subtitle="Formal education and relevant academic highlights.">
              <div className="space-y-4">
                {profile.education.some((item) => item.school || item.degree) ? (
                  profile.education
                    .filter((item) => item.school || item.degree)
                    .map((item, index) => (
                      <TimelineCard
                        key={`${item.school}-${index}`}
                        title={[item.degree, item.fieldOfStudy].filter(Boolean).join(' • ') || item.school}
                        meta={[item.school, `${item.startYear || 'Start'} - ${item.endYear || 'End'}`, item.grade].filter(Boolean).join(' • ')}
                        body={item.description}
                      />
                    ))
                ) : (
                  <p className="text-sm text-slate-500">No education details added yet.</p>
                )}
              </div>
            </SectionPanel>

            <SectionPanel title="Skills and strengths" subtitle="These help recruiters understand your technical fit quickly.">
              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Core skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.length ? profile.skills.map((item) => (
                      <Badge key={item} className="bg-violet-100 text-violet-800 hover:bg-violet-100">{item}</Badge>
                    )) : <span className="text-sm text-slate-500">Add at least 3 skills.</span>}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.strengths.length ? profile.strengths.map((item) => (
                      <Badge key={item} className="bg-slate-100 text-slate-800 hover:bg-slate-100">{item}</Badge>
                    )) : <span className="text-sm text-slate-500">Add your standout strengths.</span>}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.length ? profile.languages.map((item) => (
                      <Badge key={item} className="bg-sky-100 text-sky-800 hover:bg-sky-100">{item}</Badge>
                    )) : <span className="text-sm text-slate-500">No languages added yet.</span>}
                  </div>
                </div>
              </div>
            </SectionPanel>

            <SectionPanel title="Achievements and certifications" subtitle="Use this section to create recruiter confidence quickly.">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Achievements
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.achievements.length ? profile.achievements.map((item) => (
                      <Badge key={item} className="bg-amber-100 text-amber-800 hover:bg-amber-100">{item}</Badge>
                    )) : <span className="text-sm text-slate-500">No achievements added yet.</span>}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <GraduationCap className="h-4 w-4 text-violet-600" />
                    Certifications
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.length ? profile.certifications.map((item) => (
                      <Badge key={item} className="bg-violet-100 text-violet-800 hover:bg-violet-100">{item}</Badge>
                    )) : <span className="text-sm text-slate-500">No certifications added yet.</span>}
                  </div>
                </div>
              </div>
            </SectionPanel>

            <SectionPanel title="Preferences and resume" subtitle="Operational details that matter during outreach and screening.">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoCard icon={BriefcaseBusiness} label="Preferred job types" value={profile.preferredJobTypes.join(', ')} />
                  <InfoCard icon={MapPin} label="Preferred locations" value={profile.preferredLocations.join(', ')} />
                  <InfoCard icon={Sparkles} label="Salary expectation" value={profile.salaryExpectation} />
                  <InfoCard icon={CircleCheck} label="Notice period" value={profile.noticePeriod} />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Resume</p>
                      <p className="mt-1 text-sm text-slate-500">Attach the latest version you want recruiters to review.</p>
                    </div>
                    {hasResume ? (
                      <a
                        href={profile.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
                      >
                        <FileText className="h-4 w-4" />
                        {profile.resumeOriginalName || 'View resume'}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500">No resume uploaded yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </SectionPanel>
          </div>
        </section>
      </main>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile
