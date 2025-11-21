import { setupWorker } from 'msw/browser'
import { handlers } from './handlers/index'

export const worker = setupWorker(...handlers)
