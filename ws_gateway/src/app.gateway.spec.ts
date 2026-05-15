import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type { Socket } from 'socket.io';
import { AppGateway } from './app.gateway';

type AnyMock = jest.Mock<(...args: unknown[]) => unknown>;

interface ServerStub {
  emit: AnyMock;
}

describe('AppGateway', () => {
  let gateway: AppGateway;
  let emitMock: AnyMock;

  beforeEach(() => {
    gateway = new AppGateway();
    emitMock = jest.fn();
    // Inject a stub Server that captures emit() calls.
    (gateway as unknown as { server: ServerStub }).server = { emit: emitMock };
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('broadcast() emits the event with payload on the underlying socket server', () => {
    const payload = { id: 42, text: 'hello' };
    gateway.broadcast('image.processed', payload);
    expect(emitMock).toHaveBeenCalledWith('image.processed', payload);
  });

  it('handleConnection / handleDisconnect do not throw', () => {
    const fakeClient = { id: 'abc' } as unknown as Socket;
    expect(() => gateway.handleConnection(fakeClient)).not.toThrow();
    expect(() => gateway.handleDisconnect(fakeClient)).not.toThrow();
  });
});
