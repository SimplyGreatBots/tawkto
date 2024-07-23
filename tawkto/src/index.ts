import * as sdk from '@botpress/sdk'
import * as bp from '.botpress'
import axios from 'axios'
import * as crypto from 'crypto'
import { tawkToEvent, chatId } from './types'

type GenerateIdOutput = bp.actions.createTicket.output.Output

export default new bp.Integration({
  register: async ({ctx, webhookUrl, logger}) => {
    const webhookSecret = ctx.configuration.webhookSecret

    if (!webhookSecret) {
      throw new sdk.RuntimeError('Invalid configuration: Webhook secret is required')
    }

    try {
      const testPayload = {
        event: 'test',
        time: new Date().toISOString(),
        message: 'This is a test payload'
      }
      const testSignature = crypto
        .createHmac('sha1', webhookSecret)
        .update(JSON.stringify(testPayload))
        .digest('hex')

      const response = await axios.post(webhookUrl, testPayload, {
        headers: {
          'X-Tawk-Signature': testSignature,
          'Content-Type': 'application/json'
        }
      })

      if (response.status !== 200) {
        throw new sdk.RuntimeError('Failed to verify webhook setup with tawk.to')
      }
      logger.forBot().info('Tawk.to webhook setup verified successfully')
    } catch (error) {
      throw new sdk.RuntimeError(`Failed to verify webhook setup with tawk.to: ${error}`)
    }

  },
  unregister: async () => {
    /**
     * This is called when a bot removes the integration.
     * You should use this handler to instanciate ressources in the external service and ensure that the configuration is valid.
     */
    throw new sdk.RuntimeError('Invalid configuration') // replace this with your own validation logic
  },
  actions: {
    createTicket: async (): Promise<GenerateIdOutput> => {
      return { ticketId: '' }
    }
  },
  channels: {},
  handler: async ({req, client, logger}) => {

    // Parsing the body, assuming it's always JSON.
    const bodyObject = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const parsedData = tawkToEvent.safeParse(bodyObject);

    logger.forBot().info('Received Tawk.to webhook event:', parsedData);

    if (!parsedData.success) {
      return
    }

    try {

      const event = await client.createEvent({
        type: 'tawkToEvent',
        payload: parsedData.data,
      })
      logger.forBot().info('tawkToEvent event created successfully.')
    } catch (error) {
      logger.forBot().error('Failed to create tawkToEvent event:', error)
      throw new sdk.RuntimeError(`Failed to create tawkToEvent event: ${error}`)
    }

  }
})
