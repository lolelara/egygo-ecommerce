import {
    Smartphone,
    Shirt,
    Home,
    Gamepad2,
    Watch,
    Gift,
    Headphones,
    Laptop,
    Camera,
    Baby,
    Dumbbell,
    Car,
    Book,
    Utensils,
    Briefcase,
    Footprints,
    Glasses,
    ShoppingBag,
    Sparkles,
    LucideIcon,
    Monitor,
    Tablet,
    Printer,
    Wifi,
    Tv,
    Speaker,
    Music,
    Armchair,
    Bed,
    Lamp,
    Refrigerator,
    WashingMachine,
    ChefHat,
    Coffee,
    Bike,
    Plane,
    Hammer,
    Wrench,
    Palette,
    Scissors,
    Pen,
    Wallet,
    Gem,
    Crown,
    Puzzle,
    Smile,
    Pill,
    Stethoscope,
    Dog,
    Fish,
    Bird,
    Flower,
    Apple,
    Beef,
    Milk,
    Candy,
    Ticket,
    Tag,
    Euro,
    DollarSign,
    CreditCard,
    Map,
    Globe,
    Building,
    Truck,
    Package,
    Percent,
    Search,
    Filter,
    User,
    Users,
    Lock,
    Key,
    Bell,
    Mail,
    Phone,
    Play,
    Settings,
    Image,
    Video,
    Mic,
    Heart,
    Star,
    Sun,
    Moon,
    Cloud,
    Umbrella,
    Zap,
    Flame,
    Droplets,
    Snowflake,
    Thermometer,
    Activity,
    Syringe,
    Bone,
    Brain,
    Eye,
    Ear,
    Hand,
    Cat,
    Rabbit,
    Leaf,
    Mountain,
    Tent,
    Compass,
    Flag,
    Landmark,
    Store,
    Factory,
    Warehouse,
    Container,
    Box,
    BadgeCheck,
    BadgeAlert,
    BadgeInfo,
    BadgeHelp,
    BadgePlus,
    BadgeMinus,
    BadgeX,
    Bitcoin,
    Component,
    Blocks,
    Layers,
    Layout,
    Grid,
    List,
    Menu,
    MoreHorizontal,
    MoreVertical,
    Plus,
    Minus,
    X,
    Check,
    Info,
    AlertCircle,
    AlertTriangle,
    HelpCircle,
    SortAsc,
    SortDesc,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsUp,
    ChevronsDown,
    ChevronsLeft,
    ChevronsRight,
    Download,
    Upload,
    Share,
    Save,
    Trash,
    Edit,
    Copy,
    Clipboard,
    UserPlus,
    UserMinus,
    UserCheck,
    UserX,
    Unlock,
    Shield,
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    BellOff,
    MessageSquare,
    MessageCircle,
    VideoOff,
    MicOff,
    Volume,
    Volume1,
    Volume2,
    VolumeX,
    Pause,
    StopCircle,
    Rewind,
    FastForward,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
    Maximize,
    Minimize,
    Move,
    Crop,
    ZoomIn,
    ZoomOut,
    RotateCw,
    RotateCcw,
    RefreshCw,
    RefreshCcw,
    Loader,
    Loader2,
    Power,
    LogOut,
    LogIn,
    ExternalLink,
    Link,
    Unlink,
    Paperclip,
    Anchor,
    MapPin,
    Navigation,
    Crosshair,
    Target,
    Disc,
    Circle,
    Square,
    Triangle,
    Hexagon,
    Octagon,
    Pentagon,
    ThumbsUp,
    ThumbsDown,
    Frown,
    Meh,
    Clock,
    Calendar,
    CalendarDays,
    CalendarRange,
    Timer,
    Hourglass,
    AlarmClock,
    History,
    Archive,
    Inbox,
    Send,
    Reply,
    ReplyAll,
    Forward,
    Undo,
    Redo,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Terminal,
    Command,
    Hash,
    AtSign,
    PoundSterling,
    JapaneseYen,
    RussianRuble,
    IndianRupee,
    SwissFranc,
    Currency,
    Banana,
    Carrot,
    Wine,
    Beer,
    IceCream,
    Cake,
    Cookie,
    Croissant,
    Egg,
    Grape,
    Martini,
    Nut,
    Popcorn,
    Salad,
    Soup,
    Wheat,
    Vegan,
    Cigarette,
    CigaretteOff,
    PillBottle,
    HeartPulse,
    HeartCrack,
    BrainCircuit,
    Dna,
    Microscope,
    FlaskConical,
    TestTube,
    TestTubes,
    Atom,
    Orbit,
    Rocket,
    Satellite,
    SatelliteDish,
    Radio,
    RadioTower,
    Signal,
    SignalHigh,
    SignalLow,
    SignalMedium,
    SignalZero,
    WifiOff,
    Bluetooth,
    BluetoothConnected,
    BluetoothOff,
    BluetoothSearching,
    Cast,
    Airplay,
    ScreenShare,
    ScreenShareOff,
    Projector,
    Tv2,
    SmartphoneCharging,
    SmartphoneNfc,
    TabletSmartphone,
    MousePointer,
    MousePointer2,
    MousePointerClick,
    Pointer,
    Touchpad,
    TouchpadOff,
    KeyboardMusic,
    Piano,
    Guitar,
    Drum,
    Mic2,
    Music2,
    Music3,
    Music4
} from 'lucide-react';

export const getCategoryIcon = (categoryName: string, slug: string): LucideIcon => {
    const term = (categoryName + ' ' + slug).toLowerCase();

    // Electronics & Gadgets
    if (term.includes('iphone') || term.includes('samsung') || term.includes('mobile') || term.includes('phone') || term.includes('هاتف') || term.includes('موبايل')) return Smartphone;
    if (term.includes('tablet') || term.includes('ipad') || term.includes('تابلت') || term.includes('ايباد')) return Tablet;
    if (term.includes('laptop') || term.includes('notebook') || term.includes('macbook') || term.includes('لابتوب')) return Laptop;
    if (term.includes('desktop') || term.includes('pc') || term.includes('computer') || term.includes('كمبيوتر')) return Monitor;
    if (term.includes('watch') || term.includes('smartwatch') || term.includes('wearable') || term.includes('ساعة')) return Watch;
    if (term.includes('headphone') || term.includes('headset') || term.includes('earphone') || term.includes('سماعة')) return Headphones;
    if (term.includes('camera') || term.includes('dslr') || term.includes('lens') || term.includes('كاميرا')) return Camera;
    if (term.includes('tv') || term.includes('television') || term.includes('screen') || term.includes('تلفزيون') || term.includes('شاشة')) return Tv;
    if (term.includes('game') || term.includes('console') || term.includes('ps5') || term.includes('xbox') || term.includes('playstation') || term.includes('ألعاب')) return Gamepad2;
    if (term.includes('printer') || term.includes('scanner') || term.includes('طابعة')) return Printer;
    if (term.includes('network') || term.includes('wifi') || term.includes('router') || term.includes('شبكة')) return Wifi;
    if (term.includes('speaker') || term.includes('audio') || term.includes('sound') || term.includes('صوت')) return Speaker;

    // Fashion & Accessories
    if (term.includes('shirt') || term.includes('t-shirt') || term.includes('top') || term.includes('blouse') || term.includes('قميص')) return Shirt;
    if (term.includes('dress') || term.includes('gown') || term.includes('frock') || term.includes('فستان')) return Gem; // Using Gem for elegance
    if (term.includes('shoe') || term.includes('sneaker') || term.includes('boot') || term.includes('sandal') || term.includes('حذاء')) return Footprints;
    if (term.includes('bag') || term.includes('purse') || term.includes('handbag') || term.includes('backpack') || term.includes('حقيبة') || term.includes('شنطة')) return ShoppingBag;
    if (term.includes('glasses') || term.includes('sunglasses') || term.includes('eyewear') || term.includes('نظارة')) return Glasses;
    if (term.includes('jewelry') || term.includes('necklace') || term.includes('ring') || term.includes('earring') || term.includes('مجوهرا')) return Gem;
    if (term.includes('wallet') || term.includes('purse') || term.includes('محفظة')) return Wallet;
    if (term.includes('hat') || term.includes('cap') || term.includes('beanie') || term.includes('قبعة')) return Crown; // Closest to hat

    // Home & Living
    if (term.includes('furniture') || term.includes('sofa') || term.includes('chair') || term.includes('table') || term.includes('أثاث') || term.includes('كنبة')) return Armchair;
    if (term.includes('bed') || term.includes('mattress') || term.includes('pillow') || term.includes('سرير')) return Bed;
    if (term.includes('kitchen') || term.includes('cook') || term.includes('chef') || term.includes('مطبخ')) return ChefHat;
    if (term.includes('appliance') || term.includes('fridge') || term.includes('refrigerator') || term.includes('ثلاجة')) return Refrigerator;
    if (term.includes('washing') || term.includes('laundry') || term.includes('washer') || term.includes('غسالة')) return WashingMachine;
    if (term.includes('lamp') || term.includes('light') || term.includes('bulb') || term.includes('lighting') || term.includes('إضاءة')) return Lamp;
    if (term.includes('decor') || term.includes('art') || term.includes('painting') || term.includes('ديكور')) return Palette;
    if (term.includes('garden') || term.includes('plant') || term.includes('flower') || term.includes('حديقة') || term.includes('زرع')) return Flower;

    // Health & Beauty
    if (term.includes('makeup') || term.includes('cosmetic') || term.includes('lipstick') || term.includes('beauty') || term.includes('مكياج') || term.includes('تجميل')) return Sparkles;
    if (term.includes('perfume') || term.includes('fragrance') || term.includes('scent') || term.includes('عطر')) return Sparkles; // Fallback to Sparkles
    if (term.includes('skin') || term.includes('face') || term.includes('cream') || term.includes('lotion') || term.includes('بشرة')) return Smile;
    if (term.includes('hair') || term.includes('shampoo') || term.includes('conditioner') || term.includes('شعر')) return Scissors; // For haircut/salon
    if (term.includes('health') || term.includes('medical') || term.includes('pharmacy') || term.includes('drug') || term.includes('صحة') || term.includes('دواء')) return Stethoscope;
    if (term.includes('vitamin') || term.includes('supplement') || term.includes('pill') || term.includes('فيتامين')) return Pill;
    if (term.includes('fitness') || term.includes('gym') || term.includes('workout') || term.includes('exercise') || term.includes('رياضة')) return Dumbbell;

    // Kids & Baby
    if (term.includes('baby') || term.includes('infant') || term.includes('newborn') || term.includes('رضيع') || term.includes('بيبي')) return Baby;
    if (term.includes('toy') || term.includes('doll') || term.includes('lego') || term.includes('puzzle') || term.includes('لعبة') || term.includes('ألعاب')) return Puzzle;
    if (term.includes('kid') || term.includes('child') || term.includes('boy') || term.includes('girl') || term.includes('أطفال')) return Smile;

    // Food & Grocery
    if (term.includes('food') || term.includes('meal') || term.includes('snack') || term.includes('طعام') || term.includes('أكل')) return Utensils;
    if (term.includes('fruit') || term.includes('vegetable') || term.includes('produce') || term.includes('فاكهة') || term.includes('خضار')) return Apple;
    if (term.includes('drink') || term.includes('beverage') || term.includes('juice') || term.includes('water') || term.includes('مشروب')) return Coffee; // Fallback to Coffee/Cup
    if (term.includes('coffee') || term.includes('tea') || term.includes('cafe') || term.includes('قهوة')) return Coffee;
    if (term.includes('sweet') || term.includes('candy') || term.includes('chocolate') || term.includes('dessert') || term.includes('حلوى')) return Candy;
    if (term.includes('meat') || term.includes('beef') || term.includes('chicken') || term.includes('لحم')) return Beef;
    if (term.includes('dairy') || term.includes('milk') || term.includes('cheese') || term.includes('ألبان')) return Milk;

    // Automotive & Tools
    if (term.includes('car') || term.includes('auto') || term.includes('vehicle') || term.includes('سيارة')) return Car;
    if (term.includes('bike') || term.includes('bicycle') || term.includes('motorcycle') || term.includes('دراجة')) return Bike;
    if (term.includes('tool') || term.includes('hardware') || term.includes('drill') || term.includes('hammer') || term.includes('أدوات')) return Hammer;
    if (term.includes('repair') || term.includes('fix') || term.includes('maintenance') || term.includes('صيانة')) return Wrench;

    // Office & School
    if (term.includes('book') || term.includes('novel') || term.includes('magazine') || term.includes('كتاب')) return Book;
    if (term.includes('pen') || term.includes('pencil') || term.includes('stationery') || term.includes('paper') || term.includes('قرطاسية')) return Pen;
    if (term.includes('school') || term.includes('education') || term.includes('study') || term.includes('مدرسة') || term.includes('تعليم')) return Briefcase; // Fallback
    if (term.includes('office') || term.includes('desk') || term.includes('business') || term.includes('مكتب')) return Briefcase;

    // Pets
    if (term.includes('pet') || term.includes('dog') || term.includes('cat') || term.includes('animal') || term.includes('حيوان')) return Dog;
    if (term.includes('fish') || term.includes('aquarium') || term.includes('سمك')) return Fish;
    if (term.includes('bird') || term.includes('parrot') || term.includes('طائر')) return Bird;

    // Others
    if (term.includes('gift') || term.includes('present') || term.includes('box') || term.includes('هدية')) return Gift;
    if (term.includes('travel') || term.includes('trip') || term.includes('luggage') || term.includes('سفر')) return Plane;
    if (term.includes('music') || term.includes('instrument') || term.includes('guitar') || term.includes('piano') || term.includes('موسيقى')) return Music;
    if (term.includes('art') || term.includes('craft') || term.includes('draw') || term.includes('paint') || term.includes('فن')) return Palette;

    // Default
    return ShoppingBag;
};

