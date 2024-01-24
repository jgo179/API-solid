import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-case/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-case/factories/make-authenticate-use-case'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateBodySchema.parse(req.body)

    try {
        const authenticateUseCase = makeAuthenticateUseCase()

        await authenticateUseCase.execute({
            email,
            password
        })
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return await res.status(400).send({ message: error.message })
        }

        throw error
    }

    return await res.status(200).send()
}
