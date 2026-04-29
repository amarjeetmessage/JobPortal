import React, { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Check, Loader2, Plus, Trash2, Upload, Wand2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/getErrorMessage'
import {
  buildProfilePayload,
  emptyEducation,
  emptyExperience,
  emptyProject,
  getProfileCompletion,
  getProfileSuggestions,
  normalizeUserProfile,
  parseCommaSeparated,
} from '@/utils/profile'

const steps = [
  'Points To Remember',
  'Basic Details',
  'Academics & Education',
  'Experience',
  'Achievements',
  'Other Details',
  'Resume Preview',
]

const chipFieldMap = {
  skills: 'Core skills',
  languages: 'Languages',
  strengths: 'Strengths',
  achievements: 'Achievements',
  certifications: 'Certifications',
  preferredJobTypes: 'Preferred job types',
  preferredLocations: 'Preferred locations',
}

const helperPrompts = [
  'Use measurable outcomes in experience and project summaries.',
  'Keep your headline specific to the roles you want next.',
  'Add links recruiters can verify quickly: LinkedIn, GitHub, portfolio.',
  'A polished profile photo and resume usually improve first-response rates.',
]

const StepIndicator = ({ currentStep }) => (
  <div className="overflow-x-auto pb-2">
    <div className="flex min-w-[760px] items-start gap-2">
      {steps.map((step, index) => {
        const active = currentStep === index
        const completed = currentStep > index

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${
                  active || completed
                    ? 'border-violet-600 bg-violet-600 text-white'
                    : 'border-violet-300 text-violet-500'
                }`}
              >
                {completed ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className={`mt-2 max-w-[120px] text-xs font-medium ${active ? 'text-violet-700' : 'text-slate-500'}`}>
                {step}
              </span>
            </div>
            {index !== steps.length - 1 ? (
              <div className={`mt-5 h-0.5 flex-1 min-w-[48px] ${completed ? 'bg-violet-600' : 'bg-violet-200'}`} />
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  </div>
)

const SectionCard = ({ title, subtitle, children, action }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </div>
)

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [chipInputs, setChipInputs] = useState({})
  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [formState, setFormState] = useState(() => normalizeUserProfile(user))

  useEffect(() => {
    if (open) {
      setFormState(normalizeUserProfile(user))
      setCurrentStep(0)
      setChipInputs({})
      setProfilePhotoFile(null)
      setResumeFile(null)
    }
  }, [open, user])

  const profileCompletion = useMemo(() => getProfileCompletion(formState.profile), [formState.profile])
  const suggestions = useMemo(() => getProfileSuggestions(formState.profile), [formState.profile])

  const updateRootField = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const updateProfileField = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
      },
    }))
  }

  const updateCollectionItem = (collection, index, key, value) => {
    setFormState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [collection]: prev.profile[collection].map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item
        ),
      },
    }))
  }

  const addCollectionItem = (collection, factory) => {
    updateProfileField(collection, [...formState.profile[collection], factory()])
  }

  const removeCollectionItem = (collection, index, fallbackFactory) => {
    const updated = formState.profile[collection].filter((_, itemIndex) => itemIndex !== index)
    updateProfileField(collection, updated.length ? updated : [fallbackFactory()])
  }

  const handleChipInput = (field, value) => {
    setChipInputs((prev) => ({ ...prev, [field]: value }))
  }

  const applyChipInput = (field, rawValue) => {
    const parsed = parseCommaSeparated(rawValue)
    if (!parsed.length) {
      return
    }

    updateProfileField(field, Array.from(new Set([...formState.profile[field], ...parsed])))
    setChipInputs((prev) => ({ ...prev, [field]: '' }))
  }

  const removeChipValue = (field, value) => {
    updateProfileField(
      field,
      formState.profile[field].filter((item) => item !== value)
    )
  }

  const onChipKeyDown = (event, field) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      applyChipInput(field, chipInputs[field] || '')
    }
  }

  const submitHandler = async (event) => {
    event.preventDefault()
    const payload = buildProfilePayload(formState)
    const formData = new FormData()

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value)
    })

    if (profilePhotoFile) {
      formData.append('profilePhotoFile', profilePhotoFile)
    }

    if (resumeFile) {
      formData.append('resumeFile', resumeFile)
    }

    try {
      setLoading(true)
      const response = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })

      if (response.data.success) {
        dispatch(setUser(response.data.user))
        toast.success(response.data.message)
        setOpen(false)
      }
    } catch (error) {
      console.log(error)
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const renderPointToRemember = () => (
    <div className="grid gap-4 lg:grid-cols-[1.35fr,0.85fr]">
      <SectionCard title="Profile completion" subtitle="A strong profile improves recruiter trust and the quality of role matches.">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-bold text-slate-900">{profileCompletion}%</p>
            <p className="text-sm text-slate-500">Complete your profile to stand out faster.</p>
          </div>
          <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            Production-ready guidance
          </div>
        </div>
        <div className="h-3 rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 transition-all"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {helperPrompts.map((prompt) => (
            <div key={prompt} className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-900">
              {prompt}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Suggested next improvements"
        subtitle="These are generated from the fields that are still missing."
        action={<Wand2 className="h-4 w-4 text-violet-600" />}
      >
        <div className="space-y-2">
          {suggestions.length ? (
            suggestions.map((suggestion) => (
              <div key={suggestion} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {suggestion}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
              Your profile already covers the essentials. Use the later steps to refine it further.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )

  const renderBasicDetails = () => (
    <div className="grid gap-4">
      <SectionCard title="Identity and professional summary" subtitle="Keep this concise, specific, and aligned with your target roles.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={formState.fullname} onChange={(e) => updateRootField('fullname', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={formState.email} onChange={(e) => updateRootField('email', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Phone number</Label>
            <Input value={formState.phoneNumber} onChange={(e) => updateRootField('phoneNumber', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={formState.profile.location} onChange={(e) => updateProfileField('location', e.target.value)} placeholder="City, state or remote" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Professional headline</Label>
            <Input
              value={formState.profile.headline}
              onChange={(e) => updateProfileField('headline', e.target.value)}
              placeholder="Frontend Developer focused on React, performance, and design systems"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Bio</Label>
            <textarea
              value={formState.profile.bio}
              onChange={(e) => updateProfileField('bio', e.target.value)}
              rows={4}
              className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-violet-500"
              placeholder="Summarize your strengths, the kind of work you enjoy, and the value you bring to a team."
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Current role snapshot" subtitle="This gives recruiters a fast read on your current level.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Current company</Label>
            <Input value={formState.profile.currentCompany} onChange={(e) => updateProfileField('currentCompany', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Current position</Label>
            <Input value={formState.profile.currentPosition} onChange={(e) => updateProfileField('currentPosition', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Experience level</Label>
            <Input value={formState.profile.experienceLevel} onChange={(e) => updateProfileField('experienceLevel', e.target.value)} placeholder="Entry level, Mid-level, Senior" />
          </div>
          <div className="space-y-2">
            <Label>Total experience</Label>
            <Input value={formState.profile.totalExperience} onChange={(e) => updateProfileField('totalExperience', e.target.value)} placeholder="2 years 6 months" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Expertise chips" subtitle="Use comma or Enter to add values.">
        <div className="grid gap-4 md:grid-cols-2">
          {['skills', 'languages'].map((field) => (
            <div key={field} className="space-y-2">
              <Label>{chipFieldMap[field]}</Label>
              <Input
                value={chipInputs[field] || ''}
                onChange={(e) => handleChipInput(field, e.target.value)}
                onKeyDown={(e) => onChipKeyDown(e, field)}
                onBlur={() => applyChipInput(field, chipInputs[field] || '')}
                placeholder="React, Node.js, SQL"
              />
              <div className="flex flex-wrap gap-2">
                {formState.profile[field].map((item) => (
                  <Badge key={item} className="gap-2 bg-violet-100 text-violet-800 hover:bg-violet-100">
                    {item}
                    <button type="button" onClick={() => removeChipValue(field, item)} className="text-violet-700">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Media assets" subtitle="Profile photo is optional but strongly recommended.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Profile photo</Label>
            <Input type="file" accept="image/*" onChange={(e) => setProfilePhotoFile(e.target.files?.[0] || null)} />
            <p className="text-xs text-slate-500">
              {profilePhotoFile?.name || formState.profile.profilePhoto ? 'Profile photo ready to save.' : 'JPG, PNG, or WEBP up to your configured upload limit.'}
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {formState.profile.profilePhoto ? 'Existing profile photo is already attached.' : 'No profile photo uploaded yet.'}
          </div>
        </div>
      </SectionCard>
    </div>
  )

  const renderEducation = () => (
    <SectionCard
      title="Academic journey"
      subtitle="Start with the most relevant qualifications for the role you want."
      action={
        <Button type="button" variant="outline" size="sm" onClick={() => addCollectionItem('education', emptyEducation)}>
          <Plus className="mr-2 h-4 w-4" />
          Add education
        </Button>
      }
    >
      <div className="space-y-4">
        {formState.profile.education.map((item, index) => (
          <div key={`education-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">Education #{index + 1}</h4>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeCollectionItem('education', index, emptyEducation)}>
                <Trash2 className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>School or university</Label>
                <Input value={item.school} onChange={(e) => updateCollectionItem('education', index, 'school', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input value={item.degree} onChange={(e) => updateCollectionItem('education', index, 'degree', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Field of study</Label>
                <Input value={item.fieldOfStudy} onChange={(e) => updateCollectionItem('education', index, 'fieldOfStudy', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Grade / CGPA</Label>
                <Input value={item.grade} onChange={(e) => updateCollectionItem('education', index, 'grade', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Start year</Label>
                <Input value={item.startYear} onChange={(e) => updateCollectionItem('education', index, 'startYear', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End year</Label>
                <Input value={item.endYear} onChange={(e) => updateCollectionItem('education', index, 'endYear', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateCollectionItem('education', index, 'description', e.target.value)}
                  className="flex min-h-[96px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  placeholder="Relevant coursework, leadership, projects, or distinctions."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )

  const renderExperience = () => (
    <div className="space-y-4">
      <SectionCard
        title="Work experience"
        subtitle="Focus on impact, ownership, and measurable results."
        action={
          <Button type="button" variant="outline" size="sm" onClick={() => addCollectionItem('experience', emptyExperience)}>
            <Plus className="mr-2 h-4 w-4" />
            Add experience
          </Button>
        }
      >
        <div className="space-y-4">
          {formState.profile.experience.map((item, index) => (
            <div key={`experience-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">Experience #{index + 1}</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCollectionItem('experience', index, emptyExperience)}>
                  <Trash2 className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={item.company} onChange={(e) => updateCollectionItem('experience', index, 'company', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={item.title} onChange={(e) => updateCollectionItem('experience', index, 'title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Employment type</Label>
                  <Input value={item.employmentType} onChange={(e) => updateCollectionItem('experience', index, 'employmentType', e.target.value)} placeholder="Full-time, Internship" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={item.location} onChange={(e) => updateCollectionItem('experience', index, 'location', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Start date</Label>
                  <Input value={item.startDate} onChange={(e) => updateCollectionItem('experience', index, 'startDate', e.target.value)} placeholder="Jan 2024" />
                </div>
                <div className="space-y-2">
                  <Label>End date</Label>
                  <Input value={item.endDate} onChange={(e) => updateCollectionItem('experience', index, 'endDate', e.target.value)} placeholder="Present or Jun 2025" />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={item.currentlyWorking}
                    onChange={(e) => updateCollectionItem('experience', index, 'currentlyWorking', e.target.checked)}
                  />
                  I currently work here
                </label>
                <div className="space-y-2 md:col-span-2">
                  <Label>Summary</Label>
                  <textarea
                    rows={4}
                    value={item.summary}
                    onChange={(e) => updateCollectionItem('experience', index, 'summary', e.target.value)}
                    className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    placeholder="Describe your scope, ownership, technologies used, and business impact."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Key achievements</Label>
                  <Input
                    value={Array.isArray(item.achievements) ? item.achievements.join(', ') : ''}
                    onChange={(e) => updateCollectionItem('experience', index, 'achievements', parseCommaSeparated(e.target.value))}
                    placeholder="Reduced load time by 35%, shipped reusable component library"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Projects"
        subtitle="Strong projects help early-career candidates close the credibility gap."
        action={
          <Button type="button" variant="outline" size="sm" onClick={() => addCollectionItem('projects', emptyProject)}>
            <Plus className="mr-2 h-4 w-4" />
            Add project
          </Button>
        }
      >
        <div className="space-y-4">
          {formState.profile.projects.map((item, index) => (
            <div key={`project-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">Project #{index + 1}</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCollectionItem('projects', index, emptyProject)}>
                  <Trash2 className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Project name</Label>
                  <Input value={item.name} onChange={(e) => updateCollectionItem('projects', index, 'name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Your role</Label>
                  <Input value={item.role} onChange={(e) => updateCollectionItem('projects', index, 'role', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Project link</Label>
                  <Input value={item.link} onChange={(e) => updateCollectionItem('projects', index, 'link', e.target.value)} placeholder="https://..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Tech stack</Label>
                  <Input
                    value={Array.isArray(item.techStack) ? item.techStack.join(', ') : ''}
                    onChange={(e) => updateCollectionItem('projects', index, 'techStack', parseCommaSeparated(e.target.value))}
                    placeholder="React, Redux Toolkit, Node.js, MongoDB"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Summary</Label>
                  <textarea
                    rows={3}
                    value={item.summary}
                    onChange={(e) => updateCollectionItem('projects', index, 'summary', e.target.value)}
                    className="flex min-h-[96px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    placeholder="Highlight the problem solved, your contribution, and outcomes."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )

  const renderAchievements = () => (
    <SectionCard title="Recognition and differentiators" subtitle="These help hiring teams understand how you stand out beyond your job titles.">
      <div className="grid gap-4 md:grid-cols-2">
        {['achievements', 'certifications', 'strengths'].map((field) => (
          <div key={field} className="space-y-2">
            <Label>{chipFieldMap[field]}</Label>
            <Input
              value={chipInputs[field] || ''}
              onChange={(e) => handleChipInput(field, e.target.value)}
              onKeyDown={(e) => onChipKeyDown(e, field)}
              onBlur={() => applyChipInput(field, chipInputs[field] || '')}
              placeholder="Press Enter to add"
            />
            <div className="flex flex-wrap gap-2">
              {formState.profile[field].map((item) => (
                <Badge key={`${field}-${item}`} className="gap-2 bg-slate-100 text-slate-800 hover:bg-slate-100">
                  {item}
                  <button type="button" onClick={() => removeChipValue(field, item)} className="text-slate-600">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )

  const renderOtherDetails = () => (
    <div className="space-y-4">
      <SectionCard title="Professional links" subtitle="Make verification effortless for recruiters and hiring managers.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Website</Label>
            <Input value={formState.profile.website} onChange={(e) => updateProfileField('website', e.target.value)} placeholder="https://yourdomain.com" />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input value={formState.profile.linkedinUrl} onChange={(e) => updateProfileField('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="space-y-2">
            <Label>GitHub</Label>
            <Input value={formState.profile.githubUrl} onChange={(e) => updateProfileField('githubUrl', e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Portfolio</Label>
            <Input value={formState.profile.portfolioUrl} onChange={(e) => updateProfileField('portfolioUrl', e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Preferences" subtitle="These settings make your profile more useful for role discovery and recruiter screening.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Salary expectation</Label>
            <Input value={formState.profile.salaryExpectation} onChange={(e) => updateProfileField('salaryExpectation', e.target.value)} placeholder="8-12 LPA" />
          </div>
          <div className="space-y-2">
            <Label>Notice period</Label>
            <Input value={formState.profile.noticePeriod} onChange={(e) => updateProfileField('noticePeriod', e.target.value)} placeholder="Immediate / 30 days" />
          </div>
          <div className="space-y-2">
            <Label>Preferred job types</Label>
            <Input
              value={chipInputs.preferredJobTypes || ''}
              onChange={(e) => handleChipInput('preferredJobTypes', e.target.value)}
              onKeyDown={(e) => onChipKeyDown(e, 'preferredJobTypes')}
              onBlur={() => applyChipInput('preferredJobTypes', chipInputs.preferredJobTypes || '')}
              placeholder="Full-time, Internship, Remote"
            />
            <div className="flex flex-wrap gap-2">
              {formState.profile.preferredJobTypes.map((item) => (
                <Badge key={item} className="gap-2 bg-violet-100 text-violet-800">
                  {item}
                  <button type="button" onClick={() => removeChipValue('preferredJobTypes', item)}>×</button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Preferred locations</Label>
            <Input
              value={chipInputs.preferredLocations || ''}
              onChange={(e) => handleChipInput('preferredLocations', e.target.value)}
              onKeyDown={(e) => onChipKeyDown(e, 'preferredLocations')}
              onBlur={() => applyChipInput('preferredLocations', chipInputs.preferredLocations || '')}
              placeholder="Bengaluru, Remote, Pune"
            />
            <div className="flex flex-wrap gap-2">
              {formState.profile.preferredLocations.map((item) => (
                <Badge key={item} className="gap-2 bg-violet-100 text-violet-800">
                  {item}
                  <button type="button" onClick={() => removeChipValue('preferredLocations', item)}>×</button>
                </Badge>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2">
            <input
              type="checkbox"
              checked={formState.profile.openToWork}
              onChange={(e) => updateProfileField('openToWork', e.target.checked)}
            />
            Open to work opportunities
          </label>
        </div>
      </SectionCard>
    </div>
  )

  const renderResumePreview = () => (
    <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
      <SectionCard title="Resume and final review" subtitle="Review your assets before saving the full profile.">
        <div className="space-y-4">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Resume upload</p>
                <p className="text-sm text-slate-500">PDF recommended for best compatibility.</p>
              </div>
            </div>
            <Input className="mt-4" type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            <p className="mt-2 text-xs text-slate-500">
              {resumeFile?.name || formState.profile.resumeOriginalName || 'No resume selected yet.'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Profile headline</p>
              <p className="mt-2 text-sm text-slate-800">{formState.profile.headline || 'Add a strong headline in Basic Details.'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Primary links</p>
              <p className="mt-2 text-sm text-slate-800">{formState.profile.linkedinUrl || formState.profile.githubUrl || formState.profile.portfolioUrl || 'Add at least one professional link.'}</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Before you save" subtitle="This last check helps keep the profile recruiter-ready.">
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {formState.profile.skills.length} skills added
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {formState.profile.education.filter((item) => item.school || item.degree).length} education entries
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {formState.profile.experience.filter((item) => item.company || item.title).length} experience entries
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {formState.profile.projects.filter((item) => item.name || item.link).length} project entries
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            Open to work: {formState.profile.openToWork ? 'Yes' : 'No'}
          </div>
        </div>
      </SectionCard>
    </div>
  )

  const stepContent = [
    renderPointToRemember(),
    renderBasicDetails(),
    renderEducation(),
    renderExperience(),
    renderAchievements(),
    renderOtherDetails(),
    renderResumePreview(),
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-0 bg-gradient-to-br from-slate-50 via-white to-violet-50 p-0 sm:max-w-6xl">
        <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-950">Build your production-ready profile</DialogTitle>
            <DialogDescription className="max-w-3xl text-sm text-slate-600">
              Complete the sections below to create a profile that is useful for recruiters, hiring managers, and future matching logic.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5">
            <StepIndicator currentStep={currentStep} />
          </div>
        </div>

        <form onSubmit={submitHandler} className="px-6 py-6 sm:px-8">
          <div className="min-h-[420px]">{stepContent[currentStep]}</div>

          <DialogFooter className="mt-6 border-t border-slate-200 pt-6">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" disabled={currentStep === 0} onClick={() => setCurrentStep((prev) => prev - 1)}>
                  Previous
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={() => setCurrentStep((prev) => prev + 1)}>
                    Next
                  </Button>
                ) : loading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving profile
                  </Button>
                ) : (
                  <Button type="submit">
                    Save profile
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog
