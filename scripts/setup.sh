#!/bin/bash

# AI Usthad Mobile - Quick Setup Script

echo "🚀 AI Usthad Mobile - Quick Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and add your credentials:"
    echo "   - EXPO_PUBLIC_SUPABASE_URL"
    echo "   - EXPO_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - EXPO_PUBLIC_GEMINI_API_KEY"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if Expo CLI is installed globally
if ! command -v expo &> /dev/null; then
    echo "📱 Expo CLI not found. Installing globally..."
    npm install -g expo-cli
    echo "✅ Expo CLI installed"
else
    echo "✅ Expo CLI is already installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your credentials"
echo "2. Run 'npm start' to start the development server"
echo "3. Scan QR code with Expo Go app or press 'i' for iOS / 'a' for Android"
echo ""
echo "For detailed setup instructions, see SETUP.md"
echo ""
