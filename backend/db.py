import os
import mysql.connector


def get_connection():
    """
    Creates a new connection to the MySQL sakila database.
    Set these env vars if you want:
      SAKILA_HOST, SAKILA_USER, SAKILA_PASSWORD, SAKILA_DB
    """
    return mysql.connector.connect(
        host=os.getenv("SAKILA_HOST", "localhost"),
        user=os.getenv("SAKILA_USER", "root"),
        password=os.getenv("SAKILA_PASSWORD", ""),
        database=os.getenv("SAKILA_DB", "sakila"),
    )


def query_all(sql: str, params: tuple = ()):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(sql, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


def query_one(sql: str, params: tuple = ()):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(sql, params)
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row


def execute(sql: str, params: tuple = ()):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(sql, params)
    conn.commit()
    affected = cur.rowcount
    cur.close()
    conn.close()
    return affected
