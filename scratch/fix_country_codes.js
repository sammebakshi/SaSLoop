const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStart = 'const COUNTRY_CODES = [';
const targetEnd = '];';

const startIndex = content.indexOf(targetStart);
if (startIndex === -1) {
  console.error('Could not find COUNTRY_CODES start');
  process.exit(1);
}

// Find the first ]; after targetStart
const endIndex = content.indexOf(targetEnd, startIndex);
if (endIndex === -1) {
  console.error('Could not find COUNTRY_CODES end');
  process.exit(1);
}

const newBlock = `const getFlagEmoji = (countryCode) => {
  try {
    return String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => c.charCodeAt(0) + 127397));
  } catch (e) {
    return '';
  }
};

const COUNTRY_CODES = [
  { code: 'IN', dialCode: '+91', name: 'India' },
  { code: 'US', dialCode: '+1', name: 'United States' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom' },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia' },
  { code: 'QA', dialCode: '+974', name: 'Qatar' },
  { code: 'OM', dialCode: '+968', name: 'Oman' },
  { code: 'BH', dialCode: '+973', name: 'Bahrain' },
  { code: 'KW', dialCode: '+965', name: 'Kuwait' },
  { code: 'CA', dialCode: '+1', name: 'Canada' },
  { code: 'AU', dialCode: '+61', name: 'Australia' },
  { code: 'SG', dialCode: '+65', name: 'Singapore' },
  { code: 'MY', dialCode: '+60', name: 'Malaysia' },
  { code: 'PK', dialCode: '+92', name: 'Pakistan' },
  { code: 'BD', dialCode: '+880', name: 'Bangladesh' },
  { code: 'LK', dialCode: '+94', name: 'Sri Lanka' },
  { code: 'NP', dialCode: '+977', name: 'Nepal' },
  { code: 'DE', dialCode: '+49', name: 'Germany' },
  { code: 'FR', dialCode: '+33', name: 'France' },
  { code: 'IT', dialCode: '+39', name: 'Italy' },
  { code: 'ES', dialCode: '+34', name: 'Spain' },
  { code: 'NL', dialCode: '+31', name: 'Netherlands' },
  { code: 'CH', dialCode: '+41', name: 'Switzerland' },
  { code: 'SE', dialCode: '+46', name: 'Sweden' },
  { code: 'NO', dialCode: '+47', name: 'Norway' },
  { code: 'NZ', dialCode: '+64', name: 'New Zealand' },
  { code: 'ZA', dialCode: '+27', name: 'South Africa' },
  { code: 'JP', dialCode: '+81', name: 'Japan' },
  { code: 'CN', dialCode: '+86', name: 'China' },
  { code: 'HK', dialCode: '+852', name: 'Hong Kong' },
  { code: 'TH', dialCode: '+66', name: 'Thailand' },
  { code: 'PH', dialCode: '+63', name: 'Philippines' },
  { code: 'ID', dialCode: '+62', name: 'Indonesia' },
  { code: 'VN', dialCode: '+84', name: 'Vietnam' },
  { code: 'TR', dialCode: '+90', name: 'Turkey' },
  { code: 'RU', dialCode: '+7', name: 'Russia' },
  { code: 'BR', dialCode: '+55', name: 'Brazil' },
  { code: 'MX', dialCode: '+52', name: 'Mexico' },
  { code: 'AR', dialCode: '+54', name: 'Argentina' },
  { code: 'CO', dialCode: '+57', name: 'Colombia' },
  { code: 'CL', dialCode: '+56', name: 'Chile' },
  { code: 'PE', dialCode: '+51', name: 'Peru' },
  { code: 'EG', dialCode: '+20', name: 'Egypt' },
  { code: 'NG', dialCode: '+234', name: 'Nigeria' },
  { code: 'KE', dialCode: '+254', name: 'Kenya' },
  { code: 'IE', dialCode: '+353', name: 'Ireland' },
  { code: 'BE', dialCode: '+32', name: 'Belgium' },
  { code: 'AT', dialCode: '+43', name: 'Austria' },
  { code: 'DK', dialCode: '+45', name: 'Denmark' },
  { code: 'FI', dialCode: '+358', name: 'Finland' },
  { code: 'GR', dialCode: '+30', name: 'Greece' },
  { code: 'PL', dialCode: '+48', name: 'Poland' },
  { code: 'PT', dialCode: '+351', name: 'Portugal' },
  { code: 'UA', dialCode: '+380', name: 'Ukraine' },
  { code: 'RO', dialCode: '+40', name: 'Romania' },
  { code: 'CZ', dialCode: '+420', name: 'Czech Republic' },
  { code: 'HU', dialCode: '+36', name: 'Hungary' },
  { code: 'IL', dialCode: '+972', name: 'Israel' },
  { code: 'JO', dialCode: '+962', name: 'Jordan' },
  { code: 'LB', dialCode: '+961', name: 'Lebanon' },
  { code: 'MA', dialCode: '+212', name: 'Morocco' },
  { code: 'DZ', dialCode: '+213', name: 'Algeria' },
  { code: 'TN', dialCode: '+216', name: 'Tunisia' },
  { code: 'GH', dialCode: '+233', name: 'Ghana' },
  { code: 'UG', dialCode: '+256', name: 'Uganda' },
  { code: 'TZ', dialCode: '+255', name: 'Tanzania' },
  { code: 'MU', dialCode: '+230', name: 'Mauritius' }
].map(c => ({ ...c, flag: getFlagEmoji(c.code) }));`;

const replacedContent = content.substring(0, startIndex) + newBlock + content.substring(endIndex + targetEnd.length);
fs.writeFileSync(filePath, replacedContent, 'utf8');
console.log('Successfully fixed COUNTRY_CODES in App.jsx!');
