import { mkdir, writeFile } from 'node:fs/promises'
import {
  faBars,
  faBell,
  faBriefcase,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChartBar,
  faClipboardList,
  faCoins,
  faEye,
  faFileInvoice,
  faHandshake,
  faHandHoldingUsd,
  faLongArrowAltLeft,
  faHome,
  faPiggyBank,
  faSearch,
  faSignOutAlt,
  faScroll,
  faSlidersH,
  faUniversity,
  faUserCheck,
  faUserCog,
  faUserFriends,
  faUserTimes,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

const icons = {
  bank: faUniversity,
  bell: faBell,
  briefcase: faBriefcase,
  'arrow-left': faLongArrowAltLeft,
  'chart-bar': faChartBar,
  'chevron-down': faChevronDown,
  'chevron-left': faChevronLeft,
  'chevron-right': faChevronRight,
  'clipboard-list': faClipboardList,
  coins: faCoins,
  dashboard: faHome,
  eye: faEye,
  'file-invoice': faFileInvoice,
  handshake: faHandshake,
  'hand-holding': faHandHoldingUsd,
  logout: faSignOutAlt,
  menu: faBars,
  'piggy-bank': faPiggyBank,
  savings: faPiggyBank,
  search: faSearch,
  scroll: faScroll,
  settings: faSlidersH,
  transaction: faScroll,
  'user-check': faUserCheck,
  'user-cog': faUserCog,
  'user-times': faUserTimes,
  users: faUsers,
  'users-group': faUserFriends,
}

const outputDirectory = new URL('../src/assets/icons/', import.meta.url)
await mkdir(outputDirectory, { recursive: true })

for (const [name, definition] of Object.entries(icons)) {
  const [width, height, , , pathData] = definition.icon
  const paths = Array.isArray(pathData) ? pathData : [pathData]
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`,
    ...paths.map((path) => `<path fill="#213F7D" d="${path}"/>`),
    '</svg>',
    '',
  ].join('')
  await writeFile(new URL(`${name}.svg`, outputDirectory), svg)
}

const summaryIcons = {
  'summary-users': [faUsers, '#DF18FF'],
  'summary-active-users': [faUserFriends, '#5718FF'],
  'summary-loans': [faFileInvoice, '#F55F44'],
  'summary-savings': [faCoins, '#FF3366'],
}

for (const [name, [definition, color]] of Object.entries(summaryIcons)) {
  const [width, height, , , pathData] = definition.icon
  const paths = Array.isArray(pathData) ? pathData : [pathData]
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`,
    ...paths.map((path) => `<path fill="${color}" d="${path}"/>`),
    '</svg>',
    '',
  ].join('')
  await writeFile(new URL(`${name}.svg`, outputDirectory), svg)
}

const filterResults = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#545F7D" d="M1 3h14v2H1V3Zm2.5 4h9v2h-9V7ZM6 11h4v2H6v-2Z"/></svg>\n'
await writeFile(new URL('filter.svg', outputDirectory), filterResults)

const notificationBell = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="#213F7D" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></svg>\n'
await writeFile(new URL('bell.svg', outputDirectory), notificationBell)

console.log(`Generated ${Object.keys(icons).length + Object.keys(summaryIcons).length + 1} Figma-matched SVG assets`)
