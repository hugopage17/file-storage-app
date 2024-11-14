export const uploadFileSchema = {
  type: "object",
  properties: {
    fileData: { type: 'string' },
    fileName: { type: 'string' },
    contentType: { type: 'string' },
    contentEncoding: { type: 'string' }
  },
  required: ['fileData', 'fileName', 'contentType']
}

export const listDirectorySchema = {
  type: "object",
  properties: {
    directory: { type: 'string' },
  },
  required: ['directory']
}