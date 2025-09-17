export class NewMessage {
  public id!: string;
  public chatRoomId!: string;
  public senderId!: string;
  public receiverId!: string;
  public content!: string;
  public timestamp!: Date;
  public isEdited!: boolean;
  public isDeleted!: boolean;
}
