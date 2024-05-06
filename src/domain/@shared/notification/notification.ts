import NotificationError from "./notification.error";

export type NotificationErrorProps = {
  message: string;
  context: string;
};

export default class Notification {
  private errors: NotificationErrorProps[] = [];

  addError(error: NotificationErrorProps) {
    this.errors.push(error);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): NotificationErrorProps[] {
    return this.errors;
  }

  public throwErrorIfHasErrors() {
    if (this.hasErrors()) {
      throw new NotificationError(this.errors);
    }
  }

  messages(context?: string): string {
    const errors = context
      ? this.errors.filter((error) => error.context === context)
      : this.errors;
    const messages = errors.map(
      (error) => `${error.context}: ${error.message}`
    );
    const messagesSeparedByComma = messages.join(", ");

    return messagesSeparedByComma;
  }
}
