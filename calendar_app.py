import sqlite3

# Creați o conexiune la baza de date
# Dacă baza de date nu există, aceasta va fi creată
conn = sqlite3.connect('calendar.db')

# Creați un cursor
c = conn.cursor()

# Creați tabelul rezervari
c.execute("""
CREATE TABLE IF NOT EXISTS rezervari (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nume TEXT,
    telefon TEXT,
    tip_rezervare TEXT,
    numar_oaspeti INTEGER,
    alte_detalii TEXT,
    camera TEXT,
    data_start TEXT,
    data_end TEXT
)
""")

# Închideți conexiunea la baza de date
conn.close()

def adauga_rezervare(nume, telefon, tip_rezervare, numar_oaspeti, alte_detalii, camera, data_start, data_end):
    conn = sqlite3.connect('calendar.db')
    c = conn.cursor()

    c.execute("""
    INSERT INTO rezervari (nume, telefon, tip_rezervare, numar_oaspeti, alte_detalii, camera, data_start, data_end)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (nume, telefon, tip_rezervare, numar_oaspeti, alte_detalii, camera, data_start, data_end))

    conn.commit()
    conn.close()

def obtine_rezervari():
    conn = sqlite3.connect('calendar.db')
    c = conn.cursor()

    c.execute("SELECT * FROM rezervari")
    rezervari = c.fetchall()

    conn.close()

    return rezervari
