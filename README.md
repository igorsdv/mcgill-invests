# mcgillinvests.in

## Configuration

### Environment variables

- `GOOGLE_CLIENT_EMAIL` - Google service account email
- `GOOGLE_PRIVATE_KEY` - Google service account key
- `RAW_SPREADSHEET_ID` - raw data Google Sheets document ID
- `RAW_SHEET_NAME` - raw data sheet name
- `METADATA_SPREADSHEET_ID` - metadata Google Sheets documents ID
- `METADATA_SHEET_NAME` - metadata sheet name
- `AUTH_TOKEN` - bearer token for authenticated routes

An `.env` file can be used for development.

### Configuration files

- `config/definitions.yml` - view definitions
- `config/transforms.yml` - asset field transforms

### Asset types included by description

These asset types are not sufficiently specific. The corresponding views are defined using the asset description field instead of the asset type.

- `MATERIALS (CANADIAN)`
- `YANKEE BONDS`

## Build and run

Use the `next` command (refer to Next.js documentation).
