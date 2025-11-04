import * as fs from 'fs'
import * as path from 'path'
import {parseStringPromise} from 'xml2js'
import {createClient} from '@sanity/client'
import {Readable} from 'node:stream'

import type {SanityClient, SanityImageAssetDocument, UploadClientConfig} from '@sanity/client'

function createAssetClient(client: SanityClient): SanityClient {
  // Check if client already has assets capability
  if (client.assets && typeof client.assets.upload === 'function') {
    return client
  }

  const token = process.env.SANITY_STUDIO_TOKEN
  if (!token) {
    throw new Error('Missing SANITY_STUDIO_TOKEN environment variable for asset uploads')
  }

  const {projectId, dataset, apiVersion} = client.config()

  return createClient({
    projectId,
    dataset,
    apiVersion: apiVersion || '2023-05-03',
    token,
    useCdn: false,
  })
}

// Get WordPress' asset metadata about an image by its ID and upload to Sanity
export async function wpImageFetchXML(
  id: number,
  client?: SanityClient,
): Promise<{metadata: UploadClientConfig; asset?: SanityImageAssetDocument} | null> {
  // Try multiple possible locations for the XML file
  const possiblePaths = [
    path.resolve(__dirname, './WordPress.assets.xml'),
    path.resolve(__dirname, '../WordPress.assets.xml'),
    path.resolve(process.cwd(), 'WordPress.assets.xml'),
    path.resolve(process.cwd(), 'migrations/import-wp/WordPress.assets.xml'),
    path.resolve(process.cwd(), 'migrations/import-wp/lib/WordPress.assets.xml'),
  ]

  let xmlFilePath: string | null = null
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      xmlFilePath = possiblePath
      break
    }
  }

  if (!xmlFilePath) {
    throw new Error(
      'WordPress.assets.xml file not found. Please ensure it exists in the project directory.',
    )
  }

  // Read the XML file
  const xmlData = fs.readFileSync(xmlFilePath, 'utf-8')

  // Parse the XML data
  const parsedXml = await parseStringPromise(xmlData)

  // Get the items from the parsed XML
  const items = parsedXml.rss.channel[0].item || []
  for (const item of items) {
    const currentPostId = item['wp:post_id']?.[0]
    if (parseInt(currentPostId, 10) === id) {
      const source_url = item['guid']?.[0]?._

      let metadata: UploadClientConfig = {
        filename: source_url.split('/').pop(),
        source: {
          id: id.toString(),
          name: 'WordPress',
          url: source_url,
        },
        // Not technically part of the Sanity imageAsset schema, but used by the popular Media Plugin
        // @ts-expect-error
        altText: item['title'][0] || `Title`,
      }

      if (item['title']) {
        metadata.title = item['title'][0]
      }

      // If client is provided, upload the image to Sanity
      if (client && source_url) {
        try {
          const {body} = await fetch(source_url)
          if (body) {
            const assetClient = createAssetClient(client)
            const asset = await assetClient.assets.upload('image', Readable.fromWeb(body), metadata)
            return {metadata, asset}
          }
        } catch (error) {
          console.error(`Failed to upload image from ${source_url}:`, error)
          return {metadata}
        }
      }

      return {metadata}
    }
  }
  return null
}
