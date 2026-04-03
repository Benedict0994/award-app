import mongoose, { Document, Types } from "mongoose";
export interface IVoteHistory {
    date: string;
    votes: number;
}
export interface ICandidate extends Document {
    name: string;
    image: string;
    category: string;
    department: string;
    votes: number;
    slug: string;
    bio?: string;
    voteHistory: IVoteHistory[];
    awardSpace: Types.ObjectId;
}
declare const _default: mongoose.Model<ICandidate, {}, {}, {}, mongoose.Document<unknown, {}, ICandidate, {}, mongoose.DefaultSchemaOptions> & ICandidate & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICandidate>;
export default _default;
//# sourceMappingURL=Candidate.d.ts.map