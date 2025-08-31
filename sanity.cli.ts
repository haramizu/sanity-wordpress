
import { config as dotenvConfig } from 'dotenv'
dotenvConfig()
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || 'qldrpv59',
    dataset: process.env.SANITY_DATASET || 'production'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
