# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [3.2.0] - 2019-05-02

Added WebAuthn support to the Ledger plugin and consolidated transport instances. 

walletProviders: [ scatter(), ledger({exchangeTimeout : 30000, transport: 'TransportWebAuthn'}) ]

ledger plugin now take a parmam called transport which can be one of 'TransportWebAuthn' or 'TransportU2F'. Default is 'TransportU2F'


## [3.1.4] - 2019-05-01

Added timeout parameter exchangeTimeout to the ledger plugin - to specify a u2f timeout that should be used when the ledger is signing transaction, create the object as follows: ledger({exchangeTimeout : 30000}). Default is 5000 (5 seconds).

## [3.1.3] - 2019-05-01

Added ledger support for multiple actions withing a transaction. 

## [3.1.0] - 2019-04-30

Upgraded all packages to eosjs@20.0.0

## [3.0.6] - 2019-04-10

### Fixed 
- Code improvement provided by @Bootl3r - fixes the meet.one detection. 

## [3.0.5] - 2019-04-06

### Fixed 
- Meet.one plugin connect() fixed such that it will only resolve once the wallet is detected. If after 5 seconds it is not detected it'll resolve false.


## [3.0.3] - 2019-04-04

### Added 
- Meet.one plugin 
- Added this Changelog
- README to each package so that that NPM gets something logical

