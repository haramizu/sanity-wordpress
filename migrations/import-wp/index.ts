import type {SanityDocumentLike} from 'sanity'
import {createOrReplace, defineMigration} from 'sanity/migrate'
import type {WP_REST_API_Post, WP_REST_API_Term, WP_REST_API_User} from 'wp-types'

import {getDataTypes} from './lib/getDataTypes'
import {transformToPost} from './lib/transformToPost'
import {wpDataTypeFetch} from './lib/wpDataTypeFetch'

export default defineMigration({
  title: 'Import WP JSON data',

  async *migrate() {
    const {wpType} = getDataTypes(process.argv)
    let page = 1
    let hasMore = true

    while (hasMore) {
      try {
        let wpData = await wpDataTypeFetch(wpType, page)

        if (Array.isArray(wpData) && wpData.length) {
          const docs: SanityDocumentLike[] = []

          for (let wpDoc of wpData) {
            if (wpType === 'posts') {
              wpDoc = wpDoc as WP_REST_API_Post
              const doc = await transformToPost(wpDoc)
              docs.push(doc)
            } else if (wpType === 'pages') {
              wpDoc = wpDoc as WP_REST_API_Post
              // add your *page* transformation function
            } else if (wpType === 'categories') {
              wpDoc = wpDoc as WP_REST_API_Term
              // add your *category* transformation function
            } else if (wpType === 'tags') {
              wpDoc = wpDoc as WP_REST_API_Term
              // add your *tag* transformation function
            } else if (wpType === 'users') {
              wpDoc = wpDoc as WP_REST_API_User
              // add your *author* transformation function
            }
          }

          yield docs.map((doc) => createOrReplace(doc))
          page++
        } else {
          hasMore = false
        }
      } catch (error) {
        console.error(`Error fetching data for page ${page}:`, error)
        // Stop the loop in case of an error
        hasMore = false
      }
    }
  },
})
