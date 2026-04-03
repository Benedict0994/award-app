import { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware";
export declare function getCandidates(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getCandidateById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createCandidate(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateCandidate(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteCandidate(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getCandidateBySlug(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=candidateController.d.ts.map