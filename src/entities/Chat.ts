export class Message {
  public id!: string;
  public sender!: string;
  public content!: string;
  public createdAt!: Date;
  public isEdited!: boolean;
}

export class Chat {
  public id!: string;
  public userContactId!: string;
  public displayName!: string;
  public picture!: string;
  public status!: string;
  public chats!: Message[];
}
