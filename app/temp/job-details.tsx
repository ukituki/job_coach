import { MapPin, Building, DollarSign, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// This would typically come from an API or database
const jobDetails = {
  id: 1,
  title: 'Construction Worker',
  company: 'BuildCo',
  location: 'New York, USA',
  salary: '$20-25/hour',
  type: 'Full-time',
  posted: '2 days ago',
  description: 'We are seeking experienced construction workers for a large-scale residential project. Responsibilities include operating machinery, following safety protocols, and collaborating with team members.',
  requirements: [
    'Minimum 2 years of experience in construction',
    'Knowledge of safety regulations and procedures',
    'Ability to lift heavy objects and work in various weather conditions',
    'Valid work permit for the USA'
  ]
}

export default function JobDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b">
        <Link href="/" className="text-2xl font-bold">MigrantJobs</Link>
        <nav>
          <Button variant="ghost">Sign In</Button>
          <Button>Post a Job</Button>
        </nav>
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/browse-jobs" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Job Listings
          </Link>

          <Card>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-4">{jobDetails.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center"><Building className="h-4 w-4 mr-1" /> {jobDetails.company}</div>
                <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {jobDetails.location}</div>
                <div className="flex items-center"><DollarSign className="h-4 w-4 mr-1" /> {jobDetails.salary}</div>
                <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {jobDetails.type}</div>
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Posted {jobDetails.posted}</div>
              </div>

              <div className="space-y-4">
                <section>
                  <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                  <p>{jobDetails.description}</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {jobDetails.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </CardContent>
            <CardFooter className="bg-muted">
              <Button size="lg">Apply Now</Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        © 2024 MigrantJobs. All rights reserved.
      </footer>
    </div>
  )
}