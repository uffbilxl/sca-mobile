import { collection, getDocs, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import type { SCAOpportunity } from './types'

const COL = 'sca-opportunities'

export function subscribeToOpportunities(callback: (opps: SCAOpportunity[]) => void) {
  const q = query(collection(db, COL), orderBy('order'))
  return onSnapshot(q, snapshot => {
    const opps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SCAOpportunity))
    callback(opps)
  })
}

export async function seedIfEmpty() {
  const snapshot = await getDocs(collection(db, COL))
  if (!snapshot.empty) return

  const data = [
    {
      title: 'Web Development Intern',
      subtitle: 'BCU Student Computing Association',
      status: 'open',
      division: 'Web Division',
      extraTags: ['Year-long'],
      description:
        "A year-long internship within the SCA's Web Division, responsible for building and maintaining the association's digital presence. You'll work on live websites used by SCA members, keeping them up to date, functional, and well-designed. Ideal for students who want real ownership over a product and hands-on web development experience alongside their studies.",
      whatYoullDo: [
        'Maintain and update existing SCA websites',
        'Build new pages and features as the association grows',
        'Fix bugs and ensure cross-browser, responsive performance',
        'Collaborate with other SCA divisions on web needs',
      ],
      skills: ['HTML', 'CSS', 'JavaScript'],
      skillsNote: 'Basic proficiency required',
      experienceNote: 'No prior experience required',
      benefits: [
        'Ownership of real, live products',
        'Strengthen your CV',
        'Build a portfolio for internships & placements',
      ],
      footer: 'Year-long · Starting 2026',
      organiser: { name: 'Tayyeb Nadeem Somro', email: 'tayyeb.nadeemsomro@mail.bcu.ac.uk' },
      applyUrl: 'https://tally.so/r/QK4R5l',
      order: 1,
    },
    {
      title: 'SCA Sports Analytics Department',
      subtitle: 'BCU Student Computing Association · BCU Basketball',
      status: 'open',
      division: 'AI Division',
      extraTags: [],
      description:
        "A student-led initiative under the AI Division supporting the BCU Basketball team ahead of the 2026/27 BUCS season. Successful applicants will take part in a summer pilot programme before the official launch in September. Best suited to those with an interest in data and AI.",
      roles: ['Performance Analyst', 'Video Analyst', 'Data Collector'],
      whatYoullDo: [
        'Attend fixtures and collect live data',
        'Process and analyse performance data',
        'Contribute to match and opposition reports',
        'Support video analysis and scouting',
      ],
      skills: ['Python', 'Excel', 'PowerPoint'],
      skillsNote: 'Basic proficiency required',
      experienceNote: 'No prior experience required',
      benefits: [
        'Hands-on real-world experience',
        'Strengthen your CV',
        'Build skills for internships & placements',
      ],
      footer: 'Summer pilot · Official launch September 2026',
      organiser: { name: 'Mohamed Dahir', email: 'Mohamed.Dahir@mail.bcu.ac.uk' },
      applyUrl:
        'https://forms.microsoft.com/Pages/ResponsePage.aspx?id=VeArfoqCI0W15bd62ZOXhXzJrZmCHBlEj4k_jYn1UyZUNjFMRjc3OVRDRk1XQkVBVUdRUVlXTzdYNi4u',
      contactEmail: 'Mohamed.Dahir@mail.bcu.ac.uk',
      order: 2,
    },
  ]

  for (const opp of data) {
    await addDoc(collection(db, COL), opp)
  }
}
