# Integration Fix Plan - Customer Dashboard

## Step 1: Create New Backend Models
- [ ] `Backend/src/models/Interest/interestModel.js`
- [ ] `Backend/src/models/Chat/chatModel.js`

## Step 2: Create New Backend Services
- [ ] `Backend/src/services/Delivery/deliveryService.js`
- [ ] `Backend/src/services/Interest/interestService.js`
- [ ] `Backend/src/services/Chat/chatService.js`
- [ ] `Backend/src/services/Trust/trustService.js`

## Step 3: Create New Backend Controllers
- [ ] `Backend/src/controllers/Delivery/deliveryController.js`
- [ ] `Backend/src/controllers/Interest/interestController.js`
- [ ] `Backend/src/controllers/Chat/chatController.js`
- [ ] `Backend/src/controllers/Trust/trustController.js`

## Step 4: Create New Backend Routes
- [ ] `Backend/src/routes/Delivery/deliveryRoutes.js`
- [ ] `Backend/src/routes/Interest/interestRoutes.js`
- [ ] `Backend/src/routes/Chat/chatRoutes.js`
- [ ] `Backend/src/routes/Trust/trustRoutes.js`

## Step 5: Update server.js (mount new routes)
- [ ] Add import & mount for delivery, interest, chat, trust routes

## Step 6: Fix Frontend API URLs (CustomerDashboard.tsx)
- [ ] Fix `api/agreement/agreements` → `api/agreements/agreements`
- [ ] Fix `api/agreement/agreements/:id/sign` → `api/agreements/agreements/:id/sign`
- [ ] Fix `api/meetings/schedule` → `api/meeting/`
- [ ] Fix `api/zoom/schedule` → `api/meeting/`
- [ ] Fix `api/payments/create` → `api/bookings/create`
- [ ] Fix `api/veterinary/request` → `api/veterinary/service-job/create`
- [ ] Fix `api/delivery/request` → `api/delivery/request/:bookingId`
- [ ] Fix `api/interest/request` → `api/interest/request`
- [ ] Fix `api/chat/messages/...` → `api/chat/...`
- [ ] Fix `api/trust/verify/...` → `api/trust/verify/...`
