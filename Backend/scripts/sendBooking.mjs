import dotenv from 'dotenv';
dotenv.config();

const url = 'http://localhost:4000/api/bookings/create';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Zjc4ZTk4OWIyZjNkZTg0YzJkOTQ4OCIsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3ODc0MDkwMzYsImV4cCI6MTc4NzU4MTgzNn0.l1fMf6xijjLeD5tD5d27DaKyVOvNtBSCW7eXnZSaZJE';
const body = {
  animalId: '6a0c664c43ec03bff1731994',
  negotiatedPrice: 450000,
  paymentMethod: 'momo',
  deliveryOption: 'pickup',
  deliveryAddress: {
    address: 'Kigali, Gasabo',
    latitude: -1.95,
    longitude: 30.06
  }
};

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Request error', err);
  }
})();
