import mongoose from "mongoose";

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String, // String type is used by mongoose, not typescript and hence the captical S
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                // modify ret: returned json object directly
                // convert id => _id (normalize id property as other databases use _id)
                ret.id = ret._id;
                delete ret.id;
            },
        },
    }
);

// The only reason we create this static build method is to let Typescript to check the
// attribute type (attrs)
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket: TicketModel = mongoose.model<TicketDoc, TicketModel>(
    "Ticket",
    ticketSchema
);

export { Ticket };
