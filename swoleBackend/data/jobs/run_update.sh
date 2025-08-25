#!/bin/bash

# Swole Routine Update Job Runner
# This script sets up the environment and runs the routine update job

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}🏋️  Swole Routine Update Job${NC}"
echo "================================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

# Check if virtual environment exists
VENV_DIR="$SCRIPT_DIR/.venv"
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}📦 Creating Python virtual environment...${NC}"
    python3 -m venv "$VENV_DIR"
fi

# Activate virtual environment
echo -e "${BLUE}🔧 Activating virtual environment...${NC}"
source "$VENV_DIR/bin/activate"

# Install/update dependencies
echo -e "${BLUE}📥 Installing Python dependencies...${NC}"
pip install -r "$SCRIPT_DIR/requirements.txt" --quiet

# Load environment variables from root .env file
ENV_FILE="$ROOT_DIR/.env"
if [ -f "$ENV_FILE" ]; then
    echo -e "${BLUE}🔑 Loading environment variables from $ENV_FILE${NC}"
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo -e "${YELLOW}⚠️  No .env file found at $ENV_FILE, using defaults${NC}"
fi

# Check database connection
echo -e "${BLUE}🔗 Checking database connection...${NC}"
python3 -c "
import psycopg2
import os
try:
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'postgres'),
        database=os.getenv('DB_NAME', 'swole_db')
    )
    conn.close()
    print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
    exit(1)
"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database connection test failed${NC}"
    echo -e "${YELLOW}💡 Make sure PostgreSQL is running: docker-compose up -d${NC}"
    exit 1
fi

# Parse command line arguments
DRY_RUN=""
VERBOSE=""
YAML_FILE="$SCRIPT_DIR/routines/routines.yaml"

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN="--dry-run"
            shift
            ;;
        --verbose|-v)
            VERBOSE="--verbose"
            shift
            ;;
        --file)
            YAML_FILE="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo
            echo "Options:"
            echo "  --dry-run    Preview changes without updating database"
            echo "  --verbose    Enable verbose logging"
            echo "  --file FILE  Use custom YAML file (default: routines/routines.yaml)"
            echo "  --help       Show this help message"
            echo
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Check if YAML file exists
if [ ! -f "$YAML_FILE" ]; then
    echo -e "${RED}❌ YAML file not found: $YAML_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Using YAML file: $YAML_FILE${NC}"

# Run the update job
echo -e "${GREEN}🚀 Running routine update job...${NC}"
echo

if [ -n "$DRY_RUN" ]; then
    echo -e "${YELLOW}🔍 DRY RUN MODE - No changes will be made${NC}"
fi

python3 "$SCRIPT_DIR/update_routines.py" --file "$YAML_FILE" $DRY_RUN $VERBOSE

if [ $? -eq 0 ]; then
    echo
    echo -e "${GREEN}✅ Routine update job completed successfully!${NC}"
    
    if [ -z "$DRY_RUN" ]; then
        echo -e "${BLUE}🔄 Restart your Go API server to see changes${NC}"
        echo -e "${BLUE}💡 Test the API: curl http://localhost:8080/api/routines${NC}"
    fi
else
    echo
    echo -e "${RED}❌ Routine update job failed${NC}"
    exit 1
fi