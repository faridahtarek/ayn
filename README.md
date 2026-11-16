# Ayn

**Course:** Electronic Business Development (BINF 503) · Winter 2026
**Instructor:** Dr. Nourhan Hamdi
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa, Ms. Mariam Khalid, Mr. Younes Zied, Mr. Mahmoud Hani

## 1. Team

| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| Faridah Tarek | 13002082 | T1 | faridahtarek |
| Lojaine Soliman | 16003064 | T1 | lojainesoliman |

## 2. The idea

Ayn is a web application where companies pay for small Egyptian farmers to switch from flood irrigation to drip irrigation, and reward them for doing it. Most farmers have under three feddans and cannot pay for a drip kit up front, and since they are not billed for the canal water they use, switching saves them little money. Companies, meanwhile, need real projects to report: listed companies in Egypt must disclose their environmental and social practices, and many have water targets to meet. Ayn connects the two. A cooperative officer registers each farm with a quote from a local installer, because farmers do not use the app themselves. A company funds the kit and sets a reward for the farmer. Once the kit is installed, the officer uploads proof, and the company confirms it, which releases the reward. The farmer gets the kit with no debt and a reward on top, the company gets a farm-by-farm record it can put in its sustainability report, and Ayn earns a fee on every confirmed farm.

## 3. Features

### 3.1 The full product

- Cooperative officers and companies register and log in, each with their own role
- Officers register farms: farmer's name and phone, village, governorate, land in feddans, crop, and the installer and price quoted for the drip kit
- Companies browse farms waiting for funding and filter them by governorate, crop and size
- Companies fund a farm's kit and set a reward for the farmer
- Officers upload proof of the installation: a photo, the installation date and a note
- Companies confirm or reject the proof; a confirmed farm releases the farmer's reward, and a rejected one goes back to the officer for new proof
- Each company sees every farm it funded, its status and the total feddans it has switched to drip, ready for its sustainability report
- Each officer sees every farm in their cooperative and the rewards paid to its farmers
- Admins check new officer and company accounts (not built in this course)
- Online payment by companies, held until the installation is confirmed (not built in this course: payment is simulated)
- Paying rewards to farmers' mobile wallets (not built in this course)
- An estimate of the water saved per farm, and a yearly certificate for companies' sustainability reports (not built in this course)
- Arabic interface for officers (not built in this course)

### 3.2 The use cases we will build

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Registers with name, email, password, role (officer or company) and organisation; logs in with email and password | Their home page, with their name in the header | A User, with the password hashed, their role (`officer` if none is chosen) and organisation |
| 2 | Officer manages farms | A cooperative officer registers a farm (farmer's name and phone, village, governorate, feddans, crop, installer, kit cost), and later edits or deletes it while it is not funded | The "My farms" page, with each farm and its status | A Farm linked to the officer, with the status `open`; it is updated on edit and removed on delete |
| 3 | Company funds a farm | A company opens an open farm, confirms the kit cost and sets a reward for the farmer; later changes the reward or withdraws before proof is uploaded | The farm marked as funded, and the "My farms funded" page with the total it has committed | A Funding linked to the company and the farm; the Farm's status changes to `funded`, and back to `open` on withdraw |
| 4 | Officer uploads proof | For a funded farm, the officer adds proof of the installation (photo link, installation date, note); later edits it, for example after the company rejects it, or deletes it before the company reviews it | The farm's page with its proof, marked as waiting for review | A Proof linked to the farm and the officer, with the status `pending`; the Farm's status changes to `installed`; an edit sets the Proof back to `pending`, and a delete removes it and sets the Farm back to `funded` |
| 5 | Company reviews proof | The company opens the farms it funded that have proof, and confirms or rejects each one with a note | The farm marked as confirmed or rejected, and the company's total feddans switched | The Proof's status changes to `confirmed` or `rejected`; on confirm, the Farm's status changes to `confirmed` and the Funding's reward to `released`; on reject, the Farm goes back to `funded` so the officer can send new proof |

## 4. Who owns what

| Member | Use case |
|---|---|
| Faridah Tarek | 1. Registration and login |
| Faridah Tarek | 2. Officer manages farms |
| Lojaine Soliman | 3. Company funds a farm |
| Faridah Tarek | 4. Officer uploads proof |
| Lojaine Soliman | 5. Company reviews proof |

## 5. Data model

### User

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
  role: { type: String, enum: ['officer', 'company'], default: 'officer' }, // chosen on the registration form
  organisation: { type: String }, // the cooperative or the company's name
});
```

### Farm

```js
const farmSchema = new mongoose.Schema({
  officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, required: true },
  village: { type: String, required: true },
  governorate: { type: String, required: true },
  feddans: { type: Number, required: true },
  crop: { type: String, required: true },
  installer: { type: String, required: true }, // the local company that supplies and installs the kit
  kitCost: { type: Number, required: true }, // the installer's quote, in Egyptian pounds
  status: {
    type: String,
    enum: ['open', 'funded', 'installed', 'confirmed'],
    default: 'open',
  },
});
```

### Funding

```js
const fundingSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, unique: true }, // one company per farm
  kitCost: { type: Number, required: true },
  reward: { type: Number, required: true }, // paid to the farmer once confirmed
  rewardStatus: { type: String, enum: ['held', 'released'], default: 'held' },
  paid: { type: Boolean, default: true }, // payment is simulated in this course
});
```

### Proof

```js
const proofSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, unique: true },
  officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photoUrl: { type: String, required: true }, // a link to the photo, no file upload
  installedOn: { type: Date, required: true },
  note: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
  reviewNote: { type: String }, // written by the company
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
