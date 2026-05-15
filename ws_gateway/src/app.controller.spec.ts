import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';

type AnyMock = jest.Mock<(...args: any[]) => any>;

describe('AppController', () => {
  let controller: AppController;
  let gateway: { broadcast: AnyMock };

  beforeEach(async () => {
    gateway = { broadcast: jest.fn() as AnyMock };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppGateway, useValue: gateway }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /health returns ok status', () => {
    expect(controller.health()).toEqual({ status: 'ok' });
  });

  it('POST / forwards event + payload to the gateway broadcast', () => {
    const dto = {
      event: 'image.processed',
      payload: { id: 1, name: 'foo.png' },
    };
    controller.notify(dto);
    expect(gateway.broadcast).toHaveBeenCalledWith(dto.event, dto.payload);
  });
});
