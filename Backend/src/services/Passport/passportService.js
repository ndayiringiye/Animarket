import mongoose from "mongoose";
import Animal from "../../models/animals/AnimalModel.js";
import Booking from "../../models/Bookings/bookingModel.js";
import HotelAnimalBooking from "../../models/Hotels/hotelAnimalBookingModel.js";

const CUSTOMER_STATUSES = ["scheduled", "in_transit", "delivered", "failed"];
const HOTEL_STATUSES = ["pending", "scheduled", "in_transit", "delivered", "cancelled"];

const buildPassportId = (animalId) =>
  `PSP-${animalId.toString().slice(-8).toUpperCase()}`;

const mapAnimal = (animal) => ({
  animalId: animal._id.toString(),
  passportId: buildPassportId(animal._id),
  name: animal.name,
  type: animal.type,
  breed: animal.breed,
  gender: animal.gender,
  age: animal.age,
  photo: animal.images && animal.images.length > 0 ? animal.images[0] : null,
  location: {
    district: animal.location?.district,
    sector: animal.location?.sector,
    province: animal.location?.province,
  },
  healthStatus: animal.health?.healthStatus || "good",
});

export const listPassportsService = async () => {
  const customerBookings = await Booking.find({ deliveryRequestedAt: { $ne: null } })
    .populate("animal")
    .populate("customer", "name email phone")
    .populate("farmer", "name email phone")
    .sort({ deliveryRequestedAt: -1 });

  const hotelBookings = await HotelAnimalBooking.find({ deliveryRequestedAt: { $ne: null } })
    .populate("animalId")
    .populate("hotelId", "hotelName email phone contactPersonPhone")
    .populate("ownerId", "name email phone")
    .sort({ deliveryRequestedAt: -1 });

  const fromCustomers = customerBookings
    .filter((b) => b.animal)
    .map((b) => ({
      ...mapAnimal(b.animal),
      source: "customer",
      bookingId: b._id.toString(),
      reference: b.bookingNumber,
      requester: {
        name: b.customer?.name || "Unknown customer",
        email: b.customer?.email || "",
        phone: b.customer?.phone || "",
      },
      ownerName: b.farmer?.name || undefined,
      deliveryAddress: b.deliveryAddress?.address || "",
      deliveryDate: b.deliveryDate || null,
      deliveryStatus: b.deliveryStatus,
      deliveryRequestedAt: b.deliveryRequestedAt,
      allowedStatuses: CUSTOMER_STATUSES,
    }));

  const fromHotels = hotelBookings
    .filter((b) => b.animalId)
    .map((b) => ({
      ...mapAnimal(b.animalId),
      source: "hotel",
      bookingId: b._id.toString(),
      reference: b._id.toString().slice(-8).toUpperCase(),
      requester: {
        name: b.hotelId?.hotelName || "Unknown hotel",
        email: b.hotelId?.email || "",
        phone: b.hotelId?.contactPersonPhone || b.hotelId?.phone || "",
      },
      ownerName: b.ownerId?.name || undefined,
      deliveryAddress: b.deliveryAddress?.address || "",
      deliveryDate: b.deliveryDate || null,
      deliveryStatus: b.deliveryStatus,
      deliveryRequestedAt: b.deliveryRequestedAt,
      allowedStatuses: HOTEL_STATUSES,
    }));

  return [...fromCustomers, ...fromHotels].sort(
    (a, b) => new Date(b.deliveryRequestedAt) - new Date(a.deliveryRequestedAt)
  );
};

export const updatePassportDeliveryStatusService = async (source, bookingId, status) => {
  if (source === "customer") {
    if (!CUSTOMER_STATUSES.includes(status)) throw new Error("Invalid status for this booking type");
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");
    booking.deliveryStatus = status;
    if (status === "delivered") booking.isDelivered = true;
    booking.trackingHistory.push({
      status,
      message: `Delivery status updated to ${status} by admin`,
      timestamp: new Date(),
    });
    await booking.save();
    return booking;
  }

  if (source === "hotel") {
    if (!HOTEL_STATUSES.includes(status)) throw new Error("Invalid status for this booking type");
    const booking = await HotelAnimalBooking.findById(bookingId);
    if (!booking) throw new Error("Hotel booking not found");
    booking.deliveryStatus = status;
    await booking.save();
    return booking;
  }

  throw new Error("Unknown passport source");
};

// PUBLIC: what a person sees after scanning the QR code
export const getPublicPassportService = async (animalId) => {
  if (!mongoose.isValidObjectId(animalId)) throw new Error("Passport not found");

  const animal = await Animal.findById(animalId).lean();
  if (!animal) throw new Error("Passport not found");

  const latestDelivery = await Booking.findOne({
    animal: animal._id,
    deliveryRequestedAt: { $ne: null },
  })
    .sort({ deliveryRequestedAt: -1 })
    .select("deliveryStatus deliveryDate")
    .lean();

  const loc = animal.location || {};

  return {
    passportId: buildPassportId(animal._id),
    name: animal.name,
    type: animal.type,
    breed: animal.breed,
    gender: animal.gender,
    age: animal.age,
    weight: animal.weight || null,
    photos: (animal.images || []).slice(0, 4),
    location: {
      province: loc.province || "",
      district: loc.district || "",
      sector: loc.sector || "",
    },
    health: {
      status: animal.health?.healthStatus || "good",
      vaccinated: !!animal.health?.vaccinated,
      lastCheckupDate: animal.health?.lastCheckupDate || null,
      vaccinations: (animal.health?.vaccinationRecords || []).map((v) => ({
        vaccineName: v.vaccineName,
        date: v.date,
        verifiedByVet: !!v.verifiedByVet,
      })),
    },
    verificationLevel: animal.verificationLevel,
    isVerified: !!animal.isVerified,
    delivery: latestDelivery
      ? { status: latestDelivery.deliveryStatus, date: latestDelivery.deliveryDate || null }
      : null,
  };
};
