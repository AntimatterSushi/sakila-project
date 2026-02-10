from flask import Flask, request
from flask_cors import CORS

from db import query_all, query_one, execute

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health():
    return {"status": "ok"}


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
    # simple list for now, you can add pagination later
    return query_all(
        "SELECT customer_id, first_name, last_name, email FROM customer ORDER BY customer_id LIMIT 200"
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
