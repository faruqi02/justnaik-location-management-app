

------------------------------------
-------------MySQL Setup-------------
------------------------------------
CREATE DATABASE justnaik;
USE justnaik;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_status ENUM('online','offline') DEFAULT 'offline',
    ip_address VARCHAR(45)
);

CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    lat DOUBLE NOT NULL,
    lng DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
------------------------------------
            *IMPORTANT*
------------------------------------
Make sure change the backend/.env 
to your DB_PASSWORD, DB_NAME and JW_SECRET



------------------------------------
-------------How to Run-------------
------------------------------------
            <<backend>>
------------------------------------
cd backend
npm install
npm run dev
------------------------------------
            <<frontend>>
------------------------------------
cd frontend
npm install
npm start
------------------------------------