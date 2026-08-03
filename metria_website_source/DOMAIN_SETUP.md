# Metria Custom Domain Setup

Sites is configured for:

- `metria.com`
- `www.metria.com`

Both domains are pending DNS validation. They will not work until the owner of `metria.com` adds the DNS records below at the domain registrar or DNS provider.

## DNS Records for metria.com

Add these records:

| Type | Name | Value |
| --- | --- | --- |
| TXT | `_openai-site-verification.metria.com` | `openai-site-verification=QRqG2hz2gVTQ5VRZAiF7tpNHtciCIImV1ihxPCi_BIs` |
| TXT | `_cf-custom-hostname.metria.com` | `b980af94-bf02-4538-a27a-14e11f7ce82b` |
| A | `metria.com` | `162.159.143.30` |
| A | `metria.com` | `172.66.3.26` |

## DNS Records for www.metria.com

Add these records:

| Type | Name | Value |
| --- | --- | --- |
| TXT | `_openai-site-verification.www.metria.com` | `openai-site-verification=H7kPVQwlrLaCmPHYR13l4tcujHH0um5aqYTpK9hrZI8` |
| TXT | `_cf-custom-hostname.www.metria.com` | `38ce8784-6369-439c-8216-86c3e8be6da5` |
| CNAME | `www.metria.com` | `custom-domains.chatgpt.site.` |

## After Adding DNS

1. Wait for DNS propagation.
2. Refresh the custom-domain status in Sites.
3. Wait for SSL status to become active.
4. Test `https://metria.com` and `https://www.metria.com`.

## Important

If you do not own `metria.com`, these records cannot be added and the domain cannot point to this site. In that case, buy the domain, acquire it from the current owner, or use another brand/domain.
