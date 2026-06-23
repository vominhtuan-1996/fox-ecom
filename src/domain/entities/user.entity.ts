export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
  ) {}

  isValid(): boolean {
    return this.id.length > 0 && this.email.length > 0 && this.name.length > 0;
  }
}
