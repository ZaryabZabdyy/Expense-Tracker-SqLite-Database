# 📊 Zabdy's Expense Tracker – Smart Financial Management 

Zabdy's Expense Tracker is a secure, lightweight Full-Stack Web Application built to manage daily personal finances. Unlike basic trackers that use temporary browser arrays, this system implements a structured backend with direct relational data persistence. It allows multiple users to register private accounts, securely login, and explicitly track their expenditures across customized categories without any data interference.

---

## ✨ Key Features

* **🔒 Multi-User Isolation:** Built-in authentication system allowing multiple users to maintain entirely separate financial logs securely.
* **💾 Relational Data Persistence:** Structured storage powered by the SQLite Engine, eliminating data loss during server reboots or system shutdowns.
* **📂 Smart Expense Categorization:** Dynamic dropdown categorization (Food, Travel, Bills, Education, Entertainment) for clean data tracking.
* **⏰ Automated Timestamps:** Real-time generation metrics that automatically stamp every transaction and sort history lists dynamically by *Latest First*.
* **🗑️ Full CRUD Implementation:** Fully functional Create, Read, and Dynamic Row-Level Deletion running seamless asynchronous API calls.

---

## 🏗️ Database Structure & Schema

The data layer uses a relational **1-to-Many Relationship** (One specific user can add and manage multiple separate expense records) connected via physical foreign key constraints:

### 1. Users Table
Handles private user profiles and security access credentials.
| Column Name | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `User_ID` | INTEGER | PRIMARY KEY (Auto Increment) | Unique identification for each registered user. |
| `username` | TEXT | UNIQUE, NOT NULL | Unique account handle chosen during signup. |
| `Password` | TEXT | NOT NULL | Plain-text secure credential string. |

### 2. Expenses Table
Stores categorized transaction entries linked directly back to their respective owners.
| Column Name | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `Expense_ID`| INTEGER | PRIMARY KEY (Auto Increment) | Unique identification for each transaction. |
| `description`| TEXT    | NOT NULL | Name or details of the expense. |
| `amount`     | REAL     | NOT NULL | Price/cost value associated with the item. |
| `category`   | TEXT     | NOT NULL | Tag identifier (e.g., Food, Travel). |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Automatic record of the exact date and time. |
| `User_ID`    | INTEGER  | FOREIGN KEY ➔ `Users(User_ID)` | Maps the specific expense to the logged-in user. |

---

## 🔮 Future Enhancements & Roadmaps

To scale the application into an enterprise-level product, subsequent updates will include:
* **📊 Visual Analytical Dashboards:** Integrating clean frontend charting components to display interactive graphical spending summaries.
* **🛡️ JWT Session Authentication:** Replacing state hooks with standard JSON Web Token wrappers to maximize server route protections.
* **⚠️ Smart Budget Warnings:** Implementing strict individual budget bounds that trigger red warning colors when approaching high-risk limit scales.
