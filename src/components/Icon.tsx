import { ImgHTMLAttributes } from 'react'
import bank from '../assets/icons/bank.svg'
import arrowLeft from '../assets/icons/arrow-left.svg'
import bell from '../assets/icons/bell.svg'
import briefcase from '../assets/icons/briefcase.svg'
import chartBar from '../assets/icons/chart-bar.svg'
import chevronDown from '../assets/icons/chevron-down.svg'
import chevronLeft from '../assets/icons/chevron-left.svg'
import chevronRight from '../assets/icons/chevron-right.svg'
import clipboardList from '../assets/icons/clipboard-list.svg'
import coins from '../assets/icons/coins.svg'
import dashboard from '../assets/icons/dashboard.svg'
import eye from '../assets/icons/eye.svg'
import fileInvoice from '../assets/icons/file-invoice.svg'
import filter from '../assets/icons/filter.svg'
import handHolding from '../assets/icons/hand-holding.svg'
import handshake from '../assets/icons/handshake.svg'
import loan from '../assets/icons/loan.svg'
import logout from '../assets/icons/logout.svg'
import menu from '../assets/icons/menu.svg'
import piggyBank from '../assets/icons/piggy-bank.svg'
import savings from '../assets/icons/savings.svg'
import search from '../assets/icons/search.svg'
import settings from '../assets/icons/settings.svg'
import scroll from '../assets/icons/scroll.svg'
import summaryActiveUsers from '../assets/icons/summary-active-users.svg'
import summaryLoans from '../assets/icons/summary-loans.svg'
import summarySavings from '../assets/icons/summary-savings.svg'
import summaryUsers from '../assets/icons/summary-users.svg'
import transaction from '../assets/icons/transaction.svg'
import userCheck from '../assets/icons/user-check.svg'
import userCog from '../assets/icons/user-cog.svg'
import userTimes from '../assets/icons/user-times.svg'
import users from '../assets/icons/users.svg'
import usersGroup from '../assets/icons/users-group.svg'

export const icons = {
  arrowLeft,
  bank,
  bell,
  briefcase,
  chartBar,
  chevronDown,
  chevronLeft,
  chevronRight,
  clipboardList,
  coins,
  dashboard,
  eye,
  fileInvoice,
  filter,
  handHolding,
  handshake,
  loan,
  logout,
  menu,
  piggyBank,
  savings,
  search,
  scroll,
  settings,
  summaryActiveUsers,
  summaryLoans,
  summarySavings,
  summaryUsers,
  transaction,
  userCheck,
  userCog,
  userTimes,
  users,
  usersGroup,
} as const

export type IconName = keyof typeof icons

interface IconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  name: IconName
}

export default function Icon({ name, alt = '', ...props }: IconProps) {
  return <img src={icons[name]} alt={alt} aria-hidden={alt ? undefined : true} {...props} />
}
