# Insurance Portal API Documentation

## Base URL
```
http://localhost:<PORT>
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Health Check

#### GET `/health`
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. Authentication

#### POST `/auth/request-otp`
Request OTP for mobile login.

**Request Body:**
```json
{
  "mobile": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### POST `/auth/verify-otp`
Verify OTP and login.

**Request Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "mobile": "9876543210",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "isNewUser": false
  }
}
```

---

### 3. User Profile

#### GET `/user/profile`
Get current user profile (Requires Authentication).

**Description:**
- Fetches logged-in user's profile data using JWT token
- Returns user information without sensitive fields (OTP, password)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User profile fetched",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "mobile": "9876543210",
    "name": "John Doe",
    "age": 28,
    "gender": "male",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

#### PUT `/user/profile`
Update user profile details (Requires Authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 28,
  "gender": "male"
}
```

**Field Details:**
- `name`: string (required)
- `age`: number (required, 18-100)
- `gender`: "male" | "female" | "other" (required)

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "mobile": "9876543210",
    "name": "John Doe",
    "age": 28,
    "gender": "male"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 4. Vehicle

#### GET `/vehicle/:licencePlate`
Get vehicle details by licence plate.

**Parameters:**
- `licencePlate` (path) - Vehicle licence plate number

**Response:**
```json
{
  "success": true,
  "message": "Vehicle details fetched",
  "data": {
    "licencePlate": "DL01AB1234",
    "ownerName": "John Doe",
    "carName": "Swift",
    "company": "Maruti",
    "purchaseYear": 2020,
    "insuranceExpiryDate": "2025-12-31T00:00:00.000Z",
    "insuranceClaimsCount": 0,
    "fuelType": "petrol",
    "transmission": "manual",
    "vehicleType": "hatchback",
    "city": "Delhi",
    "usageType": "personal",
    "lastAccidentDate": null
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Vehicle not found"
}
```

---

### 5. Policy Management

**Base Route:** `/add-policy`

This route handles policy configuration management (CRUD operations for policy rules).

#### GET `/add-policy`
Get all insurance policy configurations.

**Description:**
- Fetches all policy rules/templates from the database
- These are the base policy configurations used for generating quotes
- Returns policies sorted by creation date (newest first)
- No authentication required (public endpoint)
- Used by the policy suggestion engine to match vehicles with appropriate policies

**Response:****
```json
{
  "success": true,
  "message": "Policies fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "category": "car",
      "fuelType": "petrol",
      "usageType": "personal",
      "purchaseYearGap": 5,
      "basePremium": 15000,
      "idvPercentage": 80,
      "claimBonusPercentage": 20,
      "providerName": "HDFC ERGO",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "category": "car",
      "fuelType": "diesel",
      "usageType": "commercial",
      "purchaseYearGap": 7,
      "basePremium": 18000,
      "idvPercentage": 75,
      "claimBonusPercentage": 15,
      "providerName": "ICICI Lombard",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Response Details:**
- Returns array of all policy configurations
- Each policy includes:
  - `_id`: Unique policy identifier
  - `category`: Vehicle category (car/bike)
  - `fuelType`: Fuel type this policy applies to
  - `usageType`: Usage type (personal/commercial)
  - `purchaseYearGap`: Vehicle age bracket (2/5/7/10 years)
  - `basePremium`: Base premium amount in ₹
  - `idvPercentage`: Insured Declared Value percentage
  - `claimBonusPercentage`: No-claim bonus discount percentage
  - `providerName`: Insurance provider name
  - `createdAt`: Policy creation timestamp
  - `updatedAt`: Last update timestamp
- Policies are sorted by newest first
- Empty array returned if no policies exist

#### POST `/add-policy`
Add a new insurance policy rule (Admin).

**Request Body:**
```json
{
  "category": "car",
  "fuelType": "petrol",
  "usageType": "personal",
  "purchaseYearGap": 5,
  "basePremium": 15000,
  "idvPercentage": 80,
  "claimBonusPercentage": 20,
  "providerName": "HDFC ERGO"
}
```

**Field Details:**
- `category`: "car" | "bike"
- `fuelType`: "petrol" | "diesel" | "electric" | "hybrid"
- `usageType`: "personal" | "commercial"
- `purchaseYearGap`: 2 | 5 | 7 | 10
- `basePremium`: number
- `idvPercentage`: number (optional)
- `claimBonusPercentage`: number (optional)
- `providerName`: string

**Response:**
```json
{
  "success": true,
  "message": "Policy added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "category": "car",
    "fuelType": "petrol",
    "usageType": "personal",
    "purchaseYearGap": 5,
    "basePremium": 15000,
    "idvPercentage": 80,
    "claimBonusPercentage": 20,
    "providerName": "HDFC ERGO",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. Policy Suggestions

#### GET `/policies/suggest/:licencePlate`
Get policy suggestions for a vehicle.

**Description:**
- Fetches vehicle from database if exists, otherwise uses query parameters
- Calculates policy suggestions based on vehicle details
- Returns best policy and all available options with add-ons

**Parameters:**
- `licencePlate` (path) - Vehicle licence plate number

**Query Parameters (required if vehicle not found in DB):**
- `fuelType`: "petrol" | "diesel" | "electric" | "hybrid" (required)
- `usageType`: "personal" | "commercial" (required)
- `purchaseYear`: number (required)
- `insuranceClaimsCount`: number (optional, default: 0)

**Example Requests:**

1. **With existing vehicle:**
```
GET /policies/suggest/DL01AB1234
```

2. **With new vehicle (not in DB):**
```
GET /policies/suggest/DL01AB1234?fuelType=petrol&usageType=personal&purchaseYear=2020&insuranceClaimsCount=0
```

**Response:****
```json
{
  "success": true,
  "vehicle": {
    "licencePlate": "DL01AB1234",
    "carName": "Swift",
    "company": "Maruti",
    "purchaseYear": 2020,
    "fuelType": "petrol",
    "usageType": "personal",
    "insuranceClaimsCount": 0
  },
  "bestPolicy": {
    "policyId": "507f1f77bcf86cd799439011",
    "providerName": "HDFC ERGO",
    "basePremium": 15000,
    "finalPremium": 16200,
    "idvPercentage": 80,
    "purchaseYearGap": 5,
    "addons": [
      {
        "addonId": "507f1f77bcf86cd799439012",
        "name": "Zero Depreciation",
        "code": "ZERO_DEP",
        "price": 2000
      }
    ]
  },
  "allOptions": [
    {
      "policyId": "507f1f77bcf86cd799439011",
      "providerName": "HDFC ERGO",
      "basePremium": 15000,
      "finalPremium": 16200,
      "idvPercentage": 80,
      "purchaseYearGap": 5,
      "addons": []
    }
  ]
}
```

**Error Response (400 - Missing Parameters):**
```json
{
  "success": false,
  "message": "Vehicle not found. Please provide fuelType, usageType, and purchaseYear as query parameters"
}
```

**Error Response (404 - No Matching Policy):**
```json
{
  "success": false,
  "message": "No matching policy found"
}
```

---

### 7. Add-ons

#### POST `/addOns/add`
Create a new add-on (Admin).

**Request Body:**
```json
{
  "name": "Zero Depreciation",
  "code": "ZERO_DEP",
  "description": "Covers full claim without depreciation",
  "priceType": "percentage",
  "priceValue": 15,
  "maxVehicleAge": 5,
  "applicableForFuel": ["petrol", "diesel"]
}
```

**Field Details:**
- `name`: string (required)
- `code`: string (required, unique)
- `description`: string (optional)
- `priceType`: "flat" | "percentage" (required)
- `priceValue`: number (required)
- `maxVehicleAge`: number (optional)
- `applicableForFuel`: array of fuel types (optional)

**Response:**
```json
{
  "success": true,
  "message": "Add-on created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Zero Depreciation",
    "code": "ZERO_DEP",
    "description": "Covers full claim without depreciation",
    "priceType": "percentage",
    "priceValue": 15,
    "maxVehicleAge": 5,
    "applicableForFuel": ["petrol", "diesel"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Add-on with this code already exists"
}
```

---

### 8. Policy Purchase

#### POST `/policy/purchase`
Purchase a policy with vehicle details (Requires Authentication).

**Description:**
- Creates or finds vehicle by license plate
- Generates unique policy number (format: POL{timestamp}{random})
- Sets policy expiry date to 1 year from purchase
- Sets status to "REVIEW" by default
- Saves all vehicle, policy, and add-on details in database

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "vehicleDetails": {
    "licencePlate": "DL01AB1234",
    "ownerName": "John Doe",
    "carName": "Swift",
    "company": "Maruti",
    "purchaseYear": 2020,
    "insuranceExpiryDate": "2025-12-31T00:00:00.000Z",
    "insuranceClaimsCount": 0,
    "fuelType": "petrol",
    "transmission": "manual",
    "vehicleType": "hatchback",
    "city": "Delhi",
    "usageType": "personal"
  },
  "policyId": "507f1f77bcf86cd799439011",
  "addons": ["507f1f77bcf86cd799439012"],
  "basePremium": 16200,
  "addonsPremium": 2000
}
```

**Field Details:**
- `vehicleDetails`: Complete vehicle information (required)
  - Creates new vehicle record if license plate doesn't exist
  - Updates existing vehicle if license plate found
- `policyId`: MongoDB ObjectId of selected policy (required)
- `addons`: Array of add-on ObjectIds (optional, default: [])
- `basePremium`: Calculated premium amount (required)
- `addonsPremium`: Total add-ons cost (optional, default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Policy submitted for review",
  "data": {
    "purchaseId": "507f1f77bcf86cd799439014",
    "policyNumber": "POL123456781234",
    "vehicleId": "507f1f77bcf86cd799439013",
    "policyExpiryDate": "2025-01-01T00:00:00.000Z",
    "totalPremium": 18200,
    "status": "REVIEW"
  }
}
```

**Response Fields:**
- `purchaseId`: Unique MongoDB ObjectId for this purchase
- `policyNumber`: Auto-generated unique policy number (e.g., POL123456781234)
- `vehicleId`: MongoDB ObjectId of the vehicle
- `policyExpiryDate`: Automatically set to 1 year from purchase date
- `totalPremium`: basePremium + addonsPremium
- `status`: "REVIEW" (default), can be updated to "ACTIVE", "CANCELLED", or "EXPIRED"

#### POST `/policy/buy`
Purchase a policy with existing vehicle (Requires Authentication).

**Note:** Use `/policy/purchase` for new vehicle registration.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "vehicleId": "507f1f77bcf86cd799439013",
  "policyId": "507f1f77bcf86cd799439011",
  "addons": ["507f1f77bcf86cd799439012"],
  "basePremium": 16200,
  "addonsPremium": 2000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Policy submitted for review",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439010",
    "vehicleId": "507f1f77bcf86cd799439013",
    "policyId": "507f1f77bcf86cd799439011",
    "addons": ["507f1f77bcf86cd799439012"],
    "basePremium": 16200,
    "addonsPremium": 2000,
    "totalPremium": 18200,
    "status": "REVIEW",
    "policyExpiryDate": "2025-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/policy/my`
Get user's purchased policies (Requires Authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "My policies",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439010",
      "vehicleId": {
        "licencePlate": "DL01AB1234",
        "carName": "Swift",
        "company": "Maruti"
      },
      "policyId": {
        "providerName": "HDFC ERGO",
        "basePremium": 15000
      },
      "addons": [
        {
          "name": "Zero Depreciation",
          "code": "ZERO_DEP"
        }
      ],
      "basePremium": 16200,
      "addonsPremium": 2000,
      "totalPremium": 18200,
      "status": "REVIEW",
      "policyExpiryDate": "2025-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/policy/all`
Get all purchased policies - Admin view (Requires Authentication).

**Description:**
- Fetches all policy purchases from all users
- Includes user, vehicle, policy, and add-on details
- Sorted by creation date (newest first)
- Useful for admin dashboard to view all policy purchases

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "All purchased policies",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": {
        "_id": "507f1f77bcf86cd799439010",
        "mobile": "9876543210",
        "name": "John Doe"
      },
      "vehicleId": {
        "licencePlate": "DL01AB1234",
        "carName": "Swift",
        "company": "Maruti",
        "fuelType": "petrol",
        "usageType": "personal"
      },
      "policyId": {
        "providerName": "HDFC ERGO",
        "basePremium": 15000,
        "category": "car"
      },
      "addons": [
        {
          "name": "Zero Depreciation",
          "code": "ZERO_DEP"
        }
      ],
      "policyNumber": "POL123456781234",
      "basePremium": 16200,
      "addonsPremium": 2000,
      "totalPremium": 18200,
      "status": "REVIEW",
      "policyExpiryDate": "2025-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Data Models

### User
```typescript
{
  mobile: string;              // Unique
  name?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  otp?: string;                // Hashed
  otpExpiresAt?: Date;
  createdAt?: Date;
}
```

### Vehicle
```typescript
{
  licencePlate: string;        // Unique, uppercase
  ownerName: string;
  carName: string;
  company: string;
  purchaseYear: number;
  insuranceExpiryDate: Date;
  insuranceClaimsCount: number;
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  transmission: "manual" | "automatic";
  vehicleType: "sedan" | "suv" | "hatchback";
  city: string;
  usageType: "personal" | "commercial";
  lastAccidentDate?: Date;
}
```

### Policy
```typescript
{
  category: "car" | "bike";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  usageType: "personal" | "commercial";
  purchaseYearGap: 2 | 5 | 7 | 10;
  basePremium: number;
  idvPercentage?: number;
  claimBonusPercentage?: number;
  providerName: string;
}
```

### Add-on
```typescript
{
  name: string;
  code: string;                // Unique
  description: string;
  priceType: "flat" | "percentage";
  priceValue: number;
  maxVehicleAge?: number;
  applicableForFuel?: Array<"petrol" | "diesel" | "electric" | "hybrid">;
}
```

### Policy Purchase
```typescript
{
  userId: ObjectId;
  vehicleId: ObjectId;
  policyId: ObjectId;
  addons: ObjectId[];
  policyNumber: string;         // Unique, auto-generated (e.g., POL123456781234)
  basePremium: number;
  addonsPremium: number;
  totalPremium: number;
  status: "REVIEW" | "ACTIVE" | "CANCELLED" | "EXPIRED";
  policyExpiryDate: Date;       // Set to 1 year from purchase
  adminRemarks?: string;
  approvedAt?: Date;
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Vehicle not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Add-on with this code already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Premium Calculation Logic

The policy suggestion endpoint calculates premium based on:

1. **Base Premium**: From policy configuration
2. **Vehicle Age**: +₹300 per year
3. **Commercial Usage**: +20% if commercial
4. **Claim Penalty**: +10% per previous claim
5. **Claim Bonus**: Discount based on policy's claimBonusPercentage

**Add-on Pricing:**
- **Flat**: Fixed price
- **Percentage**: Calculated as % of final premium

---

## Notes

- All licence plates are converted to uppercase
- OTP expires in 5 minutes
- Policy purchases default to "REVIEW" status
- Policy numbers are auto-generated with format: POL{8-digit-timestamp}{4-digit-random}
- Policy expiry date is automatically set to 1 year from purchase
- Policies are sorted by final premium (lowest first)
- Add-ons are filtered by vehicle age and fuel type eligibility
- Vehicle records are created automatically during policy purchase if they don't exist

---

## Policy Status Lifecycle

1. **REVIEW**: Initial status when policy is purchased (default)
2. **ACTIVE**: Policy approved and active
3. **CANCELLED**: Policy cancelled by user or admin
4. **EXPIRED**: Policy expired after expiry date

---

## Database Collections

### User Database (`user`)
- **users**: Stores user authentication and profile data

### Insurance Database (`insurance`)
- **vehicles**: Stores vehicle information
- **policies**: Stores policy rules and configurations
- **addOns**: Stores add-on options
- **policy_purchases**: Stores purchased policies with all details including:
  - User reference
  - Vehicle reference
  - Policy reference
  - Selected add-ons
  - Unique policy number
  - Premium breakdown
  - Policy expiry date
  - Status tracking
