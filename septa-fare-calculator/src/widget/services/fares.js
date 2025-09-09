import axios from './axios';

class FareService {
  static async getFares() {
    /**
     * TODO: Remove this when backend has been integrated.
     * This is for local testing only.
     *
     * Note: This assumes that the shape of the data retrieved from
     * remote will resemble that of fares.json. This may need to be
     * refactored if that is not the case.
     */
    if ( process.env.IS_LOCAL_FARES ) {
      return require( './data/fares.json' );
    }

    const { data } = await axios.get('/fares');

    return data;
  }
}

export default FareService;
