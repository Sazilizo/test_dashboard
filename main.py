#!/usr/bin/env python3
"""
A simple test dashboard application.
"""


def main():
    """Main function for the test dashboard."""
    print("Welcome to the Test Dashboard!")
    print("This is a simple demonstration application.")

    dashboard_items = [
        "System Status: Online",
        "Active Users: 42",
        "Server Load: 15%",
        "Memory Usage: 68%"
    ]

    print("\n--- Dashboard ---")
    for item in dashboard_items:
        print(f"• {item}")


if __name__ == "__main__":
    main()
