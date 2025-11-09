import {authorType} from './authorType'
import {categoryType} from './categoryType'
import {externalImageType} from './externalImageType'
import {pageType} from './pageType'
import {postType} from './postType'
import {tagType} from './tagType'
import {portableTextType} from './portableTextType'
import { SchemaTypeDefinition } from 'sanity'

// Import built-in Sanity image types that are required for the image type
const sanityImageHotspot: SchemaTypeDefinition = {
  name: 'sanity.imageHotspot',
  title: 'Image Hotspot',
  type: 'object',
  fields: [
    {name: 'x', type: 'number'},
    {name: 'y', type: 'number'},
    {name: 'height', type: 'number'},
    {name: 'width', type: 'number'},
  ],
}

const sanityImageCrop: SchemaTypeDefinition = {
  name: 'sanity.imageCrop',
  title: 'Image Crop',
  type: 'object',
  fields: [
    {name: 'top', type: 'number'},
    {name: 'bottom', type: 'number'},
    {name: 'left', type: 'number'},
    {name: 'right', type: 'number'},
  ],
}
export const schemaTypes = [
  authorType,
  categoryType,
  pageType,
  postType,
  tagType,
  externalImageType,
  portableTextType,
  sanityImageHotspot,
  sanityImageCrop,
]
