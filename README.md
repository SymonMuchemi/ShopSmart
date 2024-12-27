# ShopSmart

![shopsmart](image.webp)

## Description

A robust RESTful API for e-commerce operations built with Node.js and MongoDB. Features comprehensive endpoints for product management, secure user authentication, shopping cart operations, and payment integration (Stripe & MPesa). Designed to support scalable e-commerce applications with detailed documentation for frontend integration.

## Features

- [ ] User Authentication
- [ ] Product Management
- [ ] image storage
- [ ] Shopping Cart Operations
- [ ] Credit Card Payment Integration
- [ ] MPesa Payment Integration
- [ ] Order Management

## Technologies

- [Node.JS](www.nodejs.org): JavaScript runtime.
- [Express](https://expressjs.com/): Web framework for Node.js.
- [Amazon S3](https://aws.amazon.com/s3/): Cloud storage.
- [Multer](https://www.npmjs.com/package/multer): Middleware for handling multipart/form-data.
- [AWS EC2](https://aws.amazon.com/ec2/): for deployment.
- [MongoDB](https://www.mongodb.com/): NoSQL database.
- [Mongoose](https://mongoosejs.com/): Object Relational Mapper for MongoDB.
- [JWT](https://jwt.io/): Secure user authentication.
- [Stripe](https://stripe.com/): Payment gateway.
- [MPesa](https://developer.safaricom.co.ke/): Payment gateway.
- [Swagger](https://swagger.io/): API documentation.
- [Jest](https://jestjs.io/): Testing framework.

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
    MONGO_URL=mongodb://localhost:27017/shopsmart
    JWT_SECRET=your_secret_key
    JWT_EXPIRATION=1d
    STRIPE_SECRET_KEY=your_stripe_secret_key
    MPESA_CONSUMER_KEY=your_mpesa_consumer_key
    MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
    MPESA_SHORTCODE=your_mpesa_shortcode
    MPESA_PASSKEY=your_mpesa_passkey
    ```

5. Start the application.

    ```bash
    npm dev
    ```

6. Access the application on `http://localhost:3000`.

## API Documentation

The API documentation will available at `http://localhost:3000/api-docs`.

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Author

[Symon Muchemi](https://www.github.com/symonmuchemi)
