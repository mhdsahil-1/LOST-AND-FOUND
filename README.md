# Lost & Found Campus Network

The Lost & Found Campus Network is a web-based application designed to help students and staff report and reclaim lost items within the campus. The system provides a centralized platform for posting lost and found items, making it easier to reunite owners with their belongings.

This project is built using PHP for the backend and stores data in JSON format, eliminating the need for a traditional database like MySQL. This makes the application lightweight, portable, and easy to deploy.

## Features

### Student Features

- **User Authentication**: Simple login system using student ID.
- **Browse Items**: View a list of all lost and found items posted by other users.
- **Report Items**: Submit details about lost or found objects, including descriptions, locations, and images.
- **My Posts**: Track and manage the items you have reported.
- **Claims**: Contact the finder or report an item as claimed.

### Admin Features

- **Dashboard**: Overview of total items, lost vs. found statistics, and recent activity.
- **Item Verification**: Review and approve user posts before they become visible to the public.
- **Content Management**: Edit or delete inappropriate or outdated posts.

## Installation

To run this project locally, follow these steps:

1. Ensure you have a local server environment installed (e.g., XAMPP, WAMP, or MAMP).
2. Download or clone this repository.
3. Place the project folder in your server's root directory (e.g., `htdocs` for XAMPP).
4. Start the Apache server.
5. Open your web browser and navigate to `http://localhost/lost-and-found/`.

## Default Access

The application comes with a pre-configured admin account for demonstration and management purposes:

- **Admin Login URL**: `http://localhost/lost-and-found/admin/login.php`
- **Username**: `admin`
- **Password**: `admin123`

## Future Scope & Roadmap

This project is currently in its initial version. The following features are planned for future updates to enhance functionality and user experience:

- **Database Integration**: Migrate from JSON to a relational database (MySQL) for better scalability and data integrity.
- **User Registration**: Implement a full registration system for students to create personalized accounts.
- **Email Notifications**: Automated email alerts when a lost item matches a found report.
- **Search Optimization**: Advanced search filters for dates, specific locations, and item categories.
- **Mobile Responsiveness**: Improve the UI to be fully responsive on all mobile devices.
- **Secure Image Handling**: Implement better validation and compression for image uploads.
- **Chat System**: A built-in messaging system to allow users to communicate securely without sharing personal contact details.

## License

This project is open-source and available for educational use.
