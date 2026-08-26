import connectDb from '../src/config/db.js';
import { createBookingService } from '../src/services/bookings/bookingService.js';

const run = async () => {
  try {
    await connectDb();
    const data = {
      animalId: '6a0c664c43ec03bff1731994',
      negotiatedPrice: 450000,
      paymentMethod: 'momo',
      deliveryOption: 'pickup',
      deliveryAddress: { address: 'Kigali, Gasabo', latitude: -1.95, longitude: 30.06 }
    };
    const userId = '69f78e989b2f3de84c2d9488';
    const result = await createBookingService(data, userId);
    console.log('Result:', result);
  } catch (err) {
    console.error('Direct call error:', err);
    if (err.stack) console.error(err.stack);
  }
  process.exit(0);
};

run();
