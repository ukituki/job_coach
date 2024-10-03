const jobs = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    title: 'Factory Worker',
    company: 'PolishManufacturing Co.',
    location: 'Warsaw, Poland',
    description: 'Seeking hardworking individuals for our manufacturing plant. No prior experience required.',
    salary: '3000 - 3500 PLN per month',
    postedAt: '2024-10-01T10:00:00Z',
    startDate: '2024-11-15',
    industry: 'Manufacturing',
    visaAssistance: true,
    accommodationSupport: 'Shared dormitory provided',
    languageRequirement: 'Basic English or Polish'
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442b',
    title: 'Warehouse Associate',
    company: 'German Logistics GmbH',
    location: 'Hamburg, Germany',
    description: 'Join our team in a fast-paced warehouse environment. Forklift certification is a plus.',
    salary: '€1800 - €2200 per month',
    postedAt: '2024-10-02T09:30:00Z',
    startDate: '2024-12-01',
    industry: 'Logistics',
    visaAssistance: true,
    accommodationSupport: 'Housing allowance provided',
    languageRequirement: 'Basic German'
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442c',
    title: 'Seasonal Farm Worker',
    company: 'Polish Harvest Farms',
    location: 'Poznan, Poland',
    description: 'Seasonal work available for the upcoming harvest season. Room and board included.',
    salary: '2800 - 3200 PLN per month',
    postedAt: '2024-10-03T11:15:00Z',
    startDate: '2025-03-01',
    industry: 'Agriculture',
    visaAssistance: true,
    accommodationSupport: 'On-site accommodation provided',
    languageRequirement: 'No language requirement'
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442d',
    title: 'Assembly Line Worker',
    company: 'AutoParts Deutschland',
    location: 'Munich, Germany',
    description: 'Assemble automotive parts in our state-of-the-art facility. Training provided.',
    salary: '€1900 - €2300 per month',
    postedAt: '2024-10-04T14:00:00Z',
    startDate: '2024-11-30',
    industry: 'Automotive Manufacturing',
    visaAssistance: true,
    accommodationSupport: 'Assistance finding local housing',
    languageRequirement: 'Basic German preferred'
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442e',
    title: 'Greenhouse Worker',
    company: 'GreenFields Poland',
    location: 'Wroclaw, Poland',
    description: 'Work in our modern greenhouses cultivating vegetables and flowers.',
    salary: '2900 - 3300 PLN per month',
    postedAt: '2024-10-05T08:45:00Z',
    startDate: '2024-12-15',
    industry: 'Agriculture',
    visaAssistance: true,
    accommodationSupport: 'Shared housing available',
    languageRequirement: 'Basic English or Polish'
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442f',
    title: 'Meat Processing Worker',
    company: 'German Meats Inc.',
    location: 'Frankfurt, Germany',
    description: 'Join our team in meat processing and packaging. Food handling certification provided.',
    salary: '€1850 - €2250 per month',
    postedAt: '2024-10-06T13:30:00Z',
    startDate: '2024-12-01',
    industry: 'Food Processing',
    visaAssistance: true,
    accommodationSupport: 'Subsidized housing options',
    languageRequirement: 'Basic German'
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442g',
    title: 'Construction Laborer',
    company: 'BuildPol Construction',
    location: 'Krakow, Poland',
    description: 'General construction work on various projects. Safety training provided.',
    salary: '3100 - 3600 PLN per month',
    postedAt: '2024-10-07T09:00:00Z',
    startDate: '2024-11-20',
    industry: 'Construction',
    visaAssistance: true,
    accommodationSupport: 'Assistance with finding accommodation',
    languageRequirement: 'Basic Polish preferred'
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442h',
    title: 'Warehouse Picker/Packer',
    company: 'E-commerce Fulfillment Germany',
    location: 'Berlin, Germany',
    description: 'Fast-paced work in our e-commerce fulfillment center. Attention to detail required.',
    salary: '€1800 - €2100 per month',
    postedAt: '2024-10-08T11:45:00Z',
    startDate: '2024-12-10',
    industry: 'E-commerce',
    visaAssistance: true,
    accommodationSupport: 'Short-term housing assistance',
    languageRequirement: 'Basic English or German'
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442i',
    title: 'Food Production Worker',
    company: 'Polish Delights Factory',
    location: 'Gdansk, Poland',
    description: 'Work in our food production facility preparing traditional Polish foods.',
    salary: '2950 - 3350 PLN per month',
    postedAt: '2024-10-09T10:30:00Z',
    startDate: '2025-01-01',
    industry: 'Food Production',
    visaAssistance: true,
    accommodationSupport: 'Dormitory-style housing available',
    languageRequirement: 'No language requirement'
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442j',
    title: 'Recycling Plant Operator',
    company: 'GreenRecycle Germany',
    location: 'Dusseldorf, Germany',
    description: 'Operate machinery in our recycling plant. Environmental consciousness a plus.',
    salary: '€1950 - €2350 per month',
    postedAt: '2024-10-10T15:15:00Z',
    startDate: '2024-12-15',
    industry: 'Recycling',
    visaAssistance: true,
    accommodationSupport: 'Help with finding local apartments',
    languageRequirement: 'Basic German'
  }
];

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442c',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password_1',
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442d',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'hashed_password_2',
  },
  // Add more user entries as needed
];

module.exports = {
  jobs,
  users,
};