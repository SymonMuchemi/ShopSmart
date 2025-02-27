import { Request, Response, NextFunction } from 'express';
import { Model, Document, PopulateOptions } from 'mongoose';

// TODO: Remove this duplicated code
interface AdvancedResultsResponse<T> {
  success: boolean;
  count: number;
  pagination: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: T[];
}

interface AdvancedRequest<T> extends Request {
  advancedResults?: AdvancedResultsResponse<T>;
}

export interface AdvancedResponse<T> extends Response {
  advancedResults?: AdvancedResultsResponse<T>;
}

const advancedResults = <T extends Document>(
  model: Model<T>,
  populate?: string | object
) =>
  async (req: Request, res: AdvancedResponse<T>, next: NextFunction) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query } as Record<string, any>;

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Remove fields from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string with MongoDB operators
    let queryStr = JSON.stringify(reqQuery).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    query = model.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    if (populate) {
      query = query.populate(populate as PopulateOptions);
    }

    // Executing query
    const results = await query;

    // Pagination result
    const pagination: AdvancedResultsResponse<T>['pagination'] = {};

    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.locals.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };

export default advancedResults;
