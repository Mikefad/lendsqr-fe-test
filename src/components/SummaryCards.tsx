import type { User } from '../types/user'
import Icon, { type IconName } from './Icon'

export default function SummaryCards({ users }: { users: User[] }) {
  const cards: { icon: IconName; label: string; value: number; tone: string }[] = [
    { icon: 'summaryUsers', label: 'Users', value: users.length, tone: 'pink' },
    { icon: 'summaryActiveUsers', label: 'Active Users', value: users.filter((user) => user.status === 'Active').length, tone: 'purple' },
    { icon: 'summaryLoans', label: 'Users with Loans', value: users.filter((user) => user.hasLoan).length, tone: 'orange' },
    { icon: 'summarySavings', label: 'Users with Savings', value: users.filter((user) => user.hasSavings).length, tone: 'rose' },
  ]

  return (
    <section className="summary-grid" aria-label="User statistics">
      {cards.map((card) => (
        <article className="summary-card" key={card.label}>
          <span className={`summary-card__icon ${card.tone}`}><Icon name={card.icon} /></span>
          <h2>{card.label}</h2>
          <strong>{card.value.toLocaleString()}</strong>
        </article>
      ))}
    </section>
  )
}
