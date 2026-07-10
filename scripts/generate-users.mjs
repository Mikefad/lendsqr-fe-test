import { mkdir, writeFile } from 'node:fs/promises'

const firstNames = ['Grace', 'Adedeji', 'Debby', 'Tosin', 'Amara', 'Chinedu', 'Kemi', 'Femi', 'Zainab', 'Ibrahim', 'Ada', 'Tunde', 'Ngozi', 'Samuel', 'Aisha', 'David', 'Mariam', 'Emeka', 'Bola', 'Daniel']
const lastNames = ['Effiom', 'Ogana', 'Dokunmu', 'Okafor', 'Adeyemi', 'Balogun', 'Eze', 'Mohammed', 'Adebayo', 'Nwosu', 'Okeke', 'Lawal', 'Udo', 'James', 'Aliyu', 'Ojo', 'Williams', 'Bassey', 'Bello', 'Thomas']
const organizations = ['Lendsqr', 'Irorun', 'Lendstar', 'Kredi', 'Paystack', 'Carbon', 'Renmoney', 'FairMoney']
const statuses = ['Inactive', 'Pending', 'Blacklisted', 'Active']
const sectors = ['FinTech', 'Banking', 'Technology', 'Education', 'Healthcare', 'Retail']
const banks = ['Providus Bank', 'Access Bank', 'GTBank', 'Zenith Bank', 'First Bank']

const pad = (value, size) => String(value).padStart(size, '0')

const users = Array.from({ length: 500 }, (_, index) => {
  const firstName = firstNames[index % firstNames.length]
  const lastName = lastNames[(index * 7) % lastNames.length]
  const fullName = `${firstName} ${lastName}`
  const organization = organizations[(index * 3) % organizations.length]
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}`
  const phoneSuffix = pad(700000000 + index * 7919, 9).slice(-9)
  const phoneNumber = `0${index % 3 === 0 ? '80' : index % 3 === 1 ? '70' : '81'}${phoneSuffix.slice(1)}`
  const date = new Date(Date.UTC(2020 + (index % 5), index % 12, (index % 27) + 1, 8 + (index % 9), (index * 7) % 60))
  const emailDomain = organization.toLowerCase().replace(/[^a-z]/g, '')
  const guarantorFirst = firstNames[(index + 5) % firstNames.length]
  const guarantorLast = lastNames[(index + 9) % lastNames.length]

  return {
    id: `LSQ${pad(index + 1, 6)}`,
    organization,
    username,
    fullName,
    email: `${username}@${emailDomain}.com`,
    phoneNumber,
    dateJoined: date.toISOString(),
    status: statuses[index % statuses.length],
    bvn: `22${pad(100000000 + index * 3571, 9).slice(-9)}`,
    gender: index % 2 === 0 ? 'Female' : 'Male',
    maritalStatus: index % 3 === 0 ? 'Married' : 'Single',
    children: index % 4 === 0 ? String((index % 3) + 1) : 'None',
    residenceType: index % 2 === 0 ? 'Parent’s Apartment' : 'Rented Apartment',
    educationLevel: index % 3 === 0 ? 'M.Sc' : index % 3 === 1 ? 'B.Sc' : 'HND',
    employmentStatus: index % 5 === 0 ? 'Self-employed' : 'Employed',
    employmentSector: sectors[index % sectors.length],
    employmentDuration: `${(index % 8) + 1} years`,
    officeEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}.com`,
    monthlyIncome: `₦${100000 + (index % 5) * 100000}.00–₦${300000 + (index % 5) * 150000}.00`,
    loanRepayment: `${20000 + (index % 8) * 5000}`,
    twitter: `@${username.replace('.', '_')}`,
    facebook: fullName,
    instagram: `@${username.replace('.', '_')}`,
    tier: (index % 3) + 1,
    balance: 50000 + (index * 13711) % 950000,
    bankAccount: `${9000000000 + index * 37}`,
    bankName: banks[index % banks.length],
    hasLoan: index % 3 === 0,
    hasSavings: index % 2 === 0,
    guarantors: [{
      fullName: `${guarantorFirst} ${guarantorLast}`,
      phoneNumber: `080${pad(30000000 + index * 1237, 8).slice(-8)}`,
      email: `${guarantorFirst.toLowerCase()}.${guarantorLast.toLowerCase()}@mail.com`,
      relationship: index % 2 === 0 ? 'Sister' : 'Brother',
    }],
  }
})

await mkdir(new URL('../public/mock/', import.meta.url), { recursive: true })
await writeFile(new URL('../public/mock/users.json', import.meta.url), `${JSON.stringify(users, null, 2)}\n`)
console.log(`Generated ${users.length} users in public/mock/users.json`)
