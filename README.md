<div align="center">

# SentriQ

### Secure Quiz Monitoring Platform

A modern digital assessment platform that helps teachers create quizzes, monitor student activity, and protect academic integrity—all in one secure platform.

</div>

---

## About the Project

SentriQ is a web-based quiz and assessment platform designed for teachers and students. Teachers can create and manage quizzes, distribute access codes, monitor assessment activity, and review student performance.

Students can join assessments using a quiz code and answer questions through a simple and secure interface.

## Key Features

### For Teachers

- Create, edit, publish, and manage quizzes
- Generate unique quiz access codes
- Monitor student activity during assessments
- Receive alerts for suspicious actions
- Review quiz attempts and student answers
- View assessment results and performance reports

### For Students

- Join quizzes using an access code
- Access assessments through a simple interface
- Answer and submit quizzes securely
- Receive immediate confirmation after submission

## How SentriQ Works

1. **Create and Publish**  
   Teachers create quiz questions, configure settings, and publish an assessment.

2. **Share Quiz Access**  
   SentriQ generates a unique access code that students can use to join.

3. **Monitor Activity**  
   Student sessions and assessment activity are monitored in real time.

4. **Review Performance**  
   Teachers can analyze attempts, answers, results, and assessment records.

## Project Preview

<p align="center">
  <img
    src="./public/preview.png"
    alt="SentriQ Web Application Preview"
    width="850"
  />
</p>

## Technology Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
- **PostgreSQL**
- **Vercel**

## Getting Started

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/)
- npm
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/sentriq.git
```

2. Open the project directory:

```bash
cd sentriq
```

3. Install the dependencies:

```bash
npm install
```

4. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL of the Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key used to connect to Supabase |

> Never include private keys, passwords, or the actual contents of your `.env.local` file in the repository.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production-ready build.

```bash
npm run start
```

Runs the production build locally.

```bash
npm run lint
```

Checks the project for linting issues.

## Project Status

SentriQ is currently under active development. Some features and interfaces may continue to change as the platform is improved.

## Author

Developed by **John Lester Tan**.

## License

This project is intended for educational and portfolio purposes.

---

<div align="center">

Built for modern and secure digital assessments.

</div>