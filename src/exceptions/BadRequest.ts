class BadRequest extends Error {
  public static UNSUPPORTED_TYPE: string = "Please provide a 'String', 'Uint8Array' or 'Array'.";
  constructor(public message: string) {
    super(message);
    this.name = 'BadRequest';
    this.stack = (<any>new Error()).stack;
  }
}

export default BadRequest;
