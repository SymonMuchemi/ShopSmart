import { Request } from 'express';
export interface ReturnResponse {
    code: number;
    message: string;
    details: any;
}

export interface ExtendedRequest extends Request {
  user?: any;
}

export interface AdvancedResultsResponse<T> {
    success: boolean;
    count: number;
    pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    };
    data: T[];
  }
  
  export interface AdvancedResponse<T> extends Response {
    advancedResults?: AdvancedResultsResponse<T>;
  }

export type param = string | undefined;
