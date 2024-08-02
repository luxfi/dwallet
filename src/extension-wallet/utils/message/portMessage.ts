import Message from './index';

class PortMessage extends Message {
  port: chrome.runtime.Port | null = null;
  luxxExtId: string = '';

  listenCallback: any;

  constructor(opts: {
    luxxExtId: string;
    port?: chrome.runtime.Port,
  }) {
    super();

    if (opts.port) {
      this.port = opts.port;
    }
    this.luxxExtId = opts.luxxExtId || '';
  }

  connect = (name: string) => {
    this.port = chrome.runtime.connect(this.luxxExtId, { name });
    this.port.onMessage.addListener(({ _type_, data }) => {
      if (_type_ === `${this._EVENT_PRE}message`) {
        this.emit('message', data);
        return;
      }

      if (_type_ === `${this._EVENT_PRE}response`) {
        this.onResponse(data);
      }
    });

    return this;
  };

  listen = (listenCallback: any) => {
    if (!this.port) return;
    this.listenCallback = listenCallback;
    this.port.onMessage.addListener(({ _type_, data }) => {
      if (_type_ === `${this._EVENT_PRE}request`) {
        this.onRequest(data);
      }
    });

    return this;
  };

  send = (type: string, data: any) => {
    if (!this.port) return;
    try {
      this.port.postMessage({ _type_: `${this._EVENT_PRE}${type}`, data });
    } catch (e) {
      // DO NOTHING BUT CATCH THIS ERROR
    }
  };

  dispose = () => {
    this._dispose();
    this.port?.disconnect();
  };
}

export default PortMessage;
