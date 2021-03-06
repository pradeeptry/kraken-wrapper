import chai, { expect } from 'chai';
import { config } from 'dotenv';

import Kraken from '../src/Kraken';

// Load Enviroment variables from .env file
// this .env file must be in the root folder
// just for testing
config();

chai.config.includeStack = true;

const kraken = new Kraken(process.env.API_KEY, process.env.API_SECRET);

describe('Kraken', () => {
  describe('getTime', () => {
    it('should show the server time', (done) => {
      kraken.getTime().then((time) => {
        expect(time.result).to.be.instanceof(Object);
        expect(time.result).to.have.property('unixtime');
        expect(time.result).to.have.property('rfc1123');
        done();
      }).catch(error => done(error));
    });
  });

  describe('getAssetInfo', () => {
    it('should show all the assets available on Kraken', (done) => {
      kraken.getAssetInfo({ asset: 'all' }).then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 0).to.be.false;
        done();
      }).catch(error => done(error));
    });

    it('should show only two assets on Kraken', (done) => {
      kraken.getAssetInfo({ asset: 'ETH,XRP' }).then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 2).to.be.true;
        expect(response.result.XETH).to.have.property('altname');
        done();
      }).catch(error=> done(error));
    });
  });

  describe('getTradableAssetPairs', () => {
    it('should show all the tradable assets pairs available on Kraken', (done) => {
      kraken.getTradableAssetPairs({ info: 'all', pair: 'all' }).then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 0).to.be.false;
        done();
      }).catch(error => done(error));
    });

    it('should show only two tradable assets on Kraken', (done) => {
      kraken.getTradableAssetPairs({ info: 'all', pair: 'ETHUSD,XRPUSD' }).then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 2).to.be.true;
        expect(response.result.XETHZUSD).to.have.property('altname');
        done();
      }).catch(error => done(error));
    });
  });

  describe('getTickerInformation', () => {
    it('should show ticker informaton for the pair', (done) => {
      kraken.getTickerInformation({ pair: 'ETHUSD' }).then((response) => {
        expect(response.result).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 0).to.be.false;
        done();
      }).catch(error => done(error));
    });

    it('should show only two assets on Kraken', (done) => {
      kraken.getTickerInformation({ pair: 'ETHUSD,LTCXBT' }).then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 2).to.be.true;
        expect(response.result.XETHZUSD).to.have.property('a');
        done();
      }).catch(error=> done(error));
    });

    it('should NOT accept assets that are no strings', (done) => {
      kraken.getTickerInformation({ curr1: 'ETH', curr2: 'XRP' }).then((response) => {
        expect(response.result).to.be.undefined;
        done();
      }).catch((error) => {
        expect(error).to.be.equal('Pair option must be a string, could be all for all assets or a comma separated values such as ETHUSD,XRPUSD');
        done();
      });
    });

  });

  describe('getOHLC', () => {
    it('should show an array of pair name and OHLC data on Kraken', (done) => {
      kraken.getOHLC({ pair: 'LTCXBT' }).then((response) => {
        expect(response.result).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 0).to.be.false;
        done();
      }).catch(error => done(error));
    });

    it('should give and error if the interval option is not a number', (done) => {
      kraken.getOHLC({ pair: 'LTCXBT', interval: 'yesterday' }).then((response) => {
        expect(response.result).to.be.undefined;
        done();
      }).catch((error) => {
        expect(error).to.be.equal('Interval option must be a integer, and one of this intervals values 1 (default), 5, 15, 30, 60, 240, 1440, 10080, 21600');
        done();
      });
    });

    it('should give an error if the since option is not a number', (done) => {
      kraken.getOHLC({ pair: 'LTCXBT', since: 'yesterday' }).then((response) => {
        expect(response.result).to.be.undefined;
        done();
      }).catch((error) => {
        expect(error).to.be.equal('Since option must be a unix time, for example 1495864800');
        done();
      });
    });
  });

  describe('getOrderBook', () => {
    it('should show an array of pair name and market depth', (done) => {
      kraken.getOrderBook({ pair: 'LTCXBT' }).then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 0).to.be.false;
        done();
      }).catch(error => done(error));
    });

    it('should give an error if the count option is not a number', (done) => {
      kraken.getOrderBook({ pair: 'LTCXBT', count: 'hola' }).then((response) => {
        expect(response.result).to.be.undefined;
        done();
      }).catch((error) => {
        expect(error).to.be.equal('Count option must be a integer');
        done();
      });
    });

    it('should show 5 asks and bids for the pair', (done) => {
      kraken.getOrderBook({ pair: 'LTCXBT', count: 5 }).then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(response.result.XLTCXXBT.asks.length).to.be.equal(5);
        expect(response.result.XLTCXXBT.bids.length).to.be.equal(5);
        done();
      }).catch(error => done(error));
    });
  });

  describe('getTrades', () => {
    it('should show an array of name and recent trade data', (done) => {
      kraken.getTrades({ pair: 'LTCXBT' }).then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 0).to.be.false;
        done();
      }).catch(error => done(error));
    });

    it('should give an error if the since option is not a number', (done) => {
      kraken.getTrades({ pair: 'LTCXBT', since: 'hola' }).then((response) => {
        expect(response.result).to.be.undefined;
        done();
      }).catch((error) => {
        expect(error).to.be.equal('Since option must be a unix timestamp');
        done();
      });
    });
  });

  describe('getSpread', () => {
    it('should show an array of pair name recent spread data', (done) => {
      kraken.getSpread({ pair: 'LTCXBT' }).then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 0).to.be.false;
        done();
      }).catch(error => done(error));
    });

    it('should give an error if the since option is not a number', (done) => {
      kraken.getSpread({ pair: 'LTCXBT', since: 'hola' }).then((response) => {
        expect(response).to.be.undefined;
        done();
      }).catch((error) => {
        expect(error).to.be.equal('Since option must be a unix timestamp');
        done();
      });
    });
  });

  describe('getTradeBalance', () => {
    it('should show an array of trade balance info', (done) => {
      kraken.getTradeBalance().then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 0).to.be.false;
        expect(response.result).to.have.property('eb');
        expect(response.result).to.have.property('tb');
        done();
      }).catch(error => done(error));
    });
  });

  describe('getBalance', () => {
    it('should show an array of asset names and balance amount', (done) => {
      kraken.getBalance().then((response) => {
        expect(response).to.be.instanceof(Object);
        expect(Object.keys(response.result).length === 0).to.be.false;
        expect(response.result).to.have.property('ZUSD');
        done();
      }).catch(error => done(error));
    });
  });

  // To pass this test there must be an open order
  describe('getOpenOrders', () => {
    it('should show an array of order info', (done) => {
      kraken.getOpenOrders().then((response) => {
        expect(response.result).to.be.instanceof(Object);
        done();
      }).catch(error => done(error));
    });
  });

  describe('getClosedOrders', () => {
    it('should show an array of closed order info', (done) => {
      kraken.getClosedOrders().then((response) => {
        expect(response.result).to.be.instanceof(Object);
        done();
      }).catch(error => done(error));
    });
  });


  describe('getQueryOrders', () => {
    it('should show an array of order info', (done) => {
      kraken.getQueryOrders().then((response) => {
        expect(response).to.be.instanceof(Object);
        done();
      }).catch(error => done(error));
    });
  });

  describe('getTradesHistory', () => {
    it('should show an array of trades info', (done) => {
      kraken.getTradesHistory().then((response) => {
        expect(response).to.be.instanceof(Object);
        done();
      }).catch(error => done(error));
    });
  });

  describe('getOpenPositions', () => {
    it('should show an array of open positions info', (done) => {
      kraken.getOpenPositions().then((response) => {
        expect(response).to.be.instanceof(Object);
        done();
      }).catch(error => done(error));
    });
  });

  describe('getLedgers', () => {
    it('should show an array of ledgers info', (done) => {
      kraken.getLedgers().then((response) => {
        expect(response).to.be.instanceof(Object);
        done();
      }).catch(error => done(error));
    });
  });
});
