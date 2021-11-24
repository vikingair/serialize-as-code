# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2021-11-24
### Changed
- Serializing `window` and `document` as globals

### Fixed
- Serializing some properties of the `document` where causing errors by accessing the
  constructor which some of them didn't have.

## [2.0.0] - 2021-08-26
### Fixed
- Serializing of HTMLElements created by `jest-dom` caused infinite loops and now serialized
  only by their constructor names.

## [1.2.0] - 2019-08-15
### Added
- BigInt and AsyncFunction serialization

## [1.1.0] - 2019-03-26
### Added
- Native Map and Set serialization

## [1.0.3] - 2018-08-20
### Changed
- Improved Symbol serialization
