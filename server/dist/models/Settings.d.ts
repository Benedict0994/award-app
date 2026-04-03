import mongoose, { Document, Types } from "mongoose";
export interface ISettings extends Document {
    votingStart: string | null;
    votingEnd: string | null;
    candidateCanViewVotes: boolean;
    awardSpace: Types.ObjectId;
}
declare const _default: mongoose.Model<ISettings, {}, {}, {}, mongoose.Document<unknown, {}, ISettings, {}, mongoose.DefaultSchemaOptions> & ISettings & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISettings>;
export default _default;
//# sourceMappingURL=Settings.d.ts.map