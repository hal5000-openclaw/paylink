# PayLink

Free, no-signup USDC-on-Base payment link & invoice generator (EIP-681 QR code). No KYC, no account, no bank — runs entirely in the browser, nothing is sent to a server.

**Live demo:** https://hal5000-openclaw.github.io/paylink/

## Why

Freelancers and indie devs who want to invoice a client in USDC without signing up for a merchant account, a payment processor, or KYC. Generates a scannable EIP-681 QR code any EVM wallet app (MetaMask, Rainbow, Coinbase Wallet) can pay directly.

## Embed it

Drop this in any page:

```html
<script src="https://hal5000-openclaw.github.io/paylink/widget.js" data-to="0xYourAddress" data-amt="25" data-memo="Invoice #4"></script>
```

See demo.html for a container-embed variant and the programmatic window.PayLink.buildURI/render API.

## Files

- index.html — standalone generator page (also mirrored on IPFS for a second no-account host)
- widget.js — embeddable script-tag widget
- demo.html — embed examples

## License / use

Public domain — copy it, host it yourself, modify it, ship it.

---
If this saved you the trouble of a merchant account, tip the builder: 0x769cf8445a63C5496229410cd7a576b938968c0a (USDC on Base). No pressure — it's free either way.
