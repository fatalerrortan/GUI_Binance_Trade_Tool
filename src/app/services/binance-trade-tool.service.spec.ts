import { TestBed } from '@angular/core/testing';

import { BinanceTradeToolService } from './binance-trade-tool.service';

describe('BinanceTradeToolService', () => {
  let service: BinanceTradeToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinanceTradeToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
