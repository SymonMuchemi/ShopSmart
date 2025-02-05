# ShopSmart

## Description

A robust RESTful API for e-commerce operations built with Node.js and MongoDB.

<!-- markdownlint-disable MD033 -->
<div align="center">
    <img src="Smart_Online_Shop_Chart_Logo-shift-no-bg-cropped.png" alt="Shop-smart API Logo">
</div>

## Features

- [x] User Authentication
- [x] Product Management
- [x] image storage
- [x] Shopping Cart Operations
- [x] Purchase Management
- [x] Stripe Payment Integration

## Technologies

- [Node.JS](www.nodejs.org): JavaScript runtime.
- [Express](https://expressjs.com/): Web framework for Node.js.
- [Amazon S3](https://aws.amazon.com/s3/): Cloud storage.
- [Multer](https://www.npmjs.com/package/multer): Middleware for handling multipart/form-data.
- [AWS EC2](https://aws.amazon.com/ec2/): for deployment.
- [MongoDB](https://www.mongodb.com/): NoSQL database.
- [Mongoose](https://mongoosejs.com/): Object Relational Mapper for MongoDB.
- [JWT](https://jwt.io/): Secure user authentication.
- [Stripe](https://stripe.com/docs): Payment processing platform.

## Database Design

![database Design](/src/db/db%20design.png)

## Installation

1. Clone the repository from a terminal or command prompt.

   ```bash
   git clone https://www.github.com/symonmuchemi/ShopSmart.git
   ```

2. Navigate to the project directory.

   ```bash
    cd ShopSmart
    ```

3. Install the project dependencies.

    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add the following environment variables.

    ```env
    PORT=3000

    MONGO_DB_URL=mongodb://localhost:3000/shopsmart
    
    JWT_SECRET=your_secret_key
    JWT_EXPIRATION=1d

    STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    STRIPE_SECRET_KEY=your_stripe_secret_key

    S3_BUCKET_REGION='your_s3_bucket_region'
    S3_BUCKET_NAME='your_s3_bucket_name'
    S3_ACCESS_KEY='your_s3_access_key_id'
    S3_SECRET_ACCESS_KEY='your s3_secret_access_key'
    ```

5. Start the application.

    ```bash
    npm run dev
    ```

6. Access the application on `http://localhost:3000`.


## Author

[Symon Muchemi](https://www.github.com/symonmuchemi)
