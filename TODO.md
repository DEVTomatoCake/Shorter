# Sh0rt.zip TODO

partly in German because the devs are German, deal with it

- benutzernamen regex? `/^[a-z]([a-z0-9-]*[a-z0-9])?$/`
- Login mit WebAuthn/FIDO2, entweder eigenes Backend oder mit Bitwarden Passwordless

Angemeldete Nutzer:
- Erstellen
- Löschen
	- Mehrfachauswahl
- Import & Export in
	- JSON
	- CSV
- Suche
- Bearbeiten der Links
	- Ziel-URI
	- UTM-Header für Shortlink erstellen
		- Referral (ref): The website that is sending traffic to your link
		- UTM Source (utm_source): The source of your traffic (e.g. Facebook, Twitter, etc.)
		- UTM Medium (utm_medium): The medium of your traffic (e.g. social, email, etc.)
		- UTM Campaign (utm_campaign): The name of your campaign (e.g. summer2023)
		- UTM Term (utm_term): The term of your campaign (e.g. running+shoes)
		- UTM Content (utm_content): The content of your campaign (e.g. logo+link)
	- Analytics (Standardmäßig aus) für Aufrufe pro Tag
	- Passwortschutz
		- Möglichkeit, mit dem Link-Hash #... direkt das Passwort im Link mitzugeben
	- HTTP-Redirectstatus 301 302 307 308 (Standardmäßig 302)
	- Referrer-Header senden (Standardmäßig an) mit no-referrer
	- Open graph control: Custom title, description, image
	- Tags hinzufügen und danach filtern können
	- Kommentare pro URL
	- Massenbearbeitung
	- Linkvorschau direkt oder Link zu dc-devportal https://discord.com/developers/embeds?url=https%253A%252F%252Fsh0rt.zip
- API-Key
- Teams
	- Erstellen
	- Einladen anhand von Benutzername
	- Rechteverwaltung
		- Nur ansehen
		- Erstellen
		- Bearbeiten
		- Löschen
	- Black- bzw. Whitelist für Domains, für die Shortlinks erstellt werden dürfen

- Wenn Link nicht gefunden custom HTMLseite mit link zu startseite
- /report zum Melden von Links
- cf Turnstile im hintergrund?
- Kleine Dateien teilen
- If a submitted URL is a redirect, the final destination is stored to avoid nested redirects
- zufällige wörter statt zeichen als option
	- länge der zeichen und characterset festlegen können: a-z A-Z 0-9 zerowidthzeichen tiernamen objektnamen emojis usw.
	- https://github.com/ozh/yourls-word-based-short-urls/raw/master/nouns.txt https://github.com/cfultz/Fancy-Animal-Short-Urls/raw/main/adjectives.txt https://github.com/cfultz/Fancy-Animal-Short-Urls/raw/main/colors.txt https://github.com/cfultz/Fancy-Animal-Short-Urls/raw/main/animals.txt
- Shortcuts für Linkerstellung (Tastenkombination, Unterstützung für Strg + V überall zum Öffnen eines Popups)
- Device targeting: Pro Gerätetyp (Android, iOS, ...) eine individuelle Ziel-URL, z. B. für Appstore-Links. Wenn nicht sicher oder fehlt wird die Standard-URL verwendet.
- Backup für Cloudflare-KV
	- Langfristig andere DB
- Ein vernünftiges Logo/Icon, vor allem für Manifest/PWA notwendig
