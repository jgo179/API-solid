import { makeGetUserProfileUseCase } from '@/use-case/factories/make-get-user-profile-use-case'
import { type FastifyRequest, type FastifyReply } from 'fastify'

export async function profile(req: FastifyRequest, res: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: req.user.sub,
  })

  return await res.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
