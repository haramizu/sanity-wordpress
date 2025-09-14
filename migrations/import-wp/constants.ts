import type {SanitySchemaType, WordPressDataType} from './types'

// Replace this with your WordPress site's WP-JSON REST API URL
export const BASE_URL = `https://public-api.wordpress.com/wp/v2/sites/haramizujp.wordpress.com`
export const PER_PAGE = 100

export const WP_TYPE_TO_SANITY_SCHEMA_TYPE: Record<WordPressDataType, SanitySchemaType> = {
  categories: 'category',
  posts: 'post',
  pages: 'page',
  tags: 'tag',
  users: 'author',
}
