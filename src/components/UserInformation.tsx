import type { User } from '../types/user'

interface Field {
  label: string
  value: string
}

function InformationSection({ title, fields, columns = 5 }: { title?: string; fields: Field[]; columns?: number }) {
  return (
    <section className="information-section">
      {title && <h2>{title}</h2>}
      <dl className={`information-grid information-grid--${columns}`}>
        {fields.map((field) => (
          <div key={`${field.label}-${field.value}`}><dt>{field.label}</dt><dd>{field.value}</dd></div>
        ))}
      </dl>
    </section>
  )
}

export default function UserInformation({ user }: { user: User }) {
  const personal = [
    { label: 'Full Name', value: user.fullName },
    { label: 'Phone Number', value: user.phoneNumber },
    { label: 'Email Address', value: user.email },
    { label: 'BVN', value: user.bvn },
    { label: 'Gender', value: user.gender },
    { label: 'Marital Status', value: user.maritalStatus },
    { label: 'Children', value: user.children },
    { label: 'Type of Residence', value: user.residenceType },
  ]
  const education = [
    { label: 'Level of Education', value: user.educationLevel },
    { label: 'Employment Status', value: user.employmentStatus },
    { label: 'Sector of Employment', value: user.employmentSector },
    { label: 'Duration of Employment', value: user.employmentDuration },
    { label: 'Office Email', value: user.officeEmail },
    { label: 'Monthly Income', value: user.monthlyIncome },
    { label: 'Loan Repayment', value: user.loanRepayment },
  ]
  const socials = [
    { label: 'Twitter', value: user.twitter },
    { label: 'Facebook', value: user.facebook },
    { label: 'Instagram', value: user.instagram },
  ]
  const guarantors = user.guarantors.flatMap((guarantor) => [
    { label: 'Full Name', value: guarantor.fullName },
    { label: 'Phone Number', value: guarantor.phoneNumber },
    { label: 'Email Address', value: guarantor.email },
    { label: 'Relationship', value: guarantor.relationship },
  ])

  return (
    <article className="user-information">
      <InformationSection title="Personal Information" fields={personal} />
      <InformationSection title="Education and Employment" fields={education} columns={4} />
      <InformationSection title="Socials" fields={socials} columns={4} />
      <InformationSection title="Guarantor" fields={guarantors} columns={4} />
    </article>
  )
}
