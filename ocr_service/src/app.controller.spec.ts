import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

type AnyMock = jest.Mock<(...args: any[]) => any>;

describe('AppController', () => {
  let controller: AppController;
  let kafka: { emit: AnyMock };

  beforeEach(async () => {
    kafka = { emit: jest.fn() as AnyMock };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: 'KAFKA_PRODUCER', useValue: kafka }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /health returns ok status', () => {
    expect(controller.health()).toEqual({ status: 'ok' });
  });

  it('handleImageUploaded fetches OCR result and emits image.processed', async () => {
    const ocrPayload = { ParsedResults: [{ ParsedText: 'hello world' }] };

    // Mock global fetch — avoid hitting the real OCR.space API.
    const fakeResponse = {
      json: () => Promise.resolve(ocrPayload),
    } as unknown as Response;
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(fakeResponse);

    const message = {
      url: 'https://example.com/img.png',
      name: 'img.png',
      description: 'd',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      ocrResult: null,
    };

    await controller.handleImageUploaded(message);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(kafka.emit).toHaveBeenCalledWith('image.processed', {
      ...message,
      ocrResult: ocrPayload,
    });
  });
});
