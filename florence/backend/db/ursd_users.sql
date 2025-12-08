CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    
    institution VARCHAR(150) NOT NULL,
    role ENUM(
        'dean', 
        'faculty', 
        'researcher', 
        'director', 
        'coordinator', 
        'staff',
        'cluster'
    ) NOT NULL,

    password_hash VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
