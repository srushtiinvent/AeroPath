import { Request, Response, NextFunction } from 'express';
export interface AuthedRequest extends Request {
    uid?: string;
    user?: any;
}
export declare const authMiddleware: (req: AuthedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export default authMiddleware;
//# sourceMappingURL=authMiddleware.d.ts.map