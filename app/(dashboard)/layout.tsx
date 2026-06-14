import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { TopBar } from '@/components/layout/TopBar'
import { DashboardClientShell } from '@/components/layout/DashboardClientShell'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import fs from 'fs'
import path from 'path'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userName = 'User'
  let businessName = 'UdhaarClear'
  let userEmail = 'user@example.com'
  let userAvatarUrl = ''

  if (user) {
    userEmail = user.email || 'user@example.com'
    userAvatarUrl = user.user_metadata?.avatar_url || ''

    if (!userAvatarUrl) {
      let defaultAvatar = '/profile/img1.jpeg'
      try {
        const dir = path.join(process.cwd(), 'public', 'profile')
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir)
          const matching = files.filter(f => f.startsWith('img') && (f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png')))
          if (matching.length > 0) {
            const randomIndex = Math.floor(Math.random() * matching.length)
            defaultAvatar = `/profile/${matching[randomIndex]}`
          }
        }
      } catch (err) {
        console.error('Failed to resolve dynamic avatar in layout:', err)
      }

      try {
        const adminClient = await createServiceClient()
        await adminClient.auth.admin.updateUserById(user.id, {
          user_metadata: { ...user.user_metadata, avatar_url: defaultAvatar },
        })
        userAvatarUrl = defaultAvatar
      } catch (err) {
        console.error('Failed to retroactively assign avatar:', err)
      }
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { ownedBusiness: true },
    })
    if (dbUser) {
      userName = dbUser.name
      if (dbUser.ownedBusiness) {
        businessName = dbUser.ownedBusiness.name
      }
    }
  }

  return (
    <DashboardClientShell>
      <div className="flex h-full bg-white">
        <div className="hidden md:flex md:flex-shrink-0 bg-white">
          <Sidebar userName={userName} userEmail={userEmail} businessName={businessName} />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          <TopBar userName={userName} businessName={businessName} userEmail={userEmail} userAvatarUrl={userAvatarUrl} />
          <main className="flex-1 overflow-y-auto bg-[#F5F3EF] rounded-tl-[36px] pt-8 px-6 pb-20 md:px-8 md:pb-8">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </DashboardClientShell>
  )
}
