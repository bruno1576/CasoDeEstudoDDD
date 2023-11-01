import { MissingParamError } from './error/missing-param-error'
import { httpResponse, httpRequest } from './protocols/http'
import { badRequest } from './helpers/http-helper'
import { Controller } from './protocols/controller'
import { EmailValidator } from './protocols/email-validator'
import { InvalidParamError } from './error/invalid-param-error'

export class SignUpController implements Controller {
  private readonly EmailValidator: EmailValidator

  constructor(EmailValidator) {
    this.EmailValidator = EmailValidator
  }

  handle (httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    if (!this.EmailValidator.isValid(httpRequest.body['email'])) {
        return badRequest(new InvalidParamError('email'))
    }
  }
}
