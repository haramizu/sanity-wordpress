import {decode} from 'html-entities'
import type {WP_REST_API_Post} from 'wp-types'

import type {Post} from '../../../sanity.types'

// Remove these keys because they'll be created by Content Lake
type StagedPost = Omit<Post, '_createdAt' | '_updatedAt' | '_rev'>

export async function transformToPost(wpDoc: WP_REST_API_Post): Promise<StagedPost> {
  const doc: StagedPost = {
    _id: `post-${wpDoc.id}`,
    _type: 'post',
  }

  doc.title = decode(wpDoc.title.rendered).trim()

  return doc
}
