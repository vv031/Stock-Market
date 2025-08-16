#!/bin/bash

# Stock Market Dashboard Setup Script
# This script sets up the development environment

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

# Function to check Python version
check_python_version() {
    if command_exists python3; then
        PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
        REQUIRED_VERSION="3.11"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_success "Python version $PYTHON_VERSION is compatible"
            return 0
        else
            print_warning "Python version $PYTHON_VERSION detected, but $REQUIRED_VERSION+ is recommended"
            return 1
        fi
    else
        print_error "Python 3 is not installed"
        return 1
    fi
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node -v | cut -d'v' -f2)
        REQUIRED_VERSION="18.0.0"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_success "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_warning "Node.js version $NODE_VERSION detected, but $REQUIRED_VERSION+ is recommended"
            return 1
        fi
    else
        print_error "Node.js is not installed"
        return 1
    fi
}

# Function to setup Python environment
setup_python() {
    print_status "Setting up Python environment..."
    
    cd backend
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
        print_success "Virtual environment created"
    else
        print_status "Virtual environment already exists"
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Upgrade pip
    print_status "Upgrading pip..."
    pip install --upgrade pip
    
    # Install requirements
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    print_success "Python environment setup complete"
    cd ..
}

# Function to setup Node.js environment
setup_node() {
    print_status "Setting up Node.js environment..."
    
    cd frontend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing Node.js dependencies..."
        npm install
        print_success "Node.js dependencies installed"
    else
        print_status "Node.js dependencies already installed"
    fi
    
    print_success "Node.js environment setup complete"
    cd ..
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    cd backend
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Create database tables
    print_status "Creating database tables..."
    python -c "
from database import engine, Base
Base.metadata.create_all(bind=engine)
print('Database tables created successfully')
"
    
    print_success "Database setup complete"
    cd ..
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Backend tests
    cd backend
    source venv/bin/activate
    
    if [ -d "tests" ]; then
        print_status "Running backend tests..."
        python -m pytest tests/ -v || print_warning "Some backend tests failed"
    else
        print_status "No backend tests found"
    fi
    
    cd ..
    
    # Frontend tests
    cd frontend
    if [ -d "src" ]; then
        print_status "Running frontend tests..."
        npm test -- --watchAll=false || print_warning "Some frontend tests failed"
    else
        print_status "No frontend tests found"
    fi
    
    cd ..
    
    print_success "Tests completed"
}

# Function to show setup summary
show_summary() {
    echo ""
    echo "=========================================="
    echo "           SETUP COMPLETE!               "
    echo "=========================================="
    echo ""
    echo "🎉 Your Stock Market Dashboard is ready!"
    echo ""
    echo "📁 Project Structure:"
    echo "  ├── backend/          # FastAPI backend"
    echo "  ├── frontend/         # React frontend"
    echo "  ├── scripts/          # Utility scripts"
    echo "  └── Dockerfile        # Container config"
    echo ""
    echo "🚀 Quick Start Commands:"
    echo "  ./scripts/start.sh start     # Start both services"
    echo "  ./scripts/start.sh docker    # Start with Docker"
    echo "  ./scripts/start.sh backend   # Start backend only"
    echo "  ./scripts/start.sh frontend  # Start frontend only"
    echo ""
    echo "🌐 Access Points:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo ""
    echo "📚 Next Steps:"
    echo "  1. Start the application: ./scripts/start.sh start"
    echo "  2. Open http://localhost:3000 in your browser"
    echo "  3. Select a company to view stock data"
    echo "  4. Explore AI predictions and charts"
    echo ""
    echo "🔧 Development:"
    echo "  - Backend code: backend/"
    echo "  - Frontend code: frontend/src/"
    echo "  - Database: backend/stock_dashboard.db"
    echo ""
    echo "📖 Documentation: README.md"
    echo ""
}

# Main setup function
main() {
    echo "=========================================="
    echo "    Stock Market Dashboard Setup"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    PYTHON_OK=false
    NODE_OK=false
    
    if check_python_version; then
        PYTHON_OK=true
    fi
    
    if check_node_version; then
        NODE_OK=true
    fi
    
    if [ "$PYTHON_OK" = false ] || [ "$NODE_OK" = false ]; then
        print_error "Prerequisites not met. Please install required versions:"
        echo "  - Python 3.11+"
        echo "  - Node.js 18+"
        echo "  - npm"
        exit 1
    fi
    
    print_success "All prerequisites are satisfied"
    echo ""
    
    # Setup environments
    if [ "$PYTHON_OK" = true ]; then
        setup_python
        echo ""
    fi
    
    if [ "$NODE_OK" = true ]; then
        setup_node
        echo ""
    fi
    
    # Setup database
    setup_database
    echo ""
    
    # Run tests (optional)
    read -p "Would you like to run tests? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_tests
        echo ""
    fi
    
    # Show summary
    show_summary
}

# Run main function
main "$@"
