# Cross Origin Finder

In order to implement cross origin security in replay iframes, we need to identify all potential cross origins on a client's website. This is a list of domains that are being loaded from a different origin than the main website.

The best way to find this list is to parse domains upon processing of recording data. Domains not on the whitelist or blacklist will be presented to the client when they access the admin panel, where they can be added to the whitelist or blacklist. When viewing a replay, the domains that are not on the whitelist will be shown to the client as a warning of what the user was up to.