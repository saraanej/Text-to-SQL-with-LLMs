import sqlite3
import pandas as pd
import os

db_id = "chinook"
db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'Chinook_Sqlite.sqlite'))


chinook_schema = """"
album: AlbumId (PK), Title, ArtistId (FK → Artist.ArtistId)
artist: ArtistId (PK), Name
customer: CustomerId (PK), FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId (FK → Employee.EmployeeId)
employee: EmployeeId (PK), LastName, FirstName, Title, ReportsTo (FK → Employee.EmployeeId), BirthDate, HireDate, Address, City, State, Country, PostalCode, Phone, Fax, Email
genre: GenreId (PK), Name
invoice: InvoiceId (PK), CustomerId (FK → Customer.CustomerId), InvoiceDate, BillingAddress, BillingCity, BillingState, BillingCountry, BillingPostalCode, Total
invoiceline: InvoiceLineId (PK), InvoiceId (FK → Invoice.InvoiceId), TrackId (FK → Track.TrackId), UnitPrice, Quantity
mediatype: MediaTypeId (PK), Name
playlist: PlaylistId (PK), Name
playlisttrack: PlaylistId (PK), TrackId (PK), PlaylistId (FK → Playlist.PlaylistId), TrackId (FK → Track.TrackId)
track: TrackId (PK), Name, AlbumId (FK → Album.AlbumId), MediaTypeId (FK → MediaType.MediaTypeId), GenreId (FK → Genre.GenreId), Composer, Milliseconds, Bytes, UnitPrice
"""

def run_query(db_path, query):

    conn = None
    try:
        # Clean up SQL formatting
        conn = sqlite3.connect(db_path)
        df = pd.read_sql_query(query, conn)
        print("\n📊 Query Results:")
        print(df.head)
        return df
    except Exception as e:
        print("❌ Error running query:", e)
        return None
    finally:
        if conn:
            conn.close()



