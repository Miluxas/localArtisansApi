# Online Marketplace for Local Artisans

The Online Marketplace for Local Artisans is a platform that connects local artisans and craftsmen with potential customers, providing a space for artisans to showcase and sell their handmade products while allowing customers to discover and purchase unique locally made items.

This repository contains the backend implementation of the project using NestJS, a progressive Node.js framework.

## Features

- User registration and authentication for artisans and customers.
- Artisan profile management to showcase products and update inventory.
- Product listings with detailed descriptions, categories, and tags.
- Shopping cart and order management for customers.
- Integration with a secure payment gateway for online transactions.
- Reviews and ratings for products and artisans.
- Notifications and communication between artisans and customers.
- Analytics and insights for artisans to optimize offerings.
- Admin dashboard for managing user accounts, disputes, and product listings.

## Technology Stack

- **NestJS**: A progressive Node.js framework for building scalable and maintainable server-side applications.
- **TypeScript**: A statically typed superset of JavaScript, which integrates seamlessly with NestJS.
- **PostgreSQL**: Databases for storing user profiles, product information, and order data.
- **TypeORM**: Object-Relational Mapping (ORM) libraries for database integration and management.
- **JWT** (JSON Web Tokens): For implementing secure user authentication and authorization.
- **Stripe** or **PayPal**: Payment gateway integration for handling online transactions.
- **AWS S3**: Services for storing and managing product images and media files.

## Installation

1. Clone the repository:
```batch
git clone https://github.com/miluxas/localArtisansApi.git
```


2. Navigate to the project directory:

```batch
cd online-marketplace-backend
```


3. Install the dependencies:

```batch
npm install
```


4. Configure the environment variables:
   
   - Rename the `.env.example` file to `.env` and update the values according to your environment and services.

5. Set up the database:

   - Create a new PostgreSQL or MongoDB database.
   - Update the database connection details in the `.env` file.


6. Start the application:

```batch
npm run start
```


7. The server should now be running at `http://localhost:3000`.

## API Documentation

For detailed information about the API endpoints and their usage, refer to the API documentation. You can access it by visiting `http://localhost:3000/api-docs` when the server is running.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvement, please open an issue in this repository.

Before contributing, please familiarize yourself with the [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [NestJS](https://nestjs.com) - The Node.js framework used for building the backend.
- [TypeScript](https://www.typescriptlang.org) - The programming language used for the project.
- [PostgreSQL](https://www.postgresql.org) - Databases for storing data.
- [TypeORM](https://typeorm.io) - ORM libraries for database integration.
- [Stripe](https://stripe.com) or [PayPal](https://www.paypal.com) - Payment gateways for handling transactions.

## Contact

For any inquiries or questions, please contact [milad.ashoori@gmail.com](mailto:milad.ashoori@gmail.com).

---


comment for migration:
yarn migration:generate src/migrations/init


comment for create empty migration:
yarn migration:create src/migrations/new