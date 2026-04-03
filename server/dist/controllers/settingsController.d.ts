import { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware";
export declare function getSettings(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateSettings(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=settingsController.d.ts.map