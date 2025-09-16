export class Contact {
  public id!: string;
  public name!: string;
  public picture!: string;
}

export class ContactResponse {
  public total!: number;
  public contacts!: Contact[];
}
