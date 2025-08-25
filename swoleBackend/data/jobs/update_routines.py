#!/usr/bin/env python3
"""
Swole Routine Update Job

This script reads routine definitions from YAML files and updates the PostgreSQL database.
It preserves user progress data while updating routine metadata.

Usage:
    python update_routines.py [--dry-run] [--file path/to/routines.yaml]
"""

import argparse
import logging
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional, Any

import psycopg2
import psycopg2.extras
import yaml
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class RoutineUpdater:
    def __init__(self, db_config: Dict[str, str]):
        self.db_config = db_config
        self.conn = None
        
    def connect(self):
        """Connect to PostgreSQL database."""
        try:
            self.conn = psycopg2.connect(
                host=self.db_config['host'],
                port=self.db_config['port'],
                user=self.db_config['user'],
                password=self.db_config['password'],
                database=self.db_config['database']
            )
            self.conn.autocommit = False
            logger.info("Connected to PostgreSQL database")
        except psycopg2.Error as e:
            logger.error(f"Failed to connect to database: {e}")
            raise
            
    def disconnect(self):
        """Close database connection."""
        if self.conn:
            self.conn.close()
            logger.info("Disconnected from database")
            
    def load_yaml_file(self, file_path: str) -> Dict[str, Any]:
        """Load and parse YAML file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = yaml.safe_load(file)
                logger.info(f"Loaded YAML file: {file_path}")
                return data
        except FileNotFoundError:
            logger.error(f"YAML file not found: {file_path}")
            raise
        except yaml.YAMLError as e:
            logger.error(f"Failed to parse YAML file: {e}")
            raise
            
    def get_existing_routines(self) -> Dict[str, str]:
        """Get existing routines from database."""
        with self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT id, name FROM routines")
            routines = cur.fetchall()
            return {routine['name']: routine['id'] for routine in routines}
            
    def delete_routine_workouts(self, routine_id: str):
        """Delete all workouts for a routine (preserves user progress)."""
        with self.conn.cursor() as cur:
            cur.execute("DELETE FROM workouts WHERE routine_id = %s", (routine_id,))
            deleted_count = cur.rowcount
            logger.info(f"Deleted {deleted_count} workouts for routine {routine_id}")
            
    def create_or_update_routine(self, routine_data: Dict[str, Any]) -> str:
        """Create a new routine or update existing one."""
        name = routine_data['name']
        description = routine_data.get('description')
        
        existing_routines = self.get_existing_routines()
        
        with self.conn.cursor() as cur:
            if name in existing_routines:
                # Update existing routine
                routine_id = existing_routines[name]
                cur.execute(
                    "UPDATE routines SET description = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (description, routine_id)
                )
                logger.info(f"Updated routine: {name}")
                
                # Delete existing workouts (we'll recreate them)
                self.delete_routine_workouts(routine_id)
            else:
                # Create new routine
                cur.execute(
                    "INSERT INTO routines (name, description) VALUES (%s, %s) RETURNING id",
                    (name, description)
                )
                routine_id = cur.fetchone()[0]
                logger.info(f"Created new routine: {name}")
                
        return routine_id
        
    def create_workout(self, routine_id: str, workout_data: Dict[str, Any]):
        """Create a workout for a routine."""
        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO workouts (
                    routine_id, name, type, exercise_type, weight, time, reps, sets, description
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                routine_id,
                workout_data['name'],
                workout_data.get('type'),
                workout_data['exercise_type'],
                workout_data.get('default_weight'),
                workout_data.get('default_time'),
                workout_data.get('reps'),
                workout_data.get('sets'),
                workout_data.get('description')
            ))
            
    def update_routines_from_yaml(self, yaml_data: Dict[str, Any], dry_run: bool = False):
        """Update all routines from YAML data."""
        routines = yaml_data.get('routines', [])
        
        if dry_run:
            logger.info("DRY RUN MODE - No changes will be made to database")
            
        logger.info(f"Processing {len(routines)} routines...")
        
        try:
            for routine_data in routines:
                routine_name = routine_data['name']
                workouts = routine_data.get('workouts', [])
                
                if dry_run:
                    logger.info(f"Would process routine: {routine_name} with {len(workouts)} workouts")
                    continue
                    
                # Create or update routine
                routine_id = self.create_or_update_routine(routine_data)
                
                # Create workouts
                for workout_data in workouts:
                    self.create_workout(routine_id, workout_data)
                    
                logger.info(f"Processed routine '{routine_name}' with {len(workouts)} workouts")
                
            if not dry_run:
                self.conn.commit()
                logger.info("All routines updated successfully!")
            else:
                logger.info("Dry run completed - no changes made")
                
        except Exception as e:
            if not dry_run:
                self.conn.rollback()
                logger.error("Transaction rolled back due to error")
            raise
            
    def create_default_user_if_not_exists(self):
        """Create default user if none exists."""
        with self.conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM users")
            user_count = cur.fetchone()[0]
            
            if user_count == 0:
                cur.execute("""
                    INSERT INTO users (email, name) 
                    VALUES ('user@example.com', 'Default User')
                """)
                logger.info("Created default user")
                
    def update_default_schedule(self, schedule_data: Dict[str, List[str]], dry_run: bool = False):
        """Update the default weekly schedule."""
        if dry_run:
            logger.info("Would update default schedule")
            return
            
        # This would update the default schedule for the default user
        # Implementation depends on your specific requirements
        logger.info("Default schedule update would be implemented here")


def get_db_config() -> Dict[str, str]:
    """Get database configuration from environment variables."""
    return {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': os.getenv('DB_PORT', '5432'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', 'postgres'),
        'database': os.getenv('DB_NAME', 'swole_db')
    }


def main():
    parser = argparse.ArgumentParser(description='Update workout routines from YAML file')
    parser.add_argument(
        '--file', 
        default='routines/routines.yaml',
        help='Path to YAML file (default: routines/routines.yaml)'
    )
    parser.add_argument(
        '--dry-run', 
        action='store_true',
        help='Preview changes without updating database'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose logging'
    )
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
        
    # Load environment variables
    load_dotenv()
    
    # Get database configuration
    db_config = get_db_config()
    
    try:
        # Initialize updater
        updater = RoutineUpdater(db_config)
        updater.connect()
        
        # Load YAML data
        yaml_data = updater.load_yaml_file(args.file)
        
        # Create default user if needed
        if not args.dry_run:
            updater.create_default_user_if_not_exists()
        
        # Update routines
        updater.update_routines_from_yaml(yaml_data, dry_run=args.dry_run)
        
        # Update default schedule if provided
        if 'default_schedule' in yaml_data:
            updater.update_default_schedule(yaml_data['default_schedule'], dry_run=args.dry_run)
            
        logger.info("Routine update job completed successfully")
        
    except Exception as e:
        logger.error(f"Job failed: {e}")
        sys.exit(1)
    finally:
        if 'updater' in locals():
            updater.disconnect()


if __name__ == '__main__':
    main()