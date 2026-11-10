# Ayn

**Course:** Electronic Business Development (BINF 503) · Winter 2026
**Instructor:** Dr. Nourhan Hamdi
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa, Ms. Mariam Khalid, Mr. Younes Zied, Mr. Mahmoud Hani

## 1. Team

| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| Faridah Tarek | 13002082 | T1 | faridahtarek |
| lojaine soliman | 16003064 | T1 | lojainesoliman |

## 2. The idea

Ayn is a web application where tourists in Cairo and Giza book local experiences at one fixed price per person, paid in advance. Small businesses such as tour companies, licensed guides, craft workshops and cooking schools list their tours and workshops, each with a time slot and a group size limit. Tourists often see the Pyramids and the museum and then find little else they trust enough to book, because prices are unclear and haggling is expected. Ayn solves this with a small catalogue in which every listing is approved by an admin before tourists can see it, and only tourists who booked an experience can review it.

## 3. Features

### 3.1 The full product
   
- Tourists, businesses and admins register and log in, each with their own role

- Businesses create, edit and delete listings for their tours and workshops

- Each listing shows what is included, the duration, the language spoken, the meeting point, the price per person, the group size limit and the available dates

- Admins approve or reject new listings, and remove poor ones

- Tourists browse approved listings and filter them by type, date and price

- Tourists book a date and a group size, and change or cancel their booking

- Tourists review an experience they booked, with a rating and a comment

- Businesses see the bookings made on their listings

- Online card payment when booking 

- The business is paid only after the experience has happened 

- Hotels and holiday homes share an Ayn link with their guests and earn a share of each booking 

- Hotel partners track their referred bookings and earnings 

- Listings that fall below a set rating are removed automatically 

- Listings shown in several languages 


### 3.2 The use cases we will build

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Registers with name, email and password; logs in with email and password | Their home page, with their name in the header | A User, with the password hashed and the role `tourist` by default |
| 2 | Business manages its listings | A business fills in a form to create a listing (title, type, description, price, group size limit, dates), and later edits or deletes it | The "My listings" page, with the new listing marked as pending, and the changes after an edit or a delete | A Listing linked to the business, with the status `pending`; it is updated on edit and removed on delete |
| 3 | Tourist books an experience | A tourist opens an approved listing, picks a date and a group size and confirms; later changes the date or group size, or cancels | The "My bookings" page, with the booking, its date, group size and total price | A Booking linked to the tourist and the listing; it is updated on change and removed on cancel |
| 4 | Tourist reviews an experience | A tourist opens one of their bookings and submits a rating from 1 to 5 with a comment; later edits or deletes the review | The review on the listing's page, and the listing's average rating | A Review linked to the tourist, the listing and the booking; it is updated on edit and removed on delete |
| 5 | Admin approves listings | An admin opens the list of pending listings and approves or rejects each one, and removes a listing that is already live | The pending list without the handled listing; approved listings appear on the browse page | The Listing's status changes to `approved` or `rejected`; a removed Listing is deleted |

## 4. Who owns what

| Member | Use case |
|---|---|
| Faridah Tarek | 1. Registration and login |
| Faridah Tarek | 2. Business manages its listings |
| lojaine soliman | 3. Tourist books an experience |
| lojaine soliman | 4. Tourist reviews an experience |
| Faridah Tarek | 5. Admin approves listings |

## 5. Data model

### User

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
  role: { type: String, enum: ['tourist', 'business', 'admin'], default: 'tourist' },
});
```

### Listing

```js
const listingSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['sightseeing', 'workshop'], required: true },
  description: { type: String, required: true },
  included: { type: String },
  durationHours: { type: Number, required: true },
  language: { type: String, required: true },
  meetingPoint: { type: String, required: true },
  price: { type: Number, required: true }, // fixed price per person
  maxGroupSize: { type: Number, required: true },
  dates: [{ type: Date }], // the dates the experience can be booked on
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});
```

### Booking

```js
const bookingSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  date: { type: Date, required: true }, // one of the listing's dates
  groupSize: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // price per person x group size
  paid: { type: Boolean, default: true }, // payment is simulated in this course
});
```

### Review

```js
const reviewSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true }, // one review per booking
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
});
```

## 6. Run it locally

> Leave this section as it is until Submission 2 (Thursday 10 December 2026,
> 23:59). Then fill it in: we follow these steps to run your project.

### Back end

```bash
cd backend
npm install
# create backend/.env from backend/.env.example (see the table below)
npm start
```

The API runs on http://localhost:3000.

| Variable in `.env` | What it is |
|---|---|
| `MONGODB_URI` | The connection string of your MongoDB Atlas database |
| `JWT_SECRET` | Any long random text, used to sign login tokens |
| [Any other variable] | [What it is] |

### Front end

```bash
cd frontend
npm install
npm run dev
```

The app runs on [the address `npm run dev` prints, e.g. http://localhost:5173].
