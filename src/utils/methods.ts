import multer from 'multer'
import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { IProduct, ReturnResponse } from '../types'
import { getObjectSignedUrl } from '../s3'
import type { ErrorRequestHandler } from 'express'
import { deleteImageFromBucket } from '../s3/utils'

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

export const handleRequest = async (
  req: Request,
  res: Response,
  serviceFunction: (data: any) => Promise<ReturnResponse>,
  errorMessage: string,
) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { code, message, details } = await serviceFunction(req.body)
    return res.status(code).json({ message, details })
  } catch (error: any) {
    return res.status(500).json({
      message: errorMessage,
      details: error.toString(),
    })
  }
}

export const getSignedProductImageUrlsArray = async (product: IProduct) => {
  try {
    const imageNames: string[] = product.imageNames

    if (imageNames.length === 0) {
      return []
    }
    const imageUrls = []

    for (const name of imageNames) {
      imageUrls.push(await getObjectSignedUrl(name))
    }

    return imageUrls
  } catch (error: any) {
    throw new Error(`Error generating image url array: ${error.toString()}`)
  }
}

export const deleteProductImages = async (product: IProduct) => {
  try {
    const imageNames = product.imageNames

    for (const name of imageNames) {
      await deleteImageFromBucket(name)
    }
  } catch (error: any) {
    throw new Error(`Error deleting images: ${error.toString()}`)
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        code: 413,
        message: 'File size too large! Maximum allowed size: 5MB.',
      })

      return
    }
  }
  next(err)
}
