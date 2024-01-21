type Subscriber<Params, Return> = (args: Params) => Return;

export class EventEmitter<Params, Return> {
  private subscribers: Array<Subscriber<Params, Return>>;

  constructor() {
    this.subscribers = [];
  }

  emit(args: Params) {
    this.notify(args);
  }

  private notify(args: Params) {
    this.subscribers.forEach((subscriber) => subscriber(args));
  }

  subscribe(subscriber: Subscriber<Params, Return>) {
    this.subscribers.push(subscriber);
    return this.unsubscribe.bind(this, subscriber);
  }

  unsubscribe(subscriber: Subscriber<Params, Return>) {
    const index = this.subscribers.indexOf(subscriber);
    if (index > -1) this.subscribers.splice(index, 1);
  }
}
