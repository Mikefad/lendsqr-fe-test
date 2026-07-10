import type { User } from '../types/user'
import Icon from './Icon'

const tabs = ['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System']

export default function UserProfileCard({ user }: { user: User }) {
  return (
    <section className="profile-card">
      <div className="profile-card__identity">
        <div className="profile-avatar"><Icon name="users" /></div>
        <div className="profile-name"><h2>{user.fullName}</h2><p>{user.id}</p></div>
        <div className="profile-tier">
          <span>User’s Tier</span>
          <div aria-label={`Tier ${user.tier} out of three`}>
            {[1, 2, 3].map((tier) => <span className={tier <= user.tier ? 'filled' : ''} key={tier}>★</span>)}
          </div>
        </div>
        <div className="profile-balance">
          <strong>₦{user.balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</strong>
          <span>{user.bankAccount}/{user.bankName}</span>
        </div>
      </div>
      <nav className="profile-tabs" aria-label="User details sections">
        {tabs.map((tab, index) => <button className={index === 0 ? 'active' : ''} type="button" key={tab}>{tab}</button>)}
      </nav>
    </section>
  )
}
