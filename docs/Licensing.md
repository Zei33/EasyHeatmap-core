# Software Licensing

Enforcing licensing is very tricky with this kind of software. The reality is that PHP code is easy to modify for anybody with the skills to identify licensing checks. 

The best way to discourage hackers from cracking the software is to implement a multi-layer protection system.

## Code Obfuscation

Code will be minified and obfuscated to make it difficult to decipher where license checks are made. All files should be compiled into a single file using gulp or similar tools.

## License Certificate

Upon installation, the user will be required to login to our licensing server, which will generate a license certificate. The certificate will contain information linking the license to a specific user, as well as a specific domain name and expiration date.

This certificate is then stored in the database and will be checked in multiple places as the software performs key functions. It will also periodically check with the licensing server to ensure the certificate is still valid, although the software _should_ support offline use.

The certificate itself will use asymmetic encryption to prevent client side tampering, and a digital signature will ensure that if the certificate is modified, it will be detected.

```json
{
	"license_key": "abcd-1234-5678-9012",
	"domain": "example.com",
	"issued_at": "2025-01-01",
	"expires_at": "2025-01-01",
	"last_check": "2025-01-01"
}
```

> [!NOTE]
> The public key can be obfuscated by storing it in chunks and encoding it to make it less obvious to attackers.

## Code Substitution

When the license expires or is unable to be verified, the core code will be deleted from the server. A placeholder code will be left in place to allow the plugin to remain in a disabled state. The user will need to revalidate with the licensing server to restore the code. 

This is a controversial approach, but it ensures that if a user's license expires, they will not have access to the code in order to modify it and bypass the license checks. Worst case scenario, they pay for another year of the license and crack the code after that. However, since they have another year, they may not be motivated to crack the code until they need to renew their license again.

## Hosted Features

Some features should be hosted externally, forcing the user to connect to our servers and authenticate in order to use them. This will ensure that even if a user cracks their software, they will lose access to the features that are hosted externally without a valid license.

Features like anomaly detection and AI will be good candidates for this.

## Offline Grace Period

Could enforce a license check every month or two, allowing the user to use the software mostly offline. This could probably be stored in the certificate like `last_check` but that would require a renewal of the certificate each time. Could charge extra for longer grace period, or fully offline.

## Watermark / Code Fingerprint

A unique code should be included into the compiled code library. It could be added into the response headers or tracker somewhere, probably in multiple places. They will be retrievable from the JS injected into pages for recording. A program can be written to scrape this data from websites and identify code redistribution or misuse. This allows for the possibility of legal action.