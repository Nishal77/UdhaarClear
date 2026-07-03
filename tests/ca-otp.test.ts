/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendCAOtp, verifyCAOtp } from '@/lib/ca/otp'
import { prisma } from '@/lib/prisma/client'
import * as whatsappClient from '@/lib/whatsapp/client'
import * as icaiVerification from '@/lib/ca/icai-verification'

vi.mock('@/lib/prisma/client', () => ({
  prisma: {
    cAProfile: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/lib/whatsapp/client', () => ({
  sendTemplateMessage: vi.fn(),
}))

vi.mock('@/lib/ca/icai-verification', () => ({
  verifyICAIMembership: vi.fn(),
}))

const CA_ID = 'ca-1'
const PHONE = '+919945147769'

describe('sendCAOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stores a 6-digit code and sends it via WhatsApp', async () => {
    vi.mocked(prisma.cAProfile.update).mockResolvedValue({} as any)
    vi.mocked(whatsappClient.sendTemplateMessage).mockResolvedValue({ messages: [{ id: 'wamid-1' }] })

    await sendCAOtp(CA_ID, PHONE)

    expect(prisma.cAProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: CA_ID },
        data: expect.objectContaining({
          otpCode: expect.stringMatching(/^\d{6}$/),
          otpAttempts: 0,
          verificationStatus: 'OTP_SENT',
        }),
      })
    )
    expect(whatsappClient.sendTemplateMessage).toHaveBeenCalledWith(
      expect.objectContaining({ to: PHONE, templateName: 'ca_partner_otp' })
    )
  })

  it('does not throw in development when the WhatsApp send fails — logs the code instead', async () => {
    const originalEnv = process.env.NODE_ENV
    // @ts-expect-error — test-only override of a readonly-in-types env var
    process.env.NODE_ENV = 'development'

    vi.mocked(prisma.cAProfile.update).mockResolvedValue({} as any)
    vi.mocked(whatsappClient.sendTemplateMessage).mockRejectedValue(new Error('WhatsApp API error: 190'))
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await expect(sendCAOtp(CA_ID, PHONE)).resolves.toBeUndefined()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('CA OTP for'))

    warnSpy.mockRestore()
    // @ts-expect-error — restoring the same test-only override
    process.env.NODE_ENV = originalEnv
  })

  it('still throws in production when the WhatsApp send fails — a real CA must not be silently blocked', async () => {
    const originalEnv = process.env.NODE_ENV
    // @ts-expect-error — test-only override
    process.env.NODE_ENV = 'production'

    vi.mocked(prisma.cAProfile.update).mockResolvedValue({} as any)
    vi.mocked(whatsappClient.sendTemplateMessage).mockRejectedValue(new Error('WhatsApp API error: 190'))

    await expect(sendCAOtp(CA_ID, PHONE)).rejects.toThrow('WhatsApp API error: 190')

    // @ts-expect-error — restoring the same test-only override
    process.env.NODE_ENV = originalEnv
  })
})

describe('verifyCAOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const baseCA = {
    id: CA_ID,
    otpCode: '482913',
    otpAttempts: 0,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    icaiMembershipNumber: '123456',
    copNumber: null,
  }

  it('rejects an incorrect code and increments the attempt counter', async () => {
    vi.mocked(prisma.cAProfile.findUnique).mockResolvedValue(baseCA as any)
    vi.mocked(prisma.cAProfile.update).mockResolvedValue({} as any)

    const result = await verifyCAOtp(CA_ID, '000000')

    expect(result).toEqual({ ok: false, reason: 'Incorrect code' })
    expect(prisma.cAProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { otpAttempts: { increment: 1 } } })
    )
  })

  it('rejects an expired code', async () => {
    vi.mocked(prisma.cAProfile.findUnique).mockResolvedValue({
      ...baseCA,
      otpExpiresAt: new Date(Date.now() - 1000),
    } as any)

    const result = await verifyCAOtp(CA_ID, '482913')

    expect(result).toEqual({ ok: false, reason: 'Code expired — request a new one' })
  })

  it('rejects after too many incorrect attempts', async () => {
    vi.mocked(prisma.cAProfile.findUnique).mockResolvedValue({ ...baseCA, otpAttempts: 5 } as any)

    const result = await verifyCAOtp(CA_ID, '482913')

    expect(result).toEqual({ ok: false, reason: 'Too many incorrect attempts — request a new code' })
  })

  it('accepts the correct code, runs the ICAI check, and clears the OTP', async () => {
    vi.mocked(prisma.cAProfile.findUnique).mockResolvedValue(baseCA as any)
    vi.mocked(prisma.cAProfile.update).mockResolvedValue({} as any)
    vi.mocked(icaiVerification.verifyICAIMembership).mockResolvedValue({
      status: 'MANUAL_REVIEW',
      reason: 'Automatic ICAI directory verification is not wired up yet — queued for manual review',
    })

    const result = await verifyCAOtp(CA_ID, '482913')

    expect(result).toEqual({ ok: true })
    expect(icaiVerification.verifyICAIMembership).toHaveBeenCalledWith('123456', null)
    expect(prisma.cAProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          otpCode: null,
          otpExpiresAt: null,
          otpAttempts: 0,
          verificationStatus: 'MANUAL_REVIEW',
          verifiedAt: null,
        }),
      })
    )
  })
})
