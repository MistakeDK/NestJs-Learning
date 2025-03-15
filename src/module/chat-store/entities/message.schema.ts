import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;
  @Prop({ required: true })
  sender: string;
  @Prop({ required: true })
  content: string;
  @Prop({ enum: ['text', 'image'], default: 'text' })
  type: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
