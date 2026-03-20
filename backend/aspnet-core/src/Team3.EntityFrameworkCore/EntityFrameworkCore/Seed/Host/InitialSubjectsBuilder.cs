using System;
using System.Collections.Generic;
using System.Linq;
using Team3.Academic;
using Team3.Configuration;
using Team3.Enums;

namespace Team3.EntityFrameworkCore.Seed.Host;

public class InitialSubjectsBuilder
{
    private const string DefaultGradeLevel = "Grade 12";

    private readonly Team3DbContext _context;

    // (SubjectName, EnglishDescription, ZuluName, ZuluDescription, SesothoName, SesothoDescription, afrikaansName, afrikaansDescription)
    private static readonly IReadOnlyList<SubjectSeedData> InitialSubjects =
    [
        new("Life Sciences", "Study of living organisms and biological processes",
            "Isayensi Yezinto Eziphilayo", "Ukufunda ngezinto eziphilayo nezinqubo zezomdabu",
            "Saense ya Bophelo", "Thuto ea lintho tse phelang le mekhoa ea bona",
            "Lewenswetenskappe", "Studie van lewende organismes en biologiese prosesse",
        [
            new("Nucleic Acids", "DNA and RNA structure and function",
                "Ama-Nucleic Acids", "Isakhiwo nomsebenzi we-DNA ne-RNA",
                "Nucleic Acids", "Moralo le mosebetsi oa DNA le RNA",
                "Nukleïensure", "DNA en RNA struktuur en funksie"),
            new("Meiosis", "Cell division for sexual reproduction",
                "I-Meiosis", "Ukuhlukaniswa kweseli wokuzala ngezocansi",
                "Meiosis", "Kabo ea lisele bakeng sa tsoalo ea thobalano",
                "Meiose", "Seldeling vir geslagtelike voortplanting"),
            new("Reproduction", "Sexual and asexual reproduction in organisms",
                "Ukuzalana", "Ukuzala ngezocansi nokuzala ngaphandle kwezocansi ezidalweni",
                "Tsoalo", "Tsoalo ea thobalano le e seng ea thobalano ho lihlahlahaneng",
                "Voortplanting", "Geslagtelike en ongesltagtelike voortplanting in organismes"),
            new("Genetics", "Heredity and genetic variation",
                "Izimfuzo", "Ukuzalwa kwezimfuzo nezinguquko kwezimfuzo",
                "Genetics", "Bosali le phapang ea jenetiki",
                "Genetika", "Oorerwing en genetiese variasie"),
            new("Nervous System", "Structure and function of the nervous system",
                "Uhlelo Lwezinzwa", "Isakhiwo nomsebenzi wohlelo lwezinzwa",
                "Tsamaiso ea Methapo", "Moralo le mosebetsi oa tsamaiso ea methapo",
                "Senuweestelsel", "Struktuur en funksie van die senuweestelsel"),
            new("Endocrine System", "Hormones and endocrine glands",
                "Uhlelo Lwe-Endocrine", "Amahomoni nezitho ze-endocrine",
                "Tsamaiso ea Endocrine", "Lihoromone le lihlahla tsa endocrine",
                "Endokriene Stelsel", "Hormone en endokriene kliere"),
            new("Plant Response", "How plants respond to stimuli",
                "Indlela Izitshalo Eziphendula Ngayo", "Ukuphendula kwezitshalo ezivuselelayo",
                "Karabo ea Limela", "Hore na limela li arabela joang likhothatsong",
                "Plantreaksie", "Hoe plante op prikkels reageer"),
            new("Evolution", "Theory of evolution and natural selection",
                "Ukuphulea", "Ithiyori yokuphulea ukukhetha kwemvelo",
                "Evolusho", "Khopolo ea evolusho le khetho ea tlhaho",
                "Evolusie", "Teorie van evolusie en natuurlike seleksie"),
        ]),

        new("Physical Sciences", "Study of physics and chemistry",
            "Isayensi Yemvelo", "Ukufunda kwezimvelo nezokhethi",
            "Saense ea Maikemisetso", "Thuto ea fisiks le khemistri",
            "Fisiese Wetenskappe", "Studie van fisika en chemie",
        [
            new("Mechanics: Force and Newton's Laws", "Forces and Newton's laws of motion",
                "Imithetho YoMzimba Nemithetho YakaNyutoni", "Amandla nemithetho kaNewton yokuhamba",
                "Mekaniki: Matla le Melao ea Newton", "Matla le melao ea Newton ea motsamao",
                "Meganika: Krag en Newton se Wette", "Kragte en Newton se bewegingswette"),
            new("Momentum and Impulse", "Linear momentum and impulse",
                "Isivinini Nesisusa", "Isivinini esiqondile nesisusa",
                "Momantamo le Impulse", "Momantamo oa motsoako le impulse",
                "Momentum en Impuls", "Lineêre momentum en impuls"),
            new("Vertical projectile motion in one dimension", "Motion under gravity",
                "Ukuhamba Kwento Ephonswayo Ngokomtsi Ompo", "Ukuhamba ngaphansi komthelela womzimba",
                "Motsamao oa projectile o otlolohileng ka lehlakoreng le le leng", "Motsamao tlas'a khohlomelo",
                "Vertikale projektielbeweging in een dimensie", "Beweging onder swaartekrag"),
            new("Work, Energy and Power", "Work, kinetic and potential energy",
                "Umsebenzi, Amandla Namandla Okusebenza", "Umsebenzi, amandla ahambayo namandla angenzeki",
                "Mosebetsi, Matla le Maatla", "Mosebetsi, matla a tsamaelang le matla a potenšale",
                "Werk, Energie en Drywing", "Werk, kinetiese en potensiële energie"),
            new("Doppler Effect", "Change in frequency due to relative motion",
                "Umthelela WeDoppler", "Ushintsho lwemvamwi ngenxa yokuhamba okuhambelana",
                "Phello ea Doppler", "Phetoho ea frequency ka lebaka la motsamao o amanang",
                "Doppler-effek", "Verandering in frekwensie weens relatiewe beweging"),
            new("Electrostatics", "Static electric charges and fields",
                "I-Electrostatics", "Amashaji kagesi amile nezinkambu zagesi",
                "Electrostatics", "Likhaji tsa motlakase tse emiseng le masimo",
                "Elektrostatika", "Statiese elektriese ladings en velde"),
            new("Electric Circuits", "Current, voltage and resistance in circuits",
                "Izinqubo Zagesi", "Umgudu, ithenshinh nokumelana ezinqubweni zagesi",
                "Litikoloho tsa Motlakase", "Kerese, voltage le khanyetso litikolohong",
                "Elektriese Stroombane", "Stroom, spanning en weerstand in stroombane"),
            new("Electrodynamics", "Generators and motors",
                "I-Electrodynamics", "Izinjini zokwenza ugesi nezinjini zokusebenza",
                "Electrodynamics", "Li-generator le li-motor",
                "Elektrodinamika", "Generators en motors"),
            new("Optical phenomena and properties of materials", "Light and optical properties",
                "Izinkambu Zokukhanya Nezimpahla Zezinto", "Ukukhanya nezimpahla zokunakeka",
                "Dipontšo tsa Leseli le Thepa ea Lintho", "Leseli le thepa ea ho bona",
                "Optiese verskynsels en eienskappe van materiale", "Lig en optiese eienskappe"),
            new("Organic Chemistry", "Carbon compounds and reactions",
                "Ukhemikhali Wemvelo", "Izinhlanganisela zekhabhoni nezindlela zokusebenzana",
                "Khemistri ea Organic", "Likhomphaonte tsa kharbone le likarabelo",
                "Organiese Chemie", "Koolstofverbindings en reaksies"),
            new("Rate and Extent of Reaction", "Reaction rates and factors affecting them",
                "Isivinini Nesikhathi Sokuphenduka", "Isivinini sokuphenduka nezinto ezisithintayo",
                "Lebelo le Bogolo ba Karabelo", "Lebelo la karabelo le lintlha tse ama tsona",
                "Reaksietempo en -omvang", "Reaksietempo en faktore wat dit beïnvloed"),
            new("Chemical Equilibrium", "Reversible reactions and equilibrium",
                "Ukuqiniseka Kwezokhethi", "Izindlela zokubuyisela nokulingana",
                "Tekanelo ea Khemikale", "Likarabelo tse khutlisang le tekanelo",
                "Chemiese Ewewig", "Omkeerbare reaksies en ewewig"),
            new("Acids and Bases", "Acid-base reactions and pH",
                "Ama-Asidi Nezisekelo", "Izindlela zama-asidi nezisekelo ne-pH",
                "Lisase le Mabasi", "Likarabelo tsa asiti-bese le pH",
                "Sure en Basisse", "Suur-basis reaksies en pH"),
            new("Electrochemistry", "Galvanic and electrolytic cells",
                "I-Electrochemistry", "Iziseli ze-galvanic ne-electrolytic",
                "Electrokhemistri", "Lisele tsa galvaniki le electrolytic",
                "Elektrochemie", "Galvaniese en elektrolitiese selle"),
        ]),

        new("Business Studies", "Study of business principles and practices",
            "Izifundo Zokuphatha Ibhizinisi", "Ukufunda izimgomo nezinqubo zebhizinisi",
            "Lithuto tsa Khoebo", "Thuto ea mehlala le mekhoa ea khoebo",
            "Besigheidstudies", "Studie van besigheidsbeginsels en -praktyke",
        [
            new("Legislation", "Business laws and regulations",
                "Imithetho", "Imithetho nezithangami zebhizinisi",
                "Molao", "Melao le melaotheo ea khoebo",
                "Wetgewing", "Besigheidswette en -regulasies"),
            new("Human Resources Function", "HR management and functions",
                "Umsebenzi Wezinsiza Zabantu", "Ukuphatha nezisebenzo zezinsiza zabantu",
                "Mosebetsi oa Mehloli ea Batho", "Taolo le mesebetsi ea mehloli ea batho",
                "Menslike Hulpbronfunksie", "MH-bestuur en -funksies"),
            new("Ethics and Professionalism", "Business ethics and professional conduct",
                "Ukuziphatha Nokwenza Ngokuqeqeshwa", "Ukuziphatha kwezebhizinisi nokwenza ngokuqeqeshwa",
                "Boitšoaro le Boithati", "Boitšoaro ba khoebo le boithati ba mosebetsi",
                "Etiek en Professionalisme", "Besigheidsehiek en professionele gedrag"),
            new("Creative Thinking and Problem-Solving", "Innovation and problem-solving strategies",
                "Ukucabanga Okunobuchwepheshe Nokuxazulula Izinkinga", "Ubusha nezindlela zokuxazulula izinkinga",
                "Ho Nahana ka Boqapi le Ho Rarolla Mathata", "Boqapi le maano a ho rarolla mathata",
                "Kreatiewe Denke en Probleemoplossing", "Innovasie en probleemoplossingstrategieë"),
            new("Macro Environment; Business Strategies", "External environment and business strategy",
                "Imvelo Enkulu Nezindlela Zebhizinisi", "Imvelo yangaphandle nezindlela zebhizinisi",
                "Tikoloho ea Macro; Maano a Khoebo", "Tikoloho ea kantle le maano a khoebo",
                "Makro-omgewing; Besigheidsstrategieë", "Eksterne omgewing en besigheidsstrategie"),
            new("CSR and CSI", "Corporate social responsibility and investment",
                "Uxanduva Lomphakathi Nebhizinisi Nezikhwama", "Uxanduva lomphakathi lwamabhizinisi nezimali",
                "CSR le CSI", "Boikarabelo ba sechaba sa korporashe le peeletso",
                "KSV en KSI", "Korporatiewe sosiale verantwoordelikheid en belegging"),
            new("Human Rights, Inclusivity and Environmental Issues", "Rights and environmental responsibility",
                "Amalungelo Abantu, Ukubandakanya Nezinkinga Zemvelo", "Amalungelo nezibopho zemvelo",
                "Litokelo tsa Botho, Ho Kenyelletsa le Mathata a Tikoloho", "Litokelo le boikarabelo ba tikoloho",
                "Menseregte, Inklusiwiteit en Omgewingskwessies", "Regte en omgewingsverantwoordelikheid"),
            new("Team Performance Assessment and Conflict Resolution", "Team dynamics and conflict management",
                "Ukuhlolwa Kwenhlalakahle Yethimba Nokuxazulula Izingxabano", "Ukusebenza kwethimba nokuxazulula izingxabano",
                "Tekolo ea Tšebetso ea Sehlopha le Ho Rarolla Ho Pheta-pheta", "Tšebetso ea sehlopha le taolo ea ho pheta-pheta",
                "Spanprestasiebeoordeling en Konflikoplossing", "Spandinamika en konflikbestuur"),
            new("Business Sectors and Their Environments", "Primary, secondary and tertiary sectors",
                "Izikhungo Zebhizinisi Nemvelo Yazo", "Izikhungo zokuqala, ezesibili nezesithathu",
                "Likarolo tsa Khoebo le Tikoloho Tsona", "Likarolo tsa pele, tsa bobeli le tsa boraro",
                "Besigheidssektore en Hul Omgewings", "Primêre, sekondêre en tersiêre sektore"),
            new("Management and Leadership", "Management styles and leadership",
                "Ukuphatha Nobuholi", "Izindlela zokuphatha nobuholi",
                "Taolo le Boetapele", "Mekhoa ea taolo le boetapele",
                "Bestuur en Leierskap", "Bestuurstyle en leierskap"),
            new("Quality of Performance", "Quality management in business",
                "Ikhwalithi Yokusebenza", "Ukuphatha ikhwalithi ebhizinisini",
                "Boleng ba Tšebetso", "Taolo ea boleng khoebong",
                "Gehalte van Prestasie", "Gehaltbestuur in besighede"),
            new("Investment; Securities", "Investment instruments and securities",
                "Ukutshalwa Kwemali; Izimpahla Zokuvikela", "Izinsiza zokutshalwa kwemali nezimpahla",
                "Peeletso; Ts'ireletso", "Lisebelisoa tsa peeletso le ts'ireletso",
                "Belegging; Sekuriteite", "Beleggingsinstrumente en sekuriteite"),
            new("Investment; Insurance", "Insurance as an investment tool",
                "Ukutshalwa Kwemali; Umshwalense", "Umshwalense njengensiza yokutshalwa kwemali",
                "Peeletso; Inshorense", "Inshorense e le sesebelisoa sa peeletso",
                "Belegging; Versekering", "Versekering as beleggingsinstrument"),
            new("Forms of Ownership", "Business ownership structures",
                "Izindlela Zobunikazi", "Izakhiwo zobunikazi bebhizinisi",
                "Mekoa ea Bong", "Maatla a bong ba khoebo",
                "Vorme van Eienaarskap", "Besigheidseienaarskapsstrukture"),
            new("Presentation and Data Response", "Business presentations and data interpretation",
                "Ukwethulwa Nokusabela Kwedatha", "Ukwethulwa kwamabhizinisi nokuhumusha idatha",
                "Ntlafatso le Karabo ea Data", "Lintlafatso tsa khoebo le tlhaloso ea data",
                "Aanbieding en Data-respons", "Besigheidspresentasies en data-interpretasie"),
        ]),

        new("Mathematics", "Study of numbers, algebra, geometry and calculus",
            "Izibalo", "Ukufunda izinombolo, i-algebra, ijiyomethri ne-calculus",
            "Mathematics", "Thuto ea linomoro, algebra, geometry le calculus",
            "Wiskunde", "Studie van getalle, algebra, geometrie en calculus",
        [
            new("Exponents and Surds", "Laws of exponents and surds",
                "Imithetho Yezinombolo Ezikhulayo Nezimpande", "Imithetho yezinombolo ezikhulayo nezimpande",
                "Lieksponente le Masurdi", "Melao ea lieksponente le masurdi",
                "Eksponente en Surde", "Wette van eksponente en surde"),
            new("Algebra", "Algebraic expressions and equations",
                "I-Algebra", "Izibonelo ze-algebra nezibalo",
                "Algebra", "Litšupiso tsa algebra le li-equation",
                "Algebra", "Algebraïese uitdrukkings en vergelykings"),
            new("Number Patterns, Sequences and Series", "Arithmetic and geometric sequences",
                "Imikhakha Yezinombolo, Ukulandela Nezinhlanganisela", "Ukulandela kwezibalo nezinhlanganisela",
                "Mekhoa ea Linomoro, Maahelo le Letoto", "Maahelo a arithmetic le a geometric",
                "Getalpatrone, Rye en Reekse", "Rekenkundige en meetkundige rye"),
            new("Functions", "Types of functions and their graphs",
                "Imisebenzi", "Izinhlobo zemisebenzi namagrafu azo",
                "Mesebetsi", "Mefuta ea mesebetsi le ligrafo tsa eona",
                "Funksies", "Tipes funksies en hul grafieke"),
            new("Trig Functions", "Trigonometric functions and graphs",
                "Imisebenzi ye-Trig", "Imisebenzi ye-trigonometric namagrafu azo",
                "Mesebetsi ea Trig", "Mesebetsi ea trigonometric le ligrafo",
                "Trig-funksies", "Trigonometriese funksies en grafieke"),
            new("Finance Growth and Decay", "Compound interest and depreciation",
                "Ukukhula Nokwehla Kwemali", "Inzalo evelayo nokwehla kwenani",
                "Kholo le Phokotso ea Lichelete", "Thaelo e kopaneng le phokotso",
                "Finansiële Groei en Verval", "Saamgestelde rente en depresiasie"),
            new("Calculus", "Differentiation and integration",
                "I-Calculus", "Ukuhlukanisa nokuhlanganisa",
                "Calculus", "Phapano le kopanyo",
                "Calculus", "Differensiasie en integrasie"),
            new("Probability", "Probability rules and counting principles",
                "Ukwenzeka", "Imithetho yokwenzeka nezimiso zokubalwa",
                "Monyetla", "Melao ea monyetla le mehlala ea ho bala",
                "Waarskynlikheid", "Waarskynlikheidsreëls en telbeginsels"),
            new("Analytical Geometry", "Coordinate geometry",
                "IJiyomethri Ehlolayo", "Ijiyomethri yezinkomba",
                "Geometry ea Analytical", "Geometry ea coordinate",
                "Analitiese Geometrie", "Koördinaat geometrie"),
            new("Trigonometry; Sine, Cosine and Area Rules", "Solving triangles using trig rules",
                "I-Trigonometry; Imithetho ye-Sine, ye-Cosine Nenhlangothi", "Ukuxazulula izinxantathu ngemithetho ye-trig",
                "Trigonometry; Melao ea Sine, Cosine le Sebaka", "Ho rarolla likhutlo tse tharo ka melao ea trig",
                "Trigonometrie; Sinus-, Cosinus- en Oppervlaktereëls", "Driehoeke oplos met trig-reëls"),
            new("Euclidean Geometry", "Circle geometry and proofs",
                "IJiyomethri YamaGirikhi", "Ijiyomethri yesiyingi nezibonelo",
                "Geometry ea Euclidean", "Geometry ea sediko le liprofi",
                "Euklidiese Geometrie", "Sirkelgeometrie en bewyse"),
            new("Statistics", "Data analysis and statistics",
                "Izibalo Eziphezulu", "Ukuhlaziya idatha nezibalo",
                "Estatistiki", "Tlhahlobo ea data le statistiki",
                "Statistiek", "Data-analise en statistiek"),
        ]),

        new("Mathematical Literacy", "Applied mathematics for everyday life",
            "Ulwazi Lwezibalo", "Izibalo ezisetshenziswa empilweni yansuku zonke",
            "Bongoan ba Lipalo", "Lipalo tse sebedisoang bophelong ba letsatsi le letsatsi",
            "Wiskundige Geletterdheid", "Toegepaste wiskunde vir die alledaagse lewe",
        [
            new("Finance", "Personal and business finance",
                "Ezezimali", "Ezezimali zomuntu nezebhizinisi",
                "Lichelete", "Lichelete tsa motho le tsa khoebo",
                "Finansies", "Persoonlike en besigheidsfinansies"),
            new("Measurements", "Units and measurement in context",
                "Ukukala", "Iziyini nokukalwa ngokwendaba",
                "Lipima", "Liyunit le pima molaong",
                "Metings", "Eenhede en meting in konteks"),
            new("Maps", "Map reading and scale",
                "Amabalazwe", "Ukufunda amabalazwe nesilinganiso",
                "Likarata", "Ho bala likarata le sekala",
                "Kaarte", "Kaartlees en skaal"),
            new("Data Handling", "Collecting and interpreting data",
                "Ukuphathwa Kwedatha", "Ukuqoqa nokuhumusha idatha",
                "Ho Sebedisa Data", "Ho kgotha le ho hlalosa data",
                "Datahantering", "Insameling en interpretasie van data"),
            new("Probability", "Basic probability in real contexts",
                "Ukwenzeka", "Ukwenzeka okuyisisekelo emimeni yangempela",
                "Monyetla", "Monyetla o motheo molaong wa nnete",
                "Waarskynlikheid", "Basiese waarskynlikheid in werklike kontekste"),
        ]),

        new("Dramatic Arts", "Study of theatre and performance",
            "Ubuciko Bokwenza", "Ukufunda indawo yemidlalo nokwenza",
            "Bonono ba Tšoao", "Thuto ea theatre le tšoao",
            "Dramatiese Kunste", "Studie van teater en uitvoering",
        [
            new("Section A: 20th Century Movements", "Theatre movements of the 20th century",
                "Isigaba A: Izintuthuko Zikhankhulu Lwe-20", "Izintuthuko zendawo yemidlalo yekhulu leminyaka lama-20",
                "Karolo A: Lintho tse Tsamaeang tsa Lekholo la bo20 la Lilemo", "Lintho tse tsamaeang tsa theatre tsa lekholo la bo20",
                "Afdeling A: 20ste-eeuse Bewegings", "Teaterbewegings van die 20ste eeu"),
            new("Section B: South African Theatre Pre-1994", "South African theatre before democracy",
                "Isigaba B: Indawo Yemidlalo YaseNingizimu Afrika Ngaphambi Kuka-1994", "Indawo yemidlalo yaseNingizimu Afrika ngaphambi kwedemokhrasi",
                "Karolo B: Theatre ea Afrika Boroa Pele ho 1994", "Theatre ea Afrika Boroa pele ho demokrasi",
                "Afdeling B: Suid-Afrikaanse Teater voor 1994", "Suid-Afrikaanse teater voor demokrasie"),
            new("Section C: South African Theatre Post-1994", "South African theatre after democracy",
                "Isigaba C: Indawo Yemidlalo YaseNingizimu Afrika Ngemuva Kuka-1994", "Indawo yemidlalo yaseNingizimu Afrika ngemuva kwedemokhrasi",
                "Karolo C: Theatre ea Afrika Boroa Ka mor'a 1994", "Theatre ea Afrika Boroa ka mor'a demokrasi",
                "Afdeling C: Suid-Afrikaanse Teater na 1994", "Suid-Afrikaanse teater na demokrasie"),
            new("Section D: The History of Theatre, Practical Concepts, Content and Skills", "Theatre history and practical skills",
                "Isigaba D: Umlando Wendawo Yemidlalo, Imiqondo Yokusetshenziswa, Okuqukethwe Nezakhono", "Umlando wezindawo zemidlalo nezakhono zokusetshenziswa",
                "Karolo D: Nalane ea Theatre, Mehopolo ea Ts'ebetso, Tlhahisoleseding le Lits'oants'o", "Nalane ea theatre le lits'oants'o tsa ts'ebetso",
                "Afdeling D: Die Geskiedenis van Teater, Praktiese Konsepte, Inhoud en Vaardighede", "Teatergeskiedenis en praktiese vaardighede"),
        ]),

        new("Tourism", "Study of the tourism industry",
            "Ezokuvakasha", "Ukufunda ngezimboni zokuvakasha",
            "Bohahlauli", "Thuto ea indasteri ea bohahlauli",
            "Toerisme", "Studie van die toerismebedryf",
        [
            new("Map Work and Tour Planning", "Reading maps and planning tours",
                "Ukusebenza Namabalazwe Nokuhlela Uhambo", "Ukufunda amabalazwe nokuhlela uhambo",
                "Mosebetsi oa Karata le Ho Rwalela Leeto", "Ho bala likarata le ho rwalela maeto",
                "Kaartwerk en Toerbeplanning", "Kaartlees en toerbeplanning"),
            new("Foreign Exchange", "Currency exchange and travel finance",
                "Imali Yezwe Lomuntu", "Ukushintsha imali nezezimali zohambo",
                "Phetisetso ea Lichelete tsa Naha e Nngwe", "Phetisetso ea lichelete le lichelete tsa leeto",
                "Buitelandse Valuta", "Valutaomruiling en reisfinansies"),
            new("Tourism Attractions", "Types of tourism attractions",
                "Izinto Ezidla Abantu Ukuvakasha", "Izinhlobo zezinto ezidla abantu ukuvakasha",
                "Lintho tse Hohang Bahalauli", "Mefuta ea lintho tse hohang bahalauli",
                "Toeristeaantreklikhede", "Tipes toeristeaantreklikhede"),
            new("Cultural and Heritage Tourism", "Cultural and heritage sites",
                "Ukuvakasha Ngokomlando Nesiko", "Izindawo zomlando nesiko",
                "Bohahlauli ba Setso le ba Lefa", "Libaka tsa setso le tsa lefa",
                "Kulturele en Erfenistoerisme", "Kulturele en erfenisplekke"),
            new("Marketing", "Tourism marketing strategies",
                "Ukuthengisa", "Izindlela zokuthengisa kwezokuvakasha",
                "Mmaraka", "Maano a mmaraka oa bohahlauli",
                "Bemarking", "Toerismebemarking strategieë"),
            new("Tourism Sectors", "Sectors of the tourism industry",
                "Izikhungo Zezokuvakasha", "Izikhungo zemboni yezokuvakasha",
                "Likarolo tsa Bohahlauli", "Likarolo tsa indasteri ea bohahlauli",
                "Toerismesektore", "Sektore van die toerismebedryf"),
            new("Sustainable and Responsible Tourism", "Eco-friendly tourism practices",
                "Ukuvakasha Okuqhubekayo Nokuthembekile", "Izinqubo zokuvakasha ezinobuhlakani kwimvelo",
                "Bohahlauli bo Tšoarellang le bo Ikarabellang", "Mekhoa ea bohahlauli e ntle ho tikoloho",
                "Volhoubare en Verantwoordelike Toerisme", "Omgewingsvriendelike toerismepraktyke"),
            new("Domestic, Regional and International Tourism", "Types of tourism by geography",
                "Ukuvakasha Kwasekhaya, Kwesifunda Naphesheya", "Izinhlobo zokuvakasha ngokwendawo",
                "Bohahlauli ba Lehae, ba Naha le ba Machabeng", "Mefuta ea bohahlauli ka tulo",
                "Binnelandse, Streeks- en Internasionale Toerisme", "Tipes toerisme volgens geografie"),
            new("Communication and Customer Care", "Customer service in tourism",
                "Ukuxhumana Nokunakekela Amakhasimende", "Inkonzo yamakhasimende kwezokuvakasha",
                "Puisano le Tlhokomelo ea Bareki", "Ts'ebeletso ea bareki bohahlauling",
                "Kommunikasie en Kliëntesorg", "Kliëntediens in toerisme"),
        ]),

        new("History", "Study of historical events and their impact",
            "Umlando", "Ukufunda ngemicimbi yomlando nomthelela wayo",
            "Nalane", "Thuto ea liketsahalo tsa nalane le tshusumetso ea tsona",
            "Geskiedenis", "Studie van historiese gebeure en hul impak",
        [
            new("The Cold War", "Superpower rivalry and the Cold War",
                "IMpi Ebandayo", "Ukuncintisana kwamazwe amakhulu neMpi Ebandayo",
                "Ntoa e Batang", "Phikisano ea mabusa a maholo le ntoa e batang",
                "Die Koue Oorlog", "Supermag-wedywering en die Koue Oorlog"),
            new("Independent Africa", "African independence movements",
                "IAfrika Elizimele", "Izintuthuko zenkululeko eAfrika",
                "Afrika e Ikemetseng", "Lintho tse tsamaeang tsa boipuso ba Afrika",
                "Onafhanklike Afrika", "Afrika-onafhanklikheidsbewegings"),
            new("Civil society protests from the 1950s to the 1970s", "Protest movements globally",
                "Izimangalo Zomphakathi Kusukela Ngo-1950 Kuya Ku-1970", "Izintuthuko zezimangalo emhlabeni wonke",
                "Litšangano tsa Baahi ho tloha lilemong tsa bo1950 ho isa bo1970", "Lintho tse tsamaeang tsa ho hana lefatšeng ka bophara",
                "Burgerlike samelewing-protes van die 1950's tot die 1970's", "Protestbewegings wêreldwyd"),
            new("Civil Resistance, 1970s to 1980s: South Africa", "South African resistance movements",
                "Ukumelana Komphakathi, Iminyaka Yama-1970 Kuya Kweyama-1980: INingizimu Afrika", "Izintuthuko zokumelana eNingizimu Afrika",
                "Khauhelo ea Baahi, lilemong tsa bo1970 ho isa bo1980: Afrika Boroa", "Lintho tse tsamaeang tsa khauhelo Afrika Boroa",
                "Burgerlike Verset, 1970's tot 1980's: Suid-Afrika", "Suid-Afrikaanse versetbewegings"),
            new("The coming of democracy to South Africa and coming to terms with the past", "South African transition to democracy",
                "Ukufika Kwedemokhrasi ENingizimu Afrika Nokubhekana Nesikhathi Esedlule", "Ukuguquka kwedemokhasi eNingizimu Afrika",
                "Ho tla ha Demokrasi Afrika Boroa le ho amohela Nakong e fetileng", "Ho fetela ha Afrika Boroa ho demokrasi",
                "Die koms van demokrasie na Suid-Afrika en om vrede te maak met die verlede", "Suid-Afrika se oorgang na demokrasie"),
            new("The end of the Cold War and a new order 1989 to the present", "Post-Cold War world order",
                "Ukuphela KweMpi Ebandayo Nokuhlela Okushaye Ikhanda Kusukela Ngo-1989 Kuze Kube Manje", "Ukuhlela komhlaba ngemuva kweMpi Ebandayo",
                "Qetelo ea Ntoa e Batang le Tatelo e Ncha ho tloha 1989 ho fihlela hajoale", "Tatelo ea lefatše ka mor'a ntoa e batang",
                "Die einde van die Koue Oorlog en 'n nuwe orde 1989 tot die hede", "Post-Koue Oorlog wêreldorde"),
        ]),

        new("Geography", "Study of physical and human geography",
            "Ijografi", "Ukufunda ngejografi yemvelo yabantu",
            "Geography", "Thuto ea geography ea tlhaho le ea batho",
            "Geografie", "Studie van fisiese en menslike geografie",
        [
            new("Climate and weather", "Atmospheric processes and climate",
                "Isimo Sezulu Nezulu", "Izinqubo zomkhathi nesimo sezulu",
                "Boemo ba Leholimo le Leholimo", "Mekhoa ea moeeng le boemo ba leholimo",
                "Klimaat en weer", "Atmosferiese prosesse en klimaat"),
            new("Geomorphology", "Landforms and geological processes",
                "Izakhiwo Zomhlaba", "Izindlela zomhlaba nezinqubo zejiologi",
                "Jeomorfoloji", "Mekhoa ea naha le mekhoa ea joioloji",
                "Geomorfologie", "Landvorme en geologiese prosesse"),
            new("Rural settlement and urban settlement", "Settlement patterns and urbanisation",
                "Imikhakha Yabantu Basemagwaqeni Nabesidolobheni", "Imikhakha yokwakhiwa kwabantu nokwakheka kwamadolobha",
                "Maahelo a Mahae le a Metse", "Mekhoa ea maahelo le ho hola ha metse",
                "Landelike nedersetting en stedelike nedersetting", "Nedersettingspatrone en verstedeliking"),
            new("Economic Geography of South Africa", "South Africa's economic geography",
                "IJografi Yezomnotho YaseNingizimu Afrika", "Ijografi yezomnotho yaseNingizimu Afrika",
                "Geography ea Moruo oa Afrika Boroa", "Geography ea moruo oa Afrika Boroa",
                "Ekonomiese Geografie van Suid-Afrika", "Suid-Afrika se ekonomiese geografie"),
            new("Mapwork", "Topographic maps and GIS",
                "Ukusebenza Namabalazwe", "Amabalazwe e-topographic ne-GIS",
                "Mosebetsi oa Likarata", "Likarata tsa topographic le GIS",
                "Kaartwerk", "Topografiese kaarte en GIS"),
        ]),

        new("Accounting", "Study of financial recording and reporting",
            "Ezezimali", "Ukufunda ukurekhoda nokubika kwezezimali",
            "Accounting", "Thuto ea ho ngola le ho tlaleha lichelete",
            "Rekeningkunde", "Studie van finansiële rekordhouding en verslagdoening",
        [
            new("Basic Accounting concepts", "Fundamental accounting principles",
                "Imiqondo Eyisisekelo Yezezimali", "Izimgomo eziyisisekelo zezezimali",
                "Mehopolo ea Motheo ea Accounting", "Mehlala ea motheo ea accounting",
                "Basiese Rekeningkundige Konsepte", "Fundamentele rekeningkundige beginsels"),
            new("Companies", "Company financial statements",
                "Amabhizinisi", "Izitatimende zezezimali zamabhizinisi",
                "Likhamphani", "Litatemente tsa lichelete tsa likhamphani",
                "Maatskappye", "Maatskappy finansiële state"),
            new("Manufacturing", "Manufacturing accounts and costs",
                "Ukwenziwa Kwezimpahla", "Ama-akhawunti nezindleko zokwenziwa kwezimpahla",
                "Tlhahiso", "Li-akhaunte le litšenyehelo tsa tlhahiso",
                "Vervaardiging", "Vervaardigingsrekeninge en -koste"),
            new("Budgets", "Budget preparation and analysis",
                "Izindleko Ezihlongoziwe", "Ukulungisa nokuhlaziya izindleko ezihlongoziwe",
                "Libajethe", "Ho etsa le ho hlahlobela libajethe",
                "Begrotings", "Begrotingvoorbereiding en -analise"),
            new("Reconciliations", "Bank and creditor reconciliations",
                "Ukuvumelana", "Ukuvumelana kwebhanki nezikweletu",
                "Likhokahanyo", "Likhokahanyo tsa banka le bakoloti",
                "Rekonsiliasies", "Bank- en krediteurrekonsiliasies"),
            new("Inventories", "Stock valuation methods",
                "Izimpahla Ezigcinwayo", "Izindlela zokulinganiswa kwezimpahla",
                "Liinventori", "Mekhoa ea ho bala boleng ba liinventori",
                "Voorrade", "Voorraadwaardasiemetodes"),
            new("Value Added Tax (VAT)", "VAT calculations and records",
                "Intela Eyengeziwe (VAT)", "Izibalo nezirekhodi ze-VAT",
                "Lekhetho le Eketsehileng (VAT)", "Lipalo le lirekoto tsa VAT",
                "Belasting op Toegevoegde Waarde (BTW)", "BTW-berekeninge en -rekords"),
            new("Fixed assets", "Depreciation and asset management",
                "Izimpahla Ezimile", "Ukwehla kwenani nokuphatha izimpahla",
                "Thepa e Tsitsitseng", "Phokotso le taolo ea thepa",
                "Vaste Bates", "Depresiasie en batebestuur"),
        ]),

        new("Agricultural Sciences", "Study of agriculture and farming practices",
            "Isayensi Yezolimo", "Ukufunda ngezolimo nezinqubo zokulima",
            "Saense ea Temo", "Thuto ea temo le mekhoa ea ho lema",
            "Landbouwetenskappe", "Studie van landbou en boerderypraktyke",
        [
            new("Animal Nutrition", "Nutrients and feeding of animals",
                "Ukondla Kwezilwane", "Izakhamzimba nokondla izilwane",
                "Phepo ea Liphoofolo", "Lijo le ho fisa liphoofolo",
                "Dierevoeding", "Voedingstowwe en voeding van diere"),
            new("Animal Production, Protection and Control", "Livestock management",
                "Ukukhiqizwa, Ukuvikelwa Nokulalelwa Kwezilwane", "Ukuphatha izilwane zasekhaya",
                "Tlhahiso, Ts'ireletso le Taolo ea Liphoofolo", "Taolo ea liruuoa",
                "Dierепroduksie, -beskerming en -beheer", "Veestapelbestuur"),
            new("Reproduction", "Animal reproduction",
                "Ukuzala Kwezilwane", "Ukuzala kwezilwane",
                "Tsoalo ea Liphoofolo", "Tsoalo ea liphoofolo",
                "Voortplanting", "Dierevoortplanting"),
            new("Agricultural Management and Marketing", "Farm management and marketing",
                "Ukuphathwa Nokuthengiswa Kwezolimo", "Ukuphatha ipulazi nokuthengisa",
                "Taolo ea Temo le Mmaraka", "Taolo ea polasi le mmaraka",
                "Landboubestuur en -bemarking", "Plaasbestuur en -bemarking"),
            new("Production factors", "Factors affecting agricultural production",
                "Izinto Ezithinta Ukukhiqiza", "Izinto ezithinta ukukhiqizwa kwezolimo",
                "Lintlha tsa Tlhahiso", "Lintlha tse amang tlhahiso ea temo",
                "Produksiefaktore", "Faktore wat landbouproduksie beïnvloed"),
            new("Basic Agricultural Genetics", "Genetics applied to agriculture",
                "Izimfuzo Eziyisisekelo Zezolimo", "Izimfuzo ezisetshenziswa ezolimweni",
                "Jenetiki ea Motheo ea Temo", "Jenetiki e sebedisoang temong",
                "Basiese Landbougenetika", "Genetika toegepas op landbou"),
        ]),

        new("Economics", "Study of production, distribution and consumption",
            "Ezomnotho", "Ukufunda ukukhiqizwa, ukusabalaliswa nokusetshenziswaa",
            "Moruo", "Thuto ea tlhahiso, kabo le ts'ebeliso",
            "Ekonomie", "Studie van produksie, verspreiding en verbruik",
        [
            new("The circular flow model, national account aggregates and the multiplier", "Circular flow and national income",
                "Imodeli Yokugeleza Kwemali Nemininingwane Yezwe Nomphindamphindiwa", "Ukugeleza kwemali kanye nemininingwane yezwe",
                "Mohlala oa Phallo e Potolohang, Lihlopha tsa Akhaunte ea Naha le Multiplayer", "Phallo e potolohang le lekeno la naha",
                "Die sirkulêre vloeimodel, nasionale rekeningkunde en die vermenigvuldiger", "Sirkulêre vloei en nasionale inkomste"),
            new("Business cycles and forecasting", "Economic cycles and forecasting",
                "Imikhakha Yebhizinisi Nezibikezelo", "Imikhakha yezomnotho nezibikezelo",
                "Likotoana tsa Khoebo le Boporofeta", "Likotoana tsa moruo le boporofeta",
                "Besigheidssiklusse en voorspelling", "Ekonomiese siklusse en voorspelling"),
            new("The role of the public sector", "Government in the economy",
                "Indima Yezwe Lomphakathi", "Uhulumeni kuphela kwezomnotho",
                "Karolo ea Lekala la Sechaba", "Mmuso moruong",
                "Die rol van die openbare sektor", "Regering in die ekonomie"),
            new("The foreign exchange market and the balance of payments accounts", "Exchange rates and balance of payments",
                "Imakethe Yemali Yezwe Lomuntu Nezibalo Zokubhaliswa Kwemikhiqizo", "Amazinga oshintshwano nezibalo zokukhokha",
                "Mmaraka oa Phetisetso ea Lichelete tsa Kantle le Liakhaunte tsa Tekanelo ea Litefo", "Litefo tsa phetisetso le tekanelo ea litefo",
                "Die buitelandse valutamark en die betalingsbalansrekeninge", "Wisselkoerse en betalingsbalans"),
            new("Protectionism and free trade", "Trade policies",
                "Ukuvikelwa Kwabasekhaya Nokuhweba Ngokukhulula", "Izinqubomgomo zokunikeza",
                "Ts'ireletso le Khoebo ea Khulullo", "Maano a khoebo",
                "Proteksionisme en vrye handel", "Handelsbeleid"),
            new("The dynamics of perfect markets", "Perfect competition",
                "Isimo Sezimakethe Eziphelele", "Ukuncintisana okuphelele",
                "Maikutlo a Limaraka tse Phethahetseng", "Khetisano e phethahetseng",
                "Die dinamika van perfekte markte", "Perfekte mededinging"),
            new("Dynamics of imperfect markets", "Monopoly and oligopoly",
                "Isimo Sezimakethe Ezingaphelele", "Ukulawula kwenye noma yezinye izimboni",
                "Maikutlo a Limaraka tse sa Phethahetseng", "Monopoli le oligopoli",
                "Dinamika van onvolmaakte markte", "Monopolie en oligopolie"),
            new("The reasons for and consequences of market failures", "Market failures and externalities",
                "Izizathu Nemiphumela Yokwehluleka Kwezimakethe", "Ukwehluleka kwezimakethe nezinto zangaphandle",
                "Mabaka le Liphetho tsa Ho hloleha ha Mmaraka", "Ho hloleha ha mmaraka le lintho tsa kantle",
                "Die redes vir en gevolge van markmislukkings", "Markmislukkings en eksternaliteite"),
            new("Economic growth and development", "Growth and development indicators",
                "Ukukhula Nentuthuko Kwezomnotho", "Izinkomba zokukhula nentuthuko",
                "Kholo le Nts'etsopele ea Moruo", "Lipontšo tsa kholo le nts'etsopele",
                "Ekonomiese groei en ontwikkeling", "Groei- en ontwikkelingsaanwysers"),
            new("South Africa's industrial policies and their suitability in terms of international best practice", "SA industrial policy",
                "Izinqubomgomo Zezimboni ZaseNingizimu Afrika Nokufaneleka Kwazo Ngokwemigomo Engcono Emhlabeni", "Izinqubomgomo zezimboni zaseNingizimu Afrika",
                "Maano a Indasteri ea Afrika Boroa le ho Lokelana ha ona le Mekhoa e Betere ea Machaba", "Maano a indasteri ea Afrika Boroa",
                "Suid-Afrika se industriebeleid en geskiktheid in terme van internasionale beste praktyk", "SA nywerheidsbeleid"),
            new("South African economic and social indicators", "SA economic indicators",
                "Izinkomba Zezomnotho Nezentombi ZaseNingizimu Afrika", "Izinkomba zezomnotho zaseNingizimu Afrika",
                "Lipontšo tsa Moruo le tsa Sechaba tsa Afrika Boroa", "Lipontšo tsa moruo tsa Afrika Boroa",
                "Suid-Afrikaanse ekonomiese en sosiale aanwysers", "SA ekonomiese aanwysers"),
            new("Inflation", "Causes and effects of inflation",
                "Ukwenyuka Kwentengo", "Izizathu nomthelela wokwenyuka kwentengo",
                "Inflation", "Mabaka le litlamorao tsa inflation",
                "Inflasie", "Oorsake en gevolge van inflasie"),
            new("Tourism", "Tourism as an economic sector",
                "Ezokuvakasha", "Ezokuvakasha njengomkhakha wezomnotho",
                "Bohahlauli", "Bohahlauli e le karolo ea moruo",
                "Toerisme", "Toerisme as ekonomiese sektor"),
            new("Environmental sustainability", "Economics of sustainability",
                "Ukuqhubeka Kwemvelo", "Ezomnotho zokuqhubeka kwemvelo",
                "Ts'oarello ea Tikoloho", "Moruo oa ts'oarello",
                "Omgewingsvolhoubaarheid", "Ekonomie van volhoubaarheid"),
        ]),

        new("Computer Applications Technology", "Study of computer applications and technology",
            "Ubuchwepheshe Bezinhlelo Zekhompyutha", "Ukufunda izinhlelo zekhompyutha nobuchwepheshe",
            "Theknoloji ea Ts'ebeliso ea Khomphieutha", "Thuto ea lits'ebeliso tsa khomphieutha le theknoloji",
            "Rekenaartoepassingstegnologie", "Studie van rekenaartoepassings en -tegnologie",
        [
            new("Software", "Types and uses of software",
                "Isofthiwe", "Izinhlobo nezisebenziso zesofthiwe",
                "Softweya", "Mefuta le lits'ebeliso tsa softweya",
                "Sagteware", "Tipes en gebruike van sagteware"),
            new("Word processing", "Document creation and formatting",
                "Ukubhala Amagama", "Ukwenza nokuhlelwa kwamadokhumenti",
                "Ho Sebedisa Mantsoe", "Ho etsa le ho hlophisa litokomane",
                "Woordverwerking", "Dokumentskepping en -formatering"),
            new("Spreadsheets", "Data analysis using spreadsheets",
                "Amashidi Ezibalo", "Ukuhlaziya idatha kusetshenziswa amashidi ezibalo",
                "Lishiti tsa Lipalo", "Tlhahlobo ea data ho sebelisoa lishiti tsa lipalo",
                "Sigblaaie", "Data-analise met behulp van sigblaaie"),
            new("Databases", "Database design and queries",
                "Izinqolobane Zodatha", "Ukwakhiwa nokufunwa kwezinqolobane zodatha",
                "Libanka tsa Data", "Ho bopa le ho botsa libanka tsa data",
                "Databasisse", "Databasissontwerp en -navrae"),
            new("Web Development", "HTML and web design",
                "Ukwakhiwa Kwewebhu", "I-HTML nokwakhiwa kwewebhu",
                "Nts'etsopele ea Wepe", "HTML le tlhophiso ea wepe",
                "Webbrontwikkeling", "HTML en webontwerp"),
            new("General", "General computer concepts",
                "Okujwayelekile", "Imiqondo ejwayelekile yekhompyutha",
                "Kakaretso", "Mehopolo e akaretsang ea khomphieutha",
                "Algemeen", "Algemene rekenaarkonssepte"),
            new("Systems Technologies", "Hardware and operating systems",
                "Ubuchwepheshe Bezinhlelo", "Ihardware nezinhlelo zokusebenza",
                "Theknoloji ea Tsamaiso", "Hatuware le litsamaiso tsa ts'ebetso",
                "Stelselstegnologieë", "Hardeware en bedryfstelsels"),
            new("Internet and Network Technologies", "Networks and internet",
                "Ubuchwepheshe Bokunethi Nokukhulumisana Kwamakhompyutha", "Amanetha ne-intanethi",
                "Theknoloji ea Inthanete le Neteueke", "Linthoe le inthanete",
                "Internet- en Netwerktegnologieë", "Netwerke en internet"),
            new("Information Management", "Managing digital information",
                "Ukuphathwa Kolwazi", "Ukuphatha ulwazi lwedijithali",
                "Taolo ea Tlhahisoleseding", "Ho laola tlhahisoleseding ea dijithale",
                "Inligtingsbestuur", "Bestuur van digitale inligting"),
            new("Social Implications", "Impact of technology on society",
                "Umthelela Kwabantu", "Umthelela wobuchwepheshe emphakathini",
                "Litlamorao tsa Sechaba", "Tshusumetso ea theknoloji sechabeng",
                "Sosiale Implikasies", "Impak van tegnologie op die samelewing"),
            new("Solution Development", "Problem solving with technology",
                "Ukwakha Izixazululo", "Ukuxazulula izinkinga ngobuchwepheshe",
                "Nts'etsopele ea Karabo", "Ho rarolla mathata ka theknoloji",
                "Oplossingsontwikling", "Probleemoplossing met tegnologie"),
        ]),

        new("Information Technology", "Study of programming and information systems",
            "Ubuchwepheshe Bolwazi", "Ukufunda ukuprogram nezinhlelo zolwazi",
            "Theknoloji ea Tlhahisoleseding", "Thuto ea ho ngola mantsoe a khomphieutha le litsamaiso tsa tlhahisoleseding",
            "Inligtingstegnologie", "Studie van programmering en inligtingstelsels",
        [
            new("Databases", "Relational databases and SQL",
                "Izinqolobane Zodatha", "Izinqolobane zodatha ezinobudlelwano ne-SQL",
                "Libanka tsa Data", "Libanka tsa data tse amanang le SQL",
                "Databasisse", "Relasionele databasisse en SQL"),
            new("Object-oriented programming (OOP)", "OOP concepts and implementation",
                "Ukuprogram Ngemiqondo Yezinto (OOP)", "Imiqondo yokwenza ne-OOP",
                "Purograming ea Object-oriented (OOP)", "Mehopolo le ts'ebeliso ea OOP",
                "Objekgeoriënteerde programmering (OOP)", "OOP-konsepte en -implementering"),
            new("Graphical user interface (GUI)", "GUI design and development",
                "Isixhumi Somsebenzisi Sezithombe (GUI)", "Ukwakhiwa nokukhulisa i-GUI",
                "Sepheo sa Mosebelisi sa Grafike (GUI)", "Tlhophiso le nts'etsopele ea GUI",
                "Grafiese gebruikerskoppelvlak (GUI)", "GUI-ontwerp en -ontwikkeling"),
            new("Algorithms", "Algorithm design and analysis",
                "Izindlela Zokuxazulula Izinkinga", "Ukwakhiwa nokuhlaziya izindlela",
                "Li-Algorithm", "Tlhophiso le tlhahlobo ea li-algorithm",
                "Algoritmes", "Algoritme-ontwerp en -analise"),
            new("Systems Technologies", "Hardware and system software",
                "Ubuchwepheshe Bezinhlelo", "Ihardware nesofthiwe yezinhlelo",
                "Theknoloji ea Tsamaiso", "Hatuware le softweya ea tsamaiso",
                "Stelselstegnologieë", "Hardeware en stelsel sagteware"),
            new("Communications and Network Technologies", "Networking concepts",
                "Ubuchwepheshe Bokuxhumana Namanetha", "Imiqondo yamanetha",
                "Theknoloji ea Puisano le Neteueke", "Mehopolo ea neteueke",
                "Kommunikasie- en Netwerktegnologieë", "Netwerkkonsepte"),
            new("Data and Information Management", "Data storage and management",
                "Ukuphathwa Kodatha Nolwazi", "Ukugcina nokuphatha idatha",
                "Taolo ea Data le Tlhahisoleseding", "Ho boloka le ho laola data",
                "Data- en Inligtingsbestuur", "Databerging en -bestuur"),
            new("Solution Development", "Software development process",
                "Ukwakha Izixazululo", "Inqubo yokwakhiwa kwesofthiwe",
                "Nts'etsopele ea Karabo", "Mokhoa oa nts'etsopele ea softweya",
                "Oplossingsontwikling", "Sagteware-ontwikkelingsproses"),
        ]),

        new("Engineering Graphics & Design", "Study of technical drawing and design",
            "Imidwebo Yokwakha Nezokwakhiwa", "Ukufunda imidwebo yokwakha nokwakhiwa",
            "Mefano ea Injiniri le Tlhophiso", "Thuto ea ho hula le ho bopa ka theknike",
            "Ingenieursgrafika en -ontwerp", "Studie van tegniese tekening en ontwerp",
        [
            new("Civil drawing", "Civil engineering drawings",
                "Imidwebo Yokwakha Kwezindawo", "Imidwebo yobunjiniyela bezindawo",
                "Mefano ea Sivile", "Mefano ea injiniri ea sivile",
                "Siviele tekening", "Siviele ingenieurstekenings"),
            new("Solid geometry", "3D geometric solids",
                "IJiyomethri Yezinto Eziqinile", "Izinto eziqinile ze-3D zijiyomethri",
                "Geometry ea Lintho tse Tiileng", "Lintho tse tiileng tsa geometry tsa 3D",
                "Soliede geometrie", "3D-geometriese soliede"),
            new("Perspective drawings", "One and two-point perspective",
                "Imidwebo Yombono", "Umbono wephuzu elilodwa nalamabili",
                "Mefano ea Pono", "Pono ea ntlha e le 'ngoe le ea lintlha tse peli",
                "Perspektiewe tekeninge", "Een- en tweepuntperspektief"),
            new("Mechanical drawings", "Mechanical engineering drawings",
                "Imidwebo Yezihlahla", "Imidwebo yobunjiniyela bezinto ezihambelanayo",
                "Mefano ea Mekhaniki", "Mefano ea injiniri ea mekhaniki",
                "Meganiese tekeninge", "Meganiese ingenieurstekenings"),
            new("Loci of a cam", "Cam profiles and loci",
                "Imikhondo Ye-Cam", "Izimo ne-loci ze-cam",
                "Loci ea Cam", "Liprofile le loci ea cam",
                "Loci van 'n nok", "Nokprofiele en loci"),
            new("Isometric drawing", "Isometric projection and drawing",
                "Imidwebo Ye-Isometric", "Ukuphonswa nokudweba kwe-isometric",
                "Mefano ea Isometric", "Pontšo le ho hula ha isometric",
                "Isometriese tekening", "Isometriese projeksie en tekening"),
        ]),
    ];

    public InitialSubjectsBuilder(Team3DbContext context)
    {
        _context = context;
    }

    public void Create()
    {
        var languages = _context.Set<Language>().ToList();
        var englishLanguage = languages.FirstOrDefault(x => x.Code == "en");
        var zuluLanguage = languages.FirstOrDefault(x => x.Code == "zu");
        var sesothoLanguage = languages.FirstOrDefault(x => x.Code == "st");
        var afrikaansLanguage = languages.FirstOrDefault(x => x.Code == "af");

        foreach (var subjectData in InitialSubjects)
        {
            var subject = _context.Subjects.FirstOrDefault(x => x.Name == subjectData.EnglishName);

            if (subject is null)
            {
                subject = new Subject(
                    Guid.NewGuid(),
                    subjectData.EnglishName,
                    DefaultGradeLevel,
                    subjectData.EnglishDescription,
                    isActive: true);

                _context.Subjects.Add(subject);
                _context.SaveChanges();
            }
            else
            {
                subject.UpdateDetails(subjectData.EnglishName, DefaultGradeLevel, subject.Description, isActive: true);
                _context.Subjects.Update(subject);
                _context.SaveChanges();
            }

            // Seed subject translations
            if (englishLanguage != null)
                SeedSubjectTranslation(subject.Id, englishLanguage.Id, subjectData.EnglishName, subjectData.EnglishDescription, false);
            if (zuluLanguage != null)
                SeedSubjectTranslation(subject.Id, zuluLanguage.Id, subjectData.ZuluName, subjectData.ZuluDescription, true);
            if (sesothoLanguage != null)
                SeedSubjectTranslation(subject.Id, sesothoLanguage.Id, subjectData.SesothoName, subjectData.SesothoDescription, true);
            if (afrikaansLanguage != null)
                SeedSubjectTranslation(subject.Id, afrikaansLanguage.Id, subjectData.AfrikaansName, subjectData.AfrikaansDescription, true);

            SeedTopicsForSubject(subject, subjectData.Topics, englishLanguage, zuluLanguage, sesothoLanguage, afrikaansLanguage);
        }

        _context.SaveChanges();
    }

    private void SeedSubjectTranslation(Guid subjectId, Guid languageId, string name, string? description, bool isAutoTranslated)
    {
        var existing = _context.Set<SubjectTranslation>()
            .FirstOrDefault(x => x.SubjectId == subjectId && x.LanguageId == languageId);

        if (existing != null) return;

        _context.Set<SubjectTranslation>().Add(new SubjectTranslation(
            Guid.NewGuid(), subjectId, languageId, name, description, isAutoTranslated));
    }

    private void SeedTopicsForSubject(
        Subject subject,
        IReadOnlyList<TopicSeedData> topicList,
        Language? englishLanguage,
        Language? zuluLanguage,
        Language? sesothoLanguage,
        Language? afrikaansLanguage)
    {
        var existingTopics = _context.Topics
            .Where(x => x.SubjectId == subject.Id)
            .ToList();

        for (var i = 0; i < topicList.Count; i++)
        {
            var topicData = topicList[i];
            var sequenceOrder = i + 1;

            var existing = existingTopics.FirstOrDefault(x => x.Name == topicData.EnglishName);

            if (existing is null)
            {
                existing = new Topic(
                    Guid.NewGuid(),
                    subject.Id,
                    topicData.EnglishName,
                    DifficultyLevel.Medium,
                    topicData.EnglishDescription,
                    sequenceOrder,
                    isActive: true,
                    masteryThreshold: 0.70m,
                    generatedByAI: false);

                _context.Topics.Add(existing);
                _context.SaveChanges();
            }
            else
            {
                existing.UpdateDetails(
                    topicData.EnglishName,
                    existing.DifficultyLevel,
                    existing.Description,
                    sequenceOrder,
                    isActive: true,
                    masteryThreshold: existing.MasteryThreshold);

                _context.Topics.Update(existing);
                _context.SaveChanges();
            }

            if (englishLanguage != null)
                SeedTopicTranslation(existing.Id, englishLanguage.Id, topicData.EnglishName, topicData.EnglishDescription, false);
            if (zuluLanguage != null)
                SeedTopicTranslation(existing.Id, zuluLanguage.Id, topicData.ZuluName, topicData.ZuluDescription, true);
            if (sesothoLanguage != null)
                SeedTopicTranslation(existing.Id, sesothoLanguage.Id, topicData.SesothoName, topicData.SesothoDescription, true);
            if (afrikaansLanguage != null)
                SeedTopicTranslation(existing.Id, afrikaansLanguage.Id, topicData.AfrikaansName, topicData.AfrikaansDescription, true);
        }
    }

    private void SeedTopicTranslation(Guid topicId, Guid languageId, string name, string? description, bool isAutoTranslated)
    {
        var existing = _context.Set<TopicTranslation>()
            .FirstOrDefault(x => x.TopicId == topicId && x.LanguageId == languageId);

        if (existing != null) return;

        _context.Set<TopicTranslation>().Add(new TopicTranslation(
            Guid.NewGuid(), topicId, languageId, name, description, isAutoTranslated));
    }
}

// -------------------------------------------------------
// Seed data record types
// -------------------------------------------------------
public record SubjectSeedData(
    string EnglishName,
    string? EnglishDescription,
    string ZuluName,
    string? ZuluDescription,
    string SesothoName,
    string? SesothoDescription,
    string AfrikaansName,
    string? AfrikaansDescription,
    IReadOnlyList<TopicSeedData> Topics);

public record TopicSeedData(
    string EnglishName,
    string? EnglishDescription,
    string ZuluName,
    string? ZuluDescription,
    string SesothoName,
    string? SesothoDescription,
    string AfrikaansName,
    string? AfrikaansDescription);