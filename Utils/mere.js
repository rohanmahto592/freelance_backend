const fs=require('fs')
const arr1= [
    {country : 'Afghanistan',	value : '93',	code : 'AF',},
    {country : 'Albania',	value : '355',	code : 'AL'},
    {country : 'Algeria',	value : '213',	code : 'DZ'},
    {country : 'American Samoa',	value : '1-684',	code : 'AS'},
    {country : 'Andorra',	value : '376',	code : 'AD'},
    {country : 'Angola',	value : '244',	code : 'AO'},
    {country : 'Anguilla',	value : '1-264',	code : 'AI'},
    {country : 'Antarctica',	value : '672',	code : 'AQ'},
    {country : 'Antigua and Barbuda',	value : '1-268',	code : 'AG'},
    {country : 'Argentina',	value : '54',	code : 'AR'},
    {country : 'Armenia',	value : '374',	code : 'AM'},
    {country : 'Aruba',	value : '297',	code : 'AW'},
    {country : 'Australia',	value : '61',	code : 'AU'},
    {country : 'Austria',	value : '43',	code : 'AT'},
    {country : 'Azerbaijan',	value : '994',	code : 'AZ'},
    {country : 'Bahamas',	value : '1-242',	code : 'BS'},
    {country : 'Bahrain',	value : '973',	code : 'BH'},
    {country : 'Bangladesh',	value : '880',	code : 'BD'},
    {country : 'Barbados',	value : '1-246',	code : 'BB'},
    {country : 'Belarus',	value : '375',	code : 'BY'},
    {country : 'Belgium',	value : '32',	code : 'BE'},
    {country : 'Belize',	value : '501',	code : 'BZ'},
    {country : 'Benin',	value : '229',	code : 'BJ'},
    {country : 'Bermuda',	value : '1-441',	code : 'BM'},
    {country : 'Bhutan',	value : '975',	code : 'BT'},
    {country : 'Bolivia',	value : '591',	code : 'BO'},
    {country : 'Bosnia and Herzegovina',	value : '387',	code : 'BA'},
    {country : 'Botswana',	value : '267',	code : 'BW'},
    {country : 'Brazil',	value : '55',	code : 'BR'},
    {country : 'British Indian Ocean Territory',	value : '246',	code : 'IO'},
    {country : 'British Virgin Islands',	value : '1-284',	code : 'VG'},
    {country : 'Brunei',	value : '673',	code : 'BN'},
    {country : 'Bulgaria',	value : '359',	code : 'BG'},
    {country : 'Burkina Faso',	value : '226',	code : 'BF'},
    {country : 'Burundi',	value : '257',	code : 'BI'},
    {country : 'Cambodia',	value : '855',	code : 'KH'},
    {country : 'Cameroon',	value : '237',	code : 'CM'},
    {country : 'Canada',	value : '1',	code : 'CA'},
    {country : 'Cape Verde',	value : '238',	code : 'CV'},
    {country : 'Cayman Islands',	value : '1-345',	code : 'KY'},
    {country : 'Central African Republic',	value : '236',	code : 'CF'},
    {country : 'Chad',	value : '235',	code : 'TD'},
    {country : 'Chile',	value : '56',	code : 'CL'},
    {country : 'China',	value : '86',	code : 'CN'},
    {country : 'Christmas Island',	value : '61',	code : 'CX'},
    {country : 'Cocos Islands',	value : '61',	code : 'CC'},
    {country : 'Colombia',	value : '57',	code : 'CO'},
    {country : 'Comoros',	value : '269',	code : 'KM'},
    {country : 'Cook Islands',	value : '682',	code : 'CK'},
    {country : 'Costa Rica',	value : '506',	code : 'CR'},
    {country : 'Croatia',	value : '385',	code : 'HR'},
    {country : 'Cuba',	value : '53',	code : 'CU'},
    {country : 'Curacao',	value : '599',	code : 'CW'},
    {country : 'Cyprus',	value : '357',	code : 'CY'},
    {country : 'Czech Republic',	value : '420',	code : 'CZ'},
    {country : 'Democratic Republic of the Congo',	value : '243',	code : 'CD'},
    {country : 'Denmark',	value : '45',	code : 'DK'},
    {country : 'Djibouti',	value : '253',	code : 'DJ'},
    {country : 'Dominica',	value : '1-767',	code : 'DM'},
    {country : 'Dominican Republic (1-809)',	value : '1-809',	code : 'DO'},
    {country : 'Dominican Republic (1-829)',	value : '1-829',	code : 'DO'},
    {country : 'Dominican Republic (1-849)',	value : '1-849',	code : 'DO'},
    {country : 'East Timor',	value : '670',	code : 'TL'},
    {country : 'Ecuador',	value : '593',	code : 'EC'},
    {country : 'Egypt',	value : '20',	code : 'EG'},
    {country : 'El Salvador',	value : '503',	code : 'SV'},
    {country : 'Equatorial Guinea',	value : '240',	code : 'GQ'},
    {country : 'Eritrea',	value : '291',	code : 'ER'},
    {country : 'Estonia',	value : '372',	code : 'EE'},
    {country : 'Ethiopia',	value : '251',	code : 'ET'},
    {country : 'Falkland Islands',	value : '500',	code : 'FK'},
    {country : 'Faroe Islands',	value : '298',	code : 'FO'},
    {country : 'Fiji',	value : '679',	code : 'FJ'},
    {country : 'Finland',	value : '358',	code : 'FI'},
    {country : 'France',	value : '33',	code : 'FR'},
    {country : 'French Polynesia',	value : '689',	code : 'PF'},
    {country : 'Gabon',	value : '241',	code : 'GA'},
    {country : 'Gambia',	value : '220',	code : 'GM'},
    {country : 'Georgia',	value : '995',	code : 'GE'},
    {country : 'Germany',	value : '49',	code : 'DE'},
    {country : 'Ghana',	value : '233',	code : 'GH'},
    {country : 'Gibraltar',	value : '350',	code : 'GI'},
    {country : 'Greece',	value : '30',	code : 'GR'},
    {country : 'Greenland',	value : '299',	code : 'GL'},
    {country : 'Grenada',	value : '1-473',	code : 'GD'},
    {country : 'Guam',	value : '1-671',	code : 'GU'},
    {country : 'Guatemala',	value : '502',	code : 'GT'},
    {country : 'Guernsey',	value : '44-1481',	code : 'GG'},
    {country : 'Guinea',	value : '224',	code : 'GN'},
    {country : 'Guinea-Bissau',	value : '245',	code : 'GW'},
    {country : 'Guyana',	value : '592',	code : 'GY'},
    {country : 'Haiti',	value : '509',	code : 'HT'},
    {country : 'Honduras',	value : '504',	code : 'HN'},
    {country : 'Hong Kong',	value : '852',	code : 'HK'},
    {country : 'Hungary',	value : '36',	code : 'HU'},
    {country : 'Iceland',	value : '354',	code : 'IS'},
    {country : 'India',	value : '91',	code : 'IN'},
    {country : 'Indonesia',	value : '62',	code : 'ID'},
    {country : 'Iran',	value : '98',	code : 'IR'},
    {country : 'Iraq',	value : '964',	code : 'IQ'},
    {country : 'Ireland',	value : '353',	code : 'IE'},
    {country : 'Isle of Man',	value : '44-1624',	code : 'IM'},
    {country : 'Israel',	value : '972',	code : 'IL'},
    {country : 'Italy',	value : '39',	code : 'IT'},
    {country : 'Ivory Coast',	value : '225',	code : 'CI'},
    {country : 'Jamaica',	value : '1-876',	code : 'JM'},
    {country : 'Japan',	value : '81',	code : 'JP'},
    {country : 'Jersey',	value : '44-1534',	code : 'JE'},
    {country : 'Jordan',	value : '962',	code : 'JO'},
    {country : 'Kazakhstan',	value : '7',	code : 'KZ'},
    {country : 'Kenya',	value : '254',	code : 'KE'},
    {country : 'Kiribati',	value : '686',	code : 'KI'},
    {country : 'Kosovo',	value : '383',	code : 'XK'},
    {country : 'Kuwait',	value : '965',	code : 'KW'},
    {country : 'Kyrgyzstan',	value : '996',	code : 'KG'},
    {country : 'Laos',	value : '856',	code : 'LA'},
    {country : 'Latvia',	value : '371',	code : 'LV'},
    {country : 'Lebanon',	value : '961',	code : 'LB'},
    {country : 'Lesotho',	value : '266',	code : 'LS'},
    {country : 'Liberia',	value : '231',	code : 'LR'},
    {country : 'Libya',	value : '218',	code : 'LY'},
    {country : 'Liechtenstein',	value : '423',	code : 'LI'},
    {country : 'Lithuania',	value : '370',	code : 'LT'},
    {country : 'Luxembourg',	value : '352',	code : 'LU'},
    {country : 'Macau',	value : '853',	code : 'MO'},
    {country : 'Macedonia',	value : '389',	code : 'MK'},
    {country : 'Madagascar',	value : '261',	code : 'MG'},
    {country : 'Malawi',	value : '265',	code : 'MW'},
    {country : 'Malaysia',	value : '60',	code : 'MY'},
    {country : 'Maldives',	value : '960',	code : 'MV'},
    {country : 'Mali',	value : '223',	code : 'ML'},
    {country : 'Malta',	value : '356',	code : 'MT'},
    {country : 'Marshall Islands',	value : '692',	code : 'MH'},
    {country : 'Mauritania',	value : '222',	code : 'MR'},
    {country : 'Mauritius',	value : '230',	code : 'MU'},
    {country : 'Mayotte',	value : '262',	code : 'YT'},
    {country : 'Mexico',	value : '52',	code : 'MX'},
    {country : 'Micronesia',	value : '691',	code : 'FM'},
    {country : 'Moldova',	value : '373',	code : 'MD'},
    {country : 'Monaco',	value : '377',	code : 'MC'},
    {country : 'Mongolia',	value : '976',	code : 'MN'},
    {country : 'Montenegro',	value : '382',	code : 'ME'},
    {country : 'Montserrat',	value : '1-664',	code : 'MS'},
    {country : 'Morocco',	value : '212',	code : 'MA'},
    {country : 'Mozambique',	value : '258',	code : 'MZ'},
    {country : 'Myanmar',	value : '95',	code : 'MM'},
    {country : 'Namibia',	value : '264',	code : 'NA'},
    {country : 'Nauru',	value : '674',	code : 'NR'},
    {country : 'Nepal',	value : '977',	code : 'NP'},
    {country : 'Netherlands',	value : '31',	code : 'NL'},
    {country : 'Netherlands Antilles',	value : '599',	code : 'AN'},
    {country : 'New Caledonia',	value : '687',	code : 'NC'},
    {country : 'New Zealand',	value : '64',	code : 'NZ'},
    {country : 'Nicaragua',	value : '505',	code : 'NI'},
    {country : 'Niger',	value : '227',	code : 'NE'},
    {country : 'Nigeria',	value : '234',	code : 'NG'},
    {country : 'Niue',	value : '683',	code : 'NU'},
    {country : 'North Korea',	value : '850',	code : 'KP'},
    {country : 'Northern Mariana Islands',	value : '1-670',	code : 'MP'},
    {country : 'Norway',	value : '47',	code : 'NO'},
    {country : 'Oman',	value : '968',	code : 'OM'},
    {country : 'Pakistan',	value : '92',	code : 'PK'},
    {country : 'Palau',	value : '680',	code : 'PW'},
    {country : 'Palestine',	value : '970',	code : 'PS'},
    {country : 'Panama',	value : '507',	code : 'PA'},
    {country : 'Papua New Guinea',	value : '675',	code : 'PG'},
    {country : 'Paraguay',	value : '595',	code : 'PY'},
    {country : 'Peru',	value : '51',	code : 'PE'},
    {country : 'Philippines',	value : '63',	code : 'PH'},
    {country : 'Pitcairn',	value : '64',	code : 'PN'},
    {country : 'Poland',	value : '48',	code : 'PL'},
    {country : 'Portugal',	value : '351',	code : 'PT'},
    {country : 'Puerto Rico (1-787)',	value : '1-787',	code : 'PR'},
    {country : 'Puerto Rico (1-939)',	value : '1-939',	code : 'PR'},
    {country : 'Qatar',	value : '974',	code : 'QA'},
    {country : 'Republic of the Congo',	value : '242',	code : 'CG'},
    {country : 'Reunion',	value : '262',	code : 'RE'},
    {country : 'Romania',	value : '40',	code : 'RO'},
    {country : 'Russia',	value : '7',	code : 'RU'},
    {country : 'Rwanda',	value : '250',	code : 'RW'},
    {country : 'Saint Barthelemy',	value : '590',	code : 'BL'},
    {country : 'Saint Helena',	value : '290',	code : 'SH'},
    {country : 'Saint Kitts and Nevis',	value : '1-869',	code : 'KN'},
    {country : 'Saint Lucia',	value : '1-758',	code : 'LC'},
    {country : 'Saint Martin',	value : '590',	code : 'MF'},
    {country : 'Saint Pierre and Miquelon',	value : '508',	code : 'PM'},
    {country : 'Saint Vincent and the Grenadines',	value : '1-784',	code : 'VC'},
    {country : 'Samoa',	value : '685',	code : 'WS'},
    {country : 'San Marino',	value : '378',	code : 'SM'},
    {country : 'Sao Tome and Principe',	value : '239',	code : 'ST'},
    {country : 'Saudi Arabia',	value : '966',	code : 'SA'},
    {country : 'Senegal',	value : '221',	code : 'SN'},
    {country : 'Serbia',	value : '381',	code : 'RS'},
    {country : 'Seychelles',	value : '248',	code : 'SC'},
    {country : 'Sierra Leone',	value : '232',	code : 'SL'},
    {country : 'Singapore',	value : '65',	code : 'SG'},
    {country : 'Sint Maarten',	value : '1-721',	code : 'SX'},
    {country : 'Slovakia',	value : '421',	code : 'SK'},
    {country : 'Slovenia',	value : '386',	code : 'SI'},
    {country : 'Solomon Islands',	value : '677',	code : 'SB'},
    {country : 'Somalia',	value : '252',	code : 'SO'},
    {country : 'South Africa',	value : '27',	code : 'ZA'},
    {country : 'South Korea',	value : '82',	code : 'KR'},
    {country : 'South Sudan',	value : '211',	code : 'SS'},
    {country : 'Spain',	value : '34',	code : 'ES'},
    {country : 'Sri Lanka',	value : '94',	code : 'LK'},
    {country : 'Sudan',	value : '249',	code : 'SD'},
    {country : 'Suriname',	value : '597',	code : 'SR'},
    {country : 'Svalbard and Jan Mayen',	value : '47',	code : 'SJ'},
    {country : 'Swaziland',	value : '268',	code : 'SZ'},
    {country : 'Sweden',	value : '46',	code : 'SE'},
    {country : 'Switzerland',	value : '41',	code : 'CH'},
    {country : 'Syria',	value : '963',	code : 'SY'},
    {country : 'Taiwan',	value : '886',	code : 'TW'},
    {country : 'Tajikistan',	value : '992',	code : 'TJ'},
    {country : 'Tanzania',	value : '255',	code : 'TZ'},
    {country : 'Thailand',	value : '66',	code : 'TH'},
    {country : 'Togo',	value : '228',	code : 'TG'},
    {country : 'Tokelau',	value : '690',	code : 'TK'},
    {country : 'Tonga',	value : '676',	code : 'TO'},
    {country : 'Trinidad and Tobago',	value : '1-868',	code : 'TT'},
    {country : 'Tunisia',	value : '216',	code : 'TN'},
    {country : 'Turkey',	value : '90',	code : 'TR'},
    {country : 'Turkmenistan',	value : '993',	code : 'TM'},
    {country : 'Turks and Caicos Islands',	value : '1-649',	code : 'TC'},
    {country : 'Tuvalu',	value : '688',	code : 'TV'},
    {country : 'U.S. Virgin Islands',	value : '1-340',	code : 'VI'},
    {country : 'Uganda',	value : '256',	code : 'UG'},
    {country : 'Ukraine',	value : '380',	code : 'UA'},
    {country : 'United Arab Emirates',	value : '971',	code : 'AE'},
    {country : 'United Kingdom',	value : '44',	code : 'GB'},
    {country : 'United States',	value : '1',	code : 'US'},
    {country : 'Uruguay',	value : '598',	code : 'UY'},
    {country : 'Uzbekistan',	value : '998',	code : 'UZ'},
    {country : 'Vanuatu',	value : '678',	code : 'VU'},
    {country : 'Vatican',	value : '379',	code : 'VA'},
    {country : 'Venezuela',	value : '58',	code : 'VE'},
    {country : 'Vietnam',	value : '84',	code : 'VN'},
    {country : 'Wallis and Futuna',	value : '681',	code : 'WF'},
    {country : 'Western Sahara',	value : '212',	code : 'EH'},
    {country : 'Yemen',	value : '967',	code : 'YE'},
    {country : 'Zambia',	value : '260',	code : 'ZM'},
    {country : 'Zimbabwe',	value : '263',	code : 'ZW'}
  ]
  const arr2=[
    {
      "country": "China",
      "phLength": 13
    },
    {
      "country": "Mozambique",
      "phLength": 12
    },
    {
      "country": "Brazil",
      "phLength": 11
    },
    {
      "country": "India",
      "phLength": 10
    },
    {
      "country": "United States",
      "phLength": 10
    },
    {
      "country": "Pakistan",
      "phLength": 10
    },
    {
      "country": "Bangladesh",
      "phLength": 10
    },
    {
      "country": "Russia",
      "phLength": 10
    },
    {
      "country": "Mexico",
      "phLength": 10
    },
    {
      "country": "Japan",
      "phLength": 10
    },
    {
      "country": "Philippines",
      "phLength": 10
    },
    {
      "country": "Egypt",
      "phLength": 10
    },
    {
      "country": "Iran",
      "phLength": 10
    },
    {
      "country": "Turkey",
      "phLength": 10
    },
    {
      "country": "Germany",
      "phLength": 10
    },
    {
      "country": "United Kingdom",
      "phLength": 10
    },
    {
      "country": "Italy",
      "phLength": 10
    },
    {
      "country": "Kenya",
      "phLength": 10
    },
    {
      "country": "Colombia",
      "phLength": 10
    },
    {
      "country": "South Korea",
      "phLength": 10
    },
    {
      "country": "Canada",
      "phLength": 10
    },
    {
      "country": "Nepal",
      "phLength": 10
    },
    {
      "country": "Romania",
      "phLength": 10
    },
    {
      "country": "Kazakhstan",
      "phLength": 10
    },
    {
      "country": "Dominican Republic",
      "phLength": 10
    },
    {
      "country": "Greece",
      "phLength": 10
    },
    {
      "country": "Austria",
      "phLength": 10
    },
    {
      "country": "Libya",
      "phLength": 10
    },
    {
      "country": "Puerto Rico",
      "phLength": 10
    },
    {
      "country": "Jamaica",
      "phLength": 10
    },
    {
      "country": "Trinidad and Tobago",
      "phLength": 10
    },
    {
      "country": "Bahamas",
      "phLength": 10
    },
    {
      "country": "Barbados",
      "phLength": 10
    },
    {
      "country": "Saint Lucia",
      "phLength": 10
    },
    {
      "country": "Guam",
      "phLength": 10
    },
    {
      "country": "Grenada",
      "phLength": 10
    },
    {
      "country": "Saint Vincent and the Grenadines",
      "phLength": 10
    },
    {
      "country": "United States Virgin Islands",
      "phLength": 10
    },
    {
      "country": "Antigua and Barbuda",
      "phLength": 10
    },
    {
      "country": "Isle of Man",
      "phLength": 10
    },
    {
      "country": "Dominica",
      "phLength": 10
    },
    {
      "country": "Cayman Islands",
      "phLength": 10
    },
    {
      "country": "Bermuda",
      "phLength": 10
    },
    {
      "country": "Guernsey",
      "phLength": 10
    },
    {
      "country": "Northern Mariana Islands",
      "phLength": 10
    },
    {
      "country": "Saint Kitts and Nevis",
      "phLength": 10
    },
    {
      "country": "Turks and Caicos Islands",
      "phLength": 10
    },
    {
      "country": "Sint Maarten",
      "phLength": 10
    },
    {
      "country": "American Samoa",
      "phLength": 10
    },
    {
      "country": "British Virgin Islands",
      "phLength": 10
    },
    {
      "country": "Anguilla",
      "phLength": 10
    },
    {
      "country": "Montserrat",
      "phLength": 10
    },
    {
      "country": "Vatican City",
      "phLength": 10
    },
    {
      "country": "Indonesia",
      "phLength": 9
    },
    {
      "country": "Vietnam",
      "phLength": 9
    },
    {
      "country": "Thailand",
      "phLength": 9
    },
    {
      "country": "South Africa",
      "phLength": 9
    },
    {
      "country": "Spain",
      "phLength": 9
    },
    {
      "country": "Algeria",
      "phLength": 9
    },
    {
      "country": "Afghanistan",
      "phLength": 9
    },
    {
      "country": "Poland",
      "phLength": 9
    },
    {
      "country": "Saudi Arabia",
      "phLength": 9
    },
    {
      "country": "Ukraine",
      "phLength": 9
    },
    {
      "country": "Yemen",
      "phLength": 9
    },
    {
      "country": "Peru",
      "phLength": 9
    },
    {
      "country": "Ghana",
      "phLength": 9
    },
    {
      "country": "Cameroon",
      "phLength": 9
    },
    {
      "country": "Australia",
      "phLength": 9
    },
    {
      "country": "Taiwan",
      "phLength": 9
    },
    {
      "country": "Syria",
      "phLength": 9
    },
    {
      "country": "Zambia",
      "phLength": 9
    },
    {
      "country": "Chile",
      "phLength": 9
    },
    {
      "country": "Ecuador",
      "phLength": 9
    },
    {
      "country": "Netherlands",
      "phLength": 9
    },
    {
      "country": "Cambodia",
      "phLength": 9
    },
    {
      "country": "Zimbabwe",
      "phLength": 9
    },
    {
      "country": "Benin",
      "phLength": 9
    },
    {
      "country": "Belgium",
      "phLength": 9
    },
    {
      "country": "Jordan",
      "phLength": 9
    },
    {
      "country": "Czech Republic",
      "phLength": 9
    },
    {
      "country": "Azerbaijan",
      "phLength": 9
    },
    {
      "country": "Portugal",
      "phLength": 9
    },
    {
      "country": "Hungary",
      "phLength": 9
    },
    {
      "country": "United Arab Emirates",
      "phLength": 9
    },
    {
      "country": "Belarus",
      "phLength": 9
    },
    {
      "country": "Israel",
      "phLength": 9
    },
    {
      "country": "Switzerland",
      "phLength": 9
    },
    {
      "country": "Paraguay",
      "phLength": 9
    },
    {
      "country": "Slovakia",
      "phLength": 9
    },
    {
      "country": "New Zealand",
      "phLength": 9
    },
    {
      "country": "Ireland",
      "phLength": 9
    },
    {
      "country": "Croatia",
      "phLength": 9
    },
    {
      "country": "Georgia",
      "phLength": 9
    },
    {
      "country": "Luxembourg",
      "phLength": 9
    },
    {
      "country": "Guadeloupe",
      "phLength": 9
    },
    {
      "country": "Martinique",
      "phLength": 9
    },
    {
      "country": "French Guiana",
      "phLength": 9
    },
    {
      "country": "Nigeria",
      "phLength": 8
    },
    {
      "country": "Myanmar",
      "phLength": 8
    },
    {
      "country": "Niger",
      "phLength": 8
    },
    {
      "country": "Mali",
      "phLength": 8
    },
    {
      "country": "Burkina Faso",
      "phLength": 8
    },
    {
      "country": "Chad",
      "phLength": 8
    },
    {
      "country": "Somalia",
      "phLength": 8
    },
    {
      "country": "Guatemala",
      "phLength": 8
    },
    {
      "country": "Tunisia",
      "phLength": 8
    },
    {
      "country": "Honduras",
      "phLength": 8
    },
    {
      "country": "Togo",
      "phLength": 8
    },
    {
      "country": "Hong Kong",
      "phLength": 8
    },
    {
      "country": "Serbia",
      "phLength": 8
    },
    {
      "country": "Nicaragua",
      "phLength": 8
    },
    {
      "country": "El Salvador",
      "phLength": 8
    },
    {
      "country": "Singapore",
      "phLength": 8
    },
    {
      "country": "Denmark",
      "phLength": 8
    },
    {
      "country": "Norway",
      "phLength": 8
    },
    {
      "country": "Costa Rica",
      "phLength": 8
    },
    {
      "country": "Oman",
      "phLength": 8
    },
    {
      "country": "Panama",
      "phLength": 8
    },
    {
      "country": "Kuwait",
      "phLength": 8
    },
    {
      "country": "Moldova",
      "phLength": 8
    },
    {
      "country": "Bosnia and Herzegovina",
      "phLength": 8
    },
    {
      "country": "Armenia",
      "phLength": 8
    },
    {
      "country": "Lithuania",
      "phLength": 8
    },
    {
      "country": "Qatar",
      "phLength": 8
    },
    {
      "country": "North Macedonia",
      "phLength": 8
    },
    {
      "country": "Latvia",
      "phLength": 8
    },
    {
      "country": "Bahrain",
      "phLength": 8
    },
    {
      "country": "Estonia",
      "phLength": 8
    },
    {
      "country": "Mauritius",
      "phLength": 8
    },
    {
      "country": "Cyprus",
      "phLength": 8
    },
    {
      "country": "Montenegro",
      "phLength": 8
    },
    {
      "country": "Malta",
      "phLength": 8
    },
    {
      "country": "Kiribati",
      "phLength": 8
    },
    {
      "country": "Malaysia",
      "phLength": 7
    },
    {
      "country": "Venezuela",
      "phLength": 7
    },
    {
      "country": "Sri Lanka",
      "phLength": 7
    },
    {
      "country": "Sweden",
      "phLength": 7
    },
    {
      "country": "Liberia",
      "phLength": 7
    },
    {
      "country": "Lebanon",
      "phLength": 7
    },
    {
      "country": "Gabon",
      "phLength": 7
    },
    {
      "country": "Solomon Islands",
      "phLength": 7
    },
    {
      "country": "Maldives",
      "phLength": 7
    },
    {
      "country": "Belize",
      "phLength": 7
    },
    {
      "country": "Micronesia",
      "phLength": 7
    },
    {
      "country": "Aruba",
      "phLength": 7
    },
    {
      "country": "Marshall Islands",
      "phLength": 7
    },
    {
      "country": "Palau",
      "phLength": 7
    },
    {
      "country": "Tanzania",
      "phLength": 6
    },
    {
      "country": "French Polynesia",
      "phLength": 6
    },
    {
      "country": "New Caledonia",
      "phLength": 6
    },
    {
      "country": "Greenland",
      "phLength": 6
    },
    {
      "country": "Samoa",
      "phLength": 5
    },
    {
      "country": "Faroe Islands",
      "phLength": 5
    },
    {
      "country": "Cook Islands",
      "phLength": 5
    },
    {
      "country": "Niue",
      "phLength": 4
    }
  ]
  const mergedArray = arr1.map((obj1) => {
    const obj2 = arr2.find((obj) => obj.country === obj1.country);
    return { ...obj1, ...obj2 };
  });
const content = JSON.stringify(mergedArray);

fs.writeFile('mergedArray.js', content, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('File "mergedArray.js" created successfully.');
  }
});
