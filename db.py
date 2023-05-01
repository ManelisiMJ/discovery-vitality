import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to the database
connection = pymysql.connect(
    host=os.getenv("db_host"),
    user='root',
    password=os.getenv("password"),
    db=os.getenv("db_name"),
cursorclass=pymysql.cursors.DictCursor)

def validateUser(id, password):
    # Get users table from the database
    with connection.cursor() as cursor:
        sql = "SELECT * FROM users WHERE id=%s and password=%s"
        affected = cursor.execute(sql, (id, password))
        return affected
    
def validateEmployee(id, password):
    # Get users table from the database
    with connection.cursor() as cursor:
        sql = "SELECT * FROM employees WHERE id=%s and password=%s"
        affected = cursor.execute(sql, (id, password))
        return affected
        
def checkUser(id):
    # Get users table from the database
    with connection.cursor() as cursor:
        sql = "SELECT * FROM users WHERE id=%s "
        affected = cursor.execute(sql, (id))
        return affected
    
def getUserDetails(id):
    with connection.cursor() as cursor:
        sql = "SELECT * FROM users WHERE id=%s "
        cursor.execute(sql, (id))
        if cursor.rowcount >= 1:
            for row in cursor:
                return row

def getEmployeeDetails(id):
    with connection.cursor() as cursor:
        sql = "SELECT * FROM employees WHERE id=%s "
        cursor.execute(sql, (id))
        if cursor.rowcount >= 1:
            for row in cursor:
                return row

# def getEmployees():
#     # Get users table from the database
#     with connection.cursor() as cursor:
#         sql = "SELECT * FROM employees"
#         employees = cursor.execute(sql)
#         print(employees)

def insertUser(name, surname, password):
    # Insert user into the database
    with connection.cursor() as cursor:
        sql = "INSERT INTO users (name, surname, password, status) VALUES (%s, %s, %s)"
        affected = cursor.execute(sql, (name, surname, password))
        connection.commit()
        print(affected, "rows affected")
        return (affected == 1)

#def insertEmployee():
    # # Insert employee into the database
    # with connection.cursor() as cursor:
     
    #     sql = "INSERT INTO emplyees (name, surname,password) VALUES (%s, %s, %s)"
    #     cursor.execute(sql, ("Austin", "BAVVV","123"))
    #     connection.commit()
