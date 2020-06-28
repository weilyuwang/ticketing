import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// Add a static method to Ticket Model
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });
};

// Add a method directly to a document instance
// in order to use this - need to define this as a standard function (not arrow func syntax)
// Logics:
// Run query to look at all orders. Find an order where the ticket
// is the ticket we just found *and* the order status is not cancelled
// If we find an order from that means the ticket *is* reserved
ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });

    // if (existingOrder === null) : isReserved = false
    // else if exitingOrder is found : isReserved = true
    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
