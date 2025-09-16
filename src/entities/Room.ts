export class LastMessage {
  public content!: string;
  public createdAt!: Date;
}

export class Room {
  public id!: string;
  public picture!: string;
  public displayName!: string;
  public lastMessage!: LastMessage | null;
}
