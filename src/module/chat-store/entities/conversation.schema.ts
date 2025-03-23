import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class LastMessage {
  @Prop({ required: true })
  idUser: string;

  @Prop({ required: true })
  message: string;
}

const LastMessageSchema = SchemaFactory.createForClass(LastMessage);

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({
  timestamps: true,
})
export class Conversation {
  @Prop({ type: [String], required: true })
  participants: string[];
  @Prop({ type: LastMessageSchema })
  lastMessage: LastMessage;
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
