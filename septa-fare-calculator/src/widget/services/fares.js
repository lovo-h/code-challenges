import axios from './axios';

class FareService {
  static async getFares() {
    if ( process.env.IS_LOCAL_FARES ) {
      return require( './data/fares.json' );
    }

    const { data } = await axios.get('/fares');

    return data;
  }
}

export default FareService;
