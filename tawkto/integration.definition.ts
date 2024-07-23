import { IntegrationDefinition, z } from '@botpress/sdk'
import { integrationName } from './package.json'
import { tawkToEvent } from 'src/types'

export default new IntegrationDefinition({
  name: integrationName,
  title: 'Tawk.to',
  description: 'Tawk.to is a free messaging app that lets you monitor and chat with visitors on your website.',
  version: '0.0.1',
  readme: 'hub.md',
  icon: 'icon.svg',
  configuration:{
    schema: z.object({
      webhookSecret: z.string().describe('The secret key used to verify the incoming requests from Tawk.to')
    })
  },
  channels: {
  },
  actions: {
    createTicket: {
      title: 'Create Ticket',
      description: 'Create a new ticket in Tawk.to',
      input: {
        schema: z.object({
          name: z.string().describe('Name of the ticket requester'),
          email: z.string().describe('Email of the ticket requester'),
          subject: z.string().describe('Subject of the ticket'),
          message: z.string().describe('Message content of the ticket')
        })
      },
      output: {
        schema: z.object({
          ticketId: z.string().describe('The ID of the created ticket')
        })
      }
    }
  },
  events: {
    tawkToEvent: {
      title: 'Tawk To Event',
      description: 'Triggered when a webhook is received from Tawk To.',
      schema: tawkToEvent
    },
  }
})
