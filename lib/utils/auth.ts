import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'

export async function getSessionUser() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) return user
  } catch (err) {
    // Gracefully catch server auth client exceptions in test environments
  }

  if (process.env.NODE_ENV === 'development') {
    try {
      const firstUser = await prisma.user.findFirst()
      if (firstUser) {
        return { id: firstUser.supabaseId, email: firstUser.email } as any
      }
    } catch (err) {
      // Catch db access errors during early migration stages
    }
  }

  return null
}

export async function getBusinessFromSession(): Promise<{
  businessId: string
  planTier: string
} | null> {
  const user = await getSessionUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { ownedBusiness: { select: { id: true, planTier: true } } },
  })

  if (!dbUser?.ownedBusiness) return null
  return {
    businessId: dbUser.ownedBusiness.id,
    planTier: dbUser.ownedBusiness.planTier,
  }
}
