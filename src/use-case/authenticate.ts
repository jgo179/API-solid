import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import bcryptjs from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUserCaseRequest {
  email: string
  password: string
}

interface AuthenticateUserCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserCaseRequest): Promise<AuthenticateUserCaseResponse> {
    // buscar o usuário no banco pelo email
    // comparar se a senha salva no banco bate com a senha do param

    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await bcryptjs.compare(
      password,
      user.password_hash,
    )

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
