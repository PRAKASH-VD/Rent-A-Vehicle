# 🍽️ Vehicle Booking and Review Platform

Welcome to the **Vehicle Booking and Review Platform**! This is a modern web application designed to make dining experiences seamless, enjoyable, and personalized for users. Whether you're booking a table or leaving a review for your favorite spot, this platform has it all.

---

### 🚀 Live Demo
[Visit the Application]
- [Front-End](https://table-Booking-system.netlify.app)
- [Back-End](https://table-Booking-m21o.onrender.com)

---

### 🌟 Features

#### For Diners:
- **Quick Bookings:** Effortlessly book tables at your favorite Vehicles.
- **Dynamic Animations:** Enjoy a smooth and interactive UI powered by `framer-motion`.
- **Reviews and Ratings:** Share your dining experience or read others' reviews.

#### For Vehicles:
- **Manage Bookings:** View and update table bookings in real-time.
- **Customer Insights:** Access user feedback to improve service.
- **API Integration:** Seamlessly connect with Vehicle databases for accurate data management.

---

### 🛠️ Tech Stack

#### Frontend:
- **Framework:** React.js
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS

#### Backend:
- **Framework:** Node.js with Express.js
- **Database:** MongoDB
- **Deployment:** Render

#### APIs:
- Custom APIs for Vehicle data management and Bookings.

---

### 🎨 Design Philosophy
We aimed to combine functionality with aesthetics. The platform’s design ensures:
- Intuitive navigation.
- Responsiveness for mobile and desktop devices.
- Visual delight with engaging animations and sleek transitions.

---

### ⚡ Getting Started

#### Prerequisites:
- Node.js (v14+)
- MongoDB (running locally or in the cloud)

#### Installation:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Vehicle-Booking.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Vehicle-Booking
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

#### Running the Application:
1. Start the backend server:
   ```bash
   npm run server
   ```
2. Start the frontend:
   ```bash
   npm start
   ```
3. Access the application at [https://rent-a-vehicle.onrender.com](https://rent-a-vehicle.onrender.com).

---

### 👨‍💻 Development Notes
- **Backend API Endpoints:**
   - `/auth` for Register,Login and Logout as User or Admin.
   - `/Vehicles` for handing the Vehicles data.
   - `/users` for handling the user data.
   - `/admin` for handling the admin data.
   - `/recommendation` fro handling the recommendation data.
   - `/Bookings` for handling Booking data.
   - `/reviews` for user-generated content.
   - `/dashboard` for fetch the user,Booking,review,Vehicles count's.
- **Frontend Routes:**
   - `/` Home Page.
   - `/login` Login Page for User,Admin.
   - `/register` for register User,Admin.
   - `/Vehicles` for display the Vehicle list.
   - `/Vehicles/:id` for display the Vehicle detail.
   - `/review ` for handling the review data.
   - `/recommendation` for recommendation service.
   - `/dashboard` for fetch the user details.
   - `/reserve` Booking Form.
   - `/reviews` User Reviews.

---

### 🌐 Contribution Guidelines

We welcome contributions from the community! Here’s how you can help:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

---
## UserGuide :-

### As a USER : 
   ##### Home Page:
  - A welcoming interface to guide users.
   <img src="https://github.com/user-attachments/assets/27fe147d-69ab-4957-b8e8-6480ff07e259" width="500" height="300">

   
  ##### Login Page :
  - Login with your credentials ,if don't have click Register.
   <img src ="https://github.com/user-attachments/assets/7f7f0886-530a-4c87-9a76-d22c990ac6ab" width ="500" height="300">

  ##### Explore the Vehicles:
  - Explore the Vehicles and use the feature filter ans search bar.
  - Click the View More button to get the Vehicles details.
  <img src ="https://github.com/user-attachments/assets/6519a0a3-ad7a-4b2a-9aef-9314afacc305" width="500" height="300">


  ##### Vehicle Detail Page:
  - You get the additonal Detailed Infromation about the Resetaurants like Name,descriptions,price range,features,reviews,location,Book table & add Review Button as well
  - Also You can made a Booking by click the Book Table button its naviagte to Booking Form.
    <img src="https://github.com/user-attachments/assets/0dc91174-82ae-406f-bb4e-35531b07ad61" width="500" height="300">

    


##### Booking Form:
  - Simple and efficient table booking, with some fields.
  <img src="https://github.com/user-attachments/assets/5a884c82-6b25-46e9-ad0b-e79765a1f91a" width="500" height="300">


  

##### Reviews :
- add Your reviews with add Review button.
- fill the some given fields and submit your reviews.
 <img src ="https://github.com/user-attachments/assets/aa01254f-a2d3-4aa4-938a-d8362eb7ee12" width="500" height="300">


  
##### User Dashboard & Bookings:
- This fetch Your Booking History,review history, user details.
- User also delete their particular Reviews by clicking the delete icon at the reviews card.
<img src= "https://github.com/user-attachments/assets/a341dd59-7f6a-46e2-a6c8-03a9e86e7508" width="500" height="300">


## As a Admin :

##### Login Page:
 - Login with your credentials ,if don't have click Register,
 <img src="https://github.com/user-attachments/assets/f7dc7e21-45fc-464c-8a58-af6dd6df69b8" width="500" height="300">
   


##### Admin Booking Page:
 - In this page, it only  fetch the Vehicles thats Created by the corrosponding admin's Vehicles List,
 - Select the Vehicles to get detail of the Vehicles(notes: without selcting the Vehicles its not work)
 - If don't have else create a new one navigate to Create Resetaurants
 <img src="https://github.com/user-attachments/assets/813b5846-776b-40b9-b16f-36580911cc27" width="500" height="300" >

 

 ##### Create Vehicles :
 - You can Create the New Vehicles by adding some fields (notes : use Lower Case for filter the data's)
 - Then,navigate to Admin Booking and select the Vehicles recently created from the list
<img src="https://github.com/user-attachments/assets/74aa18cf-1424-4763-bc6b-13bf28e56ee1" width="500" height="300" >


##### Admin dashboard:
-this page only for show's the number of Vehicles,reviews,Users,Reviews count's.
<img src ="https://github.com/user-attachments/assets/bdda00a6-a0b4-499f-9ca6-bb844f6c86c9" width = "500" height="300">


#### Admin Review Page:
- To fetch the User's review's related to the  corsponding Vehicles.
<img src ="https://github.com/user-attachments/assets/3784cff2-b177-4154-9ab9-a9ae93d731a0" width= "500" height="300">

---

### 📄 License
This project is licensed under the MIT License.

---


### 📬 Contact
For inquiries, feedback, or support, please reach out at **abdulvahith2023@gmail.co**.

---

Happy Dining! 🍴

