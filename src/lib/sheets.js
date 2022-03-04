import { google } from 'googleapis';

const sheets = google.sheets('v4');

async function authorize() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );

  await auth.authorize();

  return auth;
}

function parse(rows, fields) {
  const headings = rows[0].map((field) => field.trim());

  return rows
    .slice(1)
    .map((row, i) =>
      Object.assign(
        { id: i },
        ...headings.map((heading, j) =>
          fields[heading] ? { [fields[heading]]: row[j] } : {}
        )
      )
    );
}

const client = {
  get auth() {
    if (!this._auth) {
      this._auth = authorize();
    }

    return this._auth;
  },

  async get(spreadsheetId, range) {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      auth: await this.auth,
      valueRenderOption: 'UNFORMATTED_VALUE',
      majorDimension: 'ROWS',
      range,
    });

    return data.values;
  },
};

export default {
  async getRaw() {
    const rows = await client.get(
      process.env.RAW_SPREADSHEET_ID,
      process.env.RAW_SHEET_NAME
    );

    return parse(rows, {
      'Reporting Account Name': 'account',
      'Asset Type Name': 'assetType',
      'Asset Type Category': 'assetCategory',
      'Security Description 1': 'description1',
      'Security Description 2': 'description2',
      'Ticker': 'ticker',
      'Cusip': 'cusip',
      'ISIN': 'isin',
      'Country of Issue Name': 'country',
      'Units': 'units',
      'Market Value': 'marketValue',
    });
  },

  async getMetadata() {
    const rows = await client.get(
      process.env.METADATA_SPREADSHEET_ID,
      process.env.METADATA_SHEET_NAME
    );

    return parse(rows, {
      'Oil & Gas': 'oilGas',
      'Coal': 'coal',
      'Ticker': 'ticker',
      'Note': 'note',
      'News #1': 'news1',
      'News #2': 'news2',
      'Dossier Link': 'link',
    }).reduce((output, item) => {
      if (item.ticker) {
        output[item.ticker] = item;
      }

      return output;
    }, {});
  },
};
