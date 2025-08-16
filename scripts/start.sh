#!/bin/bash

# Stock Market Dashboard Startup Script
# This script helps you start the application in different modes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists python3; then
        print_error "Python 3 is not installed. Please install Python 3.11+"
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_success "All prerequisites are satisfied"
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_status "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install requirements
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Start server
    print_status "Starting FastAPI server..."
    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    
    cd ..
    print_success "Backend started with PID: $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend development server..."
    cd frontend
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing Node.js dependencies..."
        npm install
    fi
    
    # Start development server
    print_status "Starting React development server..."
    npm start &
    FRONTEND_PID=$!
    
    cd ..
    print_success "Frontend started with PID: $FRONTEND_PID"
}

# Function to start with Docker
start_docker() {
    print_status "Starting with Docker Compose..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    docker-compose up --build
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    
    # Stop backend
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_status "Backend stopped"
    fi
    
    # Stop frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Frontend stopped"
    fi
    
    # Stop Docker services
    docker-compose down 2>/dev/null || true
    
    print_success "All services stopped"
}

# Function to show status
show_status() {
    print_status "Checking service status..."
    
    # Check backend
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        print_success "Backend is running on http://localhost:8000"
    else
        print_warning "Backend is not running"
    fi
    
    # Check frontend
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend is running on http://localhost:3000"
    else
        print_warning "Frontend is not running"
    fi
}

# Function to show help
show_help() {
    echo "Stock Market Dashboard Startup Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start       Start the application (backend + frontend)"
    echo "  docker      Start with Docker Compose"
    echo "  backend     Start only the backend"
    echo "  frontend    Start only the frontend"
    echo "  stop        Stop all services"
    echo "  status      Show service status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start     # Start both services"
    echo "  $0 docker    # Start with Docker"
    echo "  $0 stop      # Stop all services"
}

# Main script logic
case "${1:-start}" in
    "start")
        check_prerequisites
        start_backend
        sleep 3  # Wait for backend to start
        start_frontend
        print_success "Application started successfully!"
        print_status "Backend: http://localhost:8000"
        print_status "Frontend: http://localhost:3000"
        print_status "API Docs: http://localhost:8000/docs"
        print_status "Press Ctrl+C to stop all services"
        
        # Wait for interrupt
        trap stop_services INT
        wait
        ;;
    "docker")
        start_docker
        ;;
    "backend")
        check_prerequisites
        start_backend
        print_success "Backend started on http://localhost:8000"
        print_status "Press Ctrl+C to stop"
        wait $BACKEND_PID
        ;;
    "frontend")
        check_prerequisites
        start_frontend
        print_success "Frontend started on http://localhost:3000"
        print_status "Press Ctrl+C to stop"
        wait $FRONTEND_PID
        ;;
    "stop")
        stop_services
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
