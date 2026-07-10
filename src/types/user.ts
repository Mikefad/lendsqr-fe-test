export type UserStatus = 'Inactive' | 'Pending' | 'Blacklisted' | 'Active'

export interface Guarantor {
  fullName: string
  phoneNumber: string
  email: string
  relationship: string
}

export interface User {
  id: string
  organization: string
  username: string
  fullName: string
  email: string
  phoneNumber: string
  dateJoined: string
  status: UserStatus
  bvn: string
  gender: 'Female' | 'Male'
  maritalStatus: string
  children: string
  residenceType: string
  educationLevel: string
  employmentStatus: string
  employmentSector: string
  employmentDuration: string
  officeEmail: string
  monthlyIncome: string
  loanRepayment: string
  twitter: string
  facebook: string
  instagram: string
  tier: 1 | 2 | 3
  balance: number
  bankAccount: string
  bankName: string
  hasLoan: boolean
  hasSavings: boolean
  guarantors: Guarantor[]
}

export interface UserFilters {
  organization: string
  username: string
  email: string
  date: string
  phoneNumber: string
  status: UserStatus | ''
}

export const emptyUserFilters: UserFilters = {
  organization: '',
  username: '',
  email: '',
  date: '',
  phoneNumber: '',
  status: '',
}
