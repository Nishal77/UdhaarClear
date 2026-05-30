import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'

export async function getSessionUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
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
