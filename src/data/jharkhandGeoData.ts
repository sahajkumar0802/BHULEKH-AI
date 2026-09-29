export interface DistrictData {
  id: string;
  name: string;
  hindiName: string;
  division: string;
  headquarters: string;
  areaSqKm: number;
  population: string;
  blocksCount: number;
  digitizedRecords: string;
  digitizationRate: number;
  riskIndex: string;
  activeCases: number;
  color: string;
  mapPin: { x: number; y: number }; // Relative to 921x741 image
  polygonPoints: string; // SVG polygon coordinates matching reference map
  blocks?: string[];
}

export interface BlockData {
  id: string;
  name: string;
  hindiName: string;
  districtId: string;
  headquarters: string;
  areaSqKm: number;
  population: string;
  panchayatsCount: number;
  villagesCount: number;
  digitizedParcels: number;
  completionRate: number;
  color: string;
  mapPin: { x: number; y: number }; // Relative to 817x747 image
  polygonPoints: string; // SVG polygon coordinates matching reference map
}

export interface StateData {
  id: string;
  name: string;
  hindiName: string;
  code: string;
  districtsCount: number;
  isAvailable: boolean;
  featured?: boolean;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  isOfficial: boolean;
  description?: string;
}

export const BHULEKH_8_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', isOfficial: true, description: 'राजभाषा • राष्ट्रीय आधिकारिक भाषा' },
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', isOfficial: true, description: 'Official Administrative & Statutory Records' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', isOfficial: true, description: 'পশ্চিমবঙ্গ, ত্রিপুরা ও ঝাড়খণ্ড (Eastern Region)' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', isOfficial: true, description: 'महाराष्ट्र शासन महसूल व भूमी अभिलेख (Western Region)' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', isOfficial: true, description: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ భూమి రికార్డులు (Southern Region)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', isOfficial: true, description: 'தமிழ்நாடு நில வருவாய் & பட்டா பதிவுகள் (Southern Region)' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', isOfficial: true, description: 'ગુજરાત રાજ્ય મહેસૂલ અને જમીન દસ્તાવેજ (Western Region)' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Nastaliq / Arabic', isOfficial: true, description: 'قومی و ریاستی دفتری زبان • دائیں سے بائیں (RTL Layout)' }
];

export const STATE_LANGUAGES: Record<string, LanguageOption[]> = {
  jharkhand: BHULEKH_8_LANGUAGES,
  bihar: BHULEKH_8_LANGUAGES,
  uttar_pradesh: BHULEKH_8_LANGUAGES,
  odisha: BHULEKH_8_LANGUAGES,
  west_bengal: BHULEKH_8_LANGUAGES,
  maharashtra: BHULEKH_8_LANGUAGES,
  gujarat: BHULEKH_8_LANGUAGES,
  tamil_nadu: BHULEKH_8_LANGUAGES,
  andhra_pradesh: BHULEKH_8_LANGUAGES,
  telangana: BHULEKH_8_LANGUAGES
};

export const INDIAN_STATES: StateData[] = [
  { id: 'jharkhand', name: 'Jharkhand', hindiName: 'झारखण्ड', code: 'JH', districtsCount: 24, isAvailable: true, featured: true },
  { id: 'bihar', name: 'Bihar', hindiName: 'बिहार', code: 'BR', districtsCount: 38, isAvailable: false },
  { id: 'uttar_pradesh', name: 'Uttar Pradesh', hindiName: 'उत्तर प्रदेश', code: 'UP', districtsCount: 75, isAvailable: false },
  { id: 'madhya_pradesh', name: 'Madhya Pradesh', hindiName: 'मध्य प्रदेश', code: 'MP', districtsCount: 55, isAvailable: false },
  { id: 'odisha', name: 'Odisha', hindiName: 'ओडिशा', code: 'OD', districtsCount: 30, isAvailable: false },
  { id: 'west_bengal', name: 'West Bengal', hindiName: 'पश्चिम बंगाल', code: 'WB', districtsCount: 23, isAvailable: false },
  { id: 'chhattisgarh', name: 'Chhattisgarh', hindiName: 'छत्तीसगढ़', code: 'CG', districtsCount: 33, isAvailable: false },
  { id: 'rajasthan', name: 'Rajasthan', hindiName: 'राजस्थान', code: 'RJ', districtsCount: 50, isAvailable: false },
  { id: 'maharashtra', name: 'Maharashtra', hindiName: 'महाराष्ट्र', code: 'MH', districtsCount: 36, isAvailable: false },
  { id: 'gujarat', name: 'Gujarat', hindiName: 'गुजरात', code: 'GJ', districtsCount: 33, isAvailable: false },
  { id: 'karnataka', name: 'Karnataka', hindiName: 'कर्नाटक', code: 'KA', districtsCount: 31, isAvailable: false },
  { id: 'tamil_nadu', name: 'Tamil Nadu', hindiName: 'तमिलनाडु', code: 'TN', districtsCount: 38, isAvailable: false },
  { id: 'andhra_pradesh', name: 'Andhra Pradesh', hindiName: 'आंध्र प्रदेश', code: 'AP', districtsCount: 26, isAvailable: false },
  { id: 'telangana', name: 'Telangana', hindiName: 'तेलंगाना', code: 'TG', districtsCount: 33, isAvailable: false },
  { id: 'punjab', name: 'Punjab', hindiName: 'पंजाब', code: 'PB', districtsCount: 23, isAvailable: false },
  { id: 'haryana', name: 'Haryana', hindiName: 'हरियाणा', code: 'HR', districtsCount: 22, isAvailable: false },
  { id: 'kerala', name: 'Kerala', hindiName: 'केरल', code: 'KL', districtsCount: 14, isAvailable: false },
  { id: 'assam', name: 'Assam', hindiName: 'असम', code: 'AS', districtsCount: 31, isAvailable: false }
];

export const JHARKHAND_DISTRICTS: DistrictData[] = [
  {
    id: 'giridih',
    name: 'Giridih',
    hindiName: 'गिरिडीह',
    division: 'North Chotanagpur',
    headquarters: 'Giridih',
    areaSqKm: 4962,
    population: '24,45,474',
    blocksCount: 13,
    digitizedRecords: '4,28,910',
    digitizationRate: 94.2,
    riskIndex: 'Low (12.4%)',
    activeCases: 84,
    color: '#D8B4FE',
    mapPin: { x: 604, y: 344 },
    polygonPoints: '535,260 560,230 600,240 645,280 670,300 685,340 680,380 655,420 600,430 555,410 535,360 540,300',
    blocks: ['Gawan', 'Tisri', 'Deori', 'Dhanwar', 'Jamua', 'Bengabad', 'Birni', 'Sariya', 'Bagodar', 'Dumri', 'Pirtanr', 'Giridih', 'Gande']
  },
  {
    id: 'ranchi',
    name: 'Ranchi',
    hindiName: 'राँची',
    division: 'South Chotanagpur',
    headquarters: 'Ranchi',
    areaSqKm: 5097,
    population: '29,14,253',
    blocksCount: 18,
    digitizedRecords: '6,12,400',
    digitizationRate: 96.8,
    riskIndex: 'Very Low (8.1%)',
    activeCases: 142,
    color: '#FEF08A',
    mapPin: { x: 460, y: 595 },
    polygonPoints: '375,540 435,530 490,540 540,560 550,610 530,650 480,660 420,650 375,610 365,570',
    blocks: ['Ranchi Sadar', 'Kanke', 'Ratu', 'Namkum', 'Ormanjhi', 'Angara', 'Silli', 'Bundu', 'Tamar', 'Sonahatu', 'Bero', 'Itki', 'Lapung', 'Nagri', 'Mandar', 'Chanho', 'Burmu', 'Khelari']
  },
  {
    id: 'dumka',
    name: 'Dumka',
    hindiName: 'दुमका',
    division: 'Santhal Pargana',
    headquarters: 'Dumka',
    areaSqKm: 3761,
    population: '13,21,442',
    blocksCount: 10,
    digitizedRecords: '2,94,150',
    digitizationRate: 91.5,
    riskIndex: 'Medium (18.2%)',
    activeCases: 68,
    color: '#BAE6FD',
    mapPin: { x: 830, y: 345 },
    polygonPoints: '775,270 820,270 865,290 890,330 885,380 855,420 805,430 765,390 760,330',
    blocks: ['Dumka Sadar', 'Gopikandar', 'Jama', 'Jarmundi', 'Kathikund', 'Masalia', 'Ramgarh', 'Ranishwar', 'Shikaripara', 'Sarayahat']
  },
  {
    id: 'dhanbad',
    name: 'Dhanbad',
    hindiName: 'धनबाद',
    division: 'North Chotanagpur',
    headquarters: 'Dhanbad',
    areaSqKm: 2040,
    population: '26,84,487',
    blocksCount: 8,
    digitizedRecords: '3,85,900',
    digitizationRate: 95.1,
    riskIndex: 'Low (11.6%)',
    activeCases: 95,
    color: '#FBCFE8',
    mapPin: { x: 665, y: 475 },
    polygonPoints: '610,430 655,430 705,445 730,480 710,520 660,525 615,505 605,460',
    blocks: ['Dhanbad Sadar', 'Jharia', 'Baghmara', 'Govindpur', 'Nirsa', 'Baliapur', 'Tundi', 'Topchanchi']
  },
  {
    id: 'bokaro',
    name: 'Bokaro',
    hindiName: 'बोकारो',
    division: 'North Chotanagpur',
    headquarters: 'Bokaro Steel City',
    areaSqKm: 2883,
    population: '20,62,330',
    blocksCount: 9,
    digitizedRecords: '3,18,600',
    digitizationRate: 93.4,
    riskIndex: 'Low (14.1%)',
    activeCases: 71,
    color: '#BBF7D0',
    mapPin: { x: 580, y: 510 },
    polygonPoints: '515,465 570,460 610,480 615,530 590,565 540,570 510,535 505,490',
    blocks: ['Chas', 'Chandankiyari', 'Jaridih', 'Kasmar', 'Petarwar', 'Gomia', 'Bermo', 'Nawadih', 'Chandrapura']
  },
  {
    id: 'hazaribag',
    name: 'Hazaribag',
    hindiName: 'हजारीबाग',
    division: 'North Chotanagpur',
    headquarters: 'Hazaribag',
    areaSqKm: 3555,
    population: '17,34,495',
    blocksCount: 16,
    digitizedRecords: '3,45,200',
    digitizationRate: 92.7,
    riskIndex: 'Low (13.5%)',
    activeCases: 62,
    color: '#FEF08A',
    mapPin: { x: 475, y: 410 },
    polygonPoints: '420,350 480,345 530,360 545,410 535,455 490,470 435,465 405,420 405,380',
    blocks: ['Hazaribag Sadar', 'Barhi', 'Barkagaon', 'Bishnugarh', 'Chauparan', 'Churchu', 'Daru', 'Ichak', 'Katkamsandi', 'Katkamdag', 'Keredari', 'Padma', 'Tati Jhariya', 'Barkatha', 'Chalkusa', 'Dadi']
  },
  {
    id: 'koderma',
    name: 'Koderma',
    hindiName: 'कोडरमा',
    division: 'North Chotanagpur',
    headquarters: 'Koderma',
    areaSqKm: 1500,
    population: '7,16,259',
    blocksCount: 6,
    digitizedRecords: '1,54,300',
    digitizationRate: 91.8,
    riskIndex: 'Medium (16.2%)',
    activeCases: 34,
    color: '#FED7AA',
    mapPin: { x: 515, y: 300 },
    polygonPoints: '465,240 530,230 565,260 560,310 530,340 480,345 455,300',
    blocks: ['Koderma Sadar', 'Jainagar', 'Markacho', 'Satgawan', 'Chandwara', 'Domchanch']
  },
  {
    id: 'deoghar',
    name: 'Deoghar',
    hindiName: 'देवघर',
    division: 'Santhal Pargana',
    headquarters: 'Deoghar',
    areaSqKm: 2477,
    population: '14,92,073',
    blocksCount: 10,
    digitizedRecords: '2,67,800',
    digitizationRate: 92.0,
    riskIndex: 'Low (14.8%)',
    activeCases: 53,
    color: '#A7F3D0',
    mapPin: { x: 725, y: 340 },
    polygonPoints: '670,270 735,270 780,295 780,360 765,410 710,410 670,380 660,320',
    blocks: ['Deoghar Sadar', 'Devipur', 'Karon', 'Madhupur', 'Margomunda', 'Mohanpur', 'Palojori', 'Sarath', 'Sarwan', 'Sonaraithari']
  },
  {
    id: 'godda',
    name: 'Godda',
    hindiName: 'गोड्डा',
    division: 'Santhal Pargana',
    headquarters: 'Godda',
    areaSqKm: 2266,
    population: '13,13,551',
    blocksCount: 9,
    digitizedRecords: '2,18,400',
    digitizationRate: 90.4,
    riskIndex: 'Medium (17.5%)',
    activeCases: 48,
    color: '#FEF08A',
    mapPin: { x: 830, y: 185 },
    polygonPoints: '790,105 845,100 870,140 860,210 840,265 790,265 780,190 775,140',
    blocks: ['Godda Sadar', 'Boarijor', 'Mahagama', 'Meharma', 'Pathargama', 'Poreyahat', 'Sundarpahari', 'Thakurgangti', 'Basantrai']
  },
  {
    id: 'sahibganj',
    name: 'Sahibganj',
    hindiName: 'साहिबगंज',
    division: 'Santhal Pargana',
    headquarters: 'Sahibganj',
    areaSqKm: 2063,
    population: '11,50,567',
    blocksCount: 9,
    digitizedRecords: '1,96,200',
    digitizationRate: 89.2,
    riskIndex: 'Medium (19.4%)',
    activeCases: 41,
    color: '#FED7AA',
    mapPin: { x: 895, y: 155 },
    polygonPoints: '860,75 920,80 945,125 940,195 910,215 865,205 855,140',
    blocks: ['Sahibganj Sadar', 'Borio', 'Barharwa', 'Barhait', 'Mandro', 'Pathna', 'Rajmahal', 'Taljhari', 'Udhwa']
  },
  {
    id: 'pakur',
    name: 'Pakur',
    hindiName: 'पाकुड़',
    division: 'Santhal Pargana',
    headquarters: 'Pakur',
    areaSqKm: 1806,
    population: '9,00,422',
    blocksCount: 6,
    digitizedRecords: '1,62,800',
    digitizationRate: 88.7,
    riskIndex: 'High (21.3%)',
    activeCases: 52,
    color: '#DDD6FE',
    mapPin: { x: 890, y: 260 },
    polygonPoints: '855,215 915,215 940,250 930,295 885,300 850,270 850,230',
    blocks: ['Pakur Sadar', 'Hiranpur', 'Littipara', 'Amrapara', 'Pakuria', 'Maheshpur']
  },
  {
    id: 'jamtara',
    name: 'Jamtara',
    hindiName: 'जामताड़ा',
    division: 'Santhal Pargana',
    headquarters: 'Jamtara',
    areaSqKm: 1811,
    population: '7,91,042',
    blocksCount: 6,
    digitizedRecords: '1,45,200',
    digitizationRate: 91.1,
    riskIndex: 'Low (15.0%)',
    activeCases: 38,
    color: '#DDD6FE',
    mapPin: { x: 775, y: 470 },
    polygonPoints: '725,420 780,420 830,445 825,505 775,525 735,510 715,465',
    blocks: ['Jamtara Sadar', 'Karmatanr', 'Nala', 'Kundhit', 'Narayanpur', 'Fatehpur']
  },
  {
    id: 'ramgarh',
    name: 'Ramgarh',
    hindiName: 'रामगढ़',
    division: 'North Chotanagpur',
    headquarters: 'Ramgarh Cantonment',
    areaSqKm: 1341,
    population: '9,49,443',
    blocksCount: 6,
    digitizedRecords: '1,72,100',
    digitizationRate: 94.6,
    riskIndex: 'Low (11.8%)',
    activeCases: 29,
    color: '#FECDD3',
    mapPin: { x: 480, y: 525 },
    polygonPoints: '445,480 505,480 525,520 515,555 465,560 435,525',
    blocks: ['Ramgarh Sadar', 'Gola', 'Mandu', 'Patratu', 'Chitarpur', 'Dulmi']
  },
  {
    id: 'chatra',
    name: 'Chatra',
    hindiName: 'चतरा',
    division: 'North Chotanagpur',
    headquarters: 'Chatra',
    areaSqKm: 3718,
    population: '10,42,886',
    blocksCount: 12,
    digitizedRecords: '1,98,700',
    digitizationRate: 90.2,
    riskIndex: 'Medium (17.8%)',
    activeCases: 46,
    color: '#FEF08A',
    mapPin: { x: 355, y: 370 },
    polygonPoints: '290,290 380,285 425,320 425,385 390,435 320,440 285,390 280,340',
    blocks: ['Chatra Sadar', 'Hunterganj', 'Itkhori', 'Kanhachatti', 'Kunda', 'Lawalong', 'Mayurhand', 'Pathalgada', 'Pratappur', 'Simaria', 'Tandwa', 'Gidhour']
  },
  {
    id: 'palamu',
    name: 'Palamu',
    hindiName: 'पलामू',
    division: 'Palamu',
    headquarters: 'Medininagar (Daltonganj)',
    areaSqKm: 4393,
    population: '19,39,869',
    blocksCount: 21,
    digitizedRecords: '3,65,400',
    digitizationRate: 92.4,
    riskIndex: 'Low (13.9%)',
    activeCases: 67,
    color: '#FED7AA',
    mapPin: { x: 230, y: 355 },
    polygonPoints: '165,275 250,270 290,300 280,375 250,420 185,420 155,360 155,310',
    blocks: ['Medininagar (Sadar)', 'Chainpur', 'Satbarwa', 'Bishrampur', 'Pandu', 'Untari Road', 'Haidernagar', 'Hussainabad', 'Mohammadganj', 'Chhatarpur', 'Pipra', 'Hariharganj', 'Nawa Bazar', 'Pandwa', 'Patan', 'Kishunpur', 'Manatu', 'Tarhassi', 'Panki', 'Lesliganj', 'Nilambar Pitambar Pur']
  },
  {
    id: 'garhwa',
    name: 'Garhwa',
    hindiName: 'गढ़वा',
    division: 'Palamu',
    headquarters: 'Garhwa',
    areaSqKm: 4044,
    population: '13,22,784',
    blocksCount: 20,
    digitizedRecords: '2,42,800',
    digitizationRate: 89.8,
    riskIndex: 'Medium (18.6%)',
    activeCases: 58,
    color: '#BAE6FD',
    mapPin: { x: 125, y: 390 },
    polygonPoints: '75,280 155,275 180,340 175,440 145,510 95,505 65,440 65,340',
    blocks: ['Garhwa Sadar', 'Meral', 'Ranka', 'Bhandaria', 'Majhiaon', 'Kandi', 'Bishunpura', 'Bhavnathpur', 'Nagar Untari', 'Dhurki', 'Ramna', 'Kharoundhi', 'Chiniya', 'Ramkanda', 'Dandai', 'Ketar', 'Danda', 'Baradih', 'Kisko', 'Sagma']
  },
  {
    id: 'latehar',
    name: 'Latehar',
    hindiName: 'लातेहार',
    division: 'Palamu',
    headquarters: 'Latehar',
    areaSqKm: 4291,
    population: '7,26,978',
    blocksCount: 9,
    digitizedRecords: '1,38,900',
    digitizationRate: 91.2,
    riskIndex: 'Low (14.3%)',
    activeCases: 32,
    color: '#BBF7D0',
    mapPin: { x: 290, y: 480 },
    polygonPoints: '200,430 280,425 365,450 385,500 355,545 275,545 205,510 185,465',
    blocks: ['Latehar Sadar', 'Chandwa', 'Balumath', 'Barwadih', 'Garu', 'Mahuadanr', 'Manika', 'Herhanj', 'Bariyatu']
  },
  {
    id: 'lohardaga',
    name: 'Lohardaga',
    hindiName: 'लोहरदगा',
    division: 'South Chotanagpur',
    headquarters: 'Lohardaga',
    areaSqKm: 1502,
    population: '4,61,790',
    blocksCount: 7,
    digitizedRecords: '98,400',
    digitizationRate: 94.0,
    riskIndex: 'Low (10.9%)',
    activeCases: 19,
    color: '#BAE6FD',
    mapPin: { x: 320, y: 565 },
    polygonPoints: '280,525 345,520 370,555 365,600 315,610 270,580 270,545',
    blocks: ['Lohardaga Sadar', 'Kuru', 'Bhandra', 'Kisko', 'Senha', 'Peshrar', 'Bagru']
  },
  {
    id: 'gumla',
    name: 'Gumla',
    hindiName: 'गुमला',
    division: 'South Chotanagpur',
    headquarters: 'Gumla',
    areaSqKm: 5360,
    population: '10,25,213',
    blocksCount: 12,
    digitizedRecords: '2,15,300',
    digitizationRate: 91.7,
    riskIndex: 'Low (13.7%)',
    activeCases: 44,
    color: '#FECDD3',
    mapPin: { x: 285, y: 660 },
    polygonPoints: '210,560 300,555 355,595 365,670 330,710 245,705 200,650 195,595',
    blocks: ['Gumla Sadar', 'Bishunpur', 'Chainpur', 'Dumri', 'Ghaghra', 'Kamdara', 'Sisai', 'Palkot', 'Basia', 'Raidih', 'Bharno', 'Albert Ekka (Jari)']
  },
  {
    id: 'simdega',
    name: 'Simdega',
    hindiName: 'सिमडेगा',
    division: 'South Chotanagpur',
    headquarters: 'Simdega',
    areaSqKm: 3774,
    population: '5,99,578',
    blocksCount: 10,
    digitizedRecords: '1,28,400',
    digitizationRate: 92.5,
    riskIndex: 'Low (12.1%)',
    activeCases: 25,
    color: '#DDD6FE',
    mapPin: { x: 290, y: 685 },
    polygonPoints: '200,670 290,665 375,690 380,725 320,735 235,735 190,705',
    blocks: ['Simdega Sadar', 'Kolebira', 'Bano', 'Jaldega', 'Thethaitangar', 'Bolba', 'Kurdeg', 'Kersai', 'Pakartanr', 'Bansjor']
  },
  {
    id: 'khunti',
    name: 'Khunti',
    hindiName: 'खूँटी',
    division: 'South Chotanagpur',
    headquarters: 'Khunti',
    areaSqKm: 2535,
    population: '5,31,885',
    blocksCount: 6,
    digitizedRecords: '1,12,600',
    digitizationRate: 93.8,
    riskIndex: 'Low (11.4%)',
    activeCases: 21,
    color: '#BAE6FD',
    mapPin: { x: 440, y: 680 },
    polygonPoints: '375,645 450,640 495,665 500,715 450,735 385,720 365,675',
    blocks: ['Khunti Sadar', 'Murhu', 'Karra', 'Torpa', 'Rania', 'Arki']
  },
  {
    id: 'west_singhbhum',
    name: 'West Singhbhum (WSB)',
    hindiName: 'पश्चिमी सिंहभूम',
    division: 'Kolhan',
    headquarters: 'Chaibasa',
    areaSqKm: 7224,
    population: '15,02,338',
    blocksCount: 18,
    digitizedRecords: '3,24,900',
    digitizationRate: 90.1,
    riskIndex: 'Medium (16.8%)',
    activeCases: 64,
    color: '#FECDD3',
    mapPin: { x: 480, y: 715 },
    polygonPoints: '400,695 500,690 545,710 540,740 440,740 395,725',
    blocks: ['Chaibasa (Sadar)', 'Chakradharpur', 'Jhinkpani', 'Khuntpani', 'Manjhari', 'Tonto', 'Jagannathpur', 'Kumardungi', 'Majhgaon', 'Noamundi', 'Gua', 'Sonua', 'Goilkera', 'Manoharpur', 'Anandpur', 'Bandgaon', 'Gudri', 'Hatgamharia']
  },
  {
    id: 'seraikela_kharsawan',
    name: 'Seraikela Kharsawan (SK)',
    hindiName: 'सरायकेला खरसावां',
    division: 'Kolhan',
    headquarters: 'Seraikela',
    areaSqKm: 2657,
    population: '10,65,056',
    blocksCount: 9,
    digitizedRecords: '2,29,700',
    digitizationRate: 94.8,
    riskIndex: 'Low (10.5%)',
    activeCases: 37,
    color: '#FEF08A',
    mapPin: { x: 560, y: 685 },
    polygonPoints: '505,650 580,645 615,675 605,725 550,735 505,700',
    blocks: ['Seraikela Sadar', 'Kharsawan', 'Gamharia', 'Adityapur', 'Chandil', 'Ichagarh', 'Kukru', 'Nimdih', 'Rajnagar']
  },
  {
    id: 'east_singhbhum',
    name: 'East Singhbhum (ESB)',
    hindiName: 'पूर्वी सिंहभूम',
    division: 'Kolhan',
    headquarters: 'Jamshedpur',
    areaSqKm: 3562,
    population: '22,93,919',
    blocksCount: 11,
    digitizedRecords: '4,65,200',
    digitizationRate: 97.2,
    riskIndex: 'Very Low (7.9%)',
    activeCases: 88,
    color: '#BBF7D0',
    mapPin: { x: 660, y: 690 },
    polygonPoints: '595,650 680,645 735,680 730,735 660,735 595,705',
    blocks: ['Jamshedpur (Golmuri & Jugsalai)', 'Potka', 'Patamda', 'Boram', 'Ghatshila', 'Musabani', 'Dumaria', 'Ghorabandha', 'Dhalbhumgarh', 'Baharagora', 'Chakulia']
  }
];

export const GIRIDIH_BLOCKS: BlockData[] = [
  {
    id: 'gawan',
    name: 'GAWAN',
    hindiName: 'गावां',
    districtId: 'giridih',
    headquarters: 'Gawan',
    areaSqKm: 382.4,
    population: '1,15,820',
    panchayatsCount: 18,
    villagesCount: 142,
    digitizedParcels: 32410,
    completionRate: 95.8,
    color: '#FED7AA',
    mapPin: { x: 330, y: 205 },
    polygonPoints: '245,85 340,75 410,120 425,205 385,245 320,240 260,200 240,140'
  },
  {
    id: 'tisri',
    name: 'TISRI',
    hindiName: 'तिसरी',
    districtId: 'giridih',
    headquarters: 'Tisri',
    areaSqKm: 428.1,
    population: '98,640',
    panchayatsCount: 15,
    villagesCount: 168,
    digitizedParcels: 28940,
    completionRate: 93.4,
    color: '#BAE6FD',
    mapPin: { x: 475, y: 205 },
    polygonPoints: '410,120 480,70 545,95 550,210 520,305 440,325 385,245 425,205'
  },
  {
    id: 'deori',
    name: 'DEORI',
    hindiName: 'देवरी',
    districtId: 'giridih',
    headquarters: 'Deori',
    areaSqKm: 435.6,
    population: '1,42,390',
    panchayatsCount: 22,
    villagesCount: 184,
    digitizedParcels: 39510,
    completionRate: 94.1,
    color: '#FBCFE8',
    mapPin: { x: 615, y: 325 },
    polygonPoints: '545,210 635,240 685,280 670,375 640,415 570,410 520,305 550,210'
  },
  {
    id: 'dhanwar',
    name: 'DHANWAR',
    hindiName: 'धनवार (राजधनवार)',
    districtId: 'giridih',
    headquarters: 'Rajdhanwar',
    areaSqKm: 341.2,
    population: '1,92,480',
    panchayatsCount: 31,
    villagesCount: 196,
    digitizedParcels: 47200,
    completionRate: 96.2,
    color: '#BAE6FD',
    mapPin: { x: 385, y: 415 },
    polygonPoints: '320,240 385,245 440,325 455,420 440,520 360,560 305,480 305,335'
  },
  {
    id: 'jamua',
    name: 'JAMUA',
    hindiName: 'जमुआ',
    districtId: 'giridih',
    headquarters: 'Jamua',
    areaSqKm: 472.8,
    population: '2,68,910',
    panchayatsCount: 42,
    villagesCount: 245,
    digitizedParcels: 64180,
    completionRate: 95.0,
    color: '#86EFAC',
    mapPin: { x: 575, y: 470 },
    polygonPoints: '455,420 570,410 640,415 675,480 645,580 540,580 470,550 440,520'
  },
  {
    id: 'bengabad',
    name: 'BENGABAD',
    hindiName: 'बेंगाबाद',
    districtId: 'giridih',
    headquarters: 'Bengabad',
    areaSqKm: 356.5,
    population: '1,54,720',
    panchayatsCount: 24,
    villagesCount: 172,
    digitizedParcels: 38400,
    completionRate: 93.9,
    color: '#C4B5FD',
    mapPin: { x: 730, y: 525 },
    polygonPoints: '675,480 755,420 830,510 840,610 760,620 660,620 645,580'
  },
  {
    id: 'birni',
    name: 'BIRNI',
    hindiName: 'बिरनी',
    districtId: 'giridih',
    headquarters: 'Birni',
    areaSqKm: 298.0,
    population: '1,45,300',
    panchayatsCount: 23,
    villagesCount: 153,
    digitizedParcels: 34620,
    completionRate: 94.7,
    color: '#A5F3FC',
    mapPin: { x: 430, y: 590 },
    polygonPoints: '360,560 440,520 470,550 540,580 525,640 460,680 395,680 340,625'
  },
  {
    id: 'sariya',
    name: 'SARIYA',
    hindiName: 'सरिया (सुरिया)',
    districtId: 'giridih',
    headquarters: 'Sariya',
    areaSqKm: 235.4,
    population: '1,32,150',
    panchayatsCount: 20,
    villagesCount: 118,
    digitizedParcels: 29800,
    completionRate: 95.3,
    color: '#FBCFE8',
    mapPin: { x: 365, y: 665 },
    polygonPoints: '340,625 395,680 460,680 475,735 385,735 240,710 240,645'
  },
  {
    id: 'bagodar',
    name: 'BAGODAR',
    hindiName: 'बगोदर',
    districtId: 'giridih',
    headquarters: 'Bagodar',
    areaSqKm: 284.6,
    population: '1,58,420',
    panchayatsCount: 25,
    villagesCount: 136,
    digitizedParcels: 36750,
    completionRate: 94.4,
    color: '#D9F99D',
    mapPin: { x: 300, y: 725 },
    polygonPoints: '240,645 240,710 385,735 375,745 270,745 180,720 180,665'
  },
  {
    id: 'dumri',
    name: 'DUMRI',
    hindiName: 'डुमरी',
    districtId: 'giridih',
    headquarters: 'Dumri',
    areaSqKm: 424.3,
    population: '2,24,080',
    panchayatsCount: 36,
    villagesCount: 198,
    digitizedParcels: 51200,
    completionRate: 96.0,
    color: '#BBF7D0',
    mapPin: { x: 485, y: 720 },
    polygonPoints: '460,680 525,640 575,690 580,747 430,747 385,735 475,735'
  },
  {
    id: 'pirtanr',
    name: 'PIRTANR',
    hindiName: 'पीरटांड़ (पारसनाथ / मधुबन)',
    districtId: 'giridih',
    headquarters: 'Pirtanr',
    areaSqKm: 395.7,
    population: '1,12,650',
    panchayatsCount: 17,
    villagesCount: 145,
    digitizedParcels: 26890,
    completionRate: 92.8,
    color: '#FBCFE8',
    mapPin: { x: 620, y: 725 },
    polygonPoints: '575,690 655,670 705,740 680,747 530,747 580,747'
  },
  {
    id: 'giridih',
    name: 'GIRIDIH',
    hindiName: 'गिरिडीह (सदर)',
    districtId: 'giridih',
    headquarters: 'Giridih Sadar',
    areaSqKm: 412.9,
    population: '3,84,200',
    panchayatsCount: 46,
    villagesCount: 224,
    digitizedParcels: 84320,
    completionRate: 97.4,
    color: '#FEF08A',
    mapPin: { x: 650, y: 655 },
    polygonPoints: '645,580 660,620 740,610 740,695 655,670 575,690 540,580'
  },
  {
    id: 'gande',
    name: 'GANDE',
    hindiName: 'गांडेय',
    districtId: 'giridih',
    headquarters: 'Gandey',
    areaSqKm: 362.2,
    population: '1,76,340',
    panchayatsCount: 26,
    villagesCount: 182,
    digitizedParcels: 41200,
    completionRate: 93.6,
    color: '#FECDD3',
    mapPin: { x: 785, y: 695 },
    polygonPoints: '760,620 840,610 885,690 845,740 735,740 740,695 740,610'
  }
];

export const DIVISION_LIST = [
  'All Divisions',
  'North Chotanagpur',
  'South Chotanagpur',
  'Santhal Pargana',
  'Palamu',
  'Kolhan'
];
