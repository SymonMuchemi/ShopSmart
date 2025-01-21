import { S3Client } from '@aws-sdk/client-s3'
import { config } from 'dotenv'

config()

const bucketName = process.env.S3_BUCKET_NAME
const region = process.env.S3_BUCKET_REGION
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

if (!bucketName) {
  throw new Error('Missing credentials: BUCKET_NAME')
}

if (!region) {
  throw new Error('Missing credential: REGION')
}

if (!accessKeyId) {
  throw new Error('Missing credential: ACCESS_KEY_ID')
}

if (!secretAccessKey) {
  throw new Error('Missing credential: SECRET_ACCESS_KEY')
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

export { s3Client, bucketName }
