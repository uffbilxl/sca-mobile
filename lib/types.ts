export type OpportunityType = 'INTERNSHIP' | 'PLACEMENT' | 'GRADUATE' | 'SPRING_WEEK' | 'INSIGHT'
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE'
export type Status = 'OPEN' | 'CLOSING_SOON' | 'CLOSED'
export type EventType = 'WORKSHOP' | 'PANEL' | 'HACKATHON' | 'NETWORKING' | 'TALK' | 'OTHER'

export interface Company {
  id: string
  name: string
  slug: string
  logo: string | null
  website: string | null
  description: string | null
}

export interface Opportunity {
  id: string
  title: string
  slug: string
  description: string
  type: OpportunityType
  location: string
  workMode: WorkMode
  salary: string | null
  salaryMin: number | null
  salaryMax: number | null
  deadline: Date | null
  startDate: string | null
  duration: string | null
  sponsored: boolean
  featured: boolean
  status: Status
  applyUrl: string | null
  company: Company
  tags: string[]
  createdAt: Date
}

export interface SCAEvent {
  id: string
  title: string
  description: string | null
  location: string
  isOnline: boolean
  date: Date
  endDate: Date | null
  spots: number | null
  registrations: number
  registrationUrl: string | null
  type: EventType
  poster?: string | null
}

export interface SCAOpportunity {
  id: string
  title: string
  subtitle: string
  status: 'open' | 'closed'
  division: string
  extraTags: string[]
  description: string
  roles?: string[]
  whatYoullDo: string[]
  skills: string[]
  skillsNote: string
  experienceNote: string
  benefits: string[]
  footer: string
  organiser?: { name: string; email: string }
  applyUrl: string
  contactEmail?: string
  order: number
}

export interface Resource {
  id: string
  title: string
  description: string
  fileUrl: string
}

export interface ResourceCategory {
  id: string
  label: string
  icon: string
  resources: Resource[]
}
