<div align="center">
  <h1>FreeCustom.Email</h1>
  <p><strong>Next Auth Example Application</strong></p>
</div>

## About

This repository contains the `fce-example-next-auth` project, which serves as a comprehensive example repository for developers looking to test and integrate their **NextAuth.js**-based applications with **FreeCustom.Email's SDK**. 

This example demonstrates how to seamlessly integrate our temporary, privacy-focused email service into a Next.js application, enabling smooth, reliable authentication flows (such as magic links, OTPs, and credential validations) in testing environments.

## Features

- **Next Auth Integration**: A fully functional Next.js application utilizing `next-auth` for authentication.
- **SDK Example**: Clear, structured examples showing how to interact with the FreeCustom.Email SDK to retrieve, parse, and verify emails automatically during tests.
- **Modern UI/UX**: Includes a beautifully styled sign-in and authentication flow inspired by NextAuth's default minimalist and accessible design.
- **Playwright Testing Ready**: Easily integrate your automated end-to-end tests using this boilerplate as a starting point.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A FreeCustom.Email account / API keys (if applicable for the SDK)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DishIs/fce-example-next-auth.git
   cd fce-example-next-auth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory based on `.env.example` (if provided) and fill in your NextAuth secrets and FreeCustom.Email SDK configurations.
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Testing

This repository is built with automated testing in mind. You can use frameworks like Playwright or Cypress alongside the FreeCustom.Email SDK to automate the process of signing up, receiving an OTP/Magic Link, and completing the authentication flow without manual intervention.

## Contributing

We welcome contributions from the community! Please open an issue or submit a pull request if you have suggestions or improvements for this example.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Contact

DishIs Technologies - [@DishIs](https://github.com/DishIs)

Project Link: [https://github.com/DishIs/fce-example-next-auth](https://github.com/DishIs/fce-example-next-auth)
