import mongoose, { Document, Types } from "mongoose";
export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
    awardSpace: Types.ObjectId;
}
declare const _default: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin, {}, mongoose.DefaultSchemaOptions> & IAdmin & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAdmin>;
export default _default;
//# sourceMappingURL=Admin.d.ts.map