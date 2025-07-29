# HEARTI™ Assessment Platform

A comprehensive assessment platform built with React, TypeScript, and Supabase for evaluating and tracking personal development across multiple dimensions.

## Features

- Multi-dimensional assessment system
- Real-time results visualization with radar charts
- Habit tracking and goal setting
- PDF report generation
- Multi-language support (English, Chinese, Italian, French, Spanish, German, Arabic, Japanese)
- Responsive design for all devices
- Integration with Google Sheets for data export
- Coach dashboard for user management

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **Charts**: Recharts
- **PDF Generation**: jsPDF, html2canvas
- **Internationalization**: Custom translation system

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

## Deployment to cPanel

### Step 1: Build the Application

```bash
npm run build
```

### Step 2: Upload Files

1. Connect to your cPanel File Manager or FTP client
2. Navigate to your domain's public_html directory
3. Upload all contents from the `dist/` folder to your domain's root directory
4. The `.htaccess` file is already configured for proper routing

### Step 3: Configure Domain Settings

1. In cPanel, go to "Subdomains" or "Addon Domains" 
2. Set the document root to the folder containing your uploaded files
3. Ensure the domain points to the correct directory

### Step 4: Test Deployment

1. Visit your domain
2. Test all routes (should work with React Router)
3. Verify that refreshing pages works correctly
4. Check that assets load properly

## Important Notes for Production

- The `.htaccess` file handles React Router routing
- Supabase configuration uses production URLs
- Security headers and caching are configured for optimal performance
- All static assets are optimized and compressed

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── auth/           # Authentication components
│   ├── assessment/     # Assessment-related components
│   ├── results/        # Results visualization components
│   └── habit-tracker/  # Habit tracking components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and business logic
├── styles/             # CSS and styling files
├── translations/       # Internationalization files
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Development

**Use Lovable**

Visit the [Lovable Project](https://lovable.dev/projects/abf3e85d-303e-4131-b19a-f66b2f6628bc) for AI-powered development.

**Local Development**

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## Authentication

The application uses Supabase Auth with:
- Email/password authentication
- Magic link sign-in
- Password recovery
- User profiles and organization management

## License

Proprietary - PrismWork, Inc.
