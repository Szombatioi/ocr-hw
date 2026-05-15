import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { SubscriberService } from './subscriber/subscriber.service';

type AnyMock = jest.Mock<(...args: any[]) => any>;

describe('AppController', () => {
  let controller: AppController;
  let subscriberService: {
    notifySubscribers: AnyMock;
    subscribe: AnyMock;
    unsubscribe: AnyMock;
  };

  beforeEach(async () => {
    subscriberService = {
      notifySubscribers: jest.fn() as AnyMock,
      subscribe: jest.fn() as AnyMock,
      unsubscribe: jest.fn() as AnyMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: SubscriberService, useValue: subscriberService }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /health returns ok status', () => {
    expect(controller.health()).toEqual({ status: 'ok' });
  });

  it('handleImageProcessed delegates to SubscriberService.notifySubscribers', () => {
    const msg = {
      url: 'u',
      name: 'n',
      description: 'd',
      createdAt: new Date(),
      ocrResult: null,
    };
    controller.handleImageProcessed(msg);
    expect(subscriberService.notifySubscribers).toHaveBeenCalledWith(msg);
  });

  it('POST /subscribe forwards email to SubscriberService.subscribe', async () => {
    subscriberService.subscribe.mockResolvedValue({ id: 1, email: 'a@b.c' });
    const result = await controller.subscribe({ email: 'a@b.c' });
    expect(subscriberService.subscribe).toHaveBeenCalledWith('a@b.c');
    expect(result).toEqual({ id: 1, email: 'a@b.c' });
  });

  it('DELETE /subscribe forwards email and returns ok', async () => {
    subscriberService.unsubscribe.mockResolvedValue(undefined);
    const result = await controller.unsubscribe({ email: 'a@b.c' });
    expect(subscriberService.unsubscribe).toHaveBeenCalledWith('a@b.c');
    expect(result).toEqual({ ok: true });
  });
});
