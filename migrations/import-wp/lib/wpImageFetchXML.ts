import * as fs from 'fs'
import * as path from 'path'
import {parseStringPromise} from 'xml2js'

import type {UploadClientConfig} from '@sanity/client'

// Get WordPress' asset metadata about an image by its ID
export async function wpImageFetchXML(id: number): Promise<UploadClientConfig | null> {
  const xmlFilePath = path.resolve(__dirname, './WordPress.assets.xml')

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

      // if (imageData?.image_meta?.caption) {
      //   metadata.description = imageData.image_meta.caption
      // }

      return metadata
    }
  }
  return null
}
