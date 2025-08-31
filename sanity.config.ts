// Load environment variables only in Node.js environment
if (typeof window === 'undefined') {
  require('dotenv').config()
}

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Sanity WordPress',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'project_id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
