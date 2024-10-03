import { Search, MapPin, Filter, Building, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const jobOffers = [
  { id: 1, title: 'Construction Worker', company: 'BuildCo', location: 'New York, USA', salary: '$20-25/hour' },
  { id: 2, title: 'Farm Hand', company: 'Green Fields', location: 'California, USA', salary: '$15-18/hour' },
  { id: 3, title: 'Hotel Housekeeper', company: 'Luxury Stays', location: 'Miami, USA', salary: '$14-16/hour' },
  { id: 4, title: 'Warehouse Associate', company: 'LogiCorp', location: 'Chicago, USA', salary: '$16-20/hour' },
  { id: 5, title: 'Restaurant Server', company: 'Gourmet Dining', location: 'Los Angeles, USA', salary: '$12-15/hour + tips' },
  { id: 6, title: 'Landscaper', company: 'Green Thumb Gardens', location: 'Seattle, USA', salary: '$18-22/hour' },
  { id: 7, title: 'Delivery Driver', company: 'Swift Deliveries', location: 'Dallas, USA', salary: '$17-21/hour' },
  { id: 8, title: 'Caregiver', company: 'Compassionate Care', location: 'Phoenix, USA', salary: '$15-19/hour' },
]

export default function BrowseJobsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b">
        <Link href="/" className="text-2xl font-bold">MigrantJobs</Link>
        <nav>
          <Button variant="ghost">Sign In</Button>
          <Button>Post a Job</Button>
        </nav>
      </header>

      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Browse Job Offers</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input placeholder="Job title or keyword" className="flex-grow" />
            <Input placeholder="Location" className="flex-grow" />
            <div className="flex gap-2">
              <Button size="icon"><Search className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jobOffers.map((job) => (
              <Card key={job.id} className="flex flex-col">
                <CardContent className="flex-grow p-4">
                  <h2 className="text-lg font-semibold mb-2">{job.title}</h2>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{job.company}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{job.salary}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted p-4">
                  <Button asChild className="w-full"><Link href={`/job/${job.id}`}>View Details</Link></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        © 2024 MigrantJobs. All rights reserved.
      </footer>
    </div>
  )
}