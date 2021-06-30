class MissingArgumentException extends Error {
  public static UNSUPPORTED_TYPE: string = "Please provide a 'String', 'Uint8Array' or 'Array'.";
  constructor(public message: string) {
    super(message);
    this.name = 'MissingArgumentException';
    this.stack = (<any>new Error()).stack;
  }
}

export default MissingArgumentException;
