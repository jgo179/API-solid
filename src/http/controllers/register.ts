import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '../../use-case/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-case/factories/make-register-use-case'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      name,
      email,
      password
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return await res.status(409).send({ message: error.message })
    }

    throw error
  }

  return await res.status(201).send()
}
