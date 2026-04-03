import mongoose, { Document } from "mongoose";
export interface IAwardSpace extends Document {
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
}
declare const _default: mongoose.Model<IAwardSpace, {}, {}, {}, mongoose.Document<unknown, {}, IAwardSpace, {}, mongoose.DefaultSchemaOptions> & IAwardSpace & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAwardSpace>;
export default _default;
//# sourceMappingURL=AwardSpace.d.ts.map