import { getEntryCount } from './actions'
import HomeClient from './HomeClient'
import UserMenu from '@/components/UserMenu'

export default async function HomePage() {
  const count = await getEntryCount()
  return (
    <>
      <UserMenu />
      <HomeClient initialHasEntries={count > 0} />
    </>
  )
}
