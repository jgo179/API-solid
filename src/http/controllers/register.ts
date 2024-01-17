import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUserCase } from '../../use-case/register'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '../../use-case/errors/user-already-exists-error'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const usersRepository = new PrismaUsersRepository
    const registerUseCase = new RegisterUserCase(usersRepository)

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
