from flask import Flask, request
from flask_cors import CORS

from db import query_all, query_one, execute

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health():
    return {"status": "ok"}

# Search customer by ID
# app.get Gets the details
# Edge case: If no customer, 404
@app.get("/customersearch/<int:customer_id>")
def get_customer(customer_id: int):
    customer = query_one("SELECT customer_id, first_name, last_name, email FROM customer WHERE customer_id = %s", (customer_id,))
    if customer is None:
        return {"error": "Customer not found"}, 404
    return customer

@app.get("/customers/search")
def search_customers():
    q = request.args.get("q", "").strip()

    if q == "":
        return []

    like = f"%{q}%"

    # If q is a number, allow id match too
    if q.isdigit():
        sql = """
        SELECT customer_id, first_name, last_name, email
        FROM customer
        WHERE customer_id = %s
           OR first_name LIKE %s
           OR last_name LIKE %s
        ORDER BY customer_id
        LIMIT 50
        """
        return query_all(sql, (int(q), like, like))
    else:
        sql = """
        SELECT customer_id, first_name, last_name, email
        FROM customer
        WHERE first_name LIKE %s
           OR last_name LIKE %s
        ORDER BY customer_id
        LIMIT 50
        """
        return query_all(sql, (like, like))

# Adding a new customer to the database
# app.post Needs first,last, and email
# Edge case: On missing field, return error.
@app.post("/customeradd")
def add_customer():
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")

    if not first_name or not last_name or not email:
        return {"error": "First name, last name, and email are required"}, 400

    affected = execute(
        """
        INSERT INTO customer (first_name, last_name, email, store_id, address_id) 
        VALUES (%s, %s, %s, %s, %s)
        """, 
        (first_name, last_name, email, 1, 1)
    )
    
    if affected == 0:
        return {"error": "Failed to add customer"}, 500
        
    return {"status": "added", "first_name": first_name, "last_name": last_name, "email": email}

# Removing a customer from the database
# app.delete Delete the customer ID
# Edge case: If they don't exist, 404
@app.delete("/customerdelete/<int:customer_id>")
def delete_customer(customer_id: int):
    affected = execute("DELETE FROM customer WHERE customer_id = %s", (customer_id,))
    if affected == 0:
        return {"error": "Customer not found"}, 404
    return {"status": "deleted", "customer_id": customer_id}

# Edit a customer's email or name
# app.put Edits the customer's name, email, using their unique ID
# Edge case: If they don't exist, 404.
@app.put("/customeredit/<int:customer_id>")
def edit_customer(customer_id: int):
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")

    if not first_name and not last_name and not email:
        return {"error": "At least one of first_name, last_name, or email must be provided"}, 400

    fields = []
    params = []
    if first_name:
        fields.append("first_name = %s")
        params.append(first_name)
    if last_name:
        fields.append("last_name = %s")
        params.append(last_name)
    if email:
        fields.append("email = %s")
        params.append(email)
    params.append(customer_id)

    sql = f"UPDATE customer SET {', '.join(fields)} WHERE customer_id = %s"
    affected = execute(sql, tuple(params))
    if affected == 0:
        return {"error": "Customer not found or no changes made"}, 404
    return {"status": "updated", "customer_id": customer_id}

# Rent a film to a customer
# app.post Rents a film to a customer using their ID and the film ID
# Edge case: If either ID is missing, 404.
# Edge case: If no copies of the film, 404. 
@app.post("/rentals/rent")
def rent_film():
    data = request.get_json()
    customer_id = data.get("customer_id")
    film_id = data.get("film_id")

    if not customer_id or not film_id:
        return {"error": "customer_id and film_id are required"}, 400

    inventory = query_one(
        """
        SELECT inventory_id 
        FROM inventory 
        WHERE film_id = %s 
          AND inventory_id NOT IN (
              SELECT inventory_id FROM rental WHERE return_date IS NULL
          )
        LIMIT 1
        """,
        (film_id,),
    )

    if inventory is None:
        return {"error": "No available copies of the film"}, 400

    inventory_id = inventory["inventory_id"]

    affected = execute(
        """
        INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id)
        VALUES (NOW(), %s, %s, 1)
        """,
        (inventory_id, customer_id),
    )

    if affected == 0:
        return {"error": "Failed to create rental"}, 500

    return {"status": "rented", "customer_id": customer_id, "film_id": film_id}


# --- Landing page features ---

@app.get("/films/top")
def top_5_films():
    sql = """
    SELECT f.film_id, f.title, COUNT(r.rental_id) AS rentals
    FROM film f
    JOIN inventory i ON f.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    GROUP BY f.film_id
    ORDER BY rentals DESC
    LIMIT 5
    """
    return query_all(sql)


@app.get("/films/<int:film_id>")
def film_details(film_id: int):
    sql = """
    SELECT film_id, title, description, release_year, rental_rate, length, rating
    FROM film
    WHERE film_id = %s
    """
    film = query_one(sql, (film_id,))
    if film is None:
        return {"error": "Film not found"}, 404
    return film


@app.get("/actors/top")
def top_5_actors():
    # Top actors by total rentals of films they appear in
    sql = """
    SELECT a.actor_id, a.first_name, a.last_name, COUNT(r.rental_id) AS rentals
    FROM actor a
    JOIN film_actor fa ON a.actor_id = fa.actor_id
    JOIN inventory i ON fa.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    GROUP BY a.actor_id
    ORDER BY rentals DESC
    LIMIT 5
    """
    return query_all(sql)


@app.get("/actors/<int:actor_id>")
def actor_details(actor_id: int):
    actor = query_one(
        "SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = %s",
        (actor_id,),
    )
    if actor is None:
        return {"error": "Actor not found"}, 404

    top_films = query_all(
        """
        SELECT f.film_id, f.title, COUNT(r.rental_id) AS rentals
        FROM film f
        JOIN film_actor fa ON f.film_id = fa.film_id
        JOIN inventory i ON f.film_id = i.film_id
        JOIN rental r ON i.inventory_id = r.inventory_id
        WHERE fa.actor_id = %s
        GROUP BY f.film_id
        ORDER BY rentals DESC
        LIMIT 5
        """,
        (actor_id,),
    )

    return {"actor": actor, "top_films": top_films}


# --- Films page features ---

@app.get("/films/search")
def search_films():
    q = request.args.get("q", "").strip()
    if q == "":
        return []

    like = f"%{q}%"
    sql = """
    SELECT DISTINCT f.film_id, f.title
    FROM film f
    LEFT JOIN film_actor fa ON f.film_id = fa.film_id
    LEFT JOIN actor a ON fa.actor_id = a.actor_id
    LEFT JOIN film_category fc ON f.film_id = fc.film_id
    LEFT JOIN category c ON fc.category_id = c.category_id
    WHERE f.title LIKE %s
       OR a.first_name LIKE %s
       OR a.last_name LIKE %s
       OR c.name LIKE %s
    ORDER BY f.title
    LIMIT 50
    """
    return query_all(sql, (like, like, like, like))


# --- Customer page starter endpoints ---

@app.get("/customers")
def list_customers():
    page = int(request.args.get("page", 1))
    size = int(request.args.get("size", 1000))
    page = max(page, 1)
    size = min(max(size, 1), 1000)

    offset = (page - 1) * size

    return query_all(
        """
        SELECT customer_id, first_name, last_name, email
        FROM customer
        ORDER BY customer_id
        LIMIT %s OFFSET %s
        """,
        (size, offset)
    )

@app.get("/customers/<int:customer_id>")
def customer_details(customer_id: int):
    customer = query_one(
        """
        SELECT customer_id, first_name, last_name, email, active, create_date
        FROM customer
        WHERE customer_id = %s
        """,
        (customer_id,),
    )
    if customer is None:
        return {"error": "Customer not found"}, 404

    rentals = query_all(
        """
        SELECT r.rental_id, f.film_id, f.title, r.rental_date, r.return_date
        FROM rental r
        JOIN inventory i ON r.inventory_id = i.inventory_id
        JOIN film f ON i.film_id = f.film_id
        WHERE r.customer_id = %s
        ORDER BY r.rental_date DESC
        LIMIT 200
        """,
        (customer_id,),
    )

    return {"customer": customer, "rentals": rentals}


@app.post("/rentals/return/<int:rental_id>")
def return_rental(rental_id: int):
    affected = execute(
        "UPDATE rental SET return_date = NOW() WHERE rental_id = %s AND return_date IS NULL",
        (rental_id,),
    )
    if affected == 0:
        return {"error": "Rental not found or already returned"}, 404
    return {"status": "returned", "rental_id": rental_id}


if __name__ == "__main__":
    app.run(debug=True)
